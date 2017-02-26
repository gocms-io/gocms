package plugin_services

import (
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/models"
	"path/filepath"
	"os"
	"log"
	"io/ioutil"
	"encoding/json"
)

type IPluginsService interface {
	RegisterPlugins() error
}

type PluginsService struct {
	RepositoriesGroup  *repositories.RepositoriesGroup
	Plugins []*models.Plugin
}

func DefaultPluginsService(rg *repositories.RepositoriesGroup) *PluginsService {

	pluginsService := &PluginsService{
		RepositoriesGroup: rg,
	}

	return pluginsService

}

func (ps *PluginsService) RegisterPlugins() error {

	filepath.Walk("./plugins/", ps.visitPlugin)

	return nil
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