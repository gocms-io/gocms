package services

import (
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/models"
	"log"
)

type IAclService interface {
	RefreshPermissionsCache() error
	GetPermissions() *map[string]models.Permission
	IsAuthorized(string, int) bool
}


type AclService struct {
	Permissions *map[string]models.Permission
	RepositoriesGroup *repositories.RepositoriesGroup
}


func DefaultAclService(rg *repositories.RepositoriesGroup) *AclService{
	aclService := &AclService{
		RepositoriesGroup: rg,
	}
	
	return aclService

}

func (as *AclService) RefreshPermissionsCache() error {

	// get all permissions
	permissions, err := as.RepositoriesGroup.PermissionsRepository.GetAll()
	if err != nil {
		log.Fatalf("Fatal - Error caching permissions: %s\n", err.Error())
		return err
	}

	permissionsCache := make(map[string]models.Permission, len(*permissions))
	// cache permissions
	for _, permission := range *permissions {
		permissionsCache[permission.Name] = permission
	}

	as.Permissions = &permissionsCache
	return nil
}

func (as *AclService) GetPermissions() *map[string]models.Permission {
	return as.Permissions
}

func (as *AclService) IsAuthorized(permission string, userId int) bool {
	// get user permissions mapped to user
	activePermissions, err := as.RepositoriesGroup.PermissionsRepository.GetUserPermissions(userId)
	if err != nil {
		log.Printf("Error getting users permissions: %s\n", err.Error())
		return false
	}

	// loop over permissions and see if they match the request one
	for _, permId := range *activePermissions {
		log.Printf("Testing perm %s, against %d\n", as.Permissions[permission],  permId)
		if permId == as.Permissions[permission] {
			return true
		}
	}
	return false
}