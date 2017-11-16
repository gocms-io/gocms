package permission_repository

import (
	"github.com/gocms-io/gocms/domain/acl/permissions/permission_model"
	"github.com/gocms-io/gocms/utility/log"
	"github.com/jmoiron/sqlx"
)

type IPermissionsRepository interface {
	Add(*permission_model.Permission) error
	Delete(int64) error
	GetAll() (*[]permission_model.Permission, error)

	GetUserPermissions(userId int) ([]*permission_model.Permission, error)
	AddUserToPermission(userId int, permissionId int) error
	RemoveUserFromPermission(userId int, permissionId int) error

	GetGroupPermissions(groupId int) ([]*permission_model.Permission, error)
	AddGroupToPermission(groupId int, permissionId int) error
	RemoveGroupFromPermission(groupId int, permissionId int) error
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
		log.Errorf("Error adding permission to db: %s\n", err.Error())
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
		log.Errorf("Error deleting permission %v from database: %s\n", permissionId, err.Error())
		return err
	}

	return nil
}

// GetAll get all permissions
func (pr *PermissionsRepository) GetAll() (*[]permission_model.Permission, error) {
	var permissions []permission_model.Permission
	err := pr.database.Select(&permissions, "SELECT * FROM gocms_permissions")
	if err != nil {
		log.Errorf("Error getting permissions from database: %s\n", err.Error())
		return nil, err
	}
	return &permissions, nil
}

// GetUserPermissions get permissions assigned to a given user via userId
func (pr *PermissionsRepository) GetUserPermissions(userId int) ([]*permission_model.Permission, error) {

	var permissions []*permission_model.Permission
	err := pr.database.Select(&permissions, `
	SELECT perms.id AS 'id', perms.name AS 'name',
	perms.description AS 'description', groupId AS 'inheritedFromGroupId'
	FROM (
		SELECT permissionId, groupId FROM gocms_groups_to_permissions
		WHERE groupId IN (
			SELECT groupId FROM gocms_users_to_groups
			WHERE userId = ?
		)
		UNION
		SELECT permissionId, 0 AS groupId FROM gocms_users_to_permissions
		WHERE userId = ?
	) AS permIds
	JOIN gocms_permissions AS perms
	ON permIds.permissionId = perms.id
	`, userId, userId)
	if err != nil {
		log.Errorf("Error getting all permissions for user %v from database: %s\n", userId, err.Error())
		return nil, err
	}

	return permissions, nil
}

// AddUserToPermission adds a user to the permission via userId and permissionId
func (pr *PermissionsRepository) AddUserToPermission(userId int, permissionId int) error {

	// insert user
	_, err := pr.database.NamedExec(`
	INSERT INTO gocms_users_to_permissions (userId, permissionId) VALUES (:userId, :permissionId)
	`, map[string]interface{}{"userId": userId, "permissionId": permissionId})
	if err != nil {
		log.Errorf("Error adding user %v to permission %v: %s\n", userId, permissionId, err.Error())
		return err
	}
	return nil

}

// RemoveUserFromPermission removes a user from the permission via userId and permissionId
func (pr *PermissionsRepository) RemoveUserFromPermission(userId int, permissionId int) error {

	_, err := pr.database.NamedExec(`
	DELETE FROM gocms_users_to_permissions
	WHERE userId=:userId
	AND permissionId=:permissionId
	`, map[string]interface{}{"userId": userId, "permissionId": permissionId})
	if err != nil {
		log.Errorf("Error deleting user %v to permission %v: %s\n", userId, permissionId, err.Error())
		return err
	}

	return nil
}

// AddGroupToPermission adds a group to the permission via groupId and permissionId
func (pr *PermissionsRepository) AddGroupToPermission(groupId int, permissionId int) error {

	// insert user
	_, err := pr.database.NamedExec(`
	INSERT INTO gocms_groups_to_permissions (groupId, permissionId) VALUES (:groupId, :permissionId)
	`, map[string]interface{}{"groupId": groupId, "permissionId": permissionId})
	if err != nil {
		log.Errorf("Error adding group %v to permission %v: %s\n", groupId, permissionId, err.Error())
		return err
	}
	return nil

}

// RemoveGroupFromPermission removes a group from the permission via groupId and permissionId
func (pr *PermissionsRepository) RemoveGroupFromPermission(groupId int, permissionId int) error {

	_, err := pr.database.NamedExec(`
	DELETE FROM gocms_groups_to_permissions
	WHERE groupId=:groupId
	AND permissionId=:permissionId
	`, map[string]interface{}{"groupId": groupId, "permissionId": permissionId})
	if err != nil {
		log.Errorf("Error deleting group %v to permission %v: %s\n", groupId, permissionId, err.Error())
		return err
	}

	return nil
}

// GetGroupPermissions get permissions assigned to a given group via groupId
func (pr *PermissionsRepository) GetGroupPermissions(groupId int) ([]*permission_model.Permission, error) {
	var groupPermissions []*permission_model.Permission
	err := pr.database.Select(&groupPermissions, `
	SELECT permissionId as id, name, description
	FROM (
		SELECT permissionId from gocms_groups_to_permissions
		WHERE groupId = ?
	) as permissionsIds
	JOIN gocms_permissions as perms
	ON permissionsIds.permissionId = perms.id
	`, groupId)
	if err != nil {
		log.Errorf("Error getting all permissions for group %v from database: %s\n", groupId, err.Error())
		return nil, err
	}
	return groupPermissions, nil
}
