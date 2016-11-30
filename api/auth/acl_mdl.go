package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/menklab/goCMS/services"
	"net/http"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/routes"
)

type AclMiddleware struct {
	authService      services.IAuthService
	userService      services.IUserService
}

func NewAclMiddleware(sg *services.ServicesGroup) *AclMiddleware {

	aclMiddleware := &AclMiddleware {
		authService: sg.AuthService,
		userService: sg.UserService,
	}

	return aclMiddleware
}

func (acl *AclMiddleware) DefaultAcl(r *routes.ApiRoutes) {
	r.Admin.Use(acl.RequireAdmin())
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