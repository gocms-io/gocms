package static_ctrl

import (
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
	"fmt"
)

type DocumentationController struct {
	serviceGroup *services.ServicesGroup
	routes *routes.Routes
}

func DefaultDocumentationController(routes *routes.Routes, sg *services.ServicesGroup) *DocumentationController {
	dc := &DocumentationController{
		serviceGroup: sg,
		routes: routes,
	}

	dc.Default()
	return dc
}

func (dc *DocumentationController) Default() {
	dc.routes.Root.Static("/goCMS/docs", "./docs")

	for _, plugin := range dc.serviceGroup.PluginsService.GetActivePlugins() {
		dc.routes.Root.Static(fmt.Sprintf("%s/docs",plugin.Manifest.Bin), fmt.Sprintf("./plugins/%s/docs", plugin.Manifest.Bin))
	}
}
