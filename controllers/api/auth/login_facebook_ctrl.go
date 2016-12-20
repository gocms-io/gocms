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
	if err != nil {
		// other error
		if err != sql.ErrNoRows {
			log.Printf("error looking up user: %s", err.Error())
			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error Validating User", REDIRECT_LOGIN)
			return

		} else {
			// user doesn't exist
			user = &models.User{
				Email: me.Email,
			}
		}
	}
	// merge in facebook data
	// set gender
	if me.Gender == "male" {
		user.Gender = models.GENDER_MALE
	} else if me.Gender == "female" {
		user.Gender = models.GENDER_FEMALE
	} else {
		user.Gender = models.GENDER_UNKNOWN
	}

	user.MaxAge = me.AgeRange.Max
	user.MinAge = me.AgeRange.Min
	user.Photo = me.Picture.Data.Url
	user.FullName = me.Name

	// add user if it doesn't have an id
	if user.Id == 0 {
		err = ac.ServicesGroup.UserService.Add(user)
		if err != nil {
			log.Printf("error adding user from facebook login: %s", err.Error())
			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from facebook.", REDIRECT_LOGIN)
			return
		}
	} else {
		// update user
		err = ac.ServicesGroup.UserService.Update(user.Id, user)
		if err != nil {
			log.Printf("error updating user from facebook login: %s", err.Error())
			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from facebook.", REDIRECT_LOGIN)
			return
		}
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

