package plugin_routes_proxy

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/myanrichal/gocms/context/consts"
	"github.com/myanrichal/gocms/domain/user/user_middleware"
	"github.com/myanrichal/gocms/utility/api_utility"
	"github.com/myanrichal/gocms/utility/errors"
	"github.com/myanrichal/gocms/utility/log"
	"net/http"
	"net/http/httputil"
	"strings"
)

type PluginRoutesProxy struct {
	Schema          string
	Port            int
	Host            string
	PluginId        string
	UpdateProxyChan chan (*PluginRoutesProxy)
	Disabled        bool
	IsExternal bool
}

func (ppm *PluginRoutesProxy) ReverseProxy() gin.HandlerFunc {
	return ppm.reverseProxy
}

func (ppm *PluginRoutesProxy) reverseProxy(c *gin.Context) {

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

	// do actual request directing
	director := func(req *http.Request) {
		// check new port channel in case the plugin has moved ports
		req.URL.Scheme = ppm.Schema
		req.URL.Host = fmt.Sprintf("%v:%v", ppm.Host, ppm.Port)

		// take namespace away from app unless it asks for it in the manifest
		nonNamespacedRequestUrl := strings.Replace(req.URL.Path, fmt.Sprintf("%v/", ppm.PluginId), "", 1)

		req.URL.Path = singleJoiningSlash("", nonNamespacedRequestUrl)
		if _, ok := req.Header["User-Agent"]; !ok {
			// explicitly disable User-Agent so it's not set to default value
			req.Header.Set("User-Agent", "")
		}
	}

	proxy := &httputil.ReverseProxy{Director: director}
	proxy.ServeHTTP(c.Writer, c.Request)
}

func (ppm *PluginRoutesProxy) handleProxyUpdate(c *gin.Context) {
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

func (ppm *PluginRoutesProxy) handleHeadersAndUserContext(c *gin.Context) {
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
