package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/utility/log"
	"github.com/gocms-io/gocms/context/consts"
	"github.com/gocms-io/gocms/context"
	"net/http"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/domain/health/health_controller"
)

type InternalControllersGroup struct {
	InternalRoutes             *routes.InternalRoutes
	HealthyController   *health_controller.InternalHealthController
}

var (
	defaultInternalRoutePrefix = "/internal/api"
)

func DefaultInternalControllerGroup(ir *gin.Engine, sg *service.ServicesGroup) *InternalControllersGroup {

	// require microservice secret to use internal api
	ir.Use(RequireMicroserviceSecretMiddleware())

	// setup route groups
	internalRoutes := &routes.InternalRoutes{
		InternalRoot:   ir.Group(defaultRoutePrefix),
	}

	// define after for 404 catcher
	icg := &InternalControllersGroup{
		HealthyController:   health_controller.DefaultInternalHealthController(internalRoutes, sg),

	}

	return icg
}

func RequireMicroserviceSecretMiddleware() gin.HandlerFunc {
	log.Debugf("Adding Microservice Secret Middleware\n")
	return msSecretMdl
}

func msSecretMdl(c *gin.Context) {
	msSecret := c.Request.Header.Get(consts.GOCMS_HEADER_MICROSERVICE_SECRET)

	// if secret is no good then fail
	if msSecret != context.Config.DbVars.MicroserviceSecret {
		c.AbortWithStatus(http.StatusUnauthorized)
	} else {
		c.Next()
	}
}

