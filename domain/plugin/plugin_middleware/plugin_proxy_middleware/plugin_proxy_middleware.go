package plugin_proxy_middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/domain/user/user_middleware"
	"github.com/gocms-io/gocms/utility/api_utility"
	"github.com/gocms-io/gocms/utility/errors"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strconv"
	"strings"
)

type PluginProxyMiddleware struct {
	Schema   string
	Port     int
	Host     string
	PluginId string
}

func (ppm *PluginProxyMiddleware) ReverseProxy() gin.HandlerFunc {
	return ppm.reverseProxy
}

func (ppm *PluginProxyMiddleware) reverseProxy(c *gin.Context) {

	// check to see if authUser available
	authUser, _ := api_utility.GetUserFromContext(c)
	timezone, _ := user_middleware.GetTimezoneFromContext(c)
	if authUser != nil {
		c.Request.Header.Set("GOCMS-AUTH-USER-ID", strconv.Itoa(authUser.Id))
		c.Request.Header.Set("GOCMS-AUTH-NAME", authUser.FullName)
		c.Request.Header.Set("GOCMS-AUTH-EMAIL", authUser.Email)
	}
	c.Request.Header.Set("GOCMS-TIMEZONE", timezone.String())

	target, err := url.Parse(fmt.Sprintf("%s://%s:%d", ppm.Schema, ppm.Host, ppm.Port))
	if err != nil {
		log.Printf("Error creating reverse proxy: %s", err.Error())
		errors.Response(c, http.StatusInternalServerError, errors.ApiError_Server, errors.New("Failed to create reverse proxy."))
		return
	}

	targetQuery := target.RawQuery
	director := func(req *http.Request) {
		req.URL.Scheme = target.Scheme
		req.URL.Host = target.Host

		// take namespace away from app unless it asks for it in the manifest
		nonNamespacedRequestUrl := strings.Replace(req.URL.Path, fmt.Sprintf("%v/", ppm.PluginId), "", 1)

		req.URL.Path = singleJoiningSlash(target.Path, nonNamespacedRequestUrl)
		if targetQuery == "" || req.URL.RawQuery == "" {
			req.URL.RawQuery = targetQuery + req.URL.RawQuery
		} else {
			req.URL.RawQuery = targetQuery + "&" + req.URL.RawQuery
		}
		if _, ok := req.Header["User-Agent"]; !ok {
			// explicitly disable User-Agent so it's not set to default value
			req.Header.Set("User-Agent", "")
		}
	}

	proxy := &httputil.ReverseProxy{Director: director}
	proxy.ServeHTTP(c.Writer, c.Request)
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
