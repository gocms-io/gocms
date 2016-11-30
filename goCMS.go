package goCMS

import (
	"github.com/gin-gonic/gin"
	"log"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/controllers"
)



type Engine struct {
	Gin *gin.Engine
	ControllersGroup *controllers.ControllersGroup
	ServicesGroup *services.ServicesGroup
}


func Default() *Engine{

	// start gin with defaults
	r := gin.Default()

	// setup services
	sg := &services.ServicesGroup{
		AuthService: new(services.AuthService),
		UserService: new(services.UserService),
	}

	// setup controllers
	cg := controllers.DefaultControllerGroup(r, sg)

	// create engine
	engine := Engine{
		Gin: r,
		ControllersGroup: cg,
		ServicesGroup: sg,
	}
	return &engine
}


func (engine *Engine) Listen(uri string) {
	err := engine.Gin.Run(uri)
	log.Println(err.Error())
}
