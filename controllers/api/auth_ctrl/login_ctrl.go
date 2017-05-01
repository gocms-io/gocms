package auth_ctrl

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/goCMS/models"
	"github.com/gocms-io/goCMS/utility/errors"
	"net/http"
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

	// verify user is enabled
	if !user.Enabled {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Your account is currently disabled.", REDIRECT_LOGIN)
		return
	}

	// verify user has activated email
	if !user.Verified {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Your primary email has not yet been verified. A new verification email will be sent.", REDIRECT_LOGIN)
		ac.ServicesGroup.EmailService.SendEmailActivationCode(user.Email)
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
