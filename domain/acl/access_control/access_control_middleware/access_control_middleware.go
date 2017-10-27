package access_control_middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/utility/api_utility"
	"github.com/gocms-io/gocms/utility/errors"
	"net/http"
	"github.com/gocms-io/gocms/init/service"
)

type AclMiddleware struct {
	ServicesGroup *service.ServicesGroup
}

// middleware
func (acl *AclMiddleware) RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authUser, _ := api_utility.GetUserFromContext(c)
		if !acl.ServicesGroup.AclService.IsAuthorized(permission, authUser.Id) {
			errors.Response(c, http.StatusForbidden, fmt.Sprintf("You must have the \"%s\" permission to access this resource.", permission), nil)
			return
		}
		c.Next()
	}
}
