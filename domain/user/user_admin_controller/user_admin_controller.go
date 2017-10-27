package user_admin_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/controllers/middleware/acl"
	"github.com/gocms-io/gocms/domain/user/user_model"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/utility/errors"
	"net/http"
	"strconv"
)

type UserAdminController struct {
	routes        *routes.Routes
	ServicesGroup *service.ServicesGroup
}

func DefaultUserAdminController(routes *routes.Routes, sg *service.ServicesGroup) *UserAdminController {
	adminUserController := &UserAdminController{
		routes:        routes,
		ServicesGroup: sg,
	}

	// create acl object
	acl := aclMdl.AclMiddleware{
		ServicesGroup: sg,
	}

	// add acl rules to route
	routes.Admin = routes.Auth.Group("/admin", acl.RequirePermission("admin"))

	//routes.Admin.Use(acl.RequirePermission("admin"))

	adminUserController.Default()
	return adminUserController

}

/**
* @apiDefine Admin Admin User
* User must be logged in and have the role of Admin.
 */
func (auc *UserAdminController) Default() {

	auc.routes.Admin.GET("/user", auc.getAll)
	auc.routes.Admin.GET("/user/:userId", auc.get)
	auc.routes.Admin.PUT("/user/:userId", auc.update)
	auc.routes.Admin.POST("/user", auc.add)
	auc.routes.Admin.DELETE("/user/:userId", auc.delete)
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

	userId, err := strconv.Atoi(c.Param("userId"))
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
	userId, err := strconv.Atoi(c.Param("userId"))
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
	userId, err := strconv.Atoi(c.Param("userId"))
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
