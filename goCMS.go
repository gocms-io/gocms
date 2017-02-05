package goCMS


import (
	"github.com/gin-gonic/gin"
	"log"
	"github.com/menklab/goCMS/controllers"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/database"
	"github.com/menklab/goCMS/context"
	"github.com/menklab/goCMS/repositories"
)

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
	db.MigrateCMS()

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
		Gin: r,
		ControllersGroup: cg,
		ServicesGroup: sg,
		RepositoriesGroup: rg,
		Database: db,
	}
	return &engine
}

func (engine *Engine) Listen(uri string) {

	err := engine.Gin.Run(uri)
	log.Println(err.Error())

}
