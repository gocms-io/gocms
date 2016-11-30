package database

import (
	_"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"log"
	"github.com/menklab/goCMS/config"
	"github.com/menklab/goCMS/database/migrations"
	"github.com/rubenv/sql-migrate"
	"database/sql"
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
	migrate.SetTable("migrations")
	n, err := migrate.Exec(db, "mysql", migs, migrate.Up)
	if err != nil {
		log.Printf("MIGRATION ERROR: %s\n", err.Error())
		if n > 0 {
			rn, err := migrate.ExecMax(db, "mysql", migs, migrate.Down, n)
			if err != nil {
				log.Printf("ROLLBACK FAILED: %s\n", err.Error())
				return err
			}
			log.Printf("Rolled back %d migrations.\n", rn)
			return err
		} else {
			log.Printf("No rollback required.\n")
			return err
		}
	}
	if n > 0 {
		log.Printf("Applied %d migrations. Database up to date.\n", n)
	}
	return nil
}