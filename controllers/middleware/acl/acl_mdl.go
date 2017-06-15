package aclMdl

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/services"
	"github.com/gocms-io/gocms/utility"
	"github.com/gocms-io/gocms/utility/errors"
	"net/http"
)

type AclMiddleware struct {
	ServicesGroup *services.ServicesGroup
}

// middleware
func (acl *AclMiddleware) RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authUser, _ := utility.GetUserFromContext(c)
		if !acl.ServicesGroup.AclService.IsAuthorized(permission, authUser.Id) {
			errors.Response(c, http.StatusForbidden, fmt.Sprintf("You must have the \"%s\" permission to access this resource.", permission), nil)
			return
		}
		c.Next()
	}
}
