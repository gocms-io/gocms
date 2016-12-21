package errors

import (
	"github.com/gin-gonic/gin"
)

const (
	ApiError_UserToken = "Your user token is not valid or has expired."
	ApiError_DeviceToken = "Your device token is not valid or has expired."
	ApiError_Json = "Could not parse request. Some fields may be missing."
	ApiError_UserDoesntExist = "User Doesn't Exist."
	ApiError_UserAlreadyExists = "User Already Exists."
	ApiError_Permissions = "You do not have access."
	ApiError_User_Disabled = "Account is currently disabled."
	ApiError_Server = "Something went wrong. Please try again."
)

type appError interface {
	Error() string
	Include() bool
}

type apiError struct {
	message string
	include bool
}

func New(m string) appError {
	return &apiError{m, false}
}

func NewToUser(m string) appError {
	return &apiError{m, true}
}

func (e *apiError) Error() string {
	return e.message
}

func (e *apiError) Include() bool {
	return e.include
}


// An Error Response is the default error that is used for api responses.
//
// swagger:model error
type ErrorResponse struct {
	Code     int  `json:"code,string"`
	Message  string `json:"message,string"`
	Redirect string `json:"redirect,string"`
	Data     interface{} `json:"data,string"`
}

func Response(c *gin.Context, code int, message string, err interface{}, a ...interface{}) {

	e, ok := err.(appError)
	if ok {
		if e.Include() {
			message = message + "; " + e.Error()
		}
	}

	c.Abort()
	c.JSON(code, gin.H{
		"code":    code,
		"message": message,
		"data": a,
	})

	return
}

func ResponseWithSoftRedirect(c *gin.Context, code int, message string, redirect string, a ...interface{}) {
	c.Abort()
	c.JSON(code, gin.H{
		"code":     code,
		"message":  message,
		"redirect": redirect,
		"data": a,
	})
}

