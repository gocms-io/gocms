package utility

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net"
	"strconv"
	"strings"
	"time"
	"github.com/myanrichal/gocms/utility/log"
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
func FindPort() (port int, err error) {

	l, err := net.Listen("tcp4", ":0")
	defer l.Close()
	if err != nil {
		log.Errorf("OS did not provide a tcp port: %v\n", err.Error())
		return 0, err
	}

	portString := strings.Replace(l.Addr().String(), "0.0.0.0:", "", 1)
	port, err = strconv.Atoi(portString)
	if err != nil {
		log.Errorf("plugin utility - error parsing port for plugin: %v\n", err.Error())
	}

	return port, nil
}
