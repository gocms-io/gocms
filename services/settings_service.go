package services

import (
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/repositories"
	"log"
	"time"
)

type ISettingsService interface {
	RefreshSettingsCache() error
	GetSettings() map[string]models.Setting
	RegisterRefreshCallback(func(map[string]models.Setting))
}

type SettingsService struct {
	LastRefresh        time.Time
	SettingsCache      map[string]models.Setting
	RepositoriesGroup  *repositories.RepositoriesGroup
	OnRefreshCallbacks []func(map[string]models.Setting)
}

func DefaultSettingsService(rg *repositories.RepositoriesGroup) *SettingsService {

	settingsService := &SettingsService{
		RepositoriesGroup: rg,
	}

	return settingsService

}

func (ss *SettingsService) RegisterRefreshCallback(cb func(map[string]models.Setting)) {

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

	settingsCache := make(map[string]models.Setting, len(*settings))
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

func (ss *SettingsService) GetSettings() map[string]models.Setting {
	return ss.SettingsCache
}
