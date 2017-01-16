package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/controllers/static"
	"github.com/menklab/goCMS/controllers/middleware/cors"
	"github.com/menklab/goCMS/controllers/api/auth_ctrl"
	"github.com/menklab/goCMS/controllers/api/healthy_ctrl"
	"github.com/menklab/goCMS/controllers/api/admin_ctrl"
	"github.com/menklab/goCMS/controllers/api/user"
)

type ControllersGroup struct {
	Api *Api
}

type Api struct {
	RoutePrefix    string
	Routes         *routes.ApiRoutes
	ApiControllers *ApiControllers
}

type ApiControllers struct {
	DocumentationController *static_ctrl.DocumentationController
	AuthController          *auth_ctrl.AuthController
	HealthyController       *healthy_ctrl.HealthyController
	AdminUserController     *admin_ctrl.AdminUserController
	UserController		*user_ctrl.UserController
}

var (
	defaultRoutePrefix = "/api"
)

func DefaultControllerGroup(r *gin.Engine, sg *services.ServicesGroup) *ControllersGroup {

	// top level middleware
	r.Use(corsMdl.CORS())

	// setup route groups
	routes := &routes.ApiRoutes{
		Root: r.Group("/"),
		Public: r.Group(defaultRoutePrefix),
		Auth: r.Group(defaultRoutePrefix),
	}

	// define routes and apply middleware

	apiControllers := &ApiControllers{
		DocumentationController: static_ctrl.DefaultDocumentationController(routes),
		AuthController: auth_ctrl.DefaultAuthController(routes, sg),
		AdminUserController: admin_ctrl.DefaultAdminUserController(routes, sg),
		HealthyController: healthy_ctrl.DefaultHealthyController(routes),
		UserController: user_ctrl.DefaultUserController(routes, sg),
	}

	api := &Api{
		RoutePrefix: "/api",
		Routes: routes,
		ApiControllers: apiControllers,
	}

	controllersGroup := &ControllersGroup{
		Api: api,
	}

	return controllersGroup
}


