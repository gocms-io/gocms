package controllers

import (
	"fmt"
	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/context"
	"github.com/menklab/goCMS/controllers/api/admin_ctrl"
	"github.com/menklab/goCMS/controllers/api/auth_ctrl"
	"github.com/menklab/goCMS/controllers/api/healthy_ctrl"
	"github.com/menklab/goCMS/controllers/api/user"
	"github.com/menklab/goCMS/controllers/content"
	"github.com/menklab/goCMS/controllers/middleware/cors"
	"github.com/menklab/goCMS/controllers/middleware/uuid"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/services"
)

type ControllersGroup struct {
	Routes             *routes.Routes
	ApiControllers     *ApiControllers
	ContentControllers *ContentControllers
}

type ContentControllers struct {
	DocumentationController *content_ctrl.DocumentationController
	TemplateControllers     *content_ctrl.TemplatesController
	ThemesControllers       *content_ctrl.ThemesController
	ReactControllers        *content_ctrl.ReactController
}

type ApiControllers struct {
	AuthController      *auth_ctrl.AuthController
	HealthyController   *healthy_ctrl.HealthyController
	AdminUserController *admin_ctrl.AdminUserController
	UserController      *user_ctrl.UserController
}

var (
	defaultRoutePrefix = "/api"
)

func DefaultControllerGroup(r *gin.Engine, sg *services.ServicesGroup) *ControllersGroup {

	// top level middleware
	r.Use(uuidMdl.UUID())
	r.Use(aclMdl.CORS())

	//r.LoadHTMLGlob("./content/templates/*.tmpl")
	r.HTMLRender = createMyRender()
	// setup route groups
	routes := &routes.Routes{
		Root:    r.Group("/"),
		Public:  r.Group(defaultRoutePrefix),
		Auth:    r.Group(defaultRoutePrefix),
		NoRoute: r.NoRoute,
	}
	// define routes and apply middleware
	apiControllers := &ApiControllers{
		AuthController:      auth_ctrl.DefaultAuthController(routes, sg),
		AdminUserController: admin_ctrl.DefaultAdminUserController(routes, sg),
		HealthyController:   healthy_ctrl.DefaultHealthyController(routes),
		UserController:      user_ctrl.DefaultUserController(routes, sg),
	}

	// define after for 404 catcher
	contentControllers := &ContentControllers{
		DocumentationController: content_ctrl.DefaultDocumentationController(routes, sg),
		ThemesControllers:       content_ctrl.DefaultThemesController(r, routes),
		TemplateControllers:     content_ctrl.DefaultTemplatesController(routes),
		ReactControllers:        content_ctrl.DefaultReactController(routes),
	}

	controllersGroup := &ControllersGroup{
		ApiControllers:     apiControllers,
		ContentControllers: contentControllers,
		Routes:             routes,
	}

	// register plugin routes
	sg.PluginsService.RegisterPluginRoutes(routes)

	return controllersGroup
}

func createMyRender() multitemplate.Render {
	r := multitemplate.New()
	r.AddFromGlob("docs.tmpl", "./templates/docs.tmpl")
	r.AddFromFiles("react.tmpl", "./templates/react.tmpl",
		fmt.Sprintf("./content/themes/%v/theme_header.tmpl", context.Config.ActiveTheme),
		fmt.Sprintf("./content/themes/%v/theme_body.tmpl", context.Config.ActiveTheme),
		fmt.Sprintf("./content/themes/%v/theme_footer.tmpl", context.Config.ActiveTheme),
	)
	return r
}
