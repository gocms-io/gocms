package runtime_repository

import (
	"github.com/myanrichal/gocms/domain/runtime/runtime_model"
	"github.com/jmoiron/sqlx"
	"github.com/myanrichal/gocms/utility/log"
)

type IRuntimeRepository interface {
	GetByName(name string) (*runtime_model.Runtime, error)
	UpdateValue(id int, value string) error
}

type RuntimeRepository struct {
	database *sqlx.DB
}

func DefaultRuntimeRepository(dbx *sqlx.DB) *RuntimeRepository {
	runtimeRepository := &RuntimeRepository{
		database: dbx,
	}

	return runtimeRepository
}

// get all settings
func (ur *RuntimeRepository) GetByName(name string) (*runtime_model.Runtime, error) {
	var runtime runtime_model.Runtime
	err := ur.database.Get(&runtime, "SELECT * FROM gocms_runtime WHERE name = ?", name)
	if err != nil {
		log.Errorf("Error getting runtime from database: %s", err.Error())
		return nil, err
	}
	return &runtime, nil
}

// get all settings
func (ur *RuntimeRepository) UpdateValue(id int, value string) error {
	_, err := ur.database.NamedExec("UPDATE gocms_runtime SET value=:value WHERE id=:id", map[string]interface{}{"value": value, "id": id})
	if err != nil {
		log.Errorf("Error updating value of runtime from database: %s", err.Error())
		return err
	}
	return nil
}
