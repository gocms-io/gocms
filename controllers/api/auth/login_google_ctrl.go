package auth
//
//import (
//	"github.com/menklab/goCMS/services"
//	"net/http"
//	"github.com/gin-gonic/gin"
//	"github.com/menklab/goCMS/utility/errors"
//	"log"
//	"encoding/json"
//	"github.com/menklab/goCMS/models"
//	"database/sql"
//	"fmt"
//	"strings"
//	"github.com/menklab/goCMS/config"
//)
//
//type gImage struct {
//	Url string `json:"url" binding:"required"`
//}
//
//type gEmail struct {
//	Email string `json:"value" binding:"required"`
//}
//type gAgeRange struct {
//	Min int `json:"min" binding:"required"`
//	Max int `json:"max" binding:"required"`
//}
//
//type gMe struct {
//	Id       string `json:"id" binding:"required"`
//	Name     string `json:"displayName" binding:"required"`
//	EmailList    []gEmail `json:"emails" binding:"required"`
//	Picture  gImage `json:"image" binding:"required"`
//	AgeRange gAgeRange `json:"ageRange" binding:"required"`
//}
//
/**
* @api {post} /login/google Login - Google
* @apiName LoginGoogle
* @apiGroup Authentication
*
* @apiParam (Request-Header) {String} x-google-token Google Authorization Token generated from google sdk in app.
*
* @apiUse UserDisplay
*
* @apiSuccess (Response-Header) {string} x-auth-token
*/
//func (ac *AuthController) loginGoogle(c *gin.Context) {
//	// check for token in header
//	token := c.Request.Header.Get("X-GOOGLE-TOKEN")
//	if token == "" {
//		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Missing Token in header X-GOOGLE-TOKEN", REDIRECT_LOGIN)
//		return
//	}
//	var headers map[string]string
//	headers = make(map[string]string)
//	headers["Authorization"] = fmt.Sprintf("Bearer %s", token)
//	// use token to verify user on facebook and get id
//	req := services.RestRequest{
//		Url: "https://www.googleapis.com/plus/v1/people/me",
//		Headers: headers,
//
//	}
//	res, err := req.Get()
//	if err != nil {
//		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Validate With Google", REDIRECT_LOGIN)
//		return
//	}
//	// get facebook user object back
//	var me gMe
//	err = json.Unmarshal(res.Body, &me)
//	if err != nil {
//		log.Printf("Error marshaling response from Google /me: %s", err.Error())
//		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Parse Google Response", REDIRECT_LOGIN)
//		return
//	}
//
//	// check if user exists
//	user, err := ac.ServicesGroup.UserService.GetByEmail(me.EmailList[0].Email)
//	log.Printf("User From Google: %v", me)
//	if err != nil {
//		// other error
//		if err != sql.ErrNoRows {
//			log.Printf("error looking up user: %s", err.Error())
//			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error Validating User", REDIRECT_LOGIN)
//			return
//
//		} else {
//			// user doesn't exist
//			user = &models.User{
//				Email: me.EmailList[0].Email,
//			}
//		}
//	}
//
//	// merge in google data
//	user.MaxAge = me.AgeRange.Max
//	user.MinAge = me.AgeRange.Min
//	user.Photo = strings.Replace(me.Picture.Url, "?sz=50", "", -1)
//	user.FullName = me.Name
//
//
//	// if user doesn't exist and registration is closed
//	if user.Id == 0 && !config.OpenRegistration {
//		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Registration Is Closed.", REDIRECT_LOGIN)
//		return
//	} else if user.Id == 0 && config.OpenRegistration {
//		// add user if it doesn't have an id
//		// auto activate user
//		user.Verified = true
//		user.Enabled = true
//		err = ac.ServicesGroup.UserService.Add(user)
//		if err != nil {
//			log.Printf("error adding user from google login: %s", err.Error())
//			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from google.", REDIRECT_LOGIN)
//			return
//		}
//	} else {
//		// update user
//		err = ac.ServicesGroup.UserService.Update(user.Id, user)
//		if err != nil {
//			log.Printf("error updating user from google login: %s", err.Error())
//			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from google.", REDIRECT_LOGIN)
//			return
//		}
//
//		// verify email because it came from facebook
//		err = ac.ServicesGroup.UserService.SetVerified(user.Id, true)
//		if err != nil {
//			log.Printf("error auto verifying email from google: %s", err.Error())
//		}
//	}
//
//	// create token
//	tokenString, err := ac.createToken(user.Id)
//	if err != nil {
//		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating token.", REDIRECT_LOGIN)
//		return
//	}
//
//	c.Header("X-AUTH-TOKEN", tokenString)
//
//
//	c.JSON(http.StatusOK, user.GetUserDisplay())
//	return
//
//}
