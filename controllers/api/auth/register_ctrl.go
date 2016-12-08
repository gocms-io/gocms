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
* @apiParam {string} fullName
* @apiParam {string} email
* @apiParam {string} newPassword
* @apiParam {string} email2 (optional)
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
func (auc *AuthController) register(c *gin.Context) {

	user := &models.User{}
	//get user data
	err := c.BindJSON(user)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// get password
	if user.NewPassword == "" {
		errors.Response(c, http.StatusBadRequest, "New Password Field Required.", err)
		return
	}

	// add user
	err = auc.ServicesGroup.UserService.Add(user)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, err.Error(), err)
		return
	}

	c.JSON(http.StatusOK, user)
}