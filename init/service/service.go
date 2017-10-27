package service

import (
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/domain/plugin/plugin_services"
	"log"
	"time"
	"github.com/gocms-io/gocms/domain/setting/setting_service"
	"github.com/gocms-io/gocms/init/repository"
	"github.com/gocms-io/gocms/domain/mail/mail_service"
	"github.com/gocms-io/gocms/domain/user/user_service"
	"github.com/gocms-io/gocms/domain/access_control_layer/acl_service"
	"github.com/gocms-io/gocms/domain/email/email_service"
	"github.com/gocms-io/gocms/domain/access_control_layer/authentication/authentication_service"
)

type ServicesGroup struct {
	SettingsService setting_service.ISettingsService
	MailService     mail_service.IMailService
	AuthService     authentication_service.IAuthService
	UserService     user_service.IUserService
	AclService      acl_service.IAclService
	EmailService    email_service.IEmailService
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
	aclService := acl_service.DefaultAclService(repositoriesGroup)
	aclService.RefreshPermissionsCache()

	authService := authentication_service.DefaultAuthService(repositoriesGroup, mailService)
	userService := user_service.DefaultUserService(repositoriesGroup, authService, mailService)

	// email service
	emailService := email_service.DefaultEmailService(repositoriesGroup, mailService, authService)

	// plugins service
	pluginsService := plugin_services.DefaultPluginsService(repositoriesGroup)
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
