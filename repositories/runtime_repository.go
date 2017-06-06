package repositories

import (
	"github.com/jmoiron/sqlx"
	"github.com/gocms-io/gocms/models"
	"log"
)

type IRuntimeRepository interface {
	GetByName(name string) (*models.Runtime, error)
	UpdateValue(id int, value string) error
}

type RuntimeRepository struct {
	database *sqlx.DB
}

func DefaultRuntimeRepository(db interface{}) *RuntimeRepository {
	d, ok := db.(*sqlx.DB)
	if !ok {
		log.Fatalf("Runtime Repo expected *sqlx.DB but got %T.\n", db)
	}
	runtimeRepository := &RuntimeRepository{
		database: d,
	}

	return runtimeRepository
}

// get all settings
func (ur *RuntimeRepository) GetByName(name string) (*models.Runtime, error) {
	var runtime models.Runtime
	err := ur.database.Get(&runtime, "SELECT id, name, value, description, created FROM gocms_runtime WHERE name = ?", name)
	if err != nil {
		log.Printf("Error getting runtime from database: %s", err.Error())
		return nil, err
	}
	return &runtime, nil
}

// get all settings
func (ur *RuntimeRepository) UpdateValue(id int, value string) error {
	_, err := ur.database.NamedExec("UPDATE gocms_runtime SET value=:value WHERE id=:id", map[string]interface{}{"value": value, "id": id})
	if err != nil {
		log.Printf("Error updating value of runtime from database: %s", err.Error())
		return err
	}
	return nil
}
