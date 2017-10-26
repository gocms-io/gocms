package sql

import (
	"database/sql"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/init/database/sql/migrations/sql"
	"github.com/jmoiron/sqlx"
	"github.com/rubenv/sql-migrate"
	"log"
)

type SQL struct {
	Dbx        *sqlx.DB
	migrations *migrate.MemoryMigrationSource
}

func DefaultSQL() *SQL {
	// create db connection
	connectionString := context.Config.EnvVars.DbName + ":" + context.Config.EnvVars.DbPassword + "@" + context.Config.EnvVars.DbServer + "/" + context.Config.EnvVars.DbName + "?parseTime=true"
	dbHandle, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal("Database Error: ", err.Error())
	}
	dbx := sqlx.NewDb(dbHandle, "mysql")

	sql := &SQL{
		Dbx:        dbx,
		migrations: migrations.Default(),
	}

	// apply migrations up by default
	return sql
}

func (sql *SQL) MigrateSql() error {
	tableName := "gocms_migrations"
	migrate.SetTable(tableName)
	n, err := migrate.Exec(sql.Dbx.DB, "mysql", sql.migrations, migrate.Up)
	if err != nil {
		log.Printf("MIGRATION ERROR: %s\n", err.Error())
		if n > 0 {
			rn, err := migrate.ExecMax(sql.Dbx.DB, "mysql", sql.migrations, migrate.Down, n)
			if err != nil {
				log.Printf("ROLLBACK FAILED: %s\n", err.Error())
				return err
			}
			log.Printf("Rolled back %d migrations.\n", rn)
			return err
		} else {
			log.Println("No rollback required.")
			return err
		}
	}
	if n > 0 {
		log.Printf("Applied %d migrations to %s. Database up to date.\n", n, tableName)
	}
	return nil
}
