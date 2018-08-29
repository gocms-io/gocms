package repository

import (
	"github.com/myanrichal/gocms/domain/acl/group/group_repository"
	"github.com/myanrichal/gocms/domain/acl/permissions/permission_repository"
	"github.com/myanrichal/gocms/domain/email/email_respository"
	"github.com/myanrichal/gocms/domain/plugin/plugin_repository"
	"github.com/myanrichal/gocms/domain/runtime/runtime_repository"
	"github.com/myanrichal/gocms/domain/secure_code/secure_code_repository"
	"github.com/myanrichal/gocms/domain/setting/setting_repository"
	"github.com/myanrichal/gocms/domain/user/user_repository"
	"github.com/myanrichal/gocms/domain/logs/log_repository"
	"github.com/jmoiron/sqlx"
)

type RepositoriesGroup struct {
	RuntimeRepository     runtime_repository.IRuntimeRepository
	SettingsRepository    setting_repository.ISettingsRepository
	UsersRepository       user_repository.IUserRepository
	EmailRepository       email_respository.IEmailRepository
	SecureCodeRepository  secure_code_repository.ISecureCodeRepository
	PermissionsRepository permission_repository.IPermissionsRepository
	GroupsRepository      group_repository.IGroupsRepository
	PluginRepository      plugin_repository.IPluginRepository
	LogRepository		  log_repository.ILogRepository
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
		GroupsRepository:      group_repository.DefaultGroupsRepository(dbx),
		PluginRepository:      plugin_repository.DefaultPluginRepository(dbx),
		LogRepository:	 	   log_repository.DefaultLogRepository(dbx),
	}
	return rg
}
