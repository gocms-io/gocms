package access_control_service

import (
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/domain/acl/permissions/permission_model"
	"github.com/gocms-io/gocms/init/repository"
	"github.com/gocms-io/gocms/utility/log"
	"time"
)

type IAclService interface {
	RefreshPermissionsCache() error
	GetPermissions() map[string]permission_model.Permission
	IsAuthorized(string, int) bool
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
	return nil
}

func (as *AclService) GetPermissions() map[string]permission_model.Permission {
	// if cache has expired refresh permissions
	if time.Now().Sub(as.permissionsAge).Seconds() > float64(context.Config.DbVars.PermissionsCacheLife) {
		as.RefreshPermissionsCache()
	}

	return as.Permissions
}

func (as *AclService) IsAuthorized(permissionName string, userId int) bool {
	// get user permissions mapped to user
	activePermissions, err := as.RepositoriesGroup.PermissionsRepository.GetUserPermissions(userId)
	if err != nil {
		log.Errorf("Error getting users permissions: %s\n", err.Error())
		return false
	}

	// loop over permissions and see if they match the request one
	for _, permission := range activePermissions {
		if permission.Id == as.Permissions[permissionName].Id {
			return true
		}
	}
	return false
}
