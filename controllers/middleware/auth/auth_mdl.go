package aclMdl

import (
	"log"
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/goCMS/context"
	"github.com/gocms-io/goCMS/routes"
	"github.com/gocms-io/goCMS/services"
	"github.com/gocms-io/goCMS/utility/errors"
)

type AuthMiddleware struct {
	ServicesGroup *services.ServicesGroup
}

func DefaultAuthMiddleware(sg *services.ServicesGroup, routes *routes.Routes) *AuthMiddleware {

	authMiddleware := &AuthMiddleware{
		ServicesGroup: sg,
	}

	authMiddleware.Default(routes)
	return authMiddleware
}

func (am *AuthMiddleware) Default(routes *routes.Routes) {
	routes.Auth.Use(am.RequireAuthenticatedUser())
	routes.PreTwofactor = routes.Auth
	if context.Config.UseTwoFactor {
		routes.Auth.Use(am.RequireAuthenticatedDevice())
	}
}

// middleware
func (am *AuthMiddleware) RequireAuthenticatedUser() gin.HandlerFunc {
	return am.requireAuthedUser
}
func (am *AuthMiddleware) RequireAuthenticatedDevice() gin.HandlerFunc {
	return am.requireAuthedDevice
}

// requireAuthedUser middleware
func (am *AuthMiddleware) requireAuthedUser(c *gin.Context) {

	// get token
	authHeader := c.Request.Header.Get("X-AUTH-TOKEN")

	if authHeader == "" {
		errors.Response(c, http.StatusUnauthorized, errors.ApiError_UserToken, nil)
		return
	}

	// parse token
	token, err := am.verifyToken(authHeader)
	if err != nil {
		errors.Response(c, http.StatusUnauthorized, errors.ApiError_UserToken, err)
		return
	}

	userId, ok := token.Claims.(jwt.MapClaims)["userId"].(float64)
	if !ok {
		log.Print("UserId not contained in token.")
		errors.Response(c, http.StatusUnauthorized, errors.ApiError_UserToken, err)
		return
	}
	// get user
	user, err := am.ServicesGroup.UserService.Get(int(userId))
	if err != nil {
		errors.Response(c, http.StatusUnauthorized, errors.ApiError_UserToken, err)
		return
	}

	// verify user is enabled
	if !user.Enabled {
		errors.Response(c, http.StatusUnauthorized, errors.ApiError_User_Disabled, err)
		return
	}

	c.Set("user", *user)
	// continue
	c.Next()
}

// requireAuthedDevice
func (am *AuthMiddleware) requireAuthedDevice(c *gin.Context) {

	// get for deviceAuthToken header if it exists
	authDeviceHeader := c.Request.Header.Get("X-DEVICE-TOKEN")

	// if auth token is empty fail
	if authDeviceHeader == "" {
		errors.Response(c, http.StatusUnauthorized, errors.ApiError_DeviceToken, nil)
		return
	}

	// parse token
	_, err := am.verifyToken(authDeviceHeader)
	if err != nil {
		errors.Response(c, http.StatusUnauthorized, errors.ApiError_DeviceToken, err)
		return
	}

	// continue
	c.Next()

}

// verifyToken
func (am *AuthMiddleware) verifyToken(authHeader string) (*jwt.Token, error) {
	token, err := jwt.Parse(authHeader, func(token *jwt.Token) (interface{}, error) {
		if jwt.SigningMethodHS256 != token.Method {
			return nil, errors.New("Token signing method does not match.")
		}

		return []byte(context.Config.AuthKey), nil
	})

	// check for parsing erorr
	if err != nil {
		return nil, err
	}

	// check if token is valid
	if !token.Valid {
		return nil, err
	}

	return token, nil
}
