package services

import (
	"github.com/menklab/goCMS/repositories"
)

type ServicesGroup struct {
	MailService IMailService
	AuthService IAuthService
	UserService IUserService
	AclService  IAclService
}

func DefaultServicesGroup(rg *repositories.RepositoriesGroup) *ServicesGroup {

	// setup services

	mailService := DefaultMailService()
	aclService := DefaultAclService(rg)
	authService := DefaultAuthService(rg, mailService)
	userService := DefaultUserService(rg, authService, mailService)

	sg := &ServicesGroup{
		MailService: mailService,
		AuthService: authService,
		UserService: userService,
		AclService: aclService,
	}

	// cache permissions
	sg.AclService.RefreshPermissionsCache()

	return sg
}