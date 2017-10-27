package repository

import (
	"github.com/gocms-io/gocms/domain/access_control_layer/permission_repository"
	"github.com/gocms-io/gocms/domain/email/email_respository"
	"github.com/gocms-io/gocms/domain/plugin/plugin_repository"
	"github.com/gocms-io/gocms/domain/runtime/runtime_repository"
	"github.com/gocms-io/gocms/domain/secure_code/secure_code_repository"
	"github.com/gocms-io/gocms/domain/setting/setting_repository"
	"github.com/gocms-io/gocms/domain/user/user_repository"
	"github.com/jmoiron/sqlx"
)

type RepositoriesGroup struct {
	RuntimeRepository     runtime_repository.IRuntimeRepository
	SettingsRepository    setting_repository.ISettingsRepository
	UsersRepository       user_repository.IUserRepository
	EmailRepository       email_respository.IEmailRepository
	SecureCodeRepository  secure_code_repository.ISecureCodeRepository
	PermissionsRepository permission_repository.IPermissionsRepository
	PluginRepository      plugin_repository.IPluginRepository
	dbx                   *sqlx.DB
}

func DefaultRepositoriesGroup(dbx *sqlx.DB) *RepositoriesGroup {

	// setup repositories
	rg := &RepositoriesGroup{
		dbx:                   dbx,
		SettingsRepository:    setting_repository.DefaultSettingsRepository(dbx),
		RuntimeRepository:     runtime_repository.DefaultRuntimeRepository(dbx),
		UsersRepository:       user_repository.DefaultUserRepository(dbx),
		EmailRepository:       email_respository.DefaultEmailRepository(dbx),
		SecureCodeRepository:  secure_code_repository.DefaultSecureCodeRepository(dbx),
		PermissionsRepository: permission_repository.DefaultPermissionsRepository(dbx),
		PluginRepository:      plugin_repository.DefaultPluginRepository(dbx),
	}
	return rg
}
