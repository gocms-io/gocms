package authentication_controller

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/cqlcorp/gocms/context"
	"github.com/cqlcorp/gocms/init/service"
	"github.com/cqlcorp/gocms/routes"
	"github.com/cqlcorp/gocms/utility"
	"time"
	"github.com/cqlcorp/gocms/utility/log"
)

const (
	REDIRECT_LOGIN         = "login"
	REDIRECT_VERIFY_DEVICE = "verifyDevice"
)

type AuthController struct {
	routes        *routes.Routes
	ServicesGroup *service.ServicesGroup
}

func DefaultAuthController(routes *routes.Routes, sg *service.ServicesGroup) *AuthController {

	// create controller
	authController := &AuthController{
		routes:        routes,
		ServicesGroup: sg,
	}

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
	ac.routes.Auth.GET("/verify", ac.verifyUser)

	if context.Config.DbVars.UseTwoFactor {
		ac.routes.PreTwofactor.GET("/verify-device", ac.getDeviceCode)
		ac.routes.PreTwofactor.POST("/verify-device", ac.verifyDevice)
	}
}

type MyCustomClaims struct {
	userId string `json:"userId"`
	jwt.StandardClaims
}

func (ac *AuthController) createToken(userId int64) (string, error) {
	expire := time.Now().Add(time.Minute * utility.GetTimeout(context.Config.DbVars.UserAuthTimeout))

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"userId": userId,
		"iat": time.Now().Unix(),
		"exp": expire.Unix() * 1000, // get milliseconds,

	})
	tokenString, err := token.SignedString(context.Config.DbVars.GetRsaPrivateKey(true))
	if err != nil {
		log.Errorf("Error signing token for account %v: %v\n", userId, err.Error())
		return "", err
	}

	return tokenString, nil
}
