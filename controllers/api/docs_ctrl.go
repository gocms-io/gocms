
package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/routes"
	"stash.cqlcorp.net/ce/wrist-reader-api/controllers/routes"
)


type DocumentationController struct {
	routes *routes.ApiRoutes
}

func DefaultDocumentationController(routes *routes.ApiRoutes) *DocumentationController{
	dc := &HealthyController{
		routes: routes,
	}

	dc.Default()
	return dc
}

func (dc *DocumentationController) Default() {
	dc.routes.Root.StaticFile("/docs", "./docs/")
}

// @api {get} /healthy Service Health Status
// @apiName GetHealthy
// @apiGroup Utility
//
// @apiSuccessExample Success-Response:
//     HTTP/1.1 200 OK
//
// @apiError Not Found The services are not online.
//
// @apiErrorExample Error-Response:
//     HTTP/1.1 404 Not Found
func (hc *HealthyController) healthy(c *gin.Context) {
	c.Status(http.StatusOK)
}

// @api {get} /verify Verify Authentication
// @apiName Verify Authentication
// @apiGroup Authentication
//
// @apiSuccessExample Success-Response:
//     HTTP/1.1 200 OK
//
// @apiError Unauthorized The user is not authorized.
//
// @apiErrorExample Error-Response:
//     HTTP/1.1 401 Unauthorized

func (hc *HealthyController) user(c *gin.Context) {
	// get logged in user
	authUser, _ := utility.GetUserFromContext(c)
	c.JSON(http.StatusOK, authUser)
}
