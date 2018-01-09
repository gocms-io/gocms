package health_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/utility/errors"
	"net/http"
)

type InternalHealthController struct {
	internalRoutes       *routes.InternalRoutes
	serviceGroup *service.ServicesGroup
}

func DefaultInternalHealthController(iRoutes *routes.InternalRoutes, serviceGroup *service.ServicesGroup) *InternalHealthController {
	ihc := &InternalHealthController{
		internalRoutes:       iRoutes,
		serviceGroup: serviceGroup,
	}

	ihc.DefaultInternal()
	return ihc
}

func (ihc *InternalHealthController) DefaultInternal() {
	ihc.internalRoutes.InternalRoot.GET("/healthy", ihc.internalHealth)
}

/**
* @api {get} /healthy Service Health Status
* @apiDescription Used to verify that the services are up and running.
* @apiName GetHealthy
* @apiGroup Utility
 */
func (hc *InternalHealthController) internalHealth(c *gin.Context) {

	ok, _ := hc.serviceGroup.HealthService.GetHealthStatus()

	if !ok {

		msg := "internal service is having health issues"
		errors.Response(c, http.StatusInternalServerError, msg, nil)
		return
	}

	c.Status(http.StatusOK)
}
