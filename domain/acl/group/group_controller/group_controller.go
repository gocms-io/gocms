package group_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/routes"
	"net/http"
	"strconv"
	"github.com/gocms-io/gocms/utility/errors"
	"github.com/gocms-io/gocms/utility/sqlUtl"
	"github.com/gocms-io/gocms/domain/acl/access_control/access_control_middleware"
	"github.com/gocms-io/gocms/domain/acl/permissions"
)

type GroupController struct {
	routes *routes.Routes
	servicesGroup  *service.ServicesGroup
}

func DefaultGroupAdminController(routes *routes.Routes, sg *service.ServicesGroup) *GroupController {
	gc := &GroupController{
		routes:        routes,
		servicesGroup:  sg,
	}

	// add acl rules to route
	adminRoutes := routes.Auth.Group("/admin", access_control_middleware.RequirePermission(sg.AclService, permissions.SUPER_ADMIN))


	adminRoutes.POST("/acl/addUser/:userId/toGroupByName/:groupName", gc.addUserToGroupByName)
	adminRoutes.DELETE("/acl/removeUser/:userId/fromGroupByName/:groupName", gc.removeUserFromGroupByName)


	return gc

}

func InternalGroupController(routes *routes.Routes, sg *service.ServicesGroup) *GroupController {
	igc := &GroupController{
		routes:        routes,
		servicesGroup:  sg,
	}

	igc.routes.InternalRoot.POST("/acl/addUser/:userId/toGroupByName/:groupName", igc.addUserToGroupByName)
	igc.routes.InternalRoot.DELETE("/acl/removeUser/:userId/fromGroupByName/:groupName", igc.removeUserFromGroupByName)

	return igc
}

/**
* @api {post} (internal)/acl/addUser/:userId/toGroupByName/:groupName Add User To Group By Name (*IO)
* @apiName AddUserToGroup
* @apiGroup ACL
* @apiDescription (Internal) add a user to an acl group by userId and groupName
 */
func (igc *GroupController) addUserToGroupByName(c *gin.Context) {

	userIdStr := c.Param("userId")
	userId, err := strconv.ParseInt(userIdStr,10,64)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "userId is missing or not an integer", err)
		return
	}

	groupName := c.Param("groupName")
	if groupName == "" {
		errors.Response(c, http.StatusBadRequest, "groupName is missing", err)
		return
	}

	err = igc.servicesGroup.GroupService.AddUserToGroupByName(userId, groupName)
	if err != nil {
		if sqlUtl.ErrDupEtry(err) {
			errors.Response(c, http.StatusBadRequest, "User is already a member of this group", err)
			return
		}
		errors.Response(c, http.StatusInternalServerError, "There was an error adding the user to the group specified", err)
		return
	}

	c.Status(http.StatusOK)
}

/**
* @api {delete} (internal)/acl/removeUser/:userId/fromGroupByName/:groupName Remove User From Group By Name (*IO)
* @apiName RemoveUserFromGroup
* @apiGroup ACL
* @apiDescription (Internal) remove a user from an acl group by userId and groupName
 */
func (igc *GroupController) removeUserFromGroupByName(c *gin.Context) {

	userIdStr := c.Param("userId")
	userId, err := strconv.ParseInt(userIdStr,10,64)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "userId is missing or not an integer", err)
		return
	}

	groupName := c.Param("groupName")
	if groupName == "" {
		errors.Response(c, http.StatusBadRequest, "groupName is missing", err)
		return
	}

	err = igc.servicesGroup.GroupService.RemoveUserFromGroupByName(userId, groupName)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "There was an error remove the user to the group specified", err)
		return
	}

	c.Status(http.StatusOK)
}