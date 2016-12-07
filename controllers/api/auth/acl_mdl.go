package auth


import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/routes"
)

type AclMiddleware struct {
}

func DefaultAclMiddleware(routes *routes.ApiRoutes) *AclMiddleware {

	aclMiddleware := &AclMiddleware {
	}

	aclMiddleware.Default(routes)

	return aclMiddleware
}

func (acl *AclMiddleware) Default(routes *routes.ApiRoutes) {
	routes.Admin.Use(acl.RequireAdmin())
}

// middleware
func (acl *AclMiddleware) RequireAdmin() gin.HandlerFunc {
	return acl.requireAdmin
}


// requireAdmin middleware
func (acl *AclMiddleware) requireAdmin(c *gin.Context) {

	//get userId
	user, _ := utility.GetUserFromContext(c)

	if !user.IsAdmin {
		errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_Permissions, REDIRECT_LOGIN)
		return
	}

	// continue
	c.Next()
}