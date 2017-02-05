package goCMS_auth_ctrl

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
* @apiSuccess (Response-Header) {string} x-auth-token
*/
func (ac *AuthController) login(c *gin.Context) {

	var loginInput goCMS_models.LoginInput

	// get login values
	if c.BindJSON(&loginInput) != nil {
		goCMS_errors.Response(c, http.StatusUnauthorized, "Missing Email or Password", REDIRECT_LOGIN)
		return
	}

	// auth user
	user, authed := ac.ServicesGroup.AuthService.AuthUser(loginInput.Email, loginInput.Password)
	if !authed {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Incorrect Email / Password", REDIRECT_LOGIN)
		return
	}

	// verify user is enabled
	if !user.Enabled {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Your account is currently disabled.", REDIRECT_LOGIN)
		return
	}

	// verify user has activated email
	if !user.Verified {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Your primary email has not yet been verified. A new verification email will be sent.", REDIRECT_LOGIN)
		ac.ServicesGroup.EmailService.SendEmailActivationCode(user.Email)
		return
	}


	// create token
	tokenString, err := ac.createToken(user.Id)
	if err != nil {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating token.", REDIRECT_LOGIN)
		return
	}

	c.Header("X-AUTH-TOKEN", tokenString)

	c.JSON(http.StatusOK, user.GetUserDisplay())
	return
}
