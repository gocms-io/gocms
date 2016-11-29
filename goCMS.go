package goCMS

import (
	"github.com/gin-gonic/gin"
	"log"
	"github.com/menklab/goCMS/api"
	"github.com/menklab/goCMS/services"
)



type Engine struct {
	Gin *gin.Engine
	Api *api.API
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

	a := api.Default(r, sg)

	// create engine
	engine := Engine{
		Gin: r,
		Api: a,
		ServicesGroup: sg,
	}
	return &engine
}


func (engine *Engine) Listen(uri string) {
	err := engine.Gin.Run(uri)
	log.Println(err.Error())
}
