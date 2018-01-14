package health_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/utility/errors"
	"net/http"
)

type HealthController struct {
	routes       *routes.Routes
	serviceGroup *service.ServicesGroup
}

func DefaultHealthController(routes *routes.Routes, serviceGroup *service.ServicesGroup) *HealthController {
	hc := &HealthController{
		routes:       routes,
		serviceGroup: serviceGroup,
	}

	hc.routes.Public.GET("/healthy", hc.health)

	return hc
}

func InternalHealthController(routes *routes.Routes, serviceGroup *service.ServicesGroup) *HealthController {
	hc := &HealthController{
		routes:       routes,
		serviceGroup: serviceGroup,
	}

	hc.routes.InternalRoot.GET("/healthy", hc.health)

	return hc
}

/**
* @api {get} /healthy Service Health Status (*I)
* @apiDescription Used to verify that the services are up and running.
* @apiName GetHealthy
* @apiGroup Utility
 */
func (hc *HealthController) health(c *gin.Context) {

	ok, _ := hc.serviceGroup.HealthService.GetHealthStatus()

	if !ok {

		msg := "Service is having health issues"

		// todo add a admin key to get more detailed reports
		//for i, issue := range context {
		//	if i == 0 {
		//		msg = fmt.Sprintf("%v %v", msg, issue)
		//	} else {
		//		msg = fmt.Sprintf("%v, %v", msg, issue)
		//	}
		//}

		errors.Response(c, http.StatusInternalServerError, msg, nil)
		return
	}

	c.Status(http.StatusOK)
}
