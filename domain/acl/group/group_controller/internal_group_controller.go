package group_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/cqlcorp/gocms/init/service"
	"github.com/cqlcorp/gocms/routes"
	"net/http"
	"strconv"
	"github.com/cqlcorp/gocms/utility/errors"
	"github.com/cqlcorp/gocms/utility/sqlUtl"
)

type InternalGroupController struct {
	internalRoutes *routes.InternalRoutes
	servicesGroup  *service.ServicesGroup
}

func DefaultInternalGroupController(iRoutes *routes.InternalRoutes, sg *service.ServicesGroup) *InternalGroupController {
	internalGroupController := &InternalGroupController{
		internalRoutes: iRoutes,
		servicesGroup:  sg,
	}
	internalGroupController.InternalDefault()
	return internalGroupController
}

func (ec *InternalGroupController) InternalDefault() {
	ec.internalRoutes.InternalRoot.POST("/acl/addUser/:userId/toGroupByName/:groupName", ec.addUserToGroupByName)
	ec.internalRoutes.InternalRoot.DELETE("/acl/removeUser/:userId/fromGroupByName/:groupName", ec.removeUserFromGroupByName)
}

/**
* @api {post} (internal)/acl/addUser/:userId/toGroupByName/:groupName (Internal) Add User To Group By Name
* @apiName AddUserToGroup
* @apiGroup (Internal) ACL
* @apiDescription (Internal) add a user to an acl group by userId and groupName
 */
func (ec *InternalGroupController) addUserToGroupByName(c *gin.Context) {

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

	err = ec.servicesGroup.GroupService.AddUserToGroupByName(userId, groupName)
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
* @api {delete} (internal)/acl/removeUser/:userId/fromGroupByName/:groupName (Internal) Remove User From Group By Name
* @apiName RemoveUserFromGroup
* @apiGroup (Internal) ACL
* @apiDescription (Internal) remove a user from an acl group by userId and groupName
 */
func (ec *InternalGroupController) removeUserFromGroupByName(c *gin.Context) {

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

	err = ec.servicesGroup.GroupService.RemoveUserFromGroupByName(userId, groupName)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "There was an error remove the user to the group specified", err)
		return
	}

	c.Status(http.StatusOK)
}