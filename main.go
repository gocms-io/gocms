package main

import (
	_ "github.com/joho/godotenv/autoload"
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/context"
	"github.com/menklab/goCMS/controllers"
	"github.com/menklab/goCMS/database"
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/services"
	"log"
)

var app *Engine

type Engine struct {
	Gin               *gin.Engine
	ControllersGroup  *goCMS_controllers.ControllersGroup
	ServicesGroup     *goCMS_services.ServicesGroup
	RepositoriesGroup *goCMS_repositories.RepositoriesGroup
	Database          *goCMS_database.Database
}

func Default() *Engine {

	// init config environment vars
	goCMS_context.Init()

	// setup database
	db := goCMS_database.Default()

	// migrate cms db
	db.MigrateCMSSql()

	// start gin with defaults
	r := gin.Default()

	// setup repositories
	rg := goCMS_repositories.DefaultRepositoriesGroup(db)

	// setup services
	sg := goCMS_services.DefaultServicesGroup(rg)

	// setup controllers
	cg := goCMS_controllers.DefaultControllerGroup(r, sg)

	// create engine
	engine := Engine{
		Gin:               r,
		ControllersGroup:  cg,
		ServicesGroup:     sg,
		RepositoriesGroup: rg,
		Database:          db,
	}
	return &engine
}

func (engine *Engine) Listen(uri string) {

	err := engine.Gin.Run(uri)
	log.Println(err.Error())

}

func main() {
	app = Default()

	// start server and listen
	port := goCMS_context.Config.Port

	if port == "" {
		port = "8080"
	}

	app.Listen(":" + port)
}


