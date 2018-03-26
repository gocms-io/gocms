package migrations

import "github.com/rubenv/sql-migrate"

func AddDocumentationToggle() *migrate.Migration {
	migrateToRSAKeys := migrate.Migration{
		Id: "6",
		Up: []string{`
			INSERT INTO cqlw.gocms_settings (name, value, description) VALUES ('DOCUMENTATION', 'TRUE', 'Display documentation at /docs.  Boolean. ');
			`,
		},
		Down: []string{
		},
	}

	return &migrateToRSAKeys
}
