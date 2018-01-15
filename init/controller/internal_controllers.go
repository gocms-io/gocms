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
	"github.com/gocms-io/gocms/domain/acl/group/group_controller"
	"github.com/gocms-io/gocms/domain/user/user_admin_controller"
	"github.com/gocms-io/gocms/domain/acl/access_control_controller"
)

type InternalControllersGroup struct {
	routes            *routes.Routes
	InternalHealthyController *health_controller.HealthController
	InternalAccessControlController *access_control_controller.AccessControlController
	InternalGroupController *group_controller.GroupController
	UserAdminController *user_admin_controller.UserAdminController
}

var (
	defaultInternalRoutePrefix = "/internal/api"
)

func DefaultInternalControllerGroup(ie *gin.Engine, sg *service.ServicesGroup) *InternalControllersGroup {

	// require microservice secret to use internal api
	ie.Use(RequireMicroserviceSecretMiddleware())

	// setup route groups
	ir := &routes.Routes{
		InternalRoot:   ie.Group(defaultInternalRoutePrefix),
	}

	// define after for 404 catcher
	icg := &InternalControllersGroup{
		InternalHealthyController: health_controller.InternalHealthController(ir, sg),
		InternalAccessControlController: access_control_controller.InternalAccessControlController(ir, sg),
		InternalGroupController: group_controller.InternalGroupController(ir, sg),
		UserAdminController: user_admin_controller.InternalUserAdminController(ir, sg),
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

