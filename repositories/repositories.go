package repositories

import "github.com/menklab/goCMS/database"

type RepositoriesGroup struct {
	UsersRepository IUserRepository
	SecureCodeRepository ISecureCodeRepository
}

func DefaultRepositoriesGroup(db *database.Database) *RepositoriesGroup {

	// setup repositories
	rg := &RepositoriesGroup{
		UsersRepository: DefaultUserRepository(db),
		SecureCodeRepository: DefaultSecureCodeRepository(db),
	}
	return rg
}