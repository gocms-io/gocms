package migrations

import "github.com/rubenv/sql-migrate"

func AddExternalPlugin() *migrate.Migration {
	addExternalPlugin := migrate.Migration{
		Id: "4",
		Up: []string{`
			ALTER TABLE gocms_plugins ADD isExternal INT(1) DEFAULT '0' NOT NULL AFTER isActive;
			`, `
			ALTER TABLE gocms_plugins ADD manifest BLOB NOT NULL AFTER isExternal;
			`, `
			ALTER TABLE gocms_plugins ADD externalSchema VARCHAR(10) DEFAULT 'http' NOT NULL After isExternal;
			`, `
			ALTER TABLE gocms_plugins ADD externalHost varchar(255) DEFAULT 'localhost' NOT NULL AFTER externalSchema;
			`, `
			ALTER TABLE gocms_plugins ADD externalPort INT DEFAULT '8080' NOT NULL AFTER externalHost;
			`,
		},
		Down: []string{
		},
	}

	return &addExternalPlugin
}
