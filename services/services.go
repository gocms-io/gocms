package services

import (
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/config"
)

type ServicesGroup struct {
	SettingsService ISettingsService
	MailService IMailService
	AuthService IAuthService
	UserService IUserService
	AclService  IAclService
}

func DefaultServicesGroup(rg *repositories.RepositoriesGroup) *ServicesGroup {

	// setup settings
	settingsService := DefaultSettingsService(rg)
	settingsService.RefreshSettingsCache()
	config.SetSettingsFromDb(settingsService.GetSettings())


	mailService := DefaultMailService()

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
	}

	return sg
}