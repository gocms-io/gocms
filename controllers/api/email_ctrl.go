package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/models"
)

type EmailController struct {
	routes *routes.ApiRoutes
	ServicesGroup *services.ServicesGroup
}

func DefaultEmailController(routes *routes.ApiRoutes, sg *services.ServicesGroup) *EmailController{
	ec := &EmailController{
		routes:        routes,
		ServicesGroup: sg,
	}

	ec.Default()
	return ec
}

func (ec *EmailController) Default() {
	ec.routes.Public.GET("/activate-email", ec.activateEmail)
	ec.routes.Public.POST("/activate-email/request-activation-link", ec.requestActivationLink)
}

/**
* @api {post} /activate-email/request-activation-link Request New Email Activation Link
* @apiName ActivateEmail
* @apiGroup Email
* @apiUse RequestEmailActivationLink
* @apiDescription Request a new activation link for a registered email.
*/
func (ec *EmailController) requestActivationLink(c *gin.Context) {

	// get email
	var  requestEmailActivationLinkInput models.RequestEmailActivationLinkInput
	err := c.BindJSON(&requestEmailActivationLinkInput)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
	}

	err = ec.ServicesGroup.AuthService.SendEmailActivationCode(requestEmailActivationLinkInput.Email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Error sending activation code.", err)
	}


}

/**
* @api {get} /activate-email Activate Email
* @apiName ActivateEmail
* @apiGroup Email
* @apiDescription This endpoint requires two url params &email and &code. Links are auto generated for this endpoint by the system. This will likely never be called directly from an app.
*/
func (ec *EmailController) activateEmail(c *gin.Context) {
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
	user, err := ec.ServicesGroup.UserService.GetByEmail(email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, errors.ApiError_Activating_Email, err)
		return
	}

	if ok := ec.ServicesGroup.AuthService.VerifyEmailActivationCode(user.Id, code); !ok {
		err = errors.New(errors.ApiError_Activating_Email)
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// set email to verified
	err = ec.ServicesGroup.EmailService.SetVerified(email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, errors.ApiError_Activating_Email, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message" : "Your email has been verified. You can now log in."})
}