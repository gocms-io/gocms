package goCMS_controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/controllers/middleware/cors"
	"github.com/menklab/goCMS/controllers/static"
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
	Routes         *goCMS_routes.ApiRoutes
	ApiControllers *ApiControllers
}

type ApiControllers struct {
	DocumentationController *goCMS_static_ctrl.DocumentationController
	AuthController          *goCMS_auth_ctrl.AuthController
	HealthyController       *goCMS_healthy_ctrl.HealthyController
	AdminUserController     *goCMS_admin_ctrl.AdminUserController
	UserController		*goCMS_user_ctrl.UserController
}

var (
	defaultRoutePrefix = "/api"
)

func DefaultControllerGroup(r *gin.Engine, sg *goCMS_services.ServicesGroup) *ControllersGroup {

	// top level middleware
	r.Use(goCMS_corsMdl.CORS())

	// setup route groups
	routes := &goCMS_routes.ApiRoutes{
		Root: r.Group("/"),
		Public: r.Group(defaultRoutePrefix),
		Auth: r.Group(defaultRoutePrefix),
	}

	// define routes and apply middleware

	apiControllers := &ApiControllers{
		DocumentationController: goCMS_static_ctrl.DefaultDocumentationController(routes),
		AuthController: goCMS_auth_ctrl.DefaultAuthController(routes, sg),
		AdminUserController: goCMS_admin_ctrl.DefaultAdminUserController(routes, sg),
		HealthyController: goCMS_healthy_ctrl.DefaultHealthyController(routes),
		UserController: goCMS_user_ctrl.DefaultUserController(routes, sg),
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


