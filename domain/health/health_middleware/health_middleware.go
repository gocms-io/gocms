package health_middleware

import (
	"bytes"
	"fmt"
	"strconv"
	"time"

	"github.com/cqlcorp/gocms/domain/logs/log_model"

	"github.com/cqlcorp/gocms/context"
	"github.com/cqlcorp/gocms/domain/mail/mail_service"
	"github.com/cqlcorp/gocms/init/service"
	"github.com/cqlcorp/gocms/routes"
	"github.com/gin-gonic/gin"
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
type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

//ApplyHealthToRoutes apply Middleware on startup
//Connect middleware to routes
func (hm *HealthMiddleware) ApplyHealthToRoutes(routes *routes.Routes) {
	//setup as auth route only
	// todo: SHOULD APPLY ON ALL ROUTES
	routes.Auth.Use(hm.CheckForErrors())
	routes.Public.Use(hm.CheckForErrors())
	routes.Root.Use(hm.CheckForErrors())
}

//wrapper for middleware
func (hm *HealthMiddleware) CheckForErrors() gin.HandlerFunc {
	return hm.errorMiddleware
}

//middleware activity
func (hm *HealthMiddleware) errorMiddleware(c *gin.Context) {
	//setup writer
	fmt.Println("try middleware")
	blw := &bodyLogWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
	c.Writer = blw

	c.Next()

	//check status
	statusCode := c.Writer.Status()

	if statusCode >= 400 {
		//check database
		var errorReport log_model.ErrorLog
		errorReport.Status = strconv.Itoa(statusCode)
		errorReport.Route = c.Request.URL.Path
		errorReport.Body = blw.body.String()
		errorReport.Time = time.Now()

		//check if this error recently happened
		RecentError, err := hm.ServicesGroup.LogService.RecentError(&errorReport)
		if err != nil {
			return
		}

		if RecentError {
			//write email
			emailBody := (`
				<!DOCTYPE html>
				<html>
				<h2> Error Report :    ` + context.Config.DbVars.LoginTitle + ` </h2>
				<ul>
					<li> Route:  		  ` + errorReport.Route + `</li>
					<li> Status: 		  ` + errorReport.Status + `</li>
					<li> Body:   		  ` + errorReport.Body + `</li>
					<li> Time of Incident ` + errorReport.Time.String() + `</li>
				</ul>
				</html>
				`)

			//setup mail
			ms := mail_service.DefaultMailService()
			mail := &mail_service.Mail{
				To:      context.Config.DbVars.ErrorReportAddress,
				Subject: "GoCms - Health Monitor",
				Body:    emailBody,
			}

			err := ms.Send(mail)

			if err != nil {
				fmt.Println("\nThere was an error in sending email\n")
			}
		}
	}
}
