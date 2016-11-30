package goCMS

import (
	"github.com/gin-gonic/gin"
	"log"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/controllers"
	"github.com/menklab/goCMS/repositories"
)



type Engine struct {
	Gin *gin.Engine
	ControllersGroup *controllers.ControllersGroup
	ServicesGroup *services.ServicesGroup
	RepositoriesGroup *repositories.RepositoriesGroup
}


func Default() *Engine{

	// start gin with defaults
	r := gin.Default()

	// setup repositories
	rg := repositories.DefaultRepositoriesGroup()

	// setup services
	sg := services.DefaultServicesGroup(rg)

	// setup controllers
	cg := controllers.DefaultControllerGroup(r, sg)

	// create engine
	engine := Engine{
		Gin: r,
		ControllersGroup: cg,
		ServicesGroup: sg,
		RepositoriesGroup: rg,
	}
	return &engine
}


func (engine *Engine) Listen(uri string) {
	err := engine.Gin.Run(uri)
	log.Println(err.Error())
}
