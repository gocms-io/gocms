package controllers

import (
	"github.com/gin-gonic/gin"
	"log"
	"bitbucket.org/menklab/grnow-services/controllers/routes"
	"bitbucket.org/menklab/grnow-services/controllers/api/middleware"
	"bitbucket.org/menklab/grnow-services/controllers/api"
)

var (
	r *gin.Engine
)

func init() {
	// start gin with defaults
	r = gin.Default()        // init gin

	// setup routes
	routes := routes.Routes()
	routes.Public = r.Group("/api")
	routes.Auth = r.Group("/api")


	// init authentication mdl

	authMdl := new(middleware.AuthMiddleware)

	// require logged in user for admin
	routes.Auth.Use(authMdl.RequireAuthenticatedUser())

	//rest API controllers
	new(api.AuthController).Apply()
	new(api.HealthyController).Apply()

	//new(controllers.UserController).Init(routes)

}


func Listen(uri string) {
	err := r.Run(uri)
	log.Println(err.Error())
}
