package auth

import (
	"github.com/menklab/goCMS/services"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/utility/errors"
	"log"
	"encoding/json"
	"github.com/menklab/goCMS/models"
	"database/sql"
	"github.com/menklab/goCMS/config"
)

type fbData struct {
	Height int `json:"height" binding:"required"`
	Width  int `json:"width" binding:"required"`
	Url    string `json:"url" binding:"required"`
}
type fbPicture struct {
	Data fbData `json:"data" binding:"required"`
}
type fbAgeRange struct {
	Min int `json:"min" binding:"required"`
	Max int `json:"max" binding:"required"`
}
type fbMe struct {
	Id       string `json:"id" binding:"required"`
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Picture  fbPicture `json:"picture" binding:"required"`
	Gender   string `json:"gender" binding:"required"`
	AgeRange fbAgeRange `json:"age_range" binding:"required"`
}

/**
* @api {post} /login/facebook Login - Facebook
* @apiName LoginFacebook
* @apiGroup Authentication
*
* @apiParam (Request-Header) {String} x-facebook-token Facebook Authorization Token generated from facebook sdk in app.
*
* @apiUse UserDisplay
*
* @apiSuccess (Response-Header) {string} x-auth-token
*/
func (ac *AuthController) loginFacebook(c *gin.Context) {
	// check for token in header
	fToken := c.Request.Header.Get("X-FACEBOOK-TOKEN")
	if fToken == "" {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Missing Token in header X-FACEBOOK-TOKEN", REDIRECT_LOGIN)
		return
	}

	// use token to verify user on facebook and get id
	req := services.RestRequest{
		Url: "https://graph.facebook.com/v2.8/me?fields=id,name,email,picture.width(800).height(800),gender,age_range&access_token=" + fToken,
	}
	res, err := req.Get()
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Validate With Facebook", REDIRECT_LOGIN)
		return
	}
	// get facebook user object back
	var me fbMe
	err = json.Unmarshal(res.Body, &me)
	if err != nil {
		log.Printf("Error marshaling response from facebook /me: %s", err.Error())
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Parse Facebook Response", REDIRECT_LOGIN)
		return
	}

	// check if user exists
	user, err := ac.ServicesGroup.UserService.GetByEmail(me.Email)
	if err != nil && err != sql.ErrNoRows {
		// other error
		log.Printf("error looking up user: %s", err.Error())
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error Validating User", REDIRECT_LOGIN)
		return
	}

	// if user doesn't exist and registration is closed reject
	if user == nil && !config.OpenRegistration {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Registration Is Closed.", REDIRECT_LOGIN)
		return

	}

	// if user exists ensure that their facebook email address is verified
	if user != nil && !ac.ServicesGroup.EmailService.GetVerified(me.Email) {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "The email addressed used by Facebook is attached to your account but has not yet been verified. Please verify the email address first by requesting a verification link.", REDIRECT_LOGIN)
		return
	}

	// if user doesn't exist create them already enabled with facebook email as primary
	if user == nil {
		user = &models.User{
			Email: me.Email,
			Enabled: true,
		}

		// add user
		err = ac.ServicesGroup.UserService.Add(user)
		if err != nil {
			log.Printf("error adding user from facebook login: %s\n", err.Error())
			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from facebook.", REDIRECT_LOGIN)
			return
		}
		// make sure we auto verify the email address
		err = ac.ServicesGroup.EmailService.SetVerified(user.Email)
		if err != nil {
			log.Printf("Error auto verifiying email: %s\n", err.Error())
		}
	}

	// merge facebook data into account

	// set gender
	if me.Gender == "male" {
		user.Gender = models.GENDER_MALE
	} else if me.Gender == "female" {
		user.Gender = models.GENDER_FEMALE
	} else {
		user.Gender = models.GENDER_UNKNOWN
	}

	// merge other data
	user.MaxAge = me.AgeRange.Max
	user.MinAge = me.AgeRange.Min
	user.Photo = me.Picture.Data.Url
	user.FullName = me.Name

	// update user with merged data
	err = ac.ServicesGroup.UserService.Update(user.Id, user)
	if err != nil {
		log.Printf("error updating user from facebook login: %s", err.Error())
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from facebook.", REDIRECT_LOGIN)
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

