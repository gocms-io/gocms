package static_ctrl

import (
	"github.com/menklab/goCMS/routes"
)


type DocumentationController struct {
	routes *routes.ApiRoutes
}

func DefaultDocumentationController(routes *routes.ApiRoutes) *DocumentationController{
	dc := &DocumentationController{
		routes: routes,
	}

	dc.Default()
	return dc
}

func (dc *DocumentationController) Default() {
	dc.routes.Root.Static("/docs", "./docs")
}
