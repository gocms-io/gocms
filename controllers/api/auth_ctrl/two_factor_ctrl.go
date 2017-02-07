package goCMS_auth_ctrl

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"

	"github.com/menklab/goCMS/context"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/utility/errors"
)

// Verify device form structure
type VerifyDeviceDisplay struct {
	DeviceCode string `json:"deviceCode" binding:"required"`
}

// getDeviceToken
func (ac *AuthController) getDeviceCode(c *gin.Context) {

	user, _ := goCMS_utility.GetUserFromContext(c)

	err := ac.ServicesGroup.AuthService.SendTwoFactorCode(user)

	if err != nil {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusInternalServerError, "Error sending device code.", REDIRECT_LOGIN)
		return
	}

	c.Status(http.StatusOK)

}

func (ac *AuthController) verifyDevice(c *gin.Context) {

	// get userId
	user, _ := goCMS_utility.GetUserFromContext(c)

	var verifyDeviceDisplay VerifyDeviceDisplay

	// get login values
	if c.BindJSON(&verifyDeviceDisplay) != nil {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Missing DeviceCode", REDIRECT_VERIFY_DEVICE)
		return
	}

	// verify code is correct
	ok := ac.ServicesGroup.AuthService.VerifyTwoFactorCode(user.Id, verifyDeviceDisplay.DeviceCode)
	if !ok {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Incorrect Device Code.", REDIRECT_VERIFY_DEVICE)
		return
	}

	// generate device token
	expire := time.Now().Add(time.Minute * goCMS_utility.GetTimeout(goCMS_context.Config.DeviceAuthTimeout))
	deviceToken := jwt.New(jwt.SigningMethodHS256)
	deviceToken.Claims["exp"] = expire.Unix()
	deviceTokenString, err := deviceToken.SignedString([]byte(goCMS_context.Config.AuthKey))

	if err != nil {
		goCMS_errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, "Error generating device token.", REDIRECT_LOGIN)
		return
	}

	c.Header("X-DEVICE-TOKEN", deviceTokenString)

	c.String(http.StatusOK, "ok")
}
