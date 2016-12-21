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
	migrations *migrate.MemoryMigrationSource
}


func Default() *Database {
	// create db connection
	connectionString := config.DbUser + ":" + config.DbPassword + "@" + config.DbServer + "/" + config.DbName + "?parseTime=true"
	dbHandle, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal("Database Error: ", err.Error())
	}
	dbx := sqlx.NewDb(dbHandle, "mysql")

	database := &Database{
		Db:dbHandle,
		Dbx: dbx,
		migrations: &migrate.MemoryMigrationSource{
			Migrations: migrations.GoCMSMigrations(),
		},
	}

	// apply migrations up by default
	return database
}


func (database *Database) Migrate(tableName string, migrationSource *migrate.MemoryMigrationSource) error {
	migrate.SetTable(tableName)
	n, err := migrate.Exec(database.Db, "mysql", migrationSource, migrate.Up)
	if err != nil {
		log.Printf("MIGRATION ERROR: %s\n", err.Error())
		if n > 0 {
			rn, err := migrate.ExecMax(database.Db, "mysql", migrationSource, migrate.Down, n)
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
		log.Printf("Applied %d migrations to %s. Database up to date.\n", n, tableName)
	}
	return nil
}

func (database *Database) MigrateCMS() error {
	tableName := "gocms_migrations"
	migrate.SetTable(tableName)
	n, err := migrate.Exec(database.Db, "mysql", database.migrations, migrate.Up)
	if err != nil {
		log.Printf("MIGRATION ERROR: %s\n", err.Error())
		if n > 0 {
			rn, err := migrate.ExecMax(database.Db, "mysql", database.migrations, migrate.Down, n)
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
		log.Printf("Applied %d migrations to %s. Database up to date.\n", n, tableName)
	}
	return nil
}
