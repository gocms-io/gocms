package repositories

import "github.com/menklab/goCMS/database"

type RepositoriesGroup struct {
	UsersRepository IUserRepository
	SecureCodeRepository ISecureCodeRepository
	PermissionsRepository IPermissionsRepository
}

func DefaultRepositoriesGroup(db *database.Database) *RepositoriesGroup {

	// setup repositories
	rg := &RepositoriesGroup{
		UsersRepository: DefaultUserRepository(db),
		SecureCodeRepository: DefaultSecureCodeRepository(db),
		PermissionsRepository: DefaultPermissionsRepository(db),
	}
	return rg
}