package utility

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/gin-gonic/gin"
	"time"
	"bitbucket.org/menklab/grnow-services/models"
	"bitbucket.org/menklab/grnow-services/config"
	"io/ioutil"
)

func Debug(message string) {
	if config.Debug {
		fmt.Println(message)
	}
}
func DebugF(format string, a ...interface{}) {
	if config.Debug {
		fmt.Printf(format, a...)
	}
}

func DebugSecurity(message string) {
	if config.DebugSecurity {
		fmt.Println(message)
	}
}

func DebugSecurityF(format string, a ...interface{}) {
	if config.Debug {
		fmt.Printf(format, a...)
	}
}

func GenerateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	// Note that err == nil only if we read len(b) bytes.
	if err != nil {
		return nil, err
	}

	return b, nil
}

func GenerateRandomString(s int) (string, error) {
	b, err := GenerateRandomBytes(s)
	if err != nil {
		return "", err
	}
	code := base64.URLEncoding.EncodeToString(b)
	return code[0:s], nil
}

func GetUserFromContext(c *gin.Context) (*models.User, bool) {
	// get user from context
	if userContext, ok := c.Get("user"); ok {
		if userDisplay, ok := userContext.(models.User); ok {
			return &userDisplay, true
		}
	}
	return nil, false
}

// getTimeout
func GetTimeout(timeout int64) time.Duration {
	return time.Duration(timeout)
}

// must
func MustReadFile(fileName string) *[]byte {
	data, err := ioutil.ReadFile(fileName)
	if err != nil {
		panic(fmt.Sprintf("Error Reading File: %s\n", err.Error()))
	}
	return &data
}