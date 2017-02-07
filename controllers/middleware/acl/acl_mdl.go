package goCMS_aclMdl

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/utility/errors"
	"net/http"
)

type AclMiddleware struct {
	ServicesGroup *goCMS_services.ServicesGroup
}

// middleware
func (acl *AclMiddleware) RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authUser, _ := goCMS_utility.GetUserFromContext(c)
		if !acl.ServicesGroup.AclService.IsAuthorized(permission, authUser.Id) {
			goCMS_errors.Response(c, http.StatusForbidden, fmt.Sprintf("You must have the \"%s\" permission to access this resource.", permission), nil)
			return
		}
		c.Next()
	}
}
