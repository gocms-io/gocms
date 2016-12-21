package auth

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/config"
)



/**
* @api {post} /register Register
* @apiName Register
* @apiGroup Authentication
*
* @apiUse UserRegisterInput
*
* @apiUse UserDisplay
*/
func (auc *AuthController) register(c *gin.Context) {

	if !config.OpenRegistration {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Registration Is Closed.", REDIRECT_LOGIN)
		return
	}

	userNewInput := &models.UserRegisterInput{}
	//get user data
	err := c.BindJSON(userNewInput)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	user := &models.User{
		Password: userNewInput.Password,
		Email: userNewInput.Email,
		FullName: userNewInput.FullName,
		Enabled: true, // if registration is open users should be auto enabled
	}

	// add user
	err = auc.ServicesGroup.UserService.Add(user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, errors.ApiError_Server, err)
		return
	}

	c.JSON(http.StatusOK, user.GetUserDisplay())

	// send activation email
	err = auc.ServicesGroup.AuthService.SendEmailActivationCode(user.Id, user.Email)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, errors.ApiError_Server, err)
		return
	}
}

/**
* @api {post} /activate-email Register
* @apiName Activate Email
* @apiDescription This endpoint requires two url params &email and &code. Links are auto generated for this endpoint by the system. This will likely never be called directly.
*/
func (auc *AuthController) activateEmail(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error activating email.", REDIRECT_LOGIN)
		return
	}

	email := c.Query("email")
	if email == "" {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error activating email.", REDIRECT_LOGIN)
		return
	}

	// get user
	user, err := auc.ServicesGroup.UserService.GetByEmail(email)
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error activating email.", REDIRECT_LOGIN)
		return
	}

	if ok := auc.ServicesGroup.AuthService.VerifyEmailActivationCode(user.Id, code); !ok {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error activating email.", REDIRECT_LOGIN)
		return
	}

	// verify the user
	err = auc.ServicesGroup.UserService.SetVerified(user.Id, true)
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error activating email.", REDIRECT_LOGIN)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message" : "Your email has been verified. You can now log in."})
}