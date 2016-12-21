package auth


import (
	"github.com/gin-gonic/gin"
)

type AclMiddleware struct {
}


// middleware
func (acl *AclMiddleware) RequirePermission() gin.HandlerFunc {
	return acl.requirePermission
}


// requireAdmin middleware
func (acl *AclMiddleware) requirePermission(c *gin.Context) {


	////get userId
	//user, _ := utility.GetUserFromContext(c)
	//
	//if !user.IsAdmin {
	//	errors.ResponseWithSoftRedirect(c, http.StatusUnauthorized, errors.ApiError_Permissions, REDIRECT_LOGIN)
	//	return
	//}
	//
	//// continue
	c.Next()
}