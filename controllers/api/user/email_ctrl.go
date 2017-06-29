package user_ctrl

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/models"
	"github.com/gocms-io/gocms/utility"
	"github.com/gocms-io/gocms/utility/errors"
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
	var requestEmailActivationLinkInput models.RequestEmailActivationLinkInput
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
* @api {get} /user/email/activate Activate Email
* @apiName ActivateEmail
* @apiGroup User
* @apiDescription This endpoint requires two url params &email and &code. Links are auto generated for this endpoint by the system. This will likely never be called diructly from an app.
 */
func (uc *UserController) activateEmail(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error", context.Config.RedirectRootUrl))
		return
	}

	email := c.Query("email")
	if email == "" {

		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error", context.Config.RedirectRootUrl))
		return
	}

	// get user
	user, err := uc.ServicesGroup.UserService.GetByEmail(email)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error", context.Config.RedirectRootUrl))
		return
	}

	if ok := uc.ServicesGroup.EmailService.VerifyEmailActivationCode(user.Id, code); !ok {
		err = errors.New(errors.ApiError_Activating_Email)
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error", context.Config.RedirectRootUrl))
		return
	}

	// set email to verified
	err = uc.ServicesGroup.EmailService.SetVerified(email)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error", context.Config.RedirectRootUrl))
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/success", context.Config.RedirectRootUrl))
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
	authUser, _ := utility.GetUserFromContext(c)

	// get reqeust data
	var addEmailInput models.EmailInput
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
		Email:      addEmailInput.Email,
		IsVerified: false,
		IsPrimary:  false,
		UserId:     authUser.Id,
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
	authUser, _ := utility.GetUserFromContext(c)

	// get reqeust data
	var promoteEmailInput models.EmailInput
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
		Email:  promoteEmailInput.Email,
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
	authUser, _ := utility.GetUserFromContext(c)

	// get reqeust data
	var addEmailInput models.EmailInput
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
	emailToDelete := models.Email{
		Email:  addEmailInput.Email,
		UserId: authUser.Id,
	}

	// add email
	err = uc.ServicesGroup.EmailService.DeleteEmail(&emailToDelete)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't delete email.", err)
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
	authUser, _ := utility.GetUserFromContext(c)

	// get all emails
	emails, err := uc.ServicesGroup.EmailService.GetEmailsByUserId(authUser.Id)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't add email to user.", err)
		return
	}

	emailDisplays := make([]*models.EmailDisplay, len(emails))

	for i, ed := range emails {
		emailDisplays[i] = ed.GetEmailDisplay()
	}

	c.JSON(http.StatusOK, emailDisplays)
}
