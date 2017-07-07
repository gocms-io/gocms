package services

import (
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/repositories"
	"github.com/gocms-io/gocms/services/plugin_services"
	"log"
	"time"
)

type ServicesGroup struct {
	SettingsService ISettingsService
	MailService     IMailService
	AuthService     IAuthService
	UserService     IUserService
	AclService      IAclService
	EmailService    IEmailService
	PluginsService  plugin_services.IPluginsService
}

func DefaultServicesGroup(rg *repositories.RepositoriesGroup) *ServicesGroup {

	// setup settings
	settingsService := DefaultSettingsService(rg)
	settingsService.RegisterRefreshCallback(context.Config.ApplySettingsToConfig)

	// refresh settings every x minutes
	refreshSettings := time.Duration(context.Config.SettingsRefreshRate) * time.Minute
	context.Schedule.AddTicker(refreshSettings, func() {
		settingsService.RefreshSettingsCache()
	})

	// mail service
	mailService := DefaultMailService()

	// start permissions cache
	aclService := DefaultAclService(rg)
	aclService.RefreshPermissionsCache()

	authService := DefaultAuthService(rg, mailService)
	userService := DefaultUserService(rg, authService, mailService)

	// email service
	emailService := DefaultEmailService(rg, mailService, authService)

	// plugins service
	pluginsService := plugin_services.DefaultPluginsService(rg)
	err := pluginsService.RefreshInstalledPlugins()
	if err != nil {
		log.Printf("Error finding plugins. Can't start plugin microservice: %s\n", err.Error())
	} else {
		pluginsService.StartActivePlugins()
	}

	sg := &ServicesGroup{
		SettingsService: settingsService,
		MailService:     mailService,
		AuthService:     authService,
		UserService:     userService,
		AclService:      aclService,
		EmailService:    emailService,
		PluginsService:  pluginsService,
	}

	return sg
}
