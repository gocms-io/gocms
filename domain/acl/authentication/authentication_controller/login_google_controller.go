package authentication_controller

import (
	"database/sql"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/utility/errors"
	"net/http"
	"strings"

	"fmt"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/domain/user/user_model"
	"github.com/gocms-io/gocms/utility/log"
	"github.com/gocms-io/gocms/utility/rest"
)

type gImage struct {
	Url string `json:"url" binding:"required"`
}

type gEmail struct {
	Email string `json:"value" binding:"required"`
}
type gAgeRange struct {
	Min int64 `json:"min" binding:"required"`
	Max int64 `json:"max" binding:"required"`
}

type gMe struct {
	Id        string    `json:"id" binding:"required"`
	Name      string    `json:"displayName" binding:"required"`
	EmailList []gEmail  `json:"emails" binding:"required"`
	Picture   gImage    `json:"image" binding:"required"`
	AgeRange  gAgeRange `json:"ageRange" binding:"required"`
}

/**
* @api {post} /login/google Login - Google
* @apiName LoginGoogle
* @apiGroup Authentication
*
* @apiParam (Request-Header) {String} x-google-token Google Authorization Token generated from google sdk in app.
*
* @apiUse UserDisplay
*
* @apiUse AuthHeaderResponse
 */
func (ac *AuthController) loginGoogle(c *gin.Context) {

	// check for token in header
	token := c.Request.Header.Get("X-GOOGLE-TOKEN")
	if token == "" {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Missing Token in header X-GOOGLE-TOKEN", REDIRECT_LOGIN)
		return
	}
	var headers map[string]string
	headers = make(map[string]string)
	headers["Authorization"] = fmt.Sprintf("Bearer %s", token)
	// use token to verify user on google and get id
	req := rest.Request{
		Url:     "https://www.googleapis.com/plus/v1/people/me",
		Headers: headers,
	}
	res, err := req.Get()
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Validate With Google", REDIRECT_LOGIN)
		return
	}
	// get google user object back
	var me gMe
	err = json.Unmarshal(res.Body, &me)
	if err != nil {
		log.Errorf("Error marshaling response from Google /me: %s", err.Error())
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Parse Google Response", REDIRECT_LOGIN)
		return
	}

	// check if user exists
	user, err := ac.ServicesGroup.UserService.GetByEmail(me.EmailList[0].Email)
	if err != nil && err != sql.ErrNoRows {
		// other error
		log.Errorf("error looking up user: %s", err.Error())
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error Validating User", REDIRECT_LOGIN)
		return
	}

	// if user doesn't exist and registration is closed reject
	if user == nil && !context.Config.DbVars.OpenRegistration {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Registration Is Closed.", REDIRECT_LOGIN)
		return

	}

	// if user exists ensure that their google email address is verified
	if user != nil && !ac.ServicesGroup.EmailService.GetVerified(me.EmailList[0].Email) {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "The email addressed used by Google is attached to your account but has not yet been verified. Please verify the email address first by requesting a verification link.", REDIRECT_LOGIN)
		return
	}

	// if user doesn't exist create them already enabled with google email as primary
	if user == nil {
		user = &user_model.User{
			Email:   me.EmailList[0].Email,
			Enabled: true,
		}

		// add user
		err = ac.ServicesGroup.UserService.Add(user)
		if err != nil {
			log.Errorf("error adding user from google login: %s\n", err.Error())
			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from google.", REDIRECT_LOGIN)
			return
		}
		// make sure we auto verify the email address
		err = ac.ServicesGroup.EmailService.SetVerified(user.Email)
		if err != nil {
			log.Errorf("Error auto verifiying email: %s\n", err.Error())
		}
	}

	// merge in google data
	user.MaxAge = me.AgeRange.Max
	user.MinAge = me.AgeRange.Min
	user.Photo = strings.Replace(me.Picture.Url, "?sz=50", "", -1)
	user.FullName = me.Name

	// update user with merged data
	err = ac.ServicesGroup.UserService.Update(user.Id, user)
	if err != nil {
		log.Errorf("error updating user from google login: %s", err.Error())
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from google.", REDIRECT_LOGIN)
		return
	}

	// create token
	tokenString, err := ac.createToken(user.Id)
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating token.", REDIRECT_LOGIN)
		return
	}

	c.Header("X-AUTH-TOKEN", tokenString)

	c.JSON(http.StatusOK, user.GetUserDisplay())
	return

}
