
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
* @api {get} /healthy Service Health Status
* @apiName GetHealthy
* @apiGroup Utility
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*
* @apiError Not Found The services are not online.
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 404 Not Found
*/
func (hc *HealthyController) healthy(c *gin.Context) {
	c.Status(http.StatusOK)
}

/**
* @api {get} /verify Verify User
* @apiName VerifyUser
* @apiGroup Authentication
*
* @apiUse UserAuthHeader
*
* @apiSuccessExample Success-Response:
*	HTTP/1.1 200 OK
*	{
*		"id": "1234",
*		"fullName": "john doe",
*		"email": "name@email.com",
*		"gender": "1"
*	}
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 403 Unauthorized
*/
func (hc *HealthyController) user(c *gin.Context) {
	// get logged in user
	authUser, _ := utility.GetUserFromContext(c)
	c.JSON(http.StatusOK, authUser)
}
