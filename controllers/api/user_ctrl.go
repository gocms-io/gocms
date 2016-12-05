package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/utility/errors"
)

type UserController struct {
	routes        *routes.ApiRoutes
	ServicesGroup *services.ServicesGroup
}

func DefaultUserController(routes *routes.ApiRoutes, sg *services.ServicesGroup) *UserController{
	userController := &UserController{
		routes: routes,
		ServicesGroup: sg,
	}
	userController.Default()
	return userController
}

func (uc *UserController) Default() {

	uc.routes.Auth.GET("/user", uc.get)
	uc.routes.Auth.PUT("/user", uc.update)

}

/**
* @api {get} /user User Profile (Get)
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
* @api {put} /user User Profile (Update)
* @apiName UpdateUser
* @apiGroup User
*
* @apiUse AuthHeader
*
* @apiParam {string} fullName
* @apiParam {string} email
* @apiParam {string} newPassword set a new password for the user.
* @apiParam {string} password (required) the current password must be entered to update profile information
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
	var userForUpdate models.User
	err := c.BindJSON(&userForUpdate) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.ServicesGroup.AuthService.VerifyPassword(authUser.Password, userForUpdate.ConfirmPassword); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// add acceptable fields to user for update
	authUser.Email = userForUpdate.Email
	authUser.FullName = userForUpdate.FullName
	authUser.NewPassword = userForUpdate.NewPassword

	// do update
	err = uc.ServicesGroup.UserService.Update(authUser.Id, authUser)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
		return
	}

	//c.Status(http.StatusOK)
	c.Status(http.StatusOK)
}
