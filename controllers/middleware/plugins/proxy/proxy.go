package plugin_proxy_mdl

import (
	"net/http/httputil"
	"github.com/gin-gonic/gin"
	"net/url"
	"fmt"
	"log"
	"github.com/menklab/goCMS/utility/errors"
	"net/http"
)

type PluginProxyMiddleware struct {
	Schema string
	Port   int64
	Host   string
}

func (ppm *PluginProxyMiddleware) ReverseProxy() gin.HandlerFunc {
	return ppm.reverseProxy
}

func (ppm *PluginProxyMiddleware) reverseProxy(c *gin.Context) {

	url, err := url.Parse(fmt.Sprintf("%s://%s:%d", ppm.Schema, ppm.Host, ppm.Port))
	if err != nil {
		log.Printf("Error creating reverse proxy: %s", err.Error())
		errors.Response(c, http.StatusInternalServerError, errors.ApiError_Server, errors.New("Failed to create reverse proxy."))
		return
	}
	proxy := httputil.NewSingleHostReverseProxy(url)
	proxy.ServeHTTP(c.Writer, c.Request)
}