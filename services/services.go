package services

import "github.com/menklab/goCMS/repositories"

type ServicesGroup struct {
	MailService IMailService
	AuthService IAuthService
	UserService IUserService
}

func DefaultServicesGroup(rg *repositories.RepositoriesGroup) *ServicesGroup {

	// setup services

	mailService := DefaultMailService()
	authService := DefaultAuthService(rg, mailService)
	userService := DefaultUserService(rg, authService, mailService)

	sg := &ServicesGroup{
		MailService: mailService,
		AuthService: authService,
		UserService: userService,
	}

	return sg
}