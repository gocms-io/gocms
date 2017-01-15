package services

import (
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/config"
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
	settingsService := DefaultSettingsService(rg)
	settingsService.RefreshSettingsCache()
	config.SetSettingsFromDb(settingsService.GetSettings())

	// mail service
	mailService := DefaultMailService()

	// email service
	emailService := DefaultEmailService(rg)

	// start permissions cache
	aclService := DefaultAclService(rg)
	aclService.RefreshPermissionsCache()

	authService := DefaultAuthService(rg, mailService)
	userService := DefaultUserService(rg, authService, mailService)

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