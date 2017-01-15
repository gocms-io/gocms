package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/controllers/api"
	"github.com/menklab/goCMS/controllers/static"
	"github.com/menklab/goCMS/controllers/api/auth"
	"github.com/menklab/goCMS/controllers/api/admin"
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
	DocumentationController *static.DocumentationController
	AuthController          *auth.AuthController
	HealthyController       *api.HealthyController
	AdminUserController     *admin.AdminUserController
	UserController		*api.UserController
	EmailController		*api.EmailController
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
		DocumentationController: static.DefaultDocumentationController(routes),
		AuthController: auth.DefaultAuthController(routes, sg),
		EmailController: api.DefaultEmailController(routes, sg),
		AdminUserController: admin.DefaultAdminUserController(routes, sg),
		HealthyController: api.DefaultHealthyController(routes),
		UserController: api.DefaultUserController(routes, sg),
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


