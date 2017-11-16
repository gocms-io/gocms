package access_control_middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/domain/acl/access_control/access_control_service"
	"github.com/gocms-io/gocms/utility/api_utility"
	"github.com/gocms-io/gocms/utility/errors"
	"github.com/gocms-io/gocms/utility/log"
	"net/http"
)

// middleware
func RequirePermission(aclService access_control_service.IAclService, permissions ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authUser, _ := api_utility.GetUserFromContext(c)
		for _, permission := range permissions {
			log.Debugf("Checking permission %v\n", permission)
			if aclService.IsAuthorized(permission, authUser.Id) {
				log.Debugf("User has permission. Continue.")
				c.Next()
				return
			}
		}
		log.Debugf("User does not have permission. Fail.")
		errors.Response(c, http.StatusForbidden, fmt.Sprint("You do not have permissions to access this resource."), nil)
	}
}
