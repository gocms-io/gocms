package content_ctrl

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
	"net/http"
)

type TemplatesController struct {
	serviceGroup *services.ServicesGroup
	routes       *routes.Routes
}

func DefaultTemplatesController(routes *routes.Routes, sg *services.ServicesGroup) *TemplatesController {
	dt := &TemplatesController{
		serviceGroup: sg,
		routes:       routes,
	}

	dt.Default()
	return dt
}

func (tc *TemplatesController) Default() {

	tc.routes.Root.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "site.tmpl", nil)
	})

}
