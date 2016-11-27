package api

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
	"bitbucket.org/menklab/grnow-services/services"
	"bitbucket.org/menklab/grnow-services/config"
	"bitbucket.org/menklab/grnow-services/utility/errors"
	"bitbucket.org/menklab/grnow-services/utility"
	"bitbucket.org/menklab/grnow-services/controllers/routes"
	"bitbucket.org/menklab/grnow-services/controllers/api/middleware"
	"log"
	"encoding/json"
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
	userService      services.IUserService
	authServices     services.IAuthService
}
var authController *AuthController

func init() {
	authController = &AuthController{
		userService: new(services.UserService),
		authServices: new(services.AuthService),
	}
}


func (ac *AuthController) Apply() {
	routes := routes.Routes()
	routes.Public.POST("/login", ac.login)
	routes.Public.POST("/login/facebook", ac.loginFacebook)
	routes.Public.POST("/reset-password", ac.resetPassword)
	routes.Public.PUT("/reset-password", ac.setPassword)
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
		errors.Response(c, http.StatusUnauthorized, "Missing Email or Password", middleware.REDIRECT_LOGIN)
		return
	}

	// auth user
	authUser := services.AuthUser{
		Email:    loginDisplay.Email,
		Password: loginDisplay.Password,
	}
	user, authed := authController.authServices.AuthUser(&authUser)
	if !authed {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Incorrect Email / Password", middleware.REDIRECT_LOGIN)
		return
	}


	// create token
	expire := time.Now().Add(time.Minute * utility.GetTimeout(config.UserAuthTimeout))
	userToken := jwt.New(jwt.SigningMethodHS256)
	userToken.Claims["userId"] = user.Id
	userToken.Claims["exp"] = expire.Unix()
	tokenString, err := userToken.SignedString([]byte(config.AuthKey))

	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating token.", middleware.REDIRECT_LOGIN)
		return
	}

	c.Header("X-AUTH-TOKEN", tokenString)

	c.JSON(http.StatusOK, user)
	return
}
type fbData struct {
	Height    int `json:"height" binding:"required"`
	Width    int `json:"width" binding:"required"`
	Url    string `json:"url" binding:"required"`
}
type fbPicture struct {
	Data    fbData `json:"data" binding:"required"`
}
type fbAgeRange struct {
	Min    int `json:"min" binding:"required"`
	Max    int `json:"max" binding:"required"`
}
type fbMe struct{
	Id string `json:"id" binding:"required"`
	Name    string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Picture    fbPicture `json:"picture" binding:"required"`
	Gender    string `json:"gender" binding:"required"`
	AgeRange    fbAgeRange `json:"age_range" binding:"required"`
}

func (ac *AuthController) loginFacebook(c *gin.Context) {
	// check for token in header
	fToken := c.Request.Header.Get("X-FACEBOOK-TOKEN")
	if fToken == ""{
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Missing Token", middleware.REDIRECT_LOGIN)
		return
	}

	// use token to verify user on facebook and get id
	req := services.RestRequest{
		Url: "https://graph.facebook.com/v2.8/me?fields=id,name,email,picture.width(800).height(800),gender,age_range&access_token=" + fToken,
	}
	res, err := req.Get()
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Validate With Facebook", middleware.REDIRECT_LOGIN)
		return
	}
	log.Printf("body: %s", string(res.Body))
	// get facebook me object back
	var me fbMe
	err = json.Unmarshal(res.Body, &me)
	if err != nil {
		log.Printf("Error marshaling response from facebook /me: %s", err.Error())
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Couldn't Parse Facebook Response", middleware.REDIRECT_LOGIN)
		return
	}

	c.JSON(http.StatusOK, me)


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
	c.String(http.StatusOK, "Email will be sent if account exists.")

	// send password reset link
	err = authController.authServices.SendPasswordResetCode(resetRequest.Email)
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
	user, err := authController.userService.GetByEmail(resetPassword.Email)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Couldn't reset password.", err)
		return
	}

	// verify code
	if ok := authController.authServices.VerifyPasswordResetCode(user.Id, resetPassword.ResetCode); !ok {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error resetting password.", middleware.REDIRECT_LOGIN)
		return
	}

	// reset password
	user.NewPassword = resetPassword.Password
	err = authController.userService.Update(user.Id, user)
	if err != nil {
		errors.Response(c, http.StatusBadRequest, "Couldn't reset password.", err)
		return
	}

	c.Status(http.StatusOK)
}
