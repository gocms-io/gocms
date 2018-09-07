package migrations

import "github.com/rubenv/sql-migrate"

func ErrorReportingMigration() *migrate.Migration {
	migrateToRSAKeys := migrate.Migration{
		Id: "7",
		Up: []string{`
			INSERT INTO gocms_settings (name, value, description) VALUES ('ERROR_REPORT_ADDRESS', 'default@gocms.io', 'Specify address to send error reports');`, `
			INSERT INTO gocms_settings (name, value, description) VALUES ('ERROR_EMAIL_DELAY', '60', 'Specify the minimum frequency error emails will be sent and recorded. Minutes');`,`
			CREATE TABLE gocms_error_logs (route varchar(255), status varchar(255), body varchar(255), date datetime);
			`,
		},
		Down: []string{
			`DELETE FROM gocms_settings WHERE name='ERROR_REPORT_ADDRESS';`,
			`DELETE FROM gocms_settings WHERE name='ERROR_EMAIL_DELAY';`,
			`DROP TABLE gocms_error_logs;`,
		},
	}

	return &migrateToRSAKeys
}
