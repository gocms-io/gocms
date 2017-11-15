package routes

import "github.com/gin-gonic/gin"

type Routes struct {
	Public       *gin.RouterGroup
	PreTwofactor *gin.RouterGroup
	Auth         *gin.RouterGroup
	// todo remove admin and replace with permissions and acl layer
	Admin   *gin.RouterGroup
	Root    *gin.RouterGroup
	NoRoute func(...gin.HandlerFunc)
}
