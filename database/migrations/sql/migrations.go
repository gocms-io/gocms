package sql_migrations

import (
	"github.com/rubenv/sql-migrate"
)

type SqlMigration struct {
	Id   string
	Up   []string
	Down []string
}

type SqlMigrationList []*SqlMigration

func GoCMSSqlMigrations() []*migrate.Migration {
	migrationsList := []*migrate.Migration{
		CreateInitial(),
		AddLastModified(),
	}
	return migrationsList
}

func (migrationsList *SqlMigrationList) ConvertMemoryMigrationsToSource() *migrate.MemoryMigrationSource {

	memoryMigrations := make([]*migrate.Migration, len(*migrationsList))
	for i, migration := range *migrationsList {
		memoryMigration := migrate.Migration{
			Id:   migration.Id,
			Up:   migration.Up,
			Down: migration.Down,
		}
		memoryMigrations[i] = &memoryMigration
	}
	memoryMigrationSource := &migrate.MemoryMigrationSource{
		Migrations: memoryMigrations,
	}

	return memoryMigrationSource
}
