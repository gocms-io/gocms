package service

import (
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/domain/plugin/plugin_services"
	"log"
	"time"
	"github.com/gocms-io/gocms/domain/setting/setting_service"
	"github.com/gocms-io/gocms/init/repository"
	"github.com/gocms-io/gocms/domain/mail/mail_service"
)

type ServicesGroup struct {
	SettingsService setting_service.ISettingsService
	MailService     mail_service.IMailService
	AuthService     IAuthService
	UserService     IUserService
	AclService      IAclService
	EmailService    IEmailService
	PluginsService  plugin_services.IPluginsService
}

func DefaultServicesGroup(repositoriesGroup *repository.RepositoriesGroup) *ServicesGroup {

	// setup settings
	settingsService := setting_service.DefaultSettingsService(repositoriesGroup)
	settingsService.RegisterRefreshCallback(context.Config.DbVars.LoadDbVars)

	// refresh settings every x minutes
	refreshSettings := time.Duration(context.Config.DbVars.SettingsRefreshRate) * time.Minute
	context.Schedule.AddTicker(refreshSettings, func() {
		settingsService.RefreshSettingsCache()
	})

	// mail service
	mailService := mail_service.DefaultMailService()

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
