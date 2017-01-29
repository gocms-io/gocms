package services

import (
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/models"
	"log"
	"time"
)

type ISettingsService interface {
	RefreshSettingsCache() error
	GetSettings() map[string]models.Setting
}

type SettingsService struct {
	LastRefresh       time.Time
	SettingsCache     map[string]models.Setting
	RepositoriesGroup *repositories.RepositoriesGroup
}

func DefaultSettingsService(rg *repositories.RepositoriesGroup) *SettingsService {
	settingsService := &SettingsService{
		RepositoriesGroup: rg,
	}

	if err := settingsService.RefreshSettingsCache(); err != nil {
		log.Fatalf("Error getting db settings: %s\n", err.Error())
	}
	return settingsService

}

func (ss *SettingsService) RefreshSettingsCache() error {

	// get all permissions
	settings, err := ss.RepositoriesGroup.SettingsRepository.GetAll()
	if err != nil {
		log.Fatalf("Fatal - Error caching permissions: %s\n", err.Error())
		return err
	}

	settingsCache := make(map[string]models.Setting, len(*settings))
	// cache permissions
	for _, setting := range *settings {
		settingsCache[setting.Name] = setting
	}

	ss.SettingsCache = settingsCache
	return nil
}

func (ss *SettingsService) GetSettings() map[string]models.Setting {
	return ss.SettingsCache
}
