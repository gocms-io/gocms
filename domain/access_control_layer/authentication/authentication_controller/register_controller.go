package authentication_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/utility/errors"
	"net/http"

	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/domain/access_control_layer/authentication/authentication_model"
	"github.com/gocms-io/gocms/domain/user/user_model"
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

	if !context.Config.DbVars.OpenRegistration {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Registration Is Closed.", REDIRECT_LOGIN)
		return
	}

	userNewInput := &authentication_model.UserRegisterInput{}
	//get user data
	err := c.BindJSON(userNewInput)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	user := &user_model.User{
		Password: userNewInput.Password,
		Email:    userNewInput.Email,
		FullName: userNewInput.FullName,
		Enabled:  true, // if registration is open users should be auto enabled
	}

	// add user
	err = auc.ServicesGroup.UserService.Add(user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, errors.ApiError_Server, err)
		return
	}

	c.JSON(http.StatusOK, user.GetUserDisplay())

	// send activation email
	err = auc.ServicesGroup.EmailService.SendEmailActivationCode(user.Email)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, errors.ApiError_Server, err)
		return
	}
}
