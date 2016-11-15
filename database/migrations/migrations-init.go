package migrations

import "github.com/rubenv/sql-migrate"

var migrations []*migrate.Migration

func init() {
	migrations = []*migrate.Migration{
		create_initial,
	}
}

func Migrations() []*migrate.Migration {
	return migrations
}