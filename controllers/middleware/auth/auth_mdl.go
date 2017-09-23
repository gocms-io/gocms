package authMdl

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/services"
	"github.com/gocms-io/gocms/utility/errors"
	"net/http"

	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/controllers/api/api_utility"
	"github.com/gocms-io/gocms/routes"
	"log"
)

type AuthMiddleware struct {
	ServicesGroup *services.ServicesGroup
}

const USER_CONTEXT_KEY = "user"

func DefaultAuthMiddleware(sg *services.ServicesGroup, routes *routes.Routes) *AuthMiddleware {

	authMiddleware := &AuthMiddleware{
		ServicesGroup: sg,
	}

	authMiddleware.Default(routes)
	return authMiddleware
}

func (am *AuthMiddleware) Default(routes *routes.Routes) {
	/// this right here is the issue with grnow compiling
	routes.Root.Use(am.AddUserToContextIfValidToken())

	routes.Auth.Use(am.RequireAuthenticatedUser())
	routes.PreTwofactor = routes.Auth
	if context.Config.UseTwoFactor {
		routes.Auth.Use(am.RequireAuthenticatedDevice())
	}
}

// middleware
func (am *AuthMiddleware) AddUserToContextIfValidToken() gin.HandlerFunc {
	return am.getAuthedUserIfPresent
}
func (am *AuthMiddleware) RequireAuthenticatedUser() gin.HandlerFunc {
	return am.requireAuthedUser
}
func (am *AuthMiddleware) RequireAuthenticatedDevice() gin.HandlerFunc {
	return am.requireAuthedDevice
}

// getAuthedUserIfPresent
func (am *AuthMiddleware) getAuthedUserIfPresent(c *gin.Context) {

	// get token
	authHeader := c.Request.Header.Get("X-AUTH-TOKEN")

	if authHeader == "" {
		c.Next()
		return
	} else {
		// parse token
		token, err := am.verifyToken(authHeader)
		if err != nil {
			c.Next()
			return
		} else {

			userId, ok := token.Claims["userId"].(float64)
			if !ok {
				log.Print("UserId not contained in token.")
				c.Next()
				return
			} else {

				// get user
				user, err := am.ServicesGroup.UserService.Get(int(userId))
				if err != nil {
					c.Next()
					return
				} else {

					// verify user is enabled
					if !user.Enabled {
						c.Next()
						return
					}
					c.Set(USER_CONTEXT_KEY, *user)
					// continue
					c.Next()
					return
				}
			}
		}
	}
}

// requireAuthedUser middleware
func (am *AuthMiddleware) requireAuthedUser(c *gin.Context) {

	user, ok := api_utility.GetUserFromContext(c)
	if !ok {
		errors.Response(c, http.StatusUnauthorized, errors.ApiError_UserToken, nil)
		return
	}

	if user == nil {
		errors.Response(c, http.StatusUnauthorized, errors.ApiError_UserToken, nil)
		return
	}
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
