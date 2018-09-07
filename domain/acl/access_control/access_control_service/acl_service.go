package access_control_service

import (
	"github.com/cqlcorp/gocms/context"
	"github.com/cqlcorp/gocms/domain/acl/permissions/permission_model"
	"github.com/cqlcorp/gocms/init/repository"
	"github.com/cqlcorp/gocms/utility/log"
	"time"
	"github.com/cqlcorp/gocms/domain/acl/group/group_model"
)

type IAclService interface {
	RefreshPermissionsCache() error
	GetPermissions() map[string]permission_model.Permission
	IsAuthorized(string, int64) bool
	IsAuthorizedWithContext(permissionName string, userId int64) (bool, []*permission_model.Permission, []*group_model.Group)
}

type AclService struct {
	Permissions       map[string]permission_model.Permission
	permissionsAge    time.Time
	RepositoriesGroup *repository.RepositoriesGroup
}

func DefaultAclService(rg *repository.RepositoriesGroup) *AclService {
	aclService := &AclService{
		RepositoriesGroup: rg,
	}

	return aclService

}

func (as *AclService) RefreshPermissionsCache() error {

	// get all permissions
	permissions, err := as.RepositoriesGroup.PermissionsRepository.GetAll()
	if err != nil {
		log.Criticalf("Fatal - Error caching permissions: %s\n", err.Error())
		return err
	}

	permissionsCache := make(map[string]permission_model.Permission, len(*permissions))
	// cache permissions
	for _, permission := range *permissions {
		permissionsCache[permission.Name] = permission
	}

	as.Permissions = permissionsCache
	as.permissionsAge = time.Now()
	log.Debugf("Permission Cache Updated\n")
	return nil
}

func (as *AclService) GetPermissions() map[string]permission_model.Permission {
	// if cache has expired refresh permissions
	if time.Now().Sub(as.permissionsAge).Seconds() > float64(context.Config.DbVars.PermissionsCacheLife) {
		as.RefreshPermissionsCache()
	}

	return as.Permissions
}

func (as *AclService) IsAuthorizedWithContext(permissionName string, userId int64) (bool, []*permission_model.Permission, []*group_model.Group) {

	isAuthorized, permissions := as.isAuthorized(permissionName, userId)

	// if authorized get users groups
	if isAuthorized {
		groups, err := as.RepositoriesGroup.GroupsRepository.GetUserGroups(userId)
		if err != nil {
			log.Errorf("Error getting users groups: %s\n", err.Error())
			return false, nil, nil
		}

		// return with full context
		return true, permissions, groups
	}

	return false, nil, nil
}

func (as *AclService) IsAuthorized(permissionName string, userId int64) bool {

	isAuthorized, _ := as.isAuthorized(permissionName, userId)
	return isAuthorized
}

func (as *AclService) isAuthorized(permissionName string, userId int64) (bool, []*permission_model.Permission) {
	// get user permissions
	permissions, err := as.RepositoriesGroup.PermissionsRepository.GetUserPermissions(userId)
	if err != nil {
		log.Errorf("Error getting users permissions: %s\n", err.Error())
		return false, nil
	}

	// loop over permissions and see if they match the request one
	for _, permission := range permissions {
		cachedPermissions := as.GetPermissions() // use function to verify that cache is refreshed
		if permission.Id == cachedPermissions[permissionName].Id {
			return true, permissions
		}
	}
	return false, nil
}
