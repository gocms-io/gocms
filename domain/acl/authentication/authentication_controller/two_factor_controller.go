package authentication_controller

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"

	"github.com/cqlcorp/gocms/context"
	"github.com/cqlcorp/gocms/utility/api_utility"
	"github.com/cqlcorp/gocms/utility"
	"github.com/cqlcorp/gocms/utility/errors"
)

// Verify device form structure
type VerifyDeviceDisplay struct {
	DeviceCode string `json:"deviceCode" binding:"required"`
}

// getDeviceToken
func (ac *AuthController) getDeviceCode(c *gin.Context) {

	user, _ := api_utility.GetUserFromContext(c)

	err := ac.ServicesGroup.AuthService.SendTwoFactorCode(user)

	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusInternalServerError, "Error sending device code.", REDIRECT_LOGIN)
		return
	}

	c.Status(http.StatusOK)

}

func (ac *AuthController) verifyDevice(c *gin.Context) {

	// get userId
	user, _ := api_utility.GetUserFromContext(c)

	var verifyDeviceDisplay VerifyDeviceDisplay

	// get login values
	if c.BindJSON(&verifyDeviceDisplay) != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Missing DeviceCode", REDIRECT_VERIFY_DEVICE)
		return
	}

	// verify code is correct
	ok := ac.ServicesGroup.AuthService.VerifyTwoFactorCode(user.Id, verifyDeviceDisplay.DeviceCode)
	if !ok {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Incorrect Device Code.", REDIRECT_VERIFY_DEVICE)
		return
	}

	// generate device token
	expire := time.Now().Add(time.Minute * utility.GetTimeout(context.Config.DbVars.DeviceAuthTimeout))
	deviceToken := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"iat": time.Now().Unix(),
		"exp": expire.Unix() * 1000, // get milliseconds,
	})
	deviceTokenString, err := deviceToken.SignedString(context.Config.DbVars.GetRsaPrivateKey(true))
	if err != nil {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating device token.", REDIRECT_LOGIN)
		return
	}

	c.Header("X-DEVICE-TOKEN", deviceTokenString)

	c.String(http.StatusOK, "ok")
}
