package healthy_ctrl

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms-services/routes"
	"net/http"
)

type HealthyController struct {
	routes *routes.Routes
}

func DefaultHealthyController(routes *routes.Routes) *HealthyController {
	hc := &HealthyController{
		routes: routes,
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
	c.Status(http.StatusOK)
}
