package plugin_services

import (
	"bufio"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/controllers/middleware/plugins/proxy"
	"github.com/gocms-io/gocms/models"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/utility"
	"github.com/gocms-io/gocms/utility/errors"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

type Plugin struct {
	BinaryPath string
	Host       string
	Port       int64
	Schema     string
	Manifest   *models.PluginManifest
	Proxy      *plugin_proxy_mdl.PluginProxyMiddleware
	cmd        *exec.Cmd
}



type IPluginsService interface {
	FindPlugins() error
	StartPlugins() error
	RegisterPluginRoutes(routes *routes.Routes) error
	GetActivePlugins() []*Plugin
}

type PluginsService struct {
	Plugins []*Plugin
}

func DefaultPluginsService() *PluginsService {

	pluginsService := &PluginsService{}

	return pluginsService

}

func (ps *PluginsService) GetActivePlugins() []*Plugin {


	return ps.Plugins
}



