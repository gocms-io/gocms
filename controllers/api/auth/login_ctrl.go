package auth

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/utility/errors"
)

// Login form structure.
type LoginDisplay struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}


/**
* @api {post} /login Login
* @apiName Login
* @apiGroup Authentication
*
* @apiUse UserAuthHeader
*
* @apiParam {string} email
* @apiParam {string} password
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*	Headers:
*		x-auth-token: xxx.xxx.xxx
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
func (ac *AuthController) login(c *gin.Context) {

	var loginDisplay LoginDisplay

	// get login values
	if c.BindJSON(&loginDisplay) != nil {
		errors.Response(c, http.StatusUnauthorized, "Missing Email or Password", REDIRECT_LOGIN)
		return
	}

	// auth user
	user, authed := ac.ServicesGroup.AuthService.AuthUser(loginDisplay.Email, loginDisplay.Password)
	if !authed {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Incorrect Email / Password", REDIRECT_LOGIN)
		return
	}


	// create token
	tokenString, err := ac.createToken(user.Id)
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating token.", REDIRECT_LOGIN)
		return
	}

	c.Header("X-AUTH-TOKEN", tokenString)

	c.JSON(http.StatusOK, user)
	return
}
