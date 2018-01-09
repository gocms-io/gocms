package group_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/routes"
	"net/http"
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
}

/**
* @api {post} (internal)/acl/addUser/:userId/toGroupByName/:groupName (Internal) Add User To Group By Name
* @apiName AddUserToGroup
* @apiGroup (Internal) ACL
* @apiDescription (Internal) add a user to an acl group by userId and groupName
 */
func (ec *InternalGroupController) addUserToGroupByName(c *gin.Context) {

	c.Status(http.StatusOK)
}
