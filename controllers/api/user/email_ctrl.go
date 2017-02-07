package goCMS_user_ctrl

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/utility/errors"
	"net/http"
)

/**
* @api {post} /user/email/activate Request New Email Activation Link
* @apiName ActivateEmail
* @apiGroup User
* @apiUse RequestEmailActivationLink
* @apiDescription Request a new activation link for a registered email.
 */
func (uc *UserController) requestActivationLink(c *gin.Context) {

	// get email
	var requestEmailActivationLinkInput goCMS_models.RequestEmailActivationLinkInput
	err := c.BindJSON(&requestEmailActivationLinkInput)
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, err.Error(), err)
	}
	err = uc.ServicesGroup.EmailService.SendEmailActivationCode(requestEmailActivationLinkInput.Email)
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, "Error sending activation code.", err)
	}

}

/**
* @api {get} /user/email/activate Activate Email
* @apiName ActivateEmail
* @apiGroup User
* @apiDescription This endpoint requires two url params &email and &code. Links are auto generated for this endpoint by the system. This will likely never be called diructly from an app.
 */
func (uc *UserController) activateEmail(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		err := goCMS_errors.New(goCMS_errors.ApiError_Activating_Email)
		goCMS_errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	email := c.Query("email")
	if email == "" {
		err := goCMS_errors.New(goCMS_errors.ApiError_Activating_Email)
		goCMS_errors.Response(c, http.StatusBadRequest, err.Error(), err)
	}

	// get user
	user, err := uc.ServicesGroup.UserService.GetByEmail(email)
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, goCMS_errors.ApiError_Activating_Email, err)
		return
	}

	if ok := uc.ServicesGroup.EmailService.VerifyEmailActivationCode(user.Id, code); !ok {
		err = goCMS_errors.New(goCMS_errors.ApiError_Activating_Email)
		goCMS_errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// set email to verified
	err = uc.ServicesGroup.EmailService.SetVerified(email)
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, goCMS_errors.ApiError_Activating_Email, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Your email has been verified. You can now log in."})
}

/**
* @api {post} /user/email Add Email
* @apiName AddEmail
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse EmailInput
* @apiUse EmailDisplay
* @apiPermission Authenticated
 */
func (uc *UserController) addEmail(c *gin.Context) {

	// get logged in user
	authUser, _ := goCMS_utility.GetUserFromContext(c)

	// get reqeust data
	var addEmailInput goCMS_models.EmailInput
	err := c.BindJSON(&addEmailInput) // update any changes from request
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.ServicesGroup.AuthService.VerifyPassword(authUser.Password, addEmailInput.Password); !ok {
		goCMS_errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// convert input to model
	emailToAdd := goCMS_models.Email{
		Email:      addEmailInput.Email,
		IsVerified: false,
		IsPrimary:  false,
		UserId:     authUser.Id,
	}

	// add email
	err = uc.ServicesGroup.EmailService.AddEmail(&emailToAdd)
	if err != nil {
		goCMS_errors.Response(c, http.StatusInternalServerError, "Couldn't add email to user.", err)
		return
	}

	// send verification email
	err = uc.ServicesGroup.EmailService.SendEmailActivationCode(emailToAdd.Email)
	if err != nil {
		goCMS_errors.Response(c, http.StatusInternalServerError, "Couldn't add email to user.", err)
		return
	}

	// create email display and send
	emailDisplay := goCMS_models.EmailDisplay{
		Email:     emailToAdd.Email,
		Id:        emailToAdd.Id,
		IsPrimary: emailToAdd.IsPrimary,
		Verified:  emailToAdd.IsVerified,
	}

	c.JSON(http.StatusOK, emailDisplay)
}

/**
* @api {put} /user/email/promote Promote Email
* @apiName PromoteEmail
* @apiGroup User
* @apiUse EmailInput
* @apiUse AuthHeader
* @apiPermission Authenticated
 */
func (uc *UserController) promoteEmail(c *gin.Context) {

	// get logged in user
	authUser, _ := goCMS_utility.GetUserFromContext(c)

	// get reqeust data
	var promoteEmailInput goCMS_models.EmailInput
	err := c.BindJSON(&promoteEmailInput) // update any changes from request
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.ServicesGroup.AuthService.VerifyPassword(authUser.Password, promoteEmailInput.Password); !ok {
		goCMS_errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	email := goCMS_models.Email{
		Email:  promoteEmailInput.Email,
		UserId: authUser.Id,
	}

	// promote email
	err = uc.ServicesGroup.EmailService.PromoteEmail(&email)
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, "Error promoting email.", err)
		return
	}

	c.Status(http.StatusOK)
}

/**
* @api {delete} /user/email Delete Email
* @apiName DeleteEmail
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse EmailInput
* @apiPermission Authenticated
 */
func (uc *UserController) deleteEmail(c *gin.Context) {

	// get logged in user
	authUser, _ := goCMS_utility.GetUserFromContext(c)

	// get reqeust data
	var addEmailInput goCMS_models.EmailInput
	err := c.BindJSON(&addEmailInput) // update any changes from request
	if err != nil {
		goCMS_errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.ServicesGroup.AuthService.VerifyPassword(authUser.Password, addEmailInput.Password); !ok {
		goCMS_errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// convert input to model
	emailToDelete := goCMS_models.Email{
		Email:  addEmailInput.Email,
		UserId: authUser.Id,
	}

	// add email
	err = uc.ServicesGroup.EmailService.DeleteEmail(&emailToDelete)
	if err != nil {
		goCMS_errors.Response(c, http.StatusInternalServerError, "Couldn't delete email.", err)
		return
	}

	c.Status(http.StatusOK)
}

/**
* @api {get} /user/email Get Emails
* @apiName GetEmails
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse EmailDisplay
* @apiPermission Authenticated
 */
func (uc *UserController) getEmails(c *gin.Context) {

	// get logged in user
	authUser, _ := goCMS_utility.GetUserFromContext(c)

	// get all emails
	emails, err := uc.ServicesGroup.EmailService.GetEmailsByUserId(authUser.Id)
	if err != nil {
		goCMS_errors.Response(c, http.StatusInternalServerError, "Couldn't add email to user.", err)
		return
	}

	emailDisplays := make([]*goCMS_models.EmailDisplay, len(emails))

	for i, ed := range emails {
		emailDisplays[i] = ed.GetEmailDisplay()
	}

	c.JSON(http.StatusOK, emailDisplays)
}
