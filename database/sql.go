package goCMS_database

import (
	"log"
	"github.com/menklab/goCMS/database/migrations"
	"github.com/rubenv/sql-migrate"
	"database/sql"
	"github.com/menklab/goCMS/context"
	"github.com/jmoiron/sqlx"
)

type SQL struct {
	Dbx        *sqlx.DB
	migrations *migrate.MemoryMigrationSource
}

func DefaultSQL() *SQL {
	// create db connection
	connectionString := goCMS_context.Config.DbUser + ":" + goCMS_context.Config.DbPassword + "@" + goCMS_context.Config.DbServer + "/" + goCMS_context.Config.DbName + "?parseTime=true"
	dbHandle, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal("Database Error: ", err.Error())
	}
	dbx := sqlx.NewDb(dbHandle, "mysql")

	sql := &SQL{
		Dbx: dbx,
		migrations: &migrate.MemoryMigrationSource{
			Migrations: goCMS_migrations.GoCMSMigrations(),
		},
	}

	// apply migrations up by default
	return sql
}

func (database *Database) Migrate(tableName string, migrationSource *migrate.MemoryMigrationSource) error {
	migrate.SetTable(tableName)
	n, err := migrate.Exec(database.SQL.Dbx.DB, "mysql", migrationSource, migrate.Up)
	if err != nil {
		log.Printf("MIGRATION ERROR: %s\n", err.Error())
		if n > 0 {
			rn, err := migrate.ExecMax(database.SQL.Dbx.DB, "mysql", migrationSource, migrate.Down, n)
			if err != nil {
				log.Printf("ROLLBACK FAILED: %s\n", err.Error())
				return err
			}
			log.Printf("Rolled back %d migrations.\n", rn)
			return err
		} else {
			log.Println("No rollback required.\n")
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
	n, err := migrate.Exec(database.SQL.Dbx.DB, "mysql", database.SQL.migrations, migrate.Up)
	if err != nil {
		log.Printf("MIGRATION ERROR: %s\n", err.Error())
		if n > 0 {
			rn, err := migrate.ExecMax(database.SQL.Dbx.DB, "mysql", database.SQL.migrations, migrate.Down, n)
			if err != nil {
				log.Printf("ROLLBACK FAILED: %s\n", err.Error())
				return err
			}
			log.Printf("Rolled back %d migrations.\n", rn)
			return err
		} else {
			log.Println("No rollback required.\n")
			return err
		}
	}
	if n > 0 {
		log.Printf("Applied %d migrations to %s. Database up to date.\n", n, tableName)
	}
	return nil
}
