package repositories

import "github.com/menklab/goCMS/database"

type RepositoriesGroup struct {
	RuntimeRepository     IRuntimeRepository
	SettingsRepository    ISettingsRepository
	UsersRepository       IUserRepository
	EmailRepository       IEmailRepository
	SecureCodeRepository  ISecureCodeRepository
	PermissionsRepository IPermissionsRepository
}

func DefaultRepositoriesGroup(db *database.Database) *RepositoriesGroup {

	// setup repositories
	rg := &RepositoriesGroup{
		RuntimeRepository:     DefaultRuntimeRepository(db.SQL.Dbx),
		SettingsRepository:    DefaultSettingsRepository(db.SQL.Dbx),
		UsersRepository:       DefaultUserRepository(db.SQL.Dbx),
		EmailRepository:       DefaultEmailRepository(db.SQL.Dbx),
		SecureCodeRepository:  DefaultSecureCodeRepository(db.SQL.Dbx),
		PermissionsRepository: DefaultPermissionsRepository(db.SQL.Dbx),
	}
	return rg
}
