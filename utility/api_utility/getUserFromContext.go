package api_utility

import (
	"github.com/gin-gonic/gin"
	"github.com/cqlcorp/gocms/context/consts"
	"github.com/cqlcorp/gocms/domain/user/user_model"
)

func GetUserFromContext(c *gin.Context) (*user_model.User, bool) {
	// get user from context
	if userContext, ok := c.Get(consts.USER_KEY_FOR_GIN_CONTEXT); ok {
		if userDisplay, ok := userContext.(user_model.User); ok {
			return &userDisplay, true
		}
	}
	return nil, false
}
