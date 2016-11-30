package api

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/api/healthy"
	"github.com/menklab/goCMS/api/auth"
	"github.com/menklab/goCMS/api/users"
)

type API struct {
	RoutePrefix string
	Routes      *routes.ApiRoutes
	servicesGroup *services.ServicesGroup
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
	routes := &routes.ApiRoutes{
		Public: r.Group(defaultRoutePrefix),
		Auth: r.Group(defaultRoutePrefix),
	}

	api := &API {
		RoutePrefix: "/api",
		Routes: routes,
		servicesGroup: sg,
	}

	// init api defaults
	auth.Default(routes, sg).Use()
	healthy.Default(routes).Use()
	users.Default(routes, sg).Use()

	return api
}

func (api *API) Apply(r *gin.Engine) {


}

