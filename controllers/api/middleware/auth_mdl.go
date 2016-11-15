package middleware

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"bitbucket.org/menklab/grnow-services/services"
	"bitbucket.org/menklab/grnow-services/utility/errors"
	"bitbucket.org/menklab/grnow-services/utility"
	"bitbucket.org/menklab/grnow-services/config"
)

const (
	REDIRECT_LOGIN         = "login"
	REDIRECT_VERIFY_DEVICE = "verifyDevice"
)

type AuthMiddleware struct {
	authService      services.IAuthService
	userService      services.IUserService
}

func (self *AuthMiddleware) init() {
	self.authService = new(services.AuthService)
	self.userService = new (services.UserService)
}

// middleware
func (self *AuthMiddleware) RequireAuthenticatedUser() gin.HandlerFunc {
	return self.requireAuthedUser
}
func (self *AuthMiddleware) RequireAuthenticatedDevice() gin.HandlerFunc {
	return self.requireAuthedDevice
}

// requireAuthedUser middleware
func (self *AuthMiddleware) requireAuthedUser(c *gin.Context) {

	// get token
	authHeader := c.Request.Header.Get("X-AUTH-TOKEN")

	if authHeader == "" {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_UserToken, REDIRECT_LOGIN)
		return
	}

	// parse token
	token, err := self.verifyToken(authHeader)
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_UserToken, REDIRECT_LOGIN)
		return
	}

	userId, ok := token.Claims["userId"].(float64)
	if !ok {
		utility.Debug("UserId not contained in token.")
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_UserToken, REDIRECT_LOGIN)
		return
	}

	// get user
	user, err := self.userService.Get(int(userId))
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_UserToken, REDIRECT_LOGIN)
	}
	c.Set("user", *user)
	// continue
	c.Next()
}

// requireAuthedDevice
func (self *AuthMiddleware) requireAuthedDevice(c *gin.Context) {

	// get for deviceAuthToken header if it exists
	authDeviceHeader := c.Request.Header.Get("X-DEVICE-TOKEN")

	// if auth token is empty fail
	if authDeviceHeader == "" {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_DeviceToken, REDIRECT_VERIFY_DEVICE)
		return
	}

	// parse token
	_, err := self.verifyToken(authDeviceHeader)
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_DeviceToken, REDIRECT_VERIFY_DEVICE)
		return
	}

	// continue
	c.Next()

}

// verifyToken
func (self *AuthMiddleware) verifyToken(authHeader string) (*jwt.Token, error) {
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
