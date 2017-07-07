package services

import (
	"github.com/gocms-io/gocms/models/runtime_models"
	"github.com/gocms-io/gocms/repositories"
	"log"
	"time"
)

type ISettingsService interface {
	RefreshSettingsCache() error
	GetSettings() map[string]runtime_models.Setting
	RegisterRefreshCallback(func(map[string]runtime_models.Setting))
}

type SettingsService struct {
	LastRefresh        time.Time
	SettingsCache      map[string]runtime_models.Setting
	RepositoriesGroup  *repositories.RepositoriesGroup
	OnRefreshCallbacks []func(map[string]runtime_models.Setting)
}

func DefaultSettingsService(rg *repositories.RepositoriesGroup) *SettingsService {

	settingsService := &SettingsService{
		RepositoriesGroup: rg,
	}

	return settingsService

}

func (ss *SettingsService) RegisterRefreshCallback(cb func(map[string]runtime_models.Setting)) {

	cbs := append(ss.OnRefreshCallbacks, cb)
	ss.OnRefreshCallbacks = cbs

	if err := ss.RefreshSettingsCache(); err != nil {
		log.Fatalf("Error getting db settings: %s\n", err.Error())
	}

}

func (ss *SettingsService) RefreshSettingsCache() error {

	// get all permissions
	settings, err := ss.RepositoriesGroup.SettingsRepository.GetAll()
	if err != nil {
		log.Fatalf("Fatal - Error caching permissions: %s\n", err.Error())
		return err
	}

	settingsCache := make(map[string]runtime_models.Setting, len(*settings))
	// cache permissions
	for _, setting := range *settings {
		settingsCache[setting.Name] = setting
	}

	ss.SettingsCache = settingsCache

	for _, refreshCallback := range ss.OnRefreshCallbacks {
		refreshCallback(ss.SettingsCache)
	}
	return nil
}

func (ss *SettingsService) GetSettings() map[string]runtime_models.Setting {
	return ss.SettingsCache
}
