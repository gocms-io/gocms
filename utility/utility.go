package utility

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms-services/models"
	"github.com/gocms-io/gocms-services/utility/errors"
	"io/ioutil"
	"net"
	"strconv"
	"time"
)

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

// Check if a port is available
func CheckPort(port int) (status bool, err error) {

	// Concatenate a colon and the port
	host := ":" + strconv.Itoa(port)

	// Try to create a server with the port
	server, err := net.Listen("tcp", host)

	// if it fails then the port is likely taken
	if err != nil {
		return false, err
	}

	// close the server
	server.Close()

	// we successfully used and closed the port
	// so it's now available to be used again
	return true, nil
}

// find an available port
func FindPort(startingPort int) (port int, err error) {
	// highest port 65535
	i := 0
	for true {
		testPort := startingPort + i

		// make sure we aren't over the allowed range
		if testPort > 65535 {
			return 0, errors.New("Over Allowed Port Range.")
		}

		isAvailable, _ := CheckPort(testPort)
		if isAvailable {
			return testPort, nil
		}

		i++
	}

	return 0, errors.New("Couldn't find available open port.")

}
