package setting_service

import (
	"github.com/gocms-io/gocms/domain/setting/setting_model"
	"github.com/gocms-io/gocms/init/repository"
	"github.com/gocms-io/gocms/utility/log"
	"time"
)

type ISettingsService interface {
	RefreshSettingsCache() error
	GetSettings() map[string]setting_model.Setting
	RegisterRefreshCallback(func(map[string]setting_model.Setting))
	GetByName(string) (*setting_model.Setting, error)
}

type SettingsService struct {
	LastRefresh        time.Time
	SettingsCache      map[string]setting_model.Setting
	RepositoriesGroup  *repository.RepositoriesGroup
	OnRefreshCallbacks []func(map[string]setting_model.Setting)
}

func DefaultSettingsService(repositoriesGroup *repository.RepositoriesGroup) *SettingsService {

	settingsService := &SettingsService{
		RepositoriesGroup: repositoriesGroup,
	}

	return settingsService

}

func (ss *SettingsService) RegisterRefreshCallback(cb func(map[string]setting_model.Setting)) {

	cbs := append(ss.OnRefreshCallbacks, cb)
	ss.OnRefreshCallbacks = cbs

	if err := ss.RefreshSettingsCache(); err != nil {
		log.Warningf("Error getting db settings: %s\n", err.Error())
	}

}

func (ss *SettingsService) RefreshSettingsCache() error {

	// get all permissions
	settings, err := ss.RepositoriesGroup.SettingsRepository.GetAll()
	if err != nil {
		log.Warningf("Error caching permissions: %s\n", err.Error())
		return err
	}

	settingsCache := make(map[string]setting_model.Setting, len(*settings))
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

func (ss *SettingsService) GetSettings() map[string]setting_model.Setting {
	return ss.SettingsCache
}

func (ss *SettingsService) GetByName(name string) (*setting_model.Setting, error) {
	return ss.RepositoriesGroup.SettingsRepository.GetByName(name)
}
