package content_ctrl

import (
	"github.com/gocms-io/goCMS/routes"
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
