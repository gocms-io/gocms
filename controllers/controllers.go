package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/controllers/api"
	"github.com/menklab/goCMS/controllers/middleware/cors"
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
	DocumentationController *api.DocumentationController
	AuthController          *api.AuthController
	HealthyController       *api.HealthyController
	UserController          *api.UserController
	AdminUserController     *api.AdminUserController
}

var (
	defaultRoutePrefix = "/api"
)

func DefaultControllerGroup(r *gin.Engine, sg *services.ServicesGroup) *ControllersGroup {

	// top level middleware
	r.Use(cors.CORS())

	// setup route groups
	routes := &routes.ApiRoutes{
		Root: r.Group("/"),
		Public: r.Group(defaultRoutePrefix),
		Auth: r.Group(defaultRoutePrefix),
	}

	apiControllers := &ApiControllers{
		DocumentationController: api.DefaultDocumentationController(routes),
		AuthController: api.DefaultAuthController(routes, sg),
		HealthyController: api.DefaultHealthyController(routes),
		UserController: api.DefaultUserController(routes, sg),
		AdminUserController: api.DefaultAdminUserController(routes, sg),
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


