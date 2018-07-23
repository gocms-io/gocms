package user_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/myanrichal/gocms/utility/api_utility"
	"github.com/myanrichal/gocms/domain/user/user_model"
	"github.com/myanrichal/gocms/init/service"
	"github.com/myanrichal/gocms/routes"
	"github.com/myanrichal/gocms/utility/errors"
	"net/http"
)

type UserController struct {
	routes        *routes.Routes
	ServicesGroup *service.ServicesGroup
}

func DefaultUserController(routes *routes.Routes, sg *service.ServicesGroup) *UserController {
	userController := &UserController{
		routes:        routes,
		ServicesGroup: sg,
	}
	userController.Default()
	return userController
}

func (uc *UserController) Default() {

	uc.routes.Auth.GET("/user", uc.get)
	uc.routes.Auth.PUT("/user", uc.update)
	uc.routes.Auth.PUT("/user/deactivate", uc.deactivateUser)
	uc.routes.Auth.PUT("/user/changePassword", uc.changePassword)

}

/**
* @api {get} /user Get Profile
* @apiName GetUser
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse UserDisplay
* @apiPermission Authenticated
 */
func (uc *UserController) get(c *gin.Context) {

	authUser, _ := api_utility.GetUserFromContext(c)

	c.JSON(http.StatusOK, authUser.GetUserDisplay())
}

/**
* @api {put} /user Update Profile
* @apiName UpdateUser
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse UserUpdateInput
* @apiPermission Authenticated
 */
func (uc *UserController) update(c *gin.Context) {

	// get logged in user
	authUser, _ := api_utility.GetUserFromContext(c)

	// copy current user info into update user
	var userForUpdate user_model.UserUpdateInput
	err := c.BindJSON(&userForUpdate) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// add acceptable fields to user for update
	if userForUpdate.FullName != "" {
		authUser.FullName = userForUpdate.FullName
	}

	// check and set gender
	switch userForUpdate.Gender {
	case user_model.GENDER_MALE:
		authUser.Gender = user_model.GENDER_MALE
		break
	case user_model.GENDER_FEMALE:
		authUser.Gender = user_model.GENDER_FEMALE
		break
	}

	// do update
	err = uc.ServicesGroup.UserService.Update(authUser.Id, authUser)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
		return
	}

	c.Status(http.StatusOK)
}

/**
* @api {put} /user/changePassword Change Password
* @apiName ChangePassword
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse UserChangePasswordInput
* @apiPermission Authenticated
 */
func (uc *UserController) changePassword(c *gin.Context) {

	// get logged in user
	authUser, _ := api_utility.GetUserFromContext(c)

	// copy current user info into update user
	var changePasswordInput user_model.UserChangePasswordInput
	err := c.BindJSON(&changePasswordInput) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.ServicesGroup.AuthService.VerifyPassword(authUser.Password, changePasswordInput.Password); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// do update
	err = uc.ServicesGroup.UserService.UpdatePassword(authUser.Id, changePasswordInput.NewPassword)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
		return
	}

	c.Status(http.StatusOK)
}

/**
* @api {put} /user/deactivate Deactivate Account
* @apiName DeactivateUser
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse UserPasswordInput
* @apiPermission Authenticated
 */
func (uc *UserController) deactivateUser(c *gin.Context) {

	// get logged in user
	authUser, _ := api_utility.GetUserFromContext(c)

	// copy current user info into update user
	var userPasswordInput user_model.UserPasswordInput
	err := c.BindJSON(&userPasswordInput) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.ServicesGroup.AuthService.VerifyPassword(authUser.Password, userPasswordInput.Password); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// deactivate account
	err = uc.ServicesGroup.UserService.SetEnabled(authUser.Id, false)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't deactivate user.", err)
		return
	}

	c.Status(http.StatusOK)
}
