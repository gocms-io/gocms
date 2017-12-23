package plugin_middleware_proxy

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/context/consts"
	"github.com/gocms-io/gocms/domain/user/user_middleware"
	"github.com/gocms-io/gocms/utility/api_utility"
	"github.com/gocms-io/gocms/utility/errors"
	"github.com/gocms-io/gocms/utility/log"
	"net/http"
	"strings"
	"io"
)

type PluginMiddlewareProxy struct {
	Schema          string
	Port            int
	Host            string
	PluginId        string
	ExecutionRank   int64
	UpdateProxyChan chan (*PluginMiddlewareProxy)
	Disabled        bool

	HeadersToReceive []string
	PassAlongError     bool
	ContinueOnError  bool
	CopyBody bool
}

func (ppm *PluginMiddlewareProxy) MiddlewareProxy() gin.HandlerFunc {
	return ppm.middlewareProxy
}

func (ppm *PluginMiddlewareProxy) middlewareProxy(c *gin.Context) {

	// check if proxy should be updated and apply if needed
	// check if proxy is disabled and skip with error if it is
	ppm.handleProxyUpdate(c)

	// if disabled then return error and skip
	if ppm.Disabled {
		log.Errorf("Plugin proxy is currently disabled for %v\n", ppm.PluginId)
		errors.Response(c, http.StatusInternalServerError, errors.ApiError_Server, errors.ApiError_Server)
		return
	}

	// transfer headers and user context as needed
	ppm.handleHeadersAndUserContext(c)

	// take namespace away from app unless it asks for it in the manifest
	// todo actually check for namespace. Right now, it just assumes and strips.
	nonNamespacedRequestUrl := strings.Replace(c.Request.URL.Path, fmt.Sprintf("%v/", ppm.PluginId), "", 1)

	// create a new url from the raw RequestURI sent by the client
	url := fmt.Sprintf("%v://%v:%v/%v/%v%v", ppm.Schema, ppm.Host, ppm.Port, "middleware", ppm.ExecutionRank, nonNamespacedRequestUrl)
	proxyReq, err := http.NewRequest(c.Request.Method, url, c.Request.Body)
	if err != nil {
		log.Debugf("Error creating plugin middleware proxy request %v: %v\n", url, err.Error())
		if ppm.ContinueOnError {
			c.Next()
			return
		} else {
			errors.Response(c, http.StatusBadRequest, errors.ApiError_Server, err)
			return
		}
	}
	proxyReq.Header.Set("Host", c.Request.Host)
	proxyReq.Header.Add("X-Forwarded-For", c.Request.RemoteAddr)

	for header, values := range c.Request.Header {
		for _, value := range values {
			proxyReq.Header.Add(header, value)
		}
	}

	client := &http.Client{}
	proxyRes, err := client.Do(proxyReq)
	if err != nil {
		log.Errorf("Error proxying request %v, to middleware %v: %v\n", nonNamespacedRequestUrl, ppm.PluginId, err.Error())
		if ppm.ContinueOnError {
			c.Next()
			return
		} else {
			errors.Response(c, http.StatusBadRequest, errors.ApiError_Server, err)
			return
		}
	}

	// check for error
	if proxyRes.StatusCode < 200 || proxyRes.StatusCode > 299 {
		// if middleware handles error code and response just pass it along
		if ppm.PassAlongError {
			resHeaders := c.Writer.Header()
			resHeaders["Content-Type"] = proxyRes.Header["Content-Type"]
			resHeaders["Content-Length"] = proxyRes.Header["Content-Length"]
			c.Status(proxyRes.StatusCode)
			_, err = io.Copy(c.Writer, proxyRes.Body)
			// error with copying body
			if err != nil {
				log.Errorf("Error writing proxied response body into response: %v\n", err.Error())
			}
			c.Abort()
			return
		}
	}

	// first check for headers to receive
	for _, headerToReceive := range ppm.HeadersToReceive {
		if resHeaderVal := proxyRes.Header.Get(headerToReceive); resHeaderVal != "" {
			c.Request.Header.Set(headerToReceive, resHeaderVal)
		}
	}

	// check the body next
	if ppm.CopyBody {
		_, err = io.Copy(c.Writer, proxyRes.Body)
		if err != nil {
			log.Errorf("Error writing proxied response body into response: %v\n", err.Error())
			// if we continue on error then do so
			if !ppm.ContinueOnError {
				c.Next()
				return
			}
			// otherwise respond with error
			errors.Response(c, http.StatusBadRequest, errors.ApiError_Server, err)
			return
		}

		// add headers that relate to body
		c.Request.Header["Content-Type"] = proxyRes.Header["Content-Type"]
		c.Request.Header["Content-Length"] = proxyRes.Header["Content-Length"]
	}

	c.Next()

}

func (ppm *PluginMiddlewareProxy) handleProxyUpdate(c *gin.Context) {
	// check for updates to proxy settings
	select {
	case newppm, ok := <-ppm.UpdateProxyChan:
		if ok {
			log.Debugf("proxy updated to: %+v\n", newppm)
			ppm.Port = newppm.Port
			ppm.Host = newppm.Host
			ppm.Schema = newppm.Schema
			ppm.PluginId = newppm.PluginId
			ppm.UpdateProxyChan = newppm.UpdateProxyChan

			ppm.CopyBody = newppm.CopyBody
			ppm.ContinueOnError = newppm.ContinueOnError
			ppm.PassAlongError = newppm.PassAlongError
			ppm.HeadersToReceive = newppm.HeadersToReceive
		}
	default:
	}
}

func (ppm *PluginMiddlewareProxy) handleHeadersAndUserContext(c *gin.Context) {
	authUser, _ := api_utility.GetUserFromContext(c)
	timezone, _ := user_middleware.GetTimezoneFromContext(c)
	if authUser != nil {
		userHeaderContext := authUser.GetUserContextHeader().Marshal()
		c.Request.Header.Set(consts.GOCMS_HEADER_USER_CONTEXT_KEY, userHeaderContext)
	}
	c.Request.Header.Set(consts.GOCMS_HEADER_TIMEZONE_KEY, timezone.String())
}

func singleJoiningSlash(a, b string) string {
	aslash := strings.HasSuffix(a, "/")
	bslash := strings.HasPrefix(b, "/")
	switch {
	case aslash && bslash:
		return a + b[1:]
	case !aslash && !bslash:
		return a + "/" + b
	}
	return a + b
}
