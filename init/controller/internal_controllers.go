package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/cqlcorp/gocms/init/service"
	"github.com/cqlcorp/gocms/utility/log"
	"github.com/cqlcorp/gocms/context/consts"
	"github.com/cqlcorp/gocms/context"
	"net/http"
	"github.com/cqlcorp/gocms/routes"
	"github.com/cqlcorp/gocms/domain/health/health_controller"
	"github.com/cqlcorp/gocms/domain/acl/group/group_controller"
)

type InternalControllersGroup struct {
	InternalRoutes            *routes.InternalRoutes
	InternalHealthyController *health_controller.InternalHealthController
	InternalGroupController *group_controller.InternalGroupController
}

var (
	defaultInternalRoutePrefix = "/internal/api"
)

func DefaultInternalControllerGroup(ir *gin.Engine, sg *service.ServicesGroup) *InternalControllersGroup {

	// require microservice secret to use internal api
	ir.Use(RequireMicroserviceSecretMiddleware())

	// setup route groups
	internalRoutes := &routes.InternalRoutes{
		InternalRoot:   ir.Group(defaultInternalRoutePrefix),
	}

	// define after for 404 catcher
	icg := &InternalControllersGroup{
		InternalHealthyController: health_controller.DefaultInternalHealthController(internalRoutes, sg),
		InternalGroupController: group_controller.DefaultInternalGroupController(internalRoutes, sg),
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

