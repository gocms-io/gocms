package email_controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/cqlcorp/gocms/context"
	"github.com/cqlcorp/gocms/domain/email/email_model"
	"github.com/cqlcorp/gocms/init/service"
	"github.com/cqlcorp/gocms/routes"
	"github.com/cqlcorp/gocms/utility/api_utility"
	"github.com/cqlcorp/gocms/utility/errors"
	"net/http"
)

type EmailController struct {
	routes        *routes.Routes
	ServicesGroup *service.ServicesGroup
}

func DefaultEmailController(routes *routes.Routes, sg *service.ServicesGroup) *EmailController {
	emailController := &EmailController{
		routes:        routes,
		ServicesGroup: sg,
	}
	emailController.Default()
	return emailController
}

func (ec *EmailController) Default() {
	ec.routes.Auth.POST("/user/email", ec.addEmail)
	ec.routes.Auth.GET("/user/email", ec.getEmails)
	ec.routes.Auth.PUT("/user/email/promote", ec.promoteEmail)
	ec.routes.Auth.DELETE("/user/email", ec.deleteEmail)
	ec.routes.Public.GET("/user/email/activate", ec.activateEmail)
	ec.routes.Public.POST("/user/email/activate", ec.requestActivationLink)
}

/**
* @api {post} /user/email/activate Request New Email Activation Link
* @apiName ActivateEmail
* @apiGroup User
* @apiUse RequestEmailActivationLink
* @apiDescription Request a new activation link for a registered email.
 */
func (ec *EmailController) requestActivationLink(c *gin.Context) {

	// get email
	var requestEmailActivationLinkInput email_model.RequestEmailActivationLinkInput
	err := c.BindJSON(&requestEmailActivationLinkInput)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
	}
	err = ec.ServicesGroup.EmailService.SendEmailActivationCode(requestEmailActivationLinkInput.Email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Error sending activation code.", err)
	}

}

/**
* @api {get} /user/email/activate Activate Email
* @apiName ActivateEmail
* @apiGroup User
* @apiDescription This endpoint requires two url params &email and &code. Links are auto generated for this endpoint by the system. This will likely never be called directly from an app.
 */
func (ec *EmailController) activateEmail(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error.html", context.Config.DbVars.RedirectRootUrl))
		return
	}

	email := c.Query("email")
	if email == "" {

		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error.html", context.Config.DbVars.RedirectRootUrl))
		return
	}

	// get user
	user, err := ec.ServicesGroup.UserService.GetByEmail(email)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error.html", context.Config.DbVars.RedirectRootUrl))
		return
	}

	if ok := ec.ServicesGroup.EmailService.VerifyEmailActivationCode(user.Id, code); !ok {
		err = errors.New(errors.ApiError_Activating_Email)
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error.html", context.Config.DbVars.RedirectRootUrl))
		return
	}

	// set email to verified
	err = ec.ServicesGroup.EmailService.SetVerified(email)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/error.html", context.Config.DbVars.RedirectRootUrl))
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%v/activateEmail/success.html", context.Config.DbVars.RedirectRootUrl))
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
func (ec *EmailController) addEmail(c *gin.Context) {

	// get logged in user
	authUser, _ := api_utility.GetUserFromContext(c)

	// get reqeust data
	var addEmailInput email_model.EmailInput
	err := c.BindJSON(&addEmailInput) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := ec.ServicesGroup.AuthService.VerifyPassword(authUser.Password, addEmailInput.Password); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// convert input to model
	emailToAdd := email_model.Email{
		Email:      addEmailInput.Email,
		IsVerified: false,
		IsPrimary:  false,
		UserId:     authUser.Id,
	}

	// add email
	err = ec.ServicesGroup.EmailService.AddEmail(&emailToAdd)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't add email to user.", err)
		return
	}

	// send verification email
	err = ec.ServicesGroup.EmailService.SendEmailActivationCode(emailToAdd.Email)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't add email to user.", err)
		return
	}

	// create email display and send
	emailDisplay := email_model.EmailDisplay{
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
func (ec *EmailController) promoteEmail(c *gin.Context) {

	// get logged in user
	authUser, _ := api_utility.GetUserFromContext(c)

	// get reqeust data
	var promoteEmailInput email_model.EmailInput
	err := c.BindJSON(&promoteEmailInput) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := ec.ServicesGroup.AuthService.VerifyPassword(authUser.Password, promoteEmailInput.Password); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	email := email_model.Email{
		Email:  promoteEmailInput.Email,
		UserId: authUser.Id,
	}

	// promote email
	err = ec.ServicesGroup.EmailService.PromoteEmail(&email)
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
func (ec *EmailController) deleteEmail(c *gin.Context) {

	// get logged in user
	authUser, _ := api_utility.GetUserFromContext(c)

	// get reqeust data
	var addEmailInput email_model.EmailInput
	err := c.BindJSON(&addEmailInput) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := ec.ServicesGroup.AuthService.VerifyPassword(authUser.Password, addEmailInput.Password); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// convert input to model
	emailToDelete := email_model.Email{
		Email:  addEmailInput.Email,
		UserId: authUser.Id,
	}

	// add email
	err = ec.ServicesGroup.EmailService.DeleteEmail(&emailToDelete)
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
func (ec *EmailController) getEmails(c *gin.Context) {

	// get logged in user
	authUser, _ := api_utility.GetUserFromContext(c)

	// get all emails
	emails, err := ec.ServicesGroup.EmailService.GetEmailsByUserId(authUser.Id)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't add email to user.", err)
		return
	}

	emailDisplays := make([]*email_model.EmailDisplay, len(emails))

	for i, ed := range emails {
		emailDisplays[i] = ed.GetEmailDisplay()
	}

	c.JSON(http.StatusOK, emailDisplays)
}
