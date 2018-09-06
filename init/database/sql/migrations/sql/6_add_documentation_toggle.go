package migrations

import "github.com/rubenv/sql-migrate"

func AddDocumentationToggle() *migrate.Migration {
	migrateToRSAKeys := migrate.Migration{
		Id: "6",
		Up: []string{`
			INSERT INTO gocms_settings (name, value, description) VALUES ('DISABLE_DOCUMENTATION_DISPLAY', 'false', 'Display documentation at /docs.  Boolean. ');
			`,
		},
		Down: []string{
			`DELETE FROM gocms_settings WHERE name='DISABLE_DOCUMENTATION_DISPLAY';`,
		},
	}

	return &migrateToRSAKeys
}
