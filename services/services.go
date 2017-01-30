package services

import (
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/context"
	"time"
)

type ServicesGroup struct {
	SettingsService ISettingsService
	MailService     IMailService
	AuthService     IAuthService
	UserService     IUserService
	AclService      IAclService
	EmailService    IEmailService
}

func DefaultServicesGroup(rg *repositories.RepositoriesGroup) *ServicesGroup {

	// setup settings
	settingsService := DefaultSettingsService(rg, context.Config.ApplySettingsToConfig)
	// refresh settings every x minutes
	refreshSettings := time.Duration(context.Config.SettingsRefreshRate) * time.Minute
	context.Schedule.AddTicker(refreshSettings, func() {
		settingsService.RefreshSettingsCache()
		context.Config.ApplySettingsToConfig(settingsService.GetSettings())
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

	sg := &ServicesGroup{
		SettingsService: settingsService,
		MailService: mailService,
		AuthService: authService,
		UserService: userService,
		AclService: aclService,
		EmailService: emailService,
	}
	return sg
}