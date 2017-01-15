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
	err = auc.ServicesGroup.AuthService.SendEmailActivationCode(user.Email)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, errors.ApiError_Server, err)
		return
	}
}