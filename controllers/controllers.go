package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/controllers/api/admin_ctrl"
	"github.com/menklab/goCMS/controllers/api/auth_ctrl"
	"github.com/menklab/goCMS/controllers/api/healthy_ctrl"
	"github.com/menklab/goCMS/controllers/api/user"
	"github.com/menklab/goCMS/controllers/middleware/cors"
	"github.com/menklab/goCMS/controllers/static"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
)

type ControllersGroup struct {
	Routes *routes.Routes
	Api    *Api
}

type Api struct {
	ApiControllers *ApiControllers
}

type ApiControllers struct {
	DocumentationController *static_ctrl.DocumentationController
	AuthController          *auth_ctrl.AuthController
	HealthyController       *healthy_ctrl.HealthyController
	AdminUserController     *admin_ctrl.AdminUserController
	UserController          *user_ctrl.UserController
}

var (
	defaultRoutePrefix = "/api"
)

func DefaultControllerGroup(r *gin.Engine, sg *services.ServicesGroup) *ControllersGroup {

	// top level middleware
	r.Use(aclMdl.CORS())
	r.LoadHTMLGlob("templates/*")

	// setup route groups
	routes := &routes.Routes{
		Root:   r.Group("/"),
		Public: r.Group(defaultRoutePrefix),
		Auth:   r.Group(defaultRoutePrefix),
	}

	// define routes and apply middleware

	apiControllers := &ApiControllers{
		DocumentationController: static_ctrl.DefaultDocumentationController(routes, sg),
		AuthController:          auth_ctrl.DefaultAuthController(routes, sg),
		AdminUserController:     admin_ctrl.DefaultAdminUserController(routes, sg),
		HealthyController:       healthy_ctrl.DefaultHealthyController(routes),
		UserController:          user_ctrl.DefaultUserController(routes, sg),
	}

	api := &Api{
		ApiControllers: apiControllers,
	}

	controllersGroup := &ControllersGroup{
		Api: api,
		Routes:         routes,
	}

	// register plugin routes
	sg.PluginsService.RegisterPluginRoutes(routes)

	// add plugin proxy middleware
	//pluginProxy := plugin_proxy_mdl.DefaultPluginProxyMiddleware(sg)
	//r.Use(pluginProxy.ReverseProxyFromMap())

	return controllersGroup
}
