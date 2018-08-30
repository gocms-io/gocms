package plugin_services

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/cqlcorp/gocms/domain/acl/permissions"
	"github.com/cqlcorp/gocms/routes"
	"github.com/cqlcorp/gocms/utility/errors"
	"github.com/cqlcorp/gocms/utility/log"
	"github.com/cqlcorp/gocms/domain/plugin/plugin_model"
	"github.com/cqlcorp/gocms/domain/acl/access_control/access_control_middleware"
)

type ProxyRoute struct {
	Schema string
	Host   string
	Port   string
}

func (ps *PluginsService) RegisterActivePluginRoutes(routes *routes.Routes) error {
	for _, plugin := range ps.GetActivePlugins() {

		// loop through each manifest and apply each route to the middleware proxy
		for _, routeManifest := range plugin.Manifest.Services.Routes {
			routerGroup, err := ps.getRouteGroup(routeManifest.Route, routes)
			if err != nil {
				es := fmt.Sprintf("Plugin %s -> Route %s -> Method %s, Url %s, Error: %s\n", plugin.Manifest.Id, routeManifest.Route, routeManifest.Method, routeManifest.Url, err.Error())
				log.Errorf(es)
				return err
			}

			// register route and permissions within GoCMS
			ps.registerPluginProxyOnRoute(routerGroup, plugin, routeManifest)
		}

		// check if there is interface routes that need to be registered
		if plugin.Manifest.Interface.Public != "" {
			routes.Root.Handle("GET", fmt.Sprintf("/content/%v/*filepath", plugin.Manifest.Id), plugin.RoutesProxy.ReverseProxy())
		}

		//
		if plugin.Manifest.Services.Docs != "" {
			routes.Root.Handle("GET", fmt.Sprintf("/docs/%v/*filepath", plugin.Manifest.Id), plugin.RoutesProxy.ReverseProxy())
		}

	}
	return nil
}

func (ps *PluginsService) registerPluginProxyOnRoute(route *gin.RouterGroup, plugin *plugin_model.Plugin, routeManifest *plugin_model.PluginManifestRoute) {

	// middlewares
	var handlers []gin.HandlerFunc
	url := routeManifest.Url

	// add acl middleware if needed
	if routeManifest.Route == routes.AUTH && len(routeManifest.Permissions) > 0 {
		log.Debugf("Adding ACL Middleware for %v\n", routeManifest.Url)
		handlers = append(handlers, access_control_middleware.RequirePermission(ps.aclService, routeManifest.Permissions...))
	}

	// if the namespace is not disabled then we should inject
	// the plugin id to namespace the url
	if !routeManifest.DisableNamespace {
		url = fmt.Sprintf("%v/%v", plugin.Manifest.Id, routeManifest.Url)
	}

	// add reverse proxy handler
	handlers = append(handlers, plugin.RoutesProxy.ReverseProxy())

	// register route
	route.Handle(routeManifest.Method, url, handlers...)
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
