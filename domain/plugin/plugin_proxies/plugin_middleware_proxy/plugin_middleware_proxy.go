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
	"net/http/httputil"
	"strings"
)

type PluginMiddlewareProxy struct {
	Schema          string
	Port            int
	Host            string
	PluginId        string
	ExecutionRank int64
	UpdateProxyChan chan (*PluginMiddlewareProxy)
	Disabled        bool
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

	// copy to be safe
	cRequest := c.Copy().Request

	// take namespace away from app unless it asks for it in the manifest
	nonNamespacedRequestUrl := strings.Replace(cRequest.URL.Path, fmt.Sprintf("%v/", ppm.PluginId), "", 1)

	// create a new url from the raw RequestURI sent by the client
	url := fmt.Sprintf("%v://%v:%v/%v/%v/%v", ppm.Schema, ppm.Host, ppm.Port, "middleware", ppm.ExecutionRank, nonNamespacedRequestUrl)
	proxyReq, err := http.NewRequest(cRequest.Method, url, cRequest.Body)
	if err != nil {
		// handle err
	}
	proxyReq.Header.Set("Host", cRequest.Host)
	proxyReq.Header.Add("X-Forwarded-For", cRequest.RemoteAddr)

	for header, values := range cRequest.Header {
		for _, value := range values {
			proxyReq.Header.Add(header, value)
		}
	}

	client := &http.Client{}
	proxyRes, err := client.Do(proxyReq)
	log.Infof("Proxy Req: %v\n", proxyRes)

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
