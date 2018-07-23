package template_controller

import (
	"github.com/myanrichal/gocms/routes"
)

type TemplatesController struct {
	routes       *routes.Routes
}

func DefaultTemplatesController(routes *routes.Routes) *TemplatesController {
	dt := &TemplatesController{
		routes:       routes,
	}

	dt.Default()
	return dt
}

func (tc *TemplatesController) Default() {

}
