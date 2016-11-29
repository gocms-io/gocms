package api

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/services"
)

type API struct {
	RoutePrefix string
	Routes      *Routes
	servicesGroup *services.ServicesGroup
}

type Routes struct {
	Public *gin.RouterGroup
	Auth   *gin.RouterGroup
}

var (
	defaultRoutePrefix = "/api"
)

// @APIVersion 1.0.0
// @APITitle Teamwork Desk
// @APIDescription Bend Teamwork Desk to your will using these read and write endpoints
// @Contact support@teamwork.com
// @TermsOfServiceUrl https://www.teamwork.com/termsofservice
// @License BSD
// @LicenseUrl http://opensource.org/licenses/BSD-2-Clause


func Default(r *gin.Engine, sg *services.ServicesGroup) *API {

	// setup route groups
	api := &API {
		RoutePrefix: "/api",
		Routes: &Routes{
			Public: r.Group(defaultRoutePrefix),
			Auth: r.Group(defaultRoutePrefix),
		},
		servicesGroup: sg,
	}

	// init authentication mdl
	//authMdl := {
	//
	//}
	//authMdl.RequireAuthenticatedUser()
	//api.Routes.Auth.Use(authMdl.RequireAuthenticatedUser())

	//new(AuthController).Apply()
	hc := HealthyController{}
	hc.Use(api.Routes)

	return api
}

func (api *API) Apply(r *gin.Engine) {


}

