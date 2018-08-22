package migrations

import "github.com/rubenv/sql-migrate"

func ErrorReportingMigration() *migrate.Migration {
	migrateToRSAKeys := migrate.Migration{
		Id: "7",
		Up: []string{`
			INSERT INTO gocms_settings (name, value, description) VALUES ('ERROR_REPORT_ADDRESS', 'default@gocms.io', 'Specify address to send error reports');`, `
			CREATE TABLE gocms_error_logs (route varchar(255), status varchar(255), body varchar(255), time varchar(255));`, `
			INSERT INTO gocms_error_logs (route, status, body, time) VALUES ('none', 'init', 'initalizes time', '10m');
			`,
		},
		Down: []string{
		},
	}

	return &migrateToRSAKeys
}
