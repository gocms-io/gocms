package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/controllers/api/admin_ctrl"
	"github.com/menklab/goCMS/controllers/api/auth_ctrl"
	"github.com/menklab/goCMS/controllers/api/healthy_ctrl"
	"github.com/menklab/goCMS/controllers/api/user"
	"github.com/menklab/goCMS/controllers/content"
	"github.com/menklab/goCMS/controllers/middleware/cors"
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
	r.Use(aclMdl.CORS())
	r.LoadHTMLGlob("./content/templates/*.tmpl")

	// setup route groups
	routes := &routes.Routes{
		Root:   r.Group("/"),
		Public: r.Group(defaultRoutePrefix),
		Auth:   r.Group(defaultRoutePrefix),
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
		ThemesControllers:       content_ctrl.DefaultThemesController(routes, sg),
		TemplateControllers:     content_ctrl.DefaultTemplatesController(routes, sg),
	}

	controllersGroup := &ControllersGroup{
		ApiControllers:     apiControllers,
		ContentControllers: contentControllers,
		Routes:             routes,
	}

	// register plugin routes
	sg.PluginsService.RegisterPluginRoutes(routes)

	// add plugin proxy middleware
	//pluginProxy := plugin_proxy_mdl.DefaultPluginProxyMiddleware(sg)
	//r.Use(pluginProxy.ReverseProxyFromMap())

	return controllersGroup
}
