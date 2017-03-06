package database

import (
	_ "github.com/go-sql-driver/mysql"
)

type Database struct {
	SQL *SQL
}

func Default() *Database {

	database := Database{
		SQL: DefaultSQL(),
	}

	return &database
}
