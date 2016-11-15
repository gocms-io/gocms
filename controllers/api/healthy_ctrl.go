package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"bitbucket.org/menklab/grnow-services/utility"
	"bitbucket.org/menklab/grnow-services/controllers/routes"
)

type HealthyController struct {
}

func (self *HealthyController) Apply() {
	routes := routes.Routes()
	routes.Public.GET("/healthy", self.healthy)
	routes.Auth.GET("/verify", self.user)
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
func (self *HealthyController) healthy(c *gin.Context) {
	c.Status(http.StatusOK)
	return
}

func (self *HealthyController) user(c *gin.Context) {
	// get logged in user
	authUser, _ := utility.GetUserFromContext(c)
	c.JSON(http.StatusOK, authUser)
}
