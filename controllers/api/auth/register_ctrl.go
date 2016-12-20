package auth

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/utility/errors"
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
		Email2: userNewInput.Email2,
		FullName: userNewInput.FullName,
	}

	// add user
	err = auc.ServicesGroup.UserService.Add(user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, err.Error(), err)
		return
	}

	c.JSON(http.StatusOK, user.GetUserDisplay())
}