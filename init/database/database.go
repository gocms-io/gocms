package database

import (
	"github.com/gocms-io/gocms/init/database/sql"
)

type Database struct {
	SQL *sql.SQL
}

func DefaultSQL() *Database {

	database := Database{
		SQL: sql.DefaultSQL(),
	}

	return &database
}
