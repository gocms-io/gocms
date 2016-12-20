package api

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/utility/errors"
	"net/http"
)

type UserController struct {
	routes        *routes.ApiRoutes
	ServicesGroup *services.ServicesGroup
}

func DefaultUserController(routes *routes.ApiRoutes, sg *services.ServicesGroup) *UserController {
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
	uc.routes.Auth.PUT("/user/changePassword", uc.changePassword)

}

/**
* @api {get} /user Get Profile
* @apiName GetUser
* @apiGroup User
*
* @apiUse AuthHeader
*
* @apiUse UserDisplay
 */
func (uc *UserController) get(c *gin.Context) {

	authUser, _ := utility.GetUserFromContext(c)

	c.JSON(http.StatusOK, authUser.GetUserDisplay())
}

/**
* @api {put} /user Update Profile
* @apiName UpdateUser
* @apiGroup User
*
* @apiUse AuthHeader
*
* @apiUse UserUpdateInput
*/
func (uc *UserController) update(c *gin.Context) {

	// get logged in user
	authUser, _ := utility.GetUserFromContext(c)

	// copy current user info into update user
	var userForUpdate models.UserUpdateInput
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
	case models.GENDER_MALE:
		authUser.Gender = models.GENDER_MALE
		break
	case models.GENDER_FEMALE:
		authUser.Gender = models.GENDER_FEMALE
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
*
* @apiUse UserUpdateInput
*/
func (uc *UserController) changePassword(c *gin.Context) {

	// get logged in user
	authUser, _ := utility.GetUserFromContext(c)

	// copy current user info into update user
	var changePaswordInput models.UserChangePasswordInput
	err := c.BindJSON(&changePaswordInput) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.ServicesGroup.AuthService.VerifyPassword(authUser.Password, changePaswordInput.CurrentPassword); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// do update
	err = uc.ServicesGroup.UserService.UpdatePassword(authUser.Id, changePaswordInput.NewPassword)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
		return
	}

	c.Status(http.StatusOK)
}
