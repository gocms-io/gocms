package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"bitbucket.org/menklab/grnow-services/controllers/routes"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"bitbucket.org/menklab/grnow-services/utility"
	"bitbucket.org/menklab/grnow-services/config"
)

type OauthController struct {
	oauthConfig oauth2.Config
}
var stateSecret = "grnow"
var oauthController *OauthController

func init() {
	//self.authServices = services.GetAuthService()

	// setup client config
	oauthController = &OauthController{
		oauthConfig: oauth2.Config{
			ClientID: "306582953068321",
			ClientSecret: "1b39c7fbbd6bcaa4f2ce3a8a0e24e013",
			Endpoint: facebook.Endpoint,
			RedirectURL: config.PublicApiUrl + "/api/login/facebook/oauthCallBack",
			Scopes: []string{"public_profile", "email", "user_friends"},
		},
	}

	utility.Debug("Secret: " + oauthController.oauthConfig.ClientSecret)
}

func (oc *OauthController) Apply() {
	routes := routes.Routes()
	routes.Public.GET("/login/facebook", oc.facebookAuth)
	routes.Public.GET("/login/facebook/oauthCallBack", oc.facebookAuthCallBack)

}

func (oc *OauthController) facebookAuth(c *gin.Context) {
	// todo verify state on postback
	url := oauthController.oauthConfig.AuthCodeURL(stateSecret, oauth2.AccessTypeOnline)
	utility.DebugF("Visit the url for the auth dialog: %v\n",url)

	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (oc *OauthController) facebookAuthCallBack(c *gin.Context) {
	state := c.Query("state")
	// check state is valid
	if state != stateSecret {
		c.Redirect(http.StatusTemporaryRedirect, config.RedirectRootUrl)
		return
	}

	error := c.Query("error")
	if error != "" {
		errorCode := c.Query("error_code")
		errorDescription := c.Query("error_description")
		errorReason := c.Query("error_reason")
		utility.DebugF("Error authorizing oauth. Error: %v, Code: %v, Description: %v, Reason %v", error, errorCode, errorDescription, errorReason)
		c.Redirect(http.StatusTemporaryRedirect, config.RedirectRootUrl)
		return
	}

	code := c.Query("code") // if no error
	utility.Debug("Code: " + code)
//https://library.launchkit.io/the-right-way-to-implement-facebook-login-in-a-mobile-app-57e2eca3648b#.pz2sb3h25
}

