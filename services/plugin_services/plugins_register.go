package plugin_services

import (
	"github.com/gocms-io/gocms/routes"
	"fmt"
	"log"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/controllers/middleware/plugins/proxy"
	"github.com/gocms-io/gocms/utility/errors"
)

type ProxyRoute struct {
	Schema string
	Host   string
	Port   string
}

func (ps *PluginsService) RegisterPluginRoutes(routes *routes.Routes) error {
	for _, plugin := range ps.Plugins {

		// loop through each manifest and apply each route to the middleware proxy
		for _, routeManifest := range plugin.Manifest.Services.Routes {
			routerGroup, err := ps.getRouteGroup(routeManifest.Route, routes)
			if err != nil {
				es := fmt.Sprintf("Plugin %s -> Route %s -> Method %s, Url %s, Error: %s\n", plugin.Manifest.Name, routeManifest.Route, routeManifest.Method, routeManifest.Url, err.Error())
				log.Print(es)
				return err
			} else {
				ps.registerPluginProxyOnRoute(routerGroup, routeManifest.Method, routeManifest.Url, plugin.Proxy)
			}
		}

		// add plugin docs to docs url
	}
	return nil
}

func (ps *PluginsService) registerPluginProxyOnRoute(route *gin.RouterGroup, method string, url string, pluginProxy *plugin_proxy_mdl.PluginProxyMiddleware) {
	route.Handle(method, url, pluginProxy.ReverseProxy())
}

func (ps *PluginsService) getRouteGroup(pluginRoute string, routes *routes.Routes) (*gin.RouterGroup, error) {
	switch pluginRoute {
	case "Public":
		return routes.Public, nil
	case "PreTwofactor":
		return routes.PreTwofactor, nil
	case "Auth":
		return routes.Auth, nil
	case "Admin":
		return routes.Admin, nil
	case "Root":
		return routes.Root, nil
	default:
		return nil, errors.New(fmt.Sprintf("Route %s doesn't exist.\n", pluginRoute))
	}
}
