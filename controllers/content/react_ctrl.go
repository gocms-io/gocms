package content_ctrl

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/services"
	"html/template"
	"net/http"
)

type ReactController struct {
	routes       *routes.Routes
	serviceGroup *services.ServicesGroup
}

type ActivePluginDisplay struct {
	Ids      string
	AdminIds string
	Scripts  []string
	Styles   []string
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

	activePlugins := rc.getActivePlugins(false)

	c.HTML(http.StatusOK, "react.tmpl", gin.H{
		"Theme":                context.Config.ActiveTheme,
		"AssetBase":            context.Config.ActiveThemeAssetsBase,
		"LoginTitle":           context.Config.LoginTitle,
		"LoginSuccessRedirect": context.Config.LoginSuccessRedirect,
		"Admin":                false,
		"PluginScripts":        activePlugins.Scripts,
		"PluginStyles":         activePlugins.Styles,
		"ActivePlugins":        activePlugins.Ids,
	})
}

func (rc *ReactController) serveReactAdmin(c *gin.Context) {

	activePlugins := rc.getActivePlugins(true)

	c.HTML(http.StatusOK, "react.tmpl", gin.H{
		"Theme":                context.Config.ActiveTheme,
		"AssetBase":            context.Config.ActiveThemeAssetsBase,
		"LoginTitle":           context.Config.LoginTitle,
		"LoginSuccessRedirect": context.Config.LoginSuccessRedirect,
		"Admin":                true,
		"PluginScripts":        activePlugins.Scripts,
		"PluginStyles":         activePlugins.Styles,
		"ActivePlugins":        template.JS(activePlugins.Ids),
		"ActiveAdminPlugins":   template.JS(activePlugins.AdminIds),
	})
}

func (rc *ReactController) getActivePlugins(loadAdmin bool) *ActivePluginDisplay {
	activePlugins := rc.serviceGroup.PluginsService.GetActivePlugins()

	var pluginIds string
	var pluginAdminIds string
	var adminVendorScripts []string
	var adminScripts []string
	var adminStyles []string
	var publicVendorScripts []string
	var publicScripts []string
	var publicStyles []string

	for _, plugin := range activePlugins {

		// if we are loading the admin we should inject it
		if loadAdmin {
			if plugin.Manifest.Interface.AdminVendor != "" {
				adminVendorScripts = append(adminVendorScripts, fmt.Sprintf("/content/%v/%v", plugin.Manifest.Id, plugin.Manifest.Interface.AdminVendor))
			}
			if plugin.Manifest.Interface.Admin != "" {
				adminScripts = append(adminScripts, fmt.Sprintf("/content/%v/%v", plugin.Manifest.Id, plugin.Manifest.Interface.Admin))
			}
			// if we have admin scripts add id to admin ids
			if plugin.Manifest.Interface.AdminVendor != "" || plugin.Manifest.Interface.Admin != "" {
				pluginAdminIds = fmt.Sprintf("%v,%v", pluginAdminIds, plugin.Manifest.Id)
			}
			if plugin.Manifest.Interface.AdminStyle != "" {
				adminStyles = append(adminStyles, fmt.Sprintf("/content/%v/%v", plugin.Manifest.Id, plugin.Manifest.Interface.AdminStyle))
			}
		}

		// load normal
		if plugin.Manifest.Interface.PublicVendor != "" {
			publicVendorScripts = append(publicVendorScripts, fmt.Sprintf("/content/%v/%v", plugin.Manifest.Id, plugin.Manifest.Interface.PublicVendor))
		}
		if plugin.Manifest.Interface.Public != "" {
			publicScripts = append(publicScripts, fmt.Sprintf("/content/%v/%v", plugin.Manifest.Id, plugin.Manifest.Interface.Public))
		}
		// if we have normal plugin scripts add id to ids
		if plugin.Manifest.Interface.PublicVendor != "" || plugin.Manifest.Interface.Public != "" {
			pluginIds = fmt.Sprintf("%v,%v", pluginIds, plugin.Manifest.Id)
		}
		if plugin.Manifest.Interface.PublicStyle != "" {
			fmt.Printf("adding style: %v\n", publicStyles)
			publicStyles = append(publicStyles, fmt.Sprintf("/content/%v/%v", plugin.Manifest.Id, plugin.Manifest.Interface.PublicStyle))
		}
	}

	apd := new(ActivePluginDisplay)

	// add scripts
	apd.Scripts = append(apd.Scripts, adminVendorScripts...)
	apd.Scripts = append(apd.Scripts, adminScripts...)
	apd.Scripts = append(apd.Scripts, publicVendorScripts...)
	apd.Scripts = append(apd.Scripts, publicScripts...)

	// add styles
	apd.Styles = append(apd.Styles, adminStyles...)
	apd.Styles = append(apd.Styles, publicStyles...)

	// add plugin ids
	apd.AdminIds = fmt.Sprintf("[\"%v\"]", pluginAdminIds[1:])
	apd.Ids = fmt.Sprintf("[\"%v\"]", pluginIds[1:])

	return apd
}
