package user_ctrl

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/utility"
)

/**
* @api {post} /user/activate-email/request-activation-link Request New Email Activation Link
* @apiName ActivateEmail
* @apiGroup User
* @apiUse RequestEmailActivationLink
* @apiDescription Request a new activation link for a registered email.
*/
func (uc *UserController) requestActivationLink(c *gin.Context) {

	// get email
	var  requestEmailActivationLinkInput models.RequestEmailActivationLinkInput
	err := c.BindJSON(&requestEmailActivationLinkInput)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
	}

	err = uc.ServicesGroup.EmailService.SendEmailActivationCode(requestEmailActivationLinkInput.Email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Error sending activation code.", err)
	}


}

/**
* @api {get} /user/activate-email Activate Email
* @apiName ActivateEmail
* @apiGroup User
* @apiDescription This endpoint requires two url params &email and &code. Links are auto generated for this endpoint by the system. This will likely never be called diructly from an app.
*/
func (uc *UserController) activateEmail(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		err := errors.New(errors.ApiError_Activating_Email)
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	email := c.Query("email")
	if email == "" {
		err := errors.New(errors.ApiError_Activating_Email)
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
	}

	// get user
	user, err := uc.ServicesGroup.UserService.GetByEmail(email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, errors.ApiError_Activating_Email, err)
		return
	}

	if ok := uc.ServicesGroup.EmailService.VerifyEmailActivationCode(user.Id, code); !ok {
		err = errors.New(errors.ApiError_Activating_Email)
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// set email to verified
	err = uc.ServicesGroup.EmailService.SetVerified(email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, errors.ApiError_Activating_Email, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message" : "Your email has been verified. You can now log in."})
}

/**
* @api {post} /user/addEmail Add Email
* @apiName AddEmail
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse AddEmailInput
* @apiUse EmailDisplay
* @apiPermission Authenticated
*/
func (uc *UserController) addEmail(c *gin.Context) {

	// get logged in user
	authUser, _ := utility.GetUserFromContext(c)

	// get reqeust data
	var addEmailInput models.AddEmailInput
	err := c.BindJSON(&addEmailInput) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.ServicesGroup.AuthService.VerifyPassword(authUser.Password, addEmailInput.Password); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// convert input to model
	emailToAdd := models.Email{
		Email: addEmailInput.Email,
		IsVerified: false,
		IsPrimary: false,
		UserId: authUser.Id,
	}

	// add email
	err = uc.ServicesGroup.EmailService.AddEmail(&emailToAdd)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't add email to user.", err)
		return
	}

	// send verification email
	err = uc.ServicesGroup.EmailService.SendEmailActivationCode(emailToAdd.Email)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't add email to user.", err)
		return
	}

	// create email display and send
	emailDisplay := models.EmailDisplay{
		Email: emailToAdd.Email,
		Id: emailToAdd.Id,
		IsPrimary: emailToAdd.IsPrimary,
		Verified: emailToAdd.IsVerified,
	}



	c.JSON(http.StatusOK, emailDisplay)
}

/**
* @api {put} /user/promoteEmail/:emailId Promote Email
* @apiName PromoteEmail
* @apiGroup User
* @apiUse AddEmailInput
* @apiUse AuthHeader
* @apiPermission Authenticated
*/
func (uc *UserController) promoteEmail(c *gin.Context) {

	// get logged in user
	authUser, _ := utility.GetUserFromContext(c)

	// get reqeust data
	var promoteEmailInput models.AddEmailInput
	err := c.BindJSON(&promoteEmailInput) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.ServicesGroup.AuthService.VerifyPassword(authUser.Password, promoteEmailInput.Password); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	email := models.Email{
		Email: promoteEmailInput.Email,
		UserId: authUser.Id,
	}

	// promote email
	err = uc.ServicesGroup.EmailService.PromoteEmail(&email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Error promoting email.", err)
		return
	}

	c.Status(http.StatusOK)
}
