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
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
* 	{
*		"id": "1234",
*  		"fullName": "John Doe",
*		"email": "name@email.com",
*		"gender": "1",
*		"photo": "www.photo.com",
*		"minAge": "0",
*		"maxAge": "0",
*		"created": "2016-12-02T23:54:59Z",
*		"isAdmin": false
* 	}
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 403 Unauthorized
 */
func (uc *UserController) get(c *gin.Context) {

	authUser, _ := utility.GetUserFromContext(c)

	c.JSON(http.StatusOK, authUser)
}

/**
* @api {put} /user Update Profile
* @apiName UpdateUser
* @apiGroup User
*
* @apiUse AuthHeader
*
* @apiParam {string} fullName
* @apiParam {int} gender 1=male, 2=female
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 403 Unauthorized
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
* @apiParam {string} newPassword set a new password for the user.
* @apiParam {string} currentPassword (required) the current password must be entered to update profile information
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 403 Unauthorized
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
