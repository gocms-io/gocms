package routes

import "github.com/gin-gonic/gin"

type ApiRoutes struct {
	Public *gin.RouterGroup
	Auth   *gin.RouterGroup
}
