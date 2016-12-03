
package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/routes"
)


type HealthyController struct {
	routes *routes.ApiRoutes
}

func DefaultHealthyController(routes *routes.ApiRoutes) *HealthyController{
	hc := &HealthyController{
		routes: routes,
	}

	hc.Default()
	return hc
}

func (hc *HealthyController) Default() {
	hc.routes.Public.GET("/healthy", hc.healthy)
	hc.routes.Auth.GET("/verify", hc.user)
}

/**
 * @api {get} /api/healthy Health Check
 * @apiName Healthy
 * @apiGroup Basic
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 */
func (hc *HealthyController) healthy(c *gin.Context) {
	c.Status(http.StatusOK)
}

func (hc *HealthyController) user(c *gin.Context) {
	// get logged in user
	authUser, _ := utility.GetUserFromContext(c)
	c.JSON(http.StatusOK, authUser)
}
