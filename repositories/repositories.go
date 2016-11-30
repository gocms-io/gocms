package repositories

type RepositoriesGroup struct {
	UsersRepository IUserRepository
	SecureCodeRepository ISecureCodeRepository
}

func DefaultRepositoriesGroup() *RepositoriesGroup {

	// setup repositories
	rg := &RepositoriesGroup{
		UsersRepository: DefaultUserRepository(),
		SecureCodeRepository: DefaultSecureCodeRepository(),
	}
	return rg
}