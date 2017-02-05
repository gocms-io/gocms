package goCMS_static_ctrl

import "github.com/menklab/goCMS/routes"

type DocumentationController struct {
	routes *goCMS_routes.ApiRoutes
}

func DefaultDocumentationController(routes *goCMS_routes.ApiRoutes) *DocumentationController{
	dc := &DocumentationController{
		routes: routes,
	}

	dc.Default()
	return dc
}

func (dc *DocumentationController) Default() {
	dc.routes.Root.Static("/docs", "./docs")
}
