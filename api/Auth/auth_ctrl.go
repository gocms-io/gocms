package auth

import (
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
	"time"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/dgrijalva/jwt-go"
	"github.com/menklab/goCMS/config"
	"github.com/menklab/goCMS/utility/errors"
	"log"
	"encoding/json"
	"github.com/menklab/goCMS/models"
	"database/sql"
	"fmt"
	"github.com/menklab/goCMS/utility"
)

const (
	REDIRECT_LOGIN         = "login"
	REDIRECT_VERIFY_DEVICE = "verifyDevice"
)

// Login form structure.
type LoginDisplay struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Verify device form structure
type VerifyDeviceDisplay struct {
	DeviceCode string `json:"deviceCode" binding:"required"`
}

type ResetPasswordRequest struct {
	Email string `json:"email" binding:"required"`
}

type ResetPassword struct {
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	ResetCode string `json:"resetCode" binding:"required"`
}

type AuthController struct {
	routes *routes.ApiRoutes
	userService  services.IUserService
	authServices services.IAuthService
}

func Default(routes *routes.ApiRoutes, sg *services.ServicesGroup) *AuthController {

	// create controller
	authController := &AuthController{
		routes: routes,
		authServices: sg.AuthService,
		userService: sg.UserService,
	}

	// apply auth middleware
	NewAuthMiddleware(sg).DefaultAuth(routes)

	// admin admin route
	routes.Admin = routes.Auth.Group("/admin")

	//apply acl middleware
	NewAclMiddleware(sg).DefaultAcl(routes)

	return authController
}

func (ac *AuthController) Use() {
	ac.routes.Public.POST("/login", ac.login)
	ac.routes.Public.POST("/login/facebook", ac.loginFacebook)
	ac.routes.Public.POST("/login/google", ac.loginGoogle)
	ac.routes.Public.POST("/reset-password", ac.resetPassword)
	ac.routes.Public.PUT("/reset-password", ac.setPassword)

	if config.UseTwoFactor {
		ac.routes.PreTwofactor.GET("/verify-device", ac.getDeviceCode)
		ac.routes.PreTwofactor.POST("/verify-device", ac.verifyDevice)
	}
}

// login controller
/**
 * @api {post} /api/login Login
 * @apiName login
 * @apiGroup Authentication
 *
 * @apiParam {json} email User's email address.
 * @apiParam {json} password User's password.
 *
 * @apiSuccess {Header} X-Auth-Token JWT token used for subsequent authenticated requests.
 *
 * @apiSuccessExample Success-Response:
 *     	HTTP/1.1 200 OK
 */
func (ac *AuthController) login(c *gin.Context) {

	var loginDisplay LoginDisplay

	// get login values
	if c.BindJSON(&loginDisplay) != nil {
		errors.Response(c, http.StatusUnauthorized, "Missing Email or Password", REDIRECT_LOGIN)
		return
	}

	// auth user
	authUser := services.AuthUser{
		Email:    loginDisplay.Email,
		Password: loginDisplay.Password,
	}
	user, authed := ac.authServices.AuthUser(&authUser)
	if !authed {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Incorrect Email / Password", REDIRECT_LOGIN)
		return
	}


	// create token
	tokenString, err := ac.createToken(user.Id)
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating token.", REDIRECT_LOGIN)
		return
	}

	c.Header("X-AUTH-TOKEN", tokenString)

	c.JSON(http.StatusOK, user)
	return
}

// getDeviceToken
func (ac *AuthController) getDeviceCode(c *gin.Context) {

	user, _ := utility.GetUserFromContext(c)

	err := ac.authServices.SendTwoFactorCode(user)

	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusInternalServerError, "Error sending device code.", REDIRECT_LOGIN)
		return
	}

	c.Status(http.StatusOK)

}

// verifyDevice controller
/**
 * @api {post} /api/verify-device Verify Device
 * @apiName  verify device
 * @apiGroup Authentication
 *
 * @apiParam {json} deviceCode One time device code sent to user's email.
 *
 * @apiSuccess {Header} X-Device-Token JWT token used for subsequent authenticated requests.
 *
 * @apiSuccessExample Success-Response:
 *     	HTTP/1.1 200 OK
 */
