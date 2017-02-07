package goCMS_auth_ctrl

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
	"time"

	"github.com/menklab/goCMS/context"
	"github.com/menklab/goCMS/controllers/middleware/auth"
	"github.com/menklab/goCMS/utility"
)

const (
	REDIRECT_LOGIN         = "login"
	REDIRECT_VERIFY_DEVICE = "verifyDevice"
)

type AuthController struct {
	routes        *goCMS_routes.ApiRoutes
	ServicesGroup *goCMS_services.ServicesGroup
}

func DefaultAuthController(routes *goCMS_routes.ApiRoutes, sg *goCMS_services.ServicesGroup) *AuthController {

	// create controller
	authController := &AuthController{
		routes:        routes,
		ServicesGroup: sg,
	}

	// apply auth middleware
	goCMS_authMdl.DefaultAuthMiddleware(sg, routes)

	authController.Default()

	return authController
}

/**
* @apiDefine Authenticated Authenticated User
* User must be logged in and authenticated.
 */

func (ac *AuthController) Default() {
	ac.routes.Public.POST("/register", ac.register)
	ac.routes.Public.POST("/login", ac.login)
	ac.routes.Public.POST("/login/facebook", ac.loginFacebook)
	ac.routes.Public.POST("/login/google", ac.loginGoogle)
	ac.routes.Public.POST("/reset-password", ac.resetPassword)
	ac.routes.Public.PUT("/reset-password", ac.setPassword)

	if goCMS_context.Config.UseTwoFactor {
		ac.routes.PreTwofactor.GET("/verify-device", ac.getDeviceCode)
		ac.routes.PreTwofactor.POST("/verify-device", ac.verifyDevice)
	}
}

func (ac *AuthController) createToken(userId int) (string, error) {
	expire := time.Now().Add(time.Minute * goCMS_utility.GetTimeout(goCMS_context.Config.UserAuthTimeout))
	userToken := jwt.New(jwt.SigningMethodHS256)
	userToken.Claims["userId"] = userId
	userToken.Claims["exp"] = expire.Unix()
	return userToken.SignedString([]byte(goCMS_context.Config.AuthKey))
}
