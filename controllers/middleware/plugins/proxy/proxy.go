package plugin_proxy_mdl

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/utility"
	"github.com/gocms-io/gocms/utility/errors"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strconv"
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

	// check to see if authUser available
	authUser, _ := utility.GetUserFromContext(c)
	if authUser != nil {
		c.Request.Header.Set("GOCMS-AUTH-USER-ID", strconv.Itoa(authUser.Id))
		c.Request.Header.Set("GOCMS-AUTH-NAME", authUser.FullName)
		c.Request.Header.Set("GOCMS-AUTH-EMAIL", authUser.Email)
	}

	url, err := url.Parse(fmt.Sprintf("%s://%s:%d", ppm.Schema, ppm.Host, ppm.Port))
	if err != nil {
		log.Printf("Error creating reverse proxy: %s", err.Error())
		errors.Response(c, http.StatusInternalServerError, errors.ApiError_Server, errors.New("Failed to create reverse proxy."))
		return
	}
	proxy := httputil.NewSingleHostReverseProxy(url)
	proxy.ServeHTTP(c.Writer, c.Request)
}
