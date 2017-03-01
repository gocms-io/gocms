package static_ctrl

import (
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

type DocumentationController struct {
	serviceGroup *services.ServicesGroup
	routes       *routes.Routes
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
	// register goCMS Docs Route
	dc.routes.Root.Static("/goCMS/docs", "./docs")
	docsMap := make(map[string]string)

	// register plugins route
	for _, plugin := range dc.serviceGroup.PluginsService.GetActivePlugins() {
		name := plugin.Manifest.Name
		link := fmt.Sprintf("%s/docs", plugin.Manifest.Bin)
		docsMap[name] = link
		dc.routes.Root.Static(fmt.Sprintf("%s/docs", plugin.Manifest.Bin), fmt.Sprintf("./plugins/%s/docs", plugin.Manifest.Bin))
	}

	docsMap["GoCMS"] = "/goCMS/docs"

	dc.routes.Root.GET("/docs", func(c *gin.Context) {
		c.HTML(http.StatusOK, "docs.tmpl", docsMap)
	})

}
