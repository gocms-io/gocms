package sql

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/init/database/sql/migrations/sql"
	"github.com/gocms-io/gocms/utility/log"
	"github.com/jmoiron/sqlx"
	"github.com/rubenv/sql-migrate"
)


type SQL struct {
	Dbx        *sqlx.DB
	migrations *migrate.MemoryMigrationSource
}

func DefaultSQL() *SQL {
	// create db connection
	connectionString := context.Config.EnvVars.DbUser + ":" + context.Config.EnvVars.DbPassword + "@" + context.Config.EnvVars.DbServer + "/" + context.Config.EnvVars.DbName + "?parseTime=true"
	dbHandle, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Criticalf("Database Error opening connection: %v\n", err.Error())
	}

	// ping to verify connection
	err = dbHandle.Ping()
	if err != nil {
		log.Criticalf("Database Error verifying good connection: %v\n", err.Error())
	}

	dbx := sqlx.NewDb(dbHandle, "mysql")

	mySql := &SQL{
		Dbx:        dbx,
		migrations: migrations.Default(),
	}

	// apply migrations up by default
	return mySql
}

func (sql *SQL) MigrateSql() error {
	tableName := "gocms_migrations"
	migrate.SetTable(tableName)
	n, err := migrate.Exec(sql.Dbx.DB, "mysql", sql.migrations, migrate.Up)
	if err != nil {
		log.Errorf("MIGRATION ERROR: %s\n", err.Error())
		if n > 0 {
			rn, err := migrate.ExecMax(sql.Dbx.DB, "mysql", sql.migrations, migrate.Down, n)
			if err != nil {
				log.Errorf("ROLLBACK FAILED: %s\n", err.Error())
				return err
			}
			log.Errorf("Rolled back %d migrations.\n", rn)
			return err
		} else {
			log.Errorf("No rollback required.\n")
			return err
		}
	}
	if n > 0 {
		log.Infof("Applied %d migrations to %s. Database up to date.\n", n, tableName)
	}
	return nil
}
