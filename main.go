package main

import (
	"flag"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/init/controller"
	"github.com/gocms-io/gocms/init/database"
	"github.com/gocms-io/gocms/init/repository"
	"github.com/gocms-io/gocms/init/service"
	"github.com/gocms-io/gocms/utility/log"
	_ "github.com/joho/godotenv/autoload"
	"net/http"
	"os"
)

var app *Engine

type Engine struct {
	Gin               *gin.Engine
	ControllersGroup  *controller.ControllersGroup
	ServicesGroup     *service.ServicesGroup
	RepositoriesGroup *repository.RepositoriesGroup
	Database          *database.Database
}

// todo write an optimizer for requirejs

//go:generate apidoc -c ./ -i ./models -i ./controllers/ -o ./content/docs/ -f ".*\\.go$" -f ".*\\.js$"
func Default() *Engine {

	// init config environment vars
	context.Init()

	// setup database
	db := database.DefaultSQL()

	// migrate cms db
	db.SQL.MigrateSql()

	// setup log level
	switch context.Config.EnvVars.LogLevel {
	case log.LOG_LEVEL_CRITICAL:
		fallthrough
	case log.LOG_LEVEL_ERROR:
		gin.SetMode(gin.ReleaseMode)
	case log.LOG_LEVEL_WARNING:
		gin.SetMode(gin.TestMode)
	case log.LOG_LEVEL_DEBUG:
		gin.SetMode(gin.DebugMode)
	}
	r := gin.Default()

	// setup repositories
	rg := repository.DefaultRepositoriesGroup(db.SQL.Dbx)

	// setup services
	sg := service.DefaultServicesGroup(rg)

	// setup controllers
	cg := controller.DefaultControllerGroup(r, sg)

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

	log.Infof("Listening on: %v\n", uri)
	err := http.ListenAndServe(uri, engine.Gin)
	log.Debugf(err.Error())

}

func main() {

	// startup defaults
	app = Default()

	// start server and listen
	port := context.Config.DbVars.Port

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
