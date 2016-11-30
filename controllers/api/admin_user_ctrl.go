package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/routes"
)

type AdminUserController struct {
	routes *routes.ApiRoutes
	userService  services.IUserService
	authServices services.IAuthService
}

func DefaultAdminUserController(routes *routes.ApiRoutes, sg *services.ServicesGroup) *AdminUserController{
	adminUserController := &AdminUserController{
		routes: routes,
		userService: sg.UserService,
		authServices: sg.AuthService,
	}

	adminUserController.Default()
	return adminUserController
}

func (auc *AdminUserController) Default() {

	auc.routes.Admin.GET("/user", auc.getAll)
	auc.routes.Admin.GET("/user/:userId", auc.get)
	auc.routes.Admin.PUT("/user/:userId", auc.update)
	auc.routes.Admin.POST("/user", auc.add)
	auc.routes.Admin.DELETE("/user/:userId", auc.delete)
}

func (auc *AdminUserController) add(c *gin.Context) {

	user := &models.User{}
	//get user data
	err := c.BindJSON(user)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// get password
	if user.NewPassword == "" {
		errors.Response(c, http.StatusBadRequest, "New Password Field Required.", err)
		return
	}

	// add user
	err = auc.userService.Add(user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, err.Error(), err)
		return
	}

	c.JSON(http.StatusOK, user)
}

func (auc *AdminUserController) get(c *gin.Context) {

	userId, err := strconv.Atoi(c.Param("userId"))
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, err.Error(), err)
	}

	user, err := auc.userService.Get(userId)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't find user.", err)
		return
	}

	c.JSON(http.StatusOK, user)
}

func (auc *AdminUserController) getAll(c *gin.Context) {
	users, err := auc.userService.GetAll()
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't get users", err)
		return
	}

	c.JSON(http.StatusOK, users)
}

func (auc *AdminUserController) update(c *gin.Context) {
	// get user to update
	userId, err := strconv.Atoi(c.Param("userId"))
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Missing Id Field", err)
		return
	}

	// get update info
	user := &models.User{}
	// get user data
	err = c.BindJSON(user)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// do update
	err = auc.userService.Update(userId, user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
		return
	}

	c.JSON(http.StatusOK, user)
}

func (auc *AdminUserController) delete(c *gin.Context) {
	userId, err := strconv.Atoi(c.Param("userId"))
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Missing Id Field", err)
		return
	}

	// delete user
	err = auc.userService.Delete(userId)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't delete user.", err)
		return
	}

	c.Status(http.StatusOK)
}
