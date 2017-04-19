package content_ctrl

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/context"
	"github.com/menklab/goCMS/routes"
)

type ThemesController struct {
	r      *gin.Engine
	routes *routes.Routes
}

func DefaultThemesController(r *gin.Engine, routes *routes.Routes) *ThemesController {
	dt := &ThemesController{
		r:      r,
		routes: routes,
	}

	dt.Default()
	return dt
}

func (tc *ThemesController) Default() {
	// register goCMS Docs Route
	tc.routes.Root.Static("/themes", "./content/themes")
	tc.routes.Root.StaticFile("/favicon.ico", "./content/themes/"+context.Config.ActiveTheme+"/img/favicon.ico")
}
