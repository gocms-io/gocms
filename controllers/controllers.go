
//     License: MIT http://opensource.org/licenses/MIT

package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/controllers/api"
)

type ControllersGroup struct {
	Api          *Api
}

type Api struct {
	RoutePrefix    string
	Routes         *routes.ApiRoutes
	ApiControllers *ApiControllers
}

type ApiControllers struct {
	AuthController      *api.AuthController
	HealthyController   *api.HealthyController
	UserController      *api.UserController
	AdminUserController *api.AdminUserController
}

var (
	defaultRoutePrefix = "/api"
)

func DefaultControllerGroup(r *gin.Engine, sg *services.ServicesGroup) *ControllersGroup {

	// setup route groups
	routes := &routes.ApiRoutes{
		Public: r.Group(defaultRoutePrefix),
		Auth: r.Group(defaultRoutePrefix),
	}

	apiControllers := &ApiControllers{
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

	r.Static("/docs", "./docs")

	return controllersGroup
}