func (ac *AuthController) verifyDevice(c *gin.Context) {

	// get userId
	user, _ := utility.GetUserFromContext(c)

	var verifyDeviceDisplay VerifyDeviceDisplay

	// get login values
	if c.BindJSON(&verifyDeviceDisplay) != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Missing DeviceCode", REDIRECT_VERIFY_DEVICE)
		return
	}

	// verify code is correct
	ok := ac.authServices.VerifyTwoFactorCode(user.Id, verifyDeviceDisplay.DeviceCode)
	if !ok {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Incorrect Device Code.", REDIRECT_VERIFY_DEVICE)
		return
	}

	// generate device token
	expire := time.Now().Add(time.Minute * utility.GetTimeout(config.DeviceAuthTimeout))
	deviceToken := jwt.New(jwt.SigningMethodHS256)
	deviceToken.Claims["exp"] = expire.Unix()
	deviceTokenString, err := deviceToken.SignedString([]byte(config.AuthKey))

	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating device token.", REDIRECT_LOGIN)
		return
	}

	c.Header("X-DEVICE-TOKEN", deviceTokenString)

	c.String(http.StatusOK, "ok")
}


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
	user, err := ac.userService.GetByEmail(me.Email)
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
		err = ac.userService.Add(user)
		if err != nil {
			log.Printf("error adding user from facebook login: %s", err.Error())
			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from facebook.", REDIRECT_LOGIN)
			return
		}
	} else {
		// update user
		err = ac.userService.Update(user.Id, user)
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

	c.JSON(http.StatusOK, user)
	return

}

type gMe struct {
	Id      string `json:"id" binding:"required"`
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required"`
	Picture string `json:"picture" binding:"required"`
}

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
	// use token to verify user on facebook and get id
	req := services.RestRequest{
		Url: "https://www.googleapis.com/userinfo/v2/me",
		Headers: headers,

	}
	res, err := req.Get()
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Validate With Google", REDIRECT_LOGIN)
		return
	}
	// get facebook user object back
	var me gMe
	err = json.Unmarshal(res.Body, &me)
	if err != nil {
		log.Printf("Error marshaling response from Google /me: %s", err.Error())
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Parse Google Response", REDIRECT_LOGIN)
		return
	}

	// check if user exists
	user, err := ac.userService.GetByEmail(me.Email)
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
	user.Photo = me.Picture
	user.FullName = me.Name

	// add user if it doesn't have an id
	if user.Id == 0 {
		err = ac.userService.Add(user)
		if err != nil {
			log.Printf("error adding user from google login: %s", err.Error())
			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from google.", REDIRECT_LOGIN)
			return
		}
	} else {
		// update user
		err = ac.userService.Update(user.Id, user)
		if err != nil {
			log.Printf("error updating user from google login: %s", err.Error())
			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error syncing data from google.", REDIRECT_LOGIN)
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

	c.JSON(http.StatusOK, user)
	return

}

func (ac *AuthController) resetPassword(c *gin.Context) {

	// get email for reset
	var resetRequest ResetPasswordRequest
	err := c.BindJSON(&resetRequest) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// respond as everything after this doesn't matter to the requester
	c.String(http.StatusOK, "Email will be sent to the account provided.")

	// send password reset link
	err = ac.authServices.SendPasswordResetCode(resetRequest.Email)
	if err != nil {
		return
	}
}

func (ac *AuthController) setPassword(c *gin.Context) {
	// get password and code for reset
	var resetPassword ResetPassword
	err := c.BindJSON(&resetPassword) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// get user
	user, err := ac.userService.GetByEmail(resetPassword.Email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Couldn't reset password.", err)
		return
	}

	// verify code
	if ok := ac.authServices.VerifyPasswordResetCode(user.Id, resetPassword.ResetCode); !ok {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error resetting password.", REDIRECT_LOGIN)
		return
	}

	// reset password
	err = ac.userService.UpdatePassword(user.Id, resetPassword.Password)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Couldn't reset password.", err)
		return
	}

	c.Status(http.StatusOK)
}

func (ac *AuthController) createToken(userId int) (string, error) {
	expire := time.Now().Add(time.Minute * utility.GetTimeout(config.UserAuthTimeout))
	userToken := jwt.New(jwt.SigningMethodHS256)
	userToken.Claims["userId"] = userId
	userToken.Claims["exp"] = expire.Unix()
	return userToken.SignedString([]byte(config.AuthKey))
}
