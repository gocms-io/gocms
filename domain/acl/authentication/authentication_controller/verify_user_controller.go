package authentication_controller

import (
	"github.com/gin-gonic/gin"
	"github.com/cqlcorp/gocms/utility/api_utility"
	"github.com/cqlcorp/gocms/utility/errors"
	"net/http"
	"strconv"
)

/**
* @api {get} /verify Verify User
* @apiDescription Used to verify that the user is authenticated. Optionally refreshing the token.
* @apiName VerifyUser
* @apiGroup Authentication
* @apiParam (Query String) {bool} refreshToken If the current user is still authenticated retrieve a new token with a refreshed expiration date. * Default=false
* @apiUse UserAuthHeader
* @apiUse UserDisplay
* @apiUse AuthHeaderResponse
* @apiPermission Authenticated
 */
func (ac *AuthController) verifyUser(c *gin.Context) {
	// get logged in user
	authUser, _ := api_utility.GetUserFromContext(c)

	// check for refresh token
	refreshTokenString := c.DefaultQuery("refreshToken", "false")
	refreshToken, err := strconv.ParseBool(refreshTokenString)
	if err != nil {
		refreshToken = false
	}

	// if refresh requested, do it
	if refreshToken {
		// create token
		tokenString, err := ac.createToken(authUser.Id)
		if err != nil {
			errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating token.", REDIRECT_LOGIN)
			return
		}

		c.Header("X-AUTH-TOKEN", tokenString)

	}

	c.JSON(http.StatusOK, authUser.GetUserDisplay())
}
