package goCMS_migrations

import (
	"github.com/rubenv/sql-migrate"
)

type Migration struct {
	Id   string
	Up   []string
	Down []string
}

type MigrationList []*Migration

func GoCMSMigrations() []*migrate.Migration {
	migrationsList := []*migrate.Migration{
		CreateInitial(),
	}
	return migrationsList
}

func (migrationsList *MigrationList) ConvertMemoryMigrationsToSource() *migrate.MemoryMigrationSource {

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
