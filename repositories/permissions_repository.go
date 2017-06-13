package repositories

import (
	"github.com/jmoiron/sqlx"
	"github.com/gocms-io/gocms-services/models"
	"log"
)

type IPermissionsRepository interface {
	GetAll() (*[]models.Permission, error)
	GetUserPermissions(int) (*[]int, error)
}

type PermissionsRepository struct {
	database *sqlx.DB
}

func DefaultPermissionsRepository(db interface{}) *PermissionsRepository {
	d, ok := db.(*sqlx.DB)
	if !ok {
		log.Fatalf("Permissions Repo expected *sqlx.DB but got %T.\n", db)
	}
	permissionsRepository := &PermissionsRepository{
		database: d,
	}

	return permissionsRepository
}

// get all permissions
func (ur *PermissionsRepository) GetAll() (*[]models.Permission, error) {
	var permissions []models.Permission
	err := ur.database.Select(&permissions, "SELECT * FROM gocms_permissions")
	if err != nil {
		log.Printf("Error getting permissions from database: %s", err.Error())
		return nil, err
	}
	return &permissions, nil
}

// get permissions assigned to a given user
func (ur *PermissionsRepository) GetUserPermissions(userId int) (*[]int, error) {
	var userPermissions []int
	err := ur.database.Select(&userPermissions, "SELECT permissionsId FROM gocms_users_to_permissions WHERE userId=?", userId)
	if err != nil {
		log.Printf("Error getting all permissions for user from database: %s", err.Error())
		return nil, err
	}
	return &userPermissions, nil
}
