package user_admin_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/domain/acl/access_control/access_control_middleware"
	"github.com/gocms-io/gocms/domain/acl/permissions"
	"github.com/gocms-io/gocms/domain/user/user_model"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/utility/errors"
	"net/http"
	"strconv"
)

type UserAdminController struct {
	routes        *routes.Routes
	servicesGroup *service.ServicesGroup
}

/**
* @apiDefine Admin Admin User
* User must be logged in and have the role of Admin.
 */
func DefaultUserAdminController(routes *routes.Routes, sg *service.ServicesGroup) *UserAdminController {
	auc := &UserAdminController{
		routes:        routes,
		servicesGroup: sg,
	}

	// add acl rules to route
	adminRoutes := routes.Auth.Group("/admin", access_control_middleware.RequirePermission(sg.AclService, permissions.SUPER_ADMIN))


	adminRoutes.GET("/user", auc.getAll)
	adminRoutes.GET("/user/:userId", auc.get)
	adminRoutes.PUT("/user/:userId", auc.update)
	adminRoutes.POST("/user", auc.add)
	adminRoutes.DELETE("/user/:userId", auc.delete)

	return auc

}

func InternalUserAdminController(routes *routes.Routes, sg *service.ServicesGroup) *UserAdminController {
	auc := &UserAdminController{
		routes:        routes,
		servicesGroup: sg,
	}

	routes.InternalRoot.GET("/user", auc.getAll)
	routes.InternalRoot.GET("/user/:userId", auc.get)
	routes.InternalRoot.PUT("/user/:userId", auc.update)
	routes.InternalRoot.POST("/user", auc.add)
	routes.InternalRoot.DELETE("/user/:userId", auc.delete)

	return auc

}

/**
* @api {post} /admin/user Add User (*I)
* @apiDescription Add a new user.
* @apiName AddUser
* @apiGroup Admin
* @apiUse UserAuthHeader
* @apiUse UserAdminInput
* @apiPermission Admin
 */
func (auc *UserAdminController) add(c *gin.Context) {

	user := &user_model.User{}
	//get user data
	err := c.BindJSON(user)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// add user
	err = auc.servicesGroup.UserService.Add(user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, err.Error(), err)
		return
	}

	c.JSON(http.StatusOK, user)
}

/**
* @api {get} /admin/user/:userId Get User By Id (*I)
* @apiDescription Get a user by their Id.
* @apiName GetUserById
* @apiGroup Admin
*
* @apiUse UserAuthHeader
* @apiUse UserDisplay
* @apiPermission Admin
 */
func (auc *UserAdminController) get(c *gin.Context) {

	userId, err := strconv.ParseInt(c.Param("userId"), 10, 64)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, err.Error(), err)
	}

	user, err := auc.servicesGroup.UserService.Get(userId)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't find user.", err)
		return
	}

	c.JSON(http.StatusOK, user.GetUserAdminDisplay())
}

/**
* @api {get} /admin/user Get All Users (*I)
* @apiDescription Used to get a list of all users.
* @apiName GetAllUsers
* @apiGroup Admin
*
* @apiUse UserAuthHeader
* @apiUse UserDisplay
* @apiPermission Admin
 */
func (auc *UserAdminController) getAll(c *gin.Context) {
	users, err := auc.servicesGroup.UserService.GetAll()
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't get users", err)
		return
	}

	// create list of users to sent out
	usersAdminDisplays := make([]user_model.UserAdminDisplay, len(*users))
	for i, user := range *users {
		usersAdminDisplays[i] = *user.GetUserAdminDisplay()
	}

	c.JSON(http.StatusOK, usersAdminDisplays)
}

/**
* @api {put} /admin/user/:userId Put User By Id (*I)
* @apiDescription Put user by id.
* @apiName UpdateUser
* @apiGroup Admin
* @apiUse UserAuthHeader
* @apiUse UserAdminInput
* @apiPermission Admin
 */
func (auc *UserAdminController) update(c *gin.Context) {
	// get user to update
	userId, err := strconv.ParseInt(c.Param("userId"), 10, 64)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Missing Id Field", err)
		return
	}

	// get update info
	user := &user_model.User{}
	// get user data
	err = c.BindJSON(user)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// do update
	err = auc.servicesGroup.UserService.Update(userId, user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
		return
	}

	c.JSON(http.StatusOK, user)
}

/**
* @api {delete} /admin/user/:userId Delete User By Id (*I)
* @apiDescription Delete user by id.
* @apiName DeleteUser
* @apiGroup Admin
*
* @apiUse UserAuthHeader
* @apiPermission Admin
 */
func (auc *UserAdminController) delete(c *gin.Context) {
	userId, err := strconv.ParseInt(c.Param("userId"), 10, 64)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Missing Id Field", err)
		return
	}

	// delete user
	err = auc.servicesGroup.UserService.Delete(userId)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't delete user.", err)
		return
	}

	c.Status(http.StatusOK)
}
