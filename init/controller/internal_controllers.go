package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/domain/acl/authentication/authentication_middleware"
	"github.com/gocms-io/gocms/domain/acl/cors"
	"github.com/gocms-io/gocms/domain/content/documentation"
	"github.com/gocms-io/gocms/domain/content/react"
	"github.com/gocms-io/gocms/domain/content/template"
	"github.com/gocms-io/gocms/domain/content/theme"
	"github.com/gocms-io/gocms/domain/user/user_middleware"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/routes"
	"strings"
	"github.com/gocms-io/gocms/domain/plugin/plugin_services"
)

type InternalControllersGroup struct {

}

var (
	defaultInternalRoutePrefix = "/internal"
)

func DefaultInternalControllerGroup(r *gin.Engine, sg *service.ServicesGroup) *InternalControllersGroup {

	// create plugin middleware handle
	pluginMiddlewareProxy := sg.PluginsService.NewPluginMiddlewareProxyByRank()
	// apply plugin middleware rank 1
	r.Use(pluginMiddlewareProxy.ApplyForRank(plugin_services.MIDDLEWARE_RANK_1)...)


	// top level middleware
	r.Use(user_middleware.UUID())
	r.Use(cors.CORS())
	r.Use(user_middleware.Timezone())
	am := authentication_middleware.DefaultAuthMiddleware(sg)
	r.Use(am.AddUserToContextIfValidToken())

	// apply plugin middleware rank 1000
	r.Use(pluginMiddlewareProxy.ApplyForRank(plugin_services.MIDDLEWARE_RANK_1000)...)

	//r.LoadHTMLGlob("./content/templates/*.tmpl")
	r.HTMLRender = createMyRender()
	// setup route groups
	routes := &routes.Routes{
		Root:    r.Group("/"),
		Public:  r.Group(defaultRoutePrefix),
		Auth:    r.Group(defaultRoutePrefix),
		NoRoute: r.NoRoute,
	}

	// apply auth middleware
	am.ApplyAuthToRoutes(routes)

	// apply plugin middleware rank 2000
	r.Use(pluginMiddlewareProxy.ApplyForRank(plugin_services.MIDDLEWARE_RANK_2000)...)



	// define after for 404 catcher
	contentControllers := &ContentControllers{
		DocumentationController: documentation_controller.DefaultDocumentationController(routes, sg),
		ThemesControllers:       theme_controller.DefaultThemesController(r, routes),
		TemplateControllers:     template_controller.DefaultTemplatesController(routes),
		ReactControllers:        react_controller.DefaultReactController(routes, sg),
	}

	// apply plugin middleware rank 3000
	r.Use(pluginMiddlewareProxy.ApplyForRank(plugin_services.MIDDLEWARE_RANK_3000)...)

	// register plugin routes
	sg.PluginsService.RegisterActivePluginRoutes(routes)

	// apply plugin middleware rank 4000
	r.Use(pluginMiddlewareProxy.ApplyForRank(plugin_services.MIDDLEWARE_RANK_4000)...)

	// add no route controller
	routes.NoRoute(func(c *gin.Context) {
		paths := strings.Split(c.Request.RequestURI, "/")
		if paths[1] == "api" {
			return // handle default not route
		}
		// otherwise return homepage
		contentControllers.ReactControllers.ServeReact(c)
	})

	internalControllersGroup := &InternalControllersGroup{

	}

	return internalControllersGroup
}
