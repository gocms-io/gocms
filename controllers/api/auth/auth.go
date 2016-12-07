package auth

import (
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
	"time"
	"github.com/dgrijalva/jwt-go"
	"github.com/menklab/goCMS/config"
	"github.com/menklab/goCMS/utility"
)

const (
	REDIRECT_LOGIN = "login"
	REDIRECT_VERIFY_DEVICE = "verifyDevice"
)

type AuthController struct {
	routes        *routes.ApiRoutes
	ServicesGroup *services.ServicesGroup
}

func DefaultAuthController(routes *routes.ApiRoutes, sg *services.ServicesGroup) *AuthController {

	// create controller
	authController := &AuthController{
		routes: routes,
		ServicesGroup: sg,
	}

	// apply auth middleware
	DefaultAuthMiddleware(sg, routes)

	// admin admin route
	routes.Admin = routes.Auth.Group("/admin")

	//apply acl middleware
	DefaultAclMiddleware(routes)

	authController.Default()

	return authController
}

func (ac *AuthController) Default() {
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


func (ac *AuthController) createToken(userId int) (string, error) {
	expire := time.Now().Add(time.Minute * utility.GetTimeout(config.UserAuthTimeout))
	userToken := jwt.New(jwt.SigningMethodHS256)
	userToken.Claims["userId"] = userId
	userToken.Claims["exp"] = expire.Unix()
	return userToken.SignedString([]byte(config.AuthKey))
}
