package database

import (
	_"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"log"
	"bitbucket.org/menklab/grnow-services/config"
	"bitbucket.org/menklab/grnow-services/database/migrations"
	"github.com/rubenv/sql-migrate"
	"database/sql"
	"bitbucket.org/menklab/grnow-services/utility"
)

type Database struct {
	Db         *sql.DB
	Dbx        *sqlx.DB
	Migrations migrate.MemoryMigrationSource
}

var Dbx *sqlx.DB
var db *sql.DB
var migs *migrate.MemoryMigrationSource

func init() {
	// create db connection
	connectionString := config.DbUser + ":" + config.DbPassword + "@" + config.DbServer + "/" + config.DbName + "?parseTime=true"
	dbHandle, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal("Database Error: ", err.Error())
	}
	dbx := sqlx.NewDb(dbHandle, "mysql")

	db = dbHandle
	Dbx = dbx
	migs = &migrate.MemoryMigrationSource{
		Migrations: migrations.Migrations(),
	}
}

//func Dbx() *sqlx.DB {
//	return dbx
//}

func Migrate() error {
	migrate.SetTable("cms_migrations")
	n, err := migrate.Exec(db, "mysql", migs, migrate.Up)
	if err != nil {
		utility.DebugF("MIGRATION ERROR: %s\n", err.Error())
		if n > 0 {
			rn, err := migrate.ExecMax(db, "mysql", migs, migrate.Down, n)
			if err != nil {
				utility.DebugF("ROLLBACK FAILED: %s\n", err.Error())
				return err
			}
			utility.DebugF("Rolled back %d migrations.\n", rn)
			return err
		} else {
			utility.DebugF("No rollback required.\n")
			return err
		}
	}
	if n > 0 {
		utility.DebugF("Applied %d migrations. Database up to date.\n", n)
	}
	return nil
}