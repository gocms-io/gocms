package health_controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/routes"
	"net/http"
)

type HealthyController struct {
	routes       *routes.Routes
	serviceGroup *service.ServicesGroup
}

func DefaultHealthyController(routes *routes.Routes, serviceGroup *service.ServicesGroup) *HealthyController {
	hc := &HealthyController{
		routes:       routes,
		serviceGroup: serviceGroup,
	}

	hc.Default()
	return hc
}

func (hc *HealthyController) Default() {
	hc.routes.Public.GET("/healthy", hc.healthy)
}

/**
* @api {get} /healthy Service Health Status
* @apiDescription Used to verify that the services are up and running.
* @apiName GetHealthy
* @apiGroup Utility
 */
func (hc *HealthyController) healthy(c *gin.Context) {

	// get active plugins
	activePlugins := hc.serviceGroup.PluginsService.GetActivePlugins()
	for _, activePlugin := range activePlugins {
		fmt.Printf("ActivePlugin: %v\n", activePlugin.Cmd.ProcessState)
		//if err != nil {
		//	fmt.Printf("died.")
		//}
	}

	c.Status(http.StatusOK)
}
