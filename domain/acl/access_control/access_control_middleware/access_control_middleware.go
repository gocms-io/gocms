package access_control_middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/myanrichal/gocms/context/consts"
	"github.com/myanrichal/gocms/domain/acl/access_control/access_control_service"
	"github.com/myanrichal/gocms/utility/api_utility"
	"github.com/myanrichal/gocms/utility/errors"
	"github.com/myanrichal/gocms/utility/log"
	"net/http"
)

// middleware
func RequirePermission(aclService access_control_service.IAclService, permissions ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authUser, _ := api_utility.GetUserFromContext(c)
		for _, permission := range permissions {
			isAuthorized, permissions, groups := aclService.IsAuthorizedWithContext(permission, authUser.Id)
			if isAuthorized {
				// add permissions and roles to context
				authUser.Permissions = permissions
				authUser.Groups = groups
				log.Debugf("User %v has permissions %v\n", authUser.Id, permission)
				c.Set(consts.USER_KEY_FOR_GIN_CONTEXT, *authUser)
				c.Next()
				return
			}
		}
		log.Debugf("User does not have permission. Fail.")
		errors.Response(c, http.StatusForbidden, fmt.Sprint("You do not have permissions to access this resource."), nil)
	}
}
