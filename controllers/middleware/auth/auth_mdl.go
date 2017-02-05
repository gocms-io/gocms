package goCMS_authMdl

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/utility/errors"

	"log"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/context"
)

type AuthMiddleware struct {
	ServicesGroup *goCMS_services.ServicesGroup
}

func DefaultAuthMiddleware(sg *goCMS_services.ServicesGroup, routes *goCMS_routes.ApiRoutes) *AuthMiddleware {

	authMiddleware := &AuthMiddleware{
		ServicesGroup: sg,
	}

	authMiddleware.Default(routes)
	return authMiddleware
}

func (am *AuthMiddleware) Default(routes *goCMS_routes.ApiRoutes) {
	routes.Auth.Use(am.RequireAuthenticatedUser())
	routes.PreTwofactor = routes.Auth
	if goCMS_context.Config.UseTwoFactor {
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
		goCMS_errors.Response(c, http.StatusUnauthorized, goCMS_errors.ApiError_UserToken, nil)
		return
	}

	// parse token
	token, err := am.verifyToken(authHeader)
	if err != nil {
		goCMS_errors.Response(c, http.StatusUnauthorized, goCMS_errors.ApiError_UserToken, err)
		return
	}

	userId, ok := token.Claims["userId"].(float64)
	if !ok {
		log.Print("UserId not contained in token.")
		goCMS_errors.Response(c, http.StatusUnauthorized, goCMS_errors.ApiError_UserToken, err)
		return
	}
	// get user
	user, err := am.ServicesGroup.UserService.Get(int(userId))
	if err != nil {
		goCMS_errors.Response(c, http.StatusUnauthorized, goCMS_errors.ApiError_UserToken, err)
		return
	}

	// verify user is enabled
	if !user.Enabled {
		goCMS_errors.Response(c, http.StatusUnauthorized, goCMS_errors.ApiError_User_Disabled, err)
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
		goCMS_errors.Response(c, http.StatusUnauthorized, goCMS_errors.ApiError_DeviceToken, nil)
		return
	}

	// parse token
	_, err := am.verifyToken(authDeviceHeader)
	if err != nil {
		goCMS_errors.Response(c, http.StatusUnauthorized, goCMS_errors.ApiError_DeviceToken, err)
		return
	}

	// continue
	c.Next()

}

// verifyToken
func (am *AuthMiddleware) verifyToken(authHeader string) (*jwt.Token, error) {
	token, err := jwt.Parse(authHeader, func(token *jwt.Token) (interface{}, error) {
		if jwt.SigningMethodHS256 != token.Method {
			return nil, goCMS_errors.New("Token signing method does not match.")
		}

		return []byte(goCMS_context.Config.AuthKey), nil
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
