package access_control_controller

import (
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gin-gonic/gin"
	"strconv"
	"net/http"
	"github.com/gocms-io/gocms/utility/errors"
)

type AccessControlController struct {
	routes *routes.Routes
	servicesGroup  *service.ServicesGroup
}

func InternalAccessControlController(routes *routes.Routes, sg *service.ServicesGroup) *AccessControlController {
	iacc := &AccessControlController{
		routes:        routes,
		servicesGroup:  sg,
	}

	iacc.routes.InternalRoot.GET("/acl/isAuthorized/:userId/:permission", iacc.isAuthorized)

	return iacc
}

/**
* @api {post} (internal)/acl/isAuthorized/:userId/:permission Is Authorized (*IO)
* @apiName IsAuthorized
* @apiGroup ACL
* @apiDescription (Internal) check is a user is authorized based upon a permission name. 200 = Yes; 401 = No
 */
func (acc *AccessControlController) isAuthorized(c *gin.Context) {

	// get user id
	userIdStr := c.Param("userId")
	userId, err := strconv.ParseInt(userIdStr,10,64)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "userId is missing or not an integer", err)
		return
	}

	// get permissions
	permission := c.Param("permission")
	if permission == "" {
		errors.Response(c, http.StatusBadRequest, "permission is missing", err)
		return
	}

	isAuthorized := acc.servicesGroup.AclService.IsAuthorized(permission, userId)

	if isAuthorized {
		c.Status(http.StatusOK)
		return
	}

	c.Status(http.StatusUnauthorized)

}