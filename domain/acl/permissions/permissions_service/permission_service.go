package permission_service

import (
	"github.com/gocms-io/gocms/domain/acl/permissions/permission_model"
	"github.com/gocms-io/gocms/init/repository"
)

type IPermissionService interface {
	Add(*permission_model.Permission) error
	//	Delete(int64) error
	//	GetAll() (*[]permission_model.Permission, error)
	//
	//	GetUserPermissions(userId int) ([]*permission_model.Permission, error)
	//	AddUserToPermission(userId int, permissionId int) error
	//	RemoveUserFromPermission(userId int, permissionId int) error
	//
	//	GetGroupPermissions(groupId int) ([]*permission_model.Permission, error)
	//	AddGroupToPermission(groupId int, permissionId int) error
	//	RemoveGroupFromPermission(groupId int, permissionId int) erro
}

type PermissionService struct {
	RepositoriesGroup *repository.RepositoriesGroup
}

func DefaultPermissionService(rg *repository.RepositoriesGroup) *PermissionService {
	permissionService := &PermissionService{
		RepositoriesGroup: rg,
	}


	return permissionService
}

func (ps *PermissionService) Add(permission *permission_model.Permission) error {

	err := ps.RepositoriesGroup.PermissionsRepository.Add(permission)
	if err != nil {
		return nil
	}
	return nil
}
