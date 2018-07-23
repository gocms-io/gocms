package user_admin_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/myanrichal/gocms/domain/acl/access_control/access_control_middleware"
	"github.com/myanrichal/gocms/domain/acl/permissions"
	"github.com/myanrichal/gocms/domain/user/user_model"
	"github.com/myanrichal/gocms/init/service"
	"github.com/myanrichal/gocms/routes"
	"github.com/myanrichal/gocms/utility/errors"
	"net/http"
	"strconv"
)

type UserAdminController struct {
	routes        *routes.Routes
	ServicesGroup *service.ServicesGroup
	adminRoutes   *gin.RouterGroup
}

func DefaultUserAdminController(routes *routes.Routes, sg *service.ServicesGroup) *UserAdminController {
	adminUserController := &UserAdminController{
		routes:        routes,
		ServicesGroup: sg,
	}

	// add acl rules to route
	adminUserController.adminRoutes = routes.Auth.Group("/admin", access_control_middleware.RequirePermission(sg.AclService, permissions.SUPER_ADMIN))

	adminUserController.Default()
	return adminUserController

}

/**
* @apiDefine Admin Admin User
* User must be logged in and have the role of Admin.
 */
func (auc *UserAdminController) Default() {

	auc.adminRoutes.GET("/user", auc.getAll)
	auc.adminRoutes.GET("/user/:userId", auc.get)
	auc.adminRoutes.PUT("/user/:userId", auc.update)
	auc.adminRoutes.POST("/user", auc.add)
	auc.adminRoutes.DELETE("/user/:userId", auc.delete)
}

func (auc *UserAdminController) add(c *gin.Context) {

	user := &user_model.User{}
	//get user data
	err := c.BindJSON(user)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// get password
	if user.Password == "" {
		errors.Response(c, http.StatusBadRequest, "New Password Field Required.", err)
		return
	}

	// add user
	err = auc.ServicesGroup.UserService.Add(user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, err.Error(), err)
		return
	}

	c.JSON(http.StatusOK, user)
}

/**
* @api {get} /admin/user/:userId Get User By Id
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

	user, err := auc.ServicesGroup.UserService.Get(userId)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't find user.", err)
		return
	}

	c.JSON(http.StatusOK, user.GetUserAdminDisplay())
}

/**
* @api {get} /admin/user Get All Users
* @apiDescription Used to get a list of all users.
* @apiName GetAllUsers
* @apiGroup Admin
*
* @apiUse UserAuthHeader
* @apiUse UserDisplay
* @apiPermission Admin
 */
func (auc *UserAdminController) getAll(c *gin.Context) {
	users, err := auc.ServicesGroup.UserService.GetAll()
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
	err = auc.ServicesGroup.UserService.Update(userId, user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
		return
	}

	c.JSON(http.StatusOK, user)
}

func (auc *UserAdminController) delete(c *gin.Context) {
	userId, err := strconv.ParseInt(c.Param("userId"), 10, 64)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Missing Id Field", err)
		return
	}

	// delete user
	err = auc.ServicesGroup.UserService.Delete(userId)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't delete user.", err)
		return
	}

	c.Status(http.StatusOK)
}
