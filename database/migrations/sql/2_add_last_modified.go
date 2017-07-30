package sql_migrations

import "github.com/rubenv/sql-migrate"

func AddLastModified() *migrate.Migration {
	add_last_modified := migrate.Migration{
		Id: "2",
		Up: []string{`
			ALTER TABLE gocms_users
			ADD COLUMN lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created;
			`, `
			ALTER TABLE gocms_emails
			ADD COLUMN lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created;
			`, `
			ALTER TABLE gocms_permissions
			ADD COLUMN lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created;
			`, `
			ALTER TABLE gocms_settings
			ADD COLUMN lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created;
			`, `
			ALTER TABLE gocms_runtime
			ADD COLUMN lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created;
			`, `
			ALTER TABLE gocms_users_to_permissions
			ADD COLUMN lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created;
			`, `
			ALTER TABLE gocms_plugins
			ADD COLUMN lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created;
			`,
		},
		Down: []string{`
			ALTER TABLE gocms_users
			DROP COLUMN lastModified
			`, `
			ALTER TABLE gocms_emails
			DROP COLUMN lastModified
			`, `
			ALTER TABLE gocms_permissions
			DROP COLUMN lastModified
			`, `
			ALTER TABLE gocms_settings
			DROP COLUMN lastModified
			`, `
			ALTER TABLE gocms_runtime
			DROP COLUMN lastModified
			`, `
			ALTER TABLE gocms_users_to_permissions
			DROP COLUMN lastModified
			`, `
			ALTER TABLE gocms_plugins
			DROP COLUMN lastModified
			`,
		},
	}

	return &add_last_modified
}
