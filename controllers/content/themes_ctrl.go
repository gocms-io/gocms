package content_ctrl

import (
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
)

type ThemesController struct {
	serviceGroup *services.ServicesGroup
	routes       *routes.Routes
}

func DefaultThemesController(routes *routes.Routes, sg *services.ServicesGroup) *ThemesController {
	dt := &ThemesController{
		serviceGroup: sg,
		routes:       routes,
	}

	dt.Default()
	return dt
}

func (tc *ThemesController) Default() {
	// register goCMS Docs Route
	tc.routes.Root.Static("/themes", "./content/themes")

}
