package auth

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/models"
)


/**
* @api {post} /login Login
* @apiName Login
* @apiGroup Authentication
*
* @apiUse LoginInput
* @apiUse UserDisplay
*
* @apiSuccess (Response-Header) {string} x-auth-token
*/
func (ac *AuthController) login(c *gin.Context) {

	var loginInput models.LoginInput

	// get login values
	if c.BindJSON(&loginInput) != nil {
		errors.Response(c, http.StatusUnauthorized, "Missing Email or Password", REDIRECT_LOGIN)
		return
	}

	// auth user
	user, authed := ac.ServicesGroup.AuthService.AuthUser(loginInput.Email, loginInput.Password)
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

	c.JSON(http.StatusOK, user.GetUserDisplay())
	return
}
