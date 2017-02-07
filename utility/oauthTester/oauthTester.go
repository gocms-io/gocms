package main

// NOT COMPLETE!!!
//import (
//	"golang.org/x/oauth2/google"
//	"golang.org/x/oauth2"
//	"io/ioutil"
//	"net/http"
//	"fmt"
//	"github.com/aws/aws-sdk-go/aws/request"
//)
//
//var clientId string = ""
//var client_secret string = ""
//
//func main() {
//
//	googleconf := &oauth2.Config{
//		ClientID:     clientId,
//		ClientSecret: client_secret,
//		RedirectURL:  "http://localhost:300/googlelogin",
//		Scopes: []string{
//			"https://www.googleapis.com/auth/userinfo.profile",
//			"https://www.googleapis.com/auth/userinfo.email",
//		},
//		Endpoint: google.Endpoint,
//	}
//
//	url := googleconf.AuthCodeURL("state")
//	response.Redirect(url)
//
//	authcode := request.FormValue("code")
//
//	tok, err := googleconf.Exchange(oauth2.NoContext, authcode)
//	if err != nil {
//		fmt.Println("err is", err)
//	}
//
//	fmt.Println("token is ", tok)
//	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + tok.AccessToken)
//
//	defer response.Body.Close()
//	contents, err := ioutil.ReadAll(response.Body)
//}
