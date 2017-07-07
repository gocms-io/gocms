package content_ctrl

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/services"
	"net/http"
)

type DocumentationController struct {
	serviceGroup *services.ServicesGroup
	routes       *routes.Routes
}

func DefaultDocumentationController(routes *routes.Routes, sg *services.ServicesGroup) *DocumentationController {
	dc := &DocumentationController{
		serviceGroup: sg,
		routes:       routes,
	}

	dc.Default()
	return dc
}

func (dc *DocumentationController) Default() {
	// register goCMS Docs Route
	dc.routes.Root.Static("/docs/gocms", "./content/docs")
	docsMap := make(map[string]string)

	// build map for docs page render
	for _, plugin := range dc.serviceGroup.PluginsService.GetActivePlugins() {
		link := fmt.Sprintf("docs/%s", plugin.Manifest.Id)
		docsMap[plugin.Manifest.Name] = link
	}

	docsMap["GoCMS"] = "/docs/gocms"

	dc.routes.Root.GET("/docs", func(c *gin.Context) {
		c.HTML(http.StatusOK, "docs.tmpl", docsMap)
	})

}
