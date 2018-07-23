package authentication_middleware

import (
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/myanrichal/gocms/context"
	"github.com/myanrichal/gocms/context/consts"
	"github.com/myanrichal/gocms/init/service"
	"github.com/myanrichal/gocms/routes"
	"github.com/myanrichal/gocms/utility/api_utility"
	"github.com/myanrichal/gocms/utility/errors"
	"github.com/myanrichal/gocms/utility/log"
)

type AuthMiddleware struct {
	ServicesGroup *service.ServicesGroup
}

func DefaultAuthMiddleware(sg *service.ServicesGroup) *AuthMiddleware {

	authMiddleware := &AuthMiddleware{
		ServicesGroup: sg,
	}

	return authMiddleware
}

func (am *AuthMiddleware) ApplyAuthToRoutes(routes *routes.Routes) {
	log.Debugf("Adding Authentication Middleware\n")
	routes.Auth.Use(am.RequireAuthenticatedUser())
	routes.PreTwofactor = routes.Auth
	if context.Config.DbVars.UseTwoFactor {
		routes.Auth.Use(am.RequireAuthenticatedDevice())
	}
}

// middleware
func (am *AuthMiddleware) AddUserToContextIfValidToken() gin.HandlerFunc {
	log.Debugf("Adding USER Context Middleware\n")
	return am.addUserToContextIfValidToken
}
func (am *AuthMiddleware) RequireAuthenticatedUser() gin.HandlerFunc {
	return am.requireAuthedUser
}
func (am *AuthMiddleware) RequireAuthenticatedDevice() gin.HandlerFunc {
	return am.requireAuthedDevice
}

// getAuthedUserIfPresent
func (am *AuthMiddleware) addUserToContextIfValidToken(c *gin.Context) {

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
			userId, ok := token.Claims.(jwt.MapClaims)["userId"].(float64)
			if !ok {
				c.Next()
				return
			} else {
				// get user
				user, err := am.ServicesGroup.UserService.Get(int64(userId))
				if err != nil {
					c.Next()
					return
				} else {

					// verify user is enabled
					if !user.Enabled {
						c.Next()
						return
					}
					c.Set(consts.USER_KEY_FOR_GIN_CONTEXT, *user)
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
		if jwt.SigningMethodRS256 != token.Method {
			return nil, errors.New("Token signing method does not match.")
		}

		return context.Config.DbVars.RSAPub, nil
	})

	// check for parsing error
	if err != nil {
		return nil, err
	}

	// check if token is valid
	if !token.Valid {
		return nil, err
	}

	return token, nil
}
