package plugin_services

import (
	"bufio"
	"encoding/json"
	_errors "errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/controllers/middleware/plugins/proxy"
	"github.com/gocms-io/gocms/models"
	"github.com/gocms-io/gocms/routes"
	"github.com/gocms-io/gocms/utility/errors"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
)

type Plugin struct {
	BinaryPath string
	Host       string
	Port       int
	Schema     string
	Manifest   *models.PluginManifest
	Proxy      *plugin_proxy_mdl.PluginProxyMiddleware
	cmd        *exec.Cmd
}

type ProxyRoute struct {
	Schema string
	Host   string
	Port   string
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

func (ps *PluginsService) StartPlugins() error {

	var port int
	for _, plugin := range ps.Plugins {

		// build command
		cmd := exec.Command(plugin.BinaryPath, "-port=0")

		// set stdout to pipe
		cmdStdoutReader, err := cmd.StdoutPipe()
		if err != nil {
			fmt.Fprintln(os.Stderr, "Error creating StdoutPipe for Cmd", err)
			return err
		}

		// setup stdout to scan continuously
		stdOutScanner := bufio.NewScanner(cmdStdoutReader)

		// set stderr to pipe
		cmdStderrReader, err := cmd.StderrPipe()
		if err != nil {
			fmt.Fprintln(os.Stderr, "Error creating StdoutPipe for Cmd", err)
			return err
		}

		// setup stderr to scan continuously
		stdErrScanner := bufio.NewScanner(cmdStderrReader)

		// start microservice
		log.Printf("Starting microservice: %s\n", plugin.Manifest.Name)
		err = cmd.Start()
		if err != nil {
			fmt.Fprintln(os.Stderr, "Error starting Cmd", err)
			return err
		}

		// determine which port the pluging in running on by watching stderr
		scanLoop:
		for stdErrScanner.Scan() {
			text := stdErrScanner.Text()
			log.Printf("\t > %s - %s\n", plugin.Manifest.Name, text)
			if len(text) >= 12 && text[:12] == "Listening on" {
				for i := len(text) - 2; i >= 12; i-- {
					if text[i] == ':' {
						port, err = strconv.Atoi(text[i+1:])
						if err != nil {
							return err
						}
						break scanLoop
					}
				}
			}
		}
		if port == 0 {
			log.Println(plugin.Manifest.Name + " exited without indicating a port")
			return _errors.New("No port detected")
		} else {
			log.Printf("Communicating with %s on port %d\n", plugin.Manifest.Name, port)
		}

		go func() {
			for stdOutScanner.Scan() {
				fmt.Printf("\t > %s - %s\n", plugin.Manifest.Name, stdOutScanner.Text())
			}
		}()

		go func() {
			for stdErrScanner.Scan() {
				fmt.Printf("\t > %s - %s\n", plugin.Manifest.Name, stdErrScanner.Text())
			}
		}()

		// add handle to command
		plugin.cmd = cmd

		// create proxy for use during registration
		plugin.Proxy = &plugin_proxy_mdl.PluginProxyMiddleware{
			Port:   port,
			Schema: "http",
			Host:   "localhost",
		}
	}

	return nil

}

func (ps *PluginsService) RegisterPluginRoutes(routes *routes.Routes) error {
	for _, plugin := range ps.Plugins {

		// loop through each manifest and apply each route to the middleware proxy
		for _, routeManifest := range plugin.Manifest.Routes {
			routerGroup, err := ps.getRouteGroup(routeManifest.Route, routes)
			if err != nil {
				log.Printf("Plugin %s -> Route %s -> Method %s, Url %s, Error: %s\n", plugin.Manifest.Name, routeManifest.Route, routeManifest.Method, routeManifest.Url, err.Error())
				return err
			} else {
				ps.registerPluginProxyOnRoute(routerGroup, routeManifest.Method, routeManifest.Url, plugin.Proxy)
			}
		}

		// add plugin docs to docs url
	}
	return nil
}

func (ps *PluginsService) registerPluginProxyOnRoute(route *gin.RouterGroup, method string, url string, pluginProxy *plugin_proxy_mdl.PluginProxyMiddleware) {
	route.Handle(method, url, pluginProxy.ReverseProxy())
}

func (ps *PluginsService) getRouteGroup(pluginRoute string, routes *routes.Routes) (*gin.RouterGroup, error) {
	switch pluginRoute {
	case "Public":
		return routes.Public, nil
	case "PreTwofactor":
		return routes.PreTwofactor, nil
	case "Auth":
		return routes.Auth, nil
	case "Admin":
		return routes.Admin, nil
	case "Root":
		return routes.Root, nil
	default:
		return nil, errors.New(fmt.Sprintf("Route %s doesn't exist.\n", pluginRoute))
	}
}

func (ps *PluginsService) FindPlugins() error {

	// find all plugins
	err := filepath.Walk("./content/plugins", ps.visitPlugin)

	if err != nil {
		log.Printf("Error finding plugins while traversing plugin directory: %s\n", err.Error())
		return err
	}

	return err
}

func (ps *PluginsService) visitPlugin(path string, f os.FileInfo, err error) error {
	if err != nil {
		log.Printf("Error traversing %s, %s\n", path, err.Error())
	}

	// parse manifests as they are found
	if f.Mode().IsRegular() && f.Name() == "manifest.json" {
		manifest, err := ps.parseManifest(path)
		if err != nil {
			return err
		}

		// verify that there is a main.go file
		mainPath, _ := filepath.Split(path)
		mainFilePath := filepath.Join(mainPath, manifest.Bin)

		// if windows add .exe to the path
		if runtime.GOOS == "windows" {
			mainFilePath += ".exe"
		}

		mainFile, err := os.Stat(mainFilePath)
		if err != nil {
			log.Printf("No main file for plugin %s: %s\n", manifest.Name, err.Error())
			return err
		}

		if !mainFile.Mode().IsRegular() {
			log.Printf("Main file for plugin %s, appears to be corrupted: %s\n", manifest.Name, err.Error())
			return err
		}

		plugin := Plugin{
			BinaryPath: mainFilePath,
			Manifest:   manifest,
		}

		ps.Plugins = append(ps.Plugins, &plugin)
	}

	return nil
}

func (ps *PluginsService) parseManifest(fileUri string) (*models.PluginManifest, error) {
	var manifest models.PluginManifest

	// read file in
	raw, err := ioutil.ReadFile(fileUri)
	if err != nil {
		log.Printf("Error reading raw plugin manifest file %s: %s\n", fileUri, err.Error())
		return nil, err
	}

	err = json.Unmarshal(raw, &manifest)
	if err != nil {
		log.Printf("Error parsing manifest file %s: %s\n", fileUri, err.Error())
		return nil, err
	}

	return &manifest, nil
}
