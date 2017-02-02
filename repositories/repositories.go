package repositories

import "github.com/menklab/goCMS/database"

type RepositoriesGroup struct {
	RuntimeRepository IRuntimeRepository
	SettingsRepository ISettingsRepository
	UsersRepository IUserRepository
	EmailRepository IEmailRepository
	SecureCodeRepository ISecureCodeRepository
	PermissionsRepository IPermissionsRepository
}

func DefaultRepositoriesGroup(db *database.Database) *RepositoriesGroup {

	// setup repositories
	rg := &RepositoriesGroup{
		RuntimeRepository: DefaultRuntimeRepository(db),
		SettingsRepository: DefaultSettingsRepository(db),
		UsersRepository: DefaultUserRepository(db),
		EmailRepository: DefaultEmailRepository(db),
		SecureCodeRepository: DefaultSecureCodeRepository(db),
		PermissionsRepository: DefaultPermissionsRepository(db),
	}
	return rg
}