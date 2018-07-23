package health_middleware

import (
	"bytes"
	"fmt"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/domain/mail/mail_service"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/utility/log"
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
	routes.Auth.Use(hm.CheckForErrors())
}

//wrapper for middleware
func (hm *HealthMiddleware) CheckForErrors() gin.HandlerFunc {
	return hm.errorMiddleware
}

//middleware activity
func (hm *HealthMiddleware) errorMiddleware(c *gin.Context) {

	fmt.Println("\n -- Trying Health Middleware -- ")

	//setup writer
	blw := &bodyLogWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
	c.Writer = blw

	c.Next()

	//initalize vairables
	var (
		responseBody, routeProblem, date string
	)

	//check status
	statusCode := c.Writer.Status()

	//There is an error send an error report
	if statusCode >= 400 {
		//Print Body
		responseBody = blw.body.String()

		//print problem route
		routeProblem = c.Request.URL.Path

		//find date
		date = time.Now().String()

		//setup mail
		ms := mail_service.DefaultMailService()
		mail := &mail_service.Mail{
			To:      "ryan.michal@cqlcorp.com",
			Subject: "PMD - Health Monitor",
			Body:    "\nRoute: " + routeProblem + "\nStatus: " + strconv.Itoa(statusCode) + "\nBody: " + responseBody + "Time of Incident: " + date,
		}

		err := ms.Send(mail)

		if err != nil {
			fmt.Println("\nThere was an error in sending\n")
		}
	}
}
