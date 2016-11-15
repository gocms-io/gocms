package routes

import (
	"github.com/gin-gonic/gin"
)

type RouteGroups struct {
	Auth    *gin.RouterGroup
	Public  *gin.RouterGroup
}

var routes *RouteGroups

func init() {
	routes = &RouteGroups{}
}

func Routes() *RouteGroups {
	return routes
}