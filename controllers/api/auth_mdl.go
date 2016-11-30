package api

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/config"
	"log"
	"github.com/menklab/goCMS/routes"
)

type AuthMiddleware struct {
	ServicesGroup *services.ServicesGroup
}

func DefaultAuthMiddleware(sg *services.ServicesGroup, routes *routes.ApiRoutes) *AuthMiddleware {

	authMiddleware := &AuthMiddleware {
		ServicesGroup: sg,
	}

	authMiddleware.Default(routes)
	return authMiddleware
}

func (am *AuthMiddleware) Default(routes *routes.ApiRoutes) {
	routes.Auth.Use(am.RequireAuthenticatedUser())
	routes.PreTwofactor = routes.Auth
	if config.UseTwoFactor {
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
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_UserToken, REDIRECT_LOGIN)
		return
	}

	// parse token
	token, err := am.verifyToken(authHeader)
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_UserToken, REDIRECT_LOGIN)
		return
	}

	userId, ok := token.Claims["userId"].(float64)
	if !ok {
		log.Print("UserId not contained in token.")
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_UserToken, REDIRECT_LOGIN)
		return
	}
	// get user
	user, err := am.ServicesGroup.UserService.Get(int(userId))
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_UserToken, REDIRECT_LOGIN)
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
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_DeviceToken, REDIRECT_VERIFY_DEVICE)
		return
	}

	// parse token
	_, err := am.verifyToken(authDeviceHeader)
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_DeviceToken, REDIRECT_VERIFY_DEVICE)
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

		return []byte(config.AuthKey), nil
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
