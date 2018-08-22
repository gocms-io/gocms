package health_middleware

import (
	"bytes"
	"fmt"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/myanrichal/gocms/domain/mail/mail_service"
	"github.com/myanrichal/gocms/init/service"
	"github.com/myanrichal/gocms/routes"
	"github.com/myanrichal/gocms/utility/log"
	"github.com/myanrichal/gocms/context"
)

//Setup
type HealthMiddleware struct {
	ServicesGroup *service.ServicesGroup
}

func DefaultHealthMiddleware(sg *service.ServicesGroup) *HealthMiddleware {

	healthMiddleware := &HealthMiddleware{
		ServicesGroup: sg,
	}

	return healthMiddleware
}

////////// body writer prototype
// working should go somewhere else

type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

//////////

//Apply Middleware on startup
//Connect middleware to routes
func (hm *HealthMiddleware) ApplyHealthToRoutes(routes *routes.Routes) {
	fmt.Println("\nSetup Health Middleware\n")
	log.Debugf("Adding Health Services Middleware\n")
	//setup as auth route only 
	routes.Auth.Use(hm.CheckForErrors())
	routes.Public.Use(hm.CheckForErrors())
}

//wrapper for middleware
func (hm *HealthMiddleware) CheckForErrors() gin.HandlerFunc {
	return hm.errorMiddleware
}

//middleware activity
func (hm *HealthMiddleware) errorMiddleware(c *gin.Context) {
	fmt.Println("error middleware")

	//setup writer
	blw := &bodyLogWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
	c.Writer = blw

	c.Next()

	//initalize vairables
	var (
		responseBody, routeProblem string
	)


	//check status
	statusCode := c.Writer.Status()

	//There is an error send an error report
	if statusCode >= 400 {

		//send only one error report of identical type  within 10 minutes. 
		//Print Body
		responseBody = blw.body.String()

		//print problem route
		routeProblem = c.Request.URL.Path

		//find date
		date := time.Now()

		emailBody := (`
			<!DOCTYPE html>
			<html>
			<h2> Error Report :    ` + context.Config.DbVars.LoginTitle + ` </h2>
			<ul>
				<li> Route:  		  ` + routeProblem 				+ `</li>
				<li> Status: 		  ` + strconv.Itoa(statusCode) 	+ `</li>
				<li> Body:   		  ` + responseBody 				+ `</li>
				<li> Time of Incident ` + date.String() 			+ `</li>
			</ul>
			</html>
			`)

		//setup mail
		ms := mail_service.DefaultMailService()
		mail := &mail_service.Mail{
			To:      context.Config.DbVars.ErrorReportAddress,
			Subject: "GoCms - Health Monitor",
			Body: emailBody,
		}

		err := ms.Send(mail)

		if err != nil {
			fmt.Println("\nThere was an error in sending\n")
		}

	}
}

