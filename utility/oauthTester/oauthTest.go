package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"net/http"
	"fmt"
	"golang.org/x/net/context"
)

var (
	r *gin.Engine
	stateSecret = "test"
	serviceBase = "localhost:8080"
	redirectUrl = "/api/oauthTest/login/facebook/oauthCallBack"
	healthyUrl = "/api/healthy"
	oauthConfig oauth2.Config
)



func main() {

	oauthConfig = oauth2.Config{
		ClientID: "306582953068321",
		ClientSecret: "1b39c7fbbd6bcaa4f2ce3a8a0e24e013",
		Endpoint: facebook.Endpoint,
		RedirectURL: serviceBase + redirectUrl,
		Scopes: []string{"public_profile", "email", "user_friends"},
	}

	r = gin.Default()
	baseApi := r.Group("/api")
	baseApi.GET("/healthy", healthy)

	oauthTestGroup := r.Group("/api/oauthTest")
	oauthTestGroup.GET("/login/facebook", facebookAuth)
	oauthTestGroup.GET("/login/facebook/oauthCallBack",facebookAuthCallBack)



	err := r.Run(serviceBase)
	log.Println(err.Error())
}

func healthy(c *gin.Context) {
	c.Status(http.StatusOK)
}

func facebookAuth(c *gin.Context) {
	// todo verify state on postback
	url := oauthConfig.AuthCodeURL(stateSecret, oauth2.AccessTypeOnline)
	fmt.Println("Visit the url for the auth dialog: %v\n",url)

	c.Redirect(http.StatusTemporaryRedirect, url)
}

func facebookAuthCallBack(c *gin.Context) {
	state := c.Query("state")
	// check state is valid
	if state != stateSecret {
		c.Redirect(http.StatusTemporaryRedirect, serviceBase + healthyUrl)
		return
	}

	error := c.Query("error")
	if error != "" {
		errorCode := c.Query("error_code")
		errorDescription := c.Query("error_description")
		errorReason := c.Query("error_reason")
		fmt.Printf("Error authorizing oauth. Error: %v, Code: %v, Description: %v, Reason %v", error, errorCode, errorDescription, errorReason)
		c.Redirect(http.StatusTemporaryRedirect, serviceBase + healthyUrl)
		return
	}

	code := c.Query("code") // if no error
	fmt.Println("Code: " + code)
	//https://library.launchkit.io/the-right-way-to-implement-facebook-login-in-a-mobile-app-57e2eca3648b#.pz2sb3h25
}
