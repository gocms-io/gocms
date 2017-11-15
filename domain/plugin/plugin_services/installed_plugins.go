package plugin_services

import (
	"fmt"
	"github.com/gocms-io/gocms/domain/plugin/plugin_model"
	"github.com/gocms-io/gocms/utility/log"
	"os"
	"path/filepath"
	"runtime"
)

func (ps *PluginsService) RefreshInstalledPlugins() error {

	// find all plugins
	err := filepath.Walk("./content/plugins", ps.visitPlugin)

	if err != nil {
		log.Errorf("Error finding plugins while traversing plugin directory: %s\n", err.Error())
		return err
	}

	return err
}

func (ps *PluginsService) visitPlugin(path string, f os.FileInfo, err error) error {
	if err != nil {
		log.Errorf("Error traversing %s, %s\n", path, err.Error())
	}

	// parse manifests as they are found
	if f.Mode().IsRegular() && f.Name() == "manifest.json" {
		manifest, err := ps.parseManifest(path)
		if err != nil {
			return err
		}

		// verify that there is a main.go file
		pluginRoot, _ := filepath.Split(path)

		// if windows add .exe to the bin
		// if windows add exe
		if runtime.GOOS == "windows" {
			manifest.Services.Bin = fmt.Sprintf("%s.exe", manifest.Services.Bin)
		}

		binaryStat, err := os.Stat(filepath.Join(pluginRoot, manifest.Services.Bin))
		if err != nil {
			log.Errorf("No binary for plugin %s: %s\n", manifest.Name, err.Error())
			return err
		}

		if !binaryStat.Mode().IsRegular() {
			log.Errorf("binary for plugin %s, apprears to be corrupted: %s\n", manifest.Id, err.Error())
			return err
		}

		plugin := plugin_model.Plugin{
			PluginRoot: pluginRoot,
			BinaryFile: manifest.Services.Bin,
			Manifest:   manifest,
		}

		ps.installedPlugins[plugin.Manifest.Id] = &plugin
	}

	return nil
}
