package permission_repository

import (
	"github.com/gocms-io/gocms/domain/acl/permissions/permission_model"
	"github.com/jmoiron/sqlx"
	"log"
)

type IPermissionsRepository interface {
	Add(*permission_model.Permission) error
	Delete(int64) error
	GetAll() (*[]permission_model.Permission, error)
	GetUserPermissions(userId int) ([]*permission_model.Permission, error)
}

type PermissionsRepository struct {
	database *sqlx.DB
}

// DefaultPermissionsRepository creates a default permissions repository.
func DefaultPermissionsRepository(dbx *sqlx.DB) *PermissionsRepository {
	permissionsRepository := &PermissionsRepository{
		database: dbx,
	}
	return permissionsRepository
}

// Add adds permission to database
func (pr *PermissionsRepository) Add(permission *permission_model.Permission) error {

	// insert user
	result, err := pr.database.NamedExec(`
	INSERT INTO gocms_permissions (name, description) VALUES (:name, :description)
	`, permission)
	if err != nil {
		log.Printf("Error adding permission to db: %s", err.Error())
		return err
	}
	id, _ := result.LastInsertId()
	permission.Id = id

	return nil

}

// Delete deletes a user permission via permissionId
func (pr *PermissionsRepository) Delete(permissionId int64) error {

	_, err := pr.database.NamedExec(`
	DELETE FROM gocms_permissions WHERE id=:id
	`, map[string]interface{}{"id": permissionId})
	if err != nil {
		log.Printf("Error deleting permission %v from database: %s", permissionId, err.Error())
		return err
	}

	return nil
}

// GetAll get all permissions
func (pr *PermissionsRepository) GetAll() (*[]permission_model.Permission, error) {
	var permissions []permission_model.Permission
	err := pr.database.Select(&permissions, "SELECT * FROM gocms_permissions")
	if err != nil {
		log.Printf("Error getting permissions from database: %s", err.Error())
		return nil, err
	}
	return &permissions, nil
}

// GetUserPermissions get permissions assigned to a given user via userId
func (pr *PermissionsRepository) GetUserPermissions(userId int) ([]*permission_model.Permission, error) {
	var userPermissions []*permission_model.Permission
	err := pr.database.Select(&userPermissions, `
	SELECT permissionId as id, permissionName, description
	FROM (
		SELECT permissionId FROM gocms_groups_to_permissions
		WHERE groupId IN (
			SELECT groupId FROM gocms_users_to_groups
			WHERE userId = ?
		)
		UNION
		SELECT permissionId from gocms_users_to_permissions
		WHERE userId = ?
	) as permIds
	JOIN gocms_permissions as perms
	ON permIds.permissionId = perms.id
	`, userId, userId)
	if err != nil {
		log.Printf("Error getting all permissions for user from database: %s", err.Error())
		return nil, err
	}
	return userPermissions, nil
}
