package goCMS_auth_ctrl

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/utility/errors"
	"log"
	"net/http"
)

/**
* @api {post} /reset-password Reset Password (Request)
* @apiName ResetPassword
* @apiGroup Authentication
*
* @apiUse ResetPasswordRequestInput
 */
func (ac *AuthController) resetPassword(c *gin.Context) {

	// get email for reset
	var resetRequest goCMS_models.ResetPasswordRequestInput
	err := c.BindJSON(&resetRequest) // update any changes from request
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, "Missing Fields", err)
		return
	}

	// send password reset link
	err = ac.ServicesGroup.AuthService.SendPasswordResetCode(resetRequest.Email)
	if err != nil {
		log.Printf("Error sending reset email: %s", err.Error())
		//return nothing for security.
	}

	// respond as everything after this doesn't matter to the requester
	c.String(http.StatusOK, "Email will be sent to the account provided.")
}

/**
* @api {put} /reset-password Reset Password (Verify/Set)
* @apiName SetResetPassword
* @apiGroup Authentication
*
* @apiUse ResetPasswordInput
 */
func (ac *AuthController) setPassword(c *gin.Context) {
	// get password and code for reset
	var resetPassword goCMS_models.ResetPasswordInput
	err := c.BindJSON(&resetPassword) // update any changes from request
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password complexity
	if !ac.ServicesGroup.AuthService.PasswordIsComplex(resetPassword.Password) {
		goCMS_errors.Response(c, http.StatusBadRequest, "Password is not complex enough.", err)
		return
	}

	// get user
	user, err := ac.ServicesGroup.UserService.GetByEmail(resetPassword.Email)
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, "Couldn't reset password.", err)
		return
	}

	// verify code
	if ok := ac.ServicesGroup.AuthService.VerifyPasswordResetCode(user.Id, resetPassword.ResetCode); !ok {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error resetting password.", REDIRECT_LOGIN)
		return
	}

	// reset password
	err = ac.ServicesGroup.UserService.UpdatePassword(user.Id, resetPassword.Password)
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, "Couldn't reset password.", err)
		return
	}

	c.Status(http.StatusOK)
}
