package plugin_services

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/domain/acl/permissions"
	"github.com/gocms-io/gocms/domain/plugin/plugin_middleware/plugin_proxy_middleware"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/utility/errors"
	"github.com/gocms-io/gocms/utility/log"
)

type ProxyRoute struct {
	Schema string
	Host   string
	Port   string
}

// todo figure out how to apply permissions to middleware in here
func (ps *PluginsService) RegisterActivePluginRoutes(routes *routes.Routes) error {
	for _, plugin := range ps.GetActivePlugins() {

		// loop through each manifest and apply each route to the middleware proxy
		for _, routeManifest := range plugin.Manifest.Services.Routes {
			routerGroup, err := ps.getRouteGroup(routeManifest.Route, routes)
			if err != nil {
				es := fmt.Sprintf("Plugin %s -> Route %s -> Method %s, Url %s, Error: %s\n", plugin.Manifest.Id, routeManifest.Route, routeManifest.Method, routeManifest.Url, err.Error())
				log.Errorf(es)
				return err
			} else {
				// if we want to disable the namespace for route
				if routeManifest.DisableNamespace {
					ps.registerPluginProxyOnRoute(routerGroup, routeManifest.Method, routeManifest.Url, plugin.Proxy)
				} else { // else namespace route
					ps.registerPluginProxyOnRoute(routerGroup, routeManifest.Method, fmt.Sprintf("%v/%v", plugin.Manifest.Id, routeManifest.Url), plugin.Proxy)
				}
			}
		}

		// check if there is interface routes that need to be registered
		if plugin.Manifest.Interface.Public != "" {
			routes.Root.Handle("GET", fmt.Sprintf("/content/%v/*filepath", plugin.Manifest.Id), plugin.Proxy.ReverseProxy())
		}

		//
		if plugin.Manifest.Services.Docs != "" {
			routes.Root.Handle("GET", fmt.Sprintf("/docs/%v/*filepath", plugin.Manifest.Id), plugin.Proxy.ReverseProxy())
		}

	}
	return nil
}

func (ps *PluginsService) registerPluginProxyOnRoute(route *gin.RouterGroup, method string, url string, pluginProxy *plugin_proxy_middleware.PluginProxyMiddleware) {
	route.Handle(method, url, pluginProxy.ReverseProxy())
}

func (ps *PluginsService) getRouteGroup(pluginRoute string, r *routes.Routes) (*gin.RouterGroup, error) {
	switch pluginRoute {
	case routes.PUBLIC:
		return r.Public, nil
	case routes.PRE_TWO_FACTOR:
		return r.PreTwofactor, nil
	case routes.AUTH:
		return r.Auth, nil
	case routes.ROOT:
		return r.Root, nil
	case routes.ADMIN:
		log.Warningf("Admin route no longer exists. Instead apply the '%v' permission to route in manifest.json route\n", permissions.SUPER_ADMIN)
	}

	return nil, errors.New(fmt.Sprintf("Plugin is registering on route %v that doesn't exist\n", pluginRoute))
}
