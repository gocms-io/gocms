package static_ctrl

import "github.com/menklab/goCMS/routes"

type DocumentationController struct {
	routes *routes.Routes
}

func DefaultDocumentationController(routes *routes.Routes) *DocumentationController {
	dc := &DocumentationController{
		routes: routes,
	}

	dc.Default()
	return dc
}

func (dc *DocumentationController) Default() {
	dc.routes.Root.Static("/docs", "./docs")
}
