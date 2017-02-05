package goCMS_auth_ctrl

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/utility/errors"

	"github.com/menklab/goCMS/context"
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

	if !goCMS_context.Config.OpenRegistration {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Registration Is Closed.", REDIRECT_LOGIN)
		return
	}

	userNewInput := &goCMS_models.UserRegisterInput{}
	//get user data
	err := c.BindJSON(userNewInput)
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	user := &goCMS_models.User{
		Password: userNewInput.Password,
		Email: userNewInput.Email,
		FullName: userNewInput.FullName,
		Enabled: true, // if registration is open users should be auto enabled
	}

	// add user
	err = auc.ServicesGroup.UserService.Add(user)
	if err != nil {
		goCMS_errors.Response(c, http.StatusInternalServerError, goCMS_errors.ApiError_Server, err)
		return
	}

	c.JSON(http.StatusOK, user.GetUserDisplay())

	// send activation email
	err = auc.ServicesGroup.EmailService.SendEmailActivationCode(user.Email)
	if err != nil {
		goCMS_errors.Response(c, http.StatusInternalServerError, goCMS_errors.ApiError_Server, err)
		return
	}
}