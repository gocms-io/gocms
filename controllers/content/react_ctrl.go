package content_ctrl

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/services"
	"net/http"
)

type ReactController struct {
	routes       *routes.Routes
	serviceGroup *services.ServicesGroup
}

type ActivePluginDisplay struct {
	Id           string
	Public       string
	PublicVendor string
}

func DefaultReactController(routes *routes.Routes, sg *services.ServicesGroup) *ReactController {
	rc := &ReactController{
		routes:       routes,
		serviceGroup: sg,
	}

	rc.Default()
	return rc
}

func (rc *ReactController) Default() {
	rc.routes.Root.Static("/gocms", "./content/gocms")
	rc.routes.Root.GET("/admin", rc.serveReactAdmin)
	rc.routes.Root.GET("/login", rc.serveReactAdmin)
	rc.routes.Root.GET("/admin/*adminPath", rc.serveReactAdmin)
	rc.routes.NoRoute(rc.serveReact)
}

func (rc *ReactController) serveReact(c *gin.Context) {

	c.HTML(http.StatusOK, "react.tmpl", gin.H{
		"Theme":         context.Config.ActiveTheme,
		"AssetBase":     context.Config.ActiveThemeAssetsBase,
		"Admin":         false,
		"ActivePlugins": rc.getActivePlugins(),
	})
}

func (rc *ReactController) serveReactAdmin(c *gin.Context) {
	c.HTML(http.StatusOK, "react.tmpl", gin.H{
		"Theme":         context.Config.ActiveTheme,
		"AssetBase":     context.Config.ActiveThemeAssetsBase,
		"Admin":         true,
		"ActivePlugins": rc.getActivePlugins(),
	})
}

func (rc *ReactController) getActivePlugins() []*ActivePluginDisplay {
	activePlugins := rc.serviceGroup.PluginsService.GetActivePlugins()

	var activePluginsDisplay []*ActivePluginDisplay
	for _, plugin := range activePlugins {
		apd := ActivePluginDisplay{
			Id:           plugin.Manifest.Id,
			Public:       fmt.Sprintf("/content/%v/%v", plugin.Manifest.Id, plugin.Manifest.Interface.Public),
			PublicVendor: fmt.Sprintf("/content/%v/%v", plugin.Manifest.Id, plugin.Manifest.Interface.PublicVendor),
		}
		activePluginsDisplay = append(activePluginsDisplay, &apd)
	}

	return activePluginsDisplay

}
