package main

import (
	"flag"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/controllers"
	"github.com/gocms-io/gocms/database"
	"github.com/gocms-io/gocms/repositories"
	"github.com/gocms-io/gocms/services"
	_ "github.com/joho/godotenv/autoload"
	"log"
	"os"
)

var app *Engine

type Engine struct {
	Gin               *gin.Engine
	ControllersGroup  *controllers.ControllersGroup
	ServicesGroup     *services.ServicesGroup
	RepositoriesGroup *repositories.RepositoriesGroup
	Database          *database.Database
}

//go:generate apidoc -c ./ -i ./models -i ./controllers/ -o ./content/docs/ -f ".*\\.go$" -f ".*\\.js$"
func Default() *Engine {

	// init config environment vars
	context.Init()

	// setup database
	db := database.Default()

	// migrate cms db
	db.MigrateCMSSql()

	// start gin with defaults
	r := gin.Default()
	// setup repositories
	rg := repositories.DefaultRepositoriesGroup(db)

	// setup services
	sg := services.DefaultServicesGroup(rg)

	// setup controllers
	cg := controllers.DefaultControllerGroup(r, sg)

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

	// startup defaults
	app = Default()

	// start server and listen
	port := context.Config.Port

	// check if env is set and override
	portEnv := os.Getenv("PORT")
	if portEnv != "" {
		port = portEnv
	}

	// check for port flag and override all
	portFlag := flag.String("port", "", "port to run on. Overrides all.")
	flag.Parse()
	if *portFlag != "" {
		port = *portFlag
	}

	if port == "" {
		port = "8080"
	}

	app.Listen(":" + port)
}
