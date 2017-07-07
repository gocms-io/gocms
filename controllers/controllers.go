package controllers

import (
	"fmt"
	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/controllers/api/admin_ctrl"
	"github.com/gocms-io/gocms/controllers/api/auth_ctrl"
	"github.com/gocms-io/gocms/controllers/api/healthy_ctrl"
	"github.com/gocms-io/gocms/controllers/api/user"
	"github.com/gocms-io/gocms/controllers/content"
	"github.com/gocms-io/gocms/controllers/middleware/cors"
	"github.com/gocms-io/gocms/controllers/middleware/uuid"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/services"
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
	sg.PluginsService.RegisterActivePluginRoutes(routes)

	return controllersGroup
}

func createMyRender() multitemplate.Render {
	r := multitemplate.New()
	r.AddFromGlob("docs.tmpl", "./content/templates/docs.tmpl")
	r.AddFromFiles("react.tmpl", "./content/templates/react.tmpl",
		fmt.Sprintf("./content/themes/%v/theme_header.tmpl", context.Config.ActiveTheme),
		fmt.Sprintf("./content/themes/%v/theme_body.tmpl", context.Config.ActiveTheme),
		fmt.Sprintf("./content/themes/%v/theme_footer.tmpl", context.Config.ActiveTheme),
	)
	return r
}
