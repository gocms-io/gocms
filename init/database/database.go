package database

import (
	"github.com/cqlcorp/gocms/init/database/sql"
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
