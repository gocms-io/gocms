package api

//import (
//	"github.com/gin-gonic/gin"
//	"net/http"
//	"strconv"
//	"bitbucket.org/menklab/grnow-services/config"
//	"bitbucket.org/menklab/grnow-services/models"
//	"bitbucket.org/menklab/grnow-services/utility/errors"
//	"bitbucket.org/menklab/grnow-services/services"
//)
//
//type AdminUserController struct {
//	userService  services.IUserService
//	authServices services.IAuthService
//}
//
//func (self *AdminUserController) Init(routes *config.Routes) {
//	self.userService = services.UserService{}
//	self.authServices = services.GetAuthService()
//
//	routes.Admin.GET("/user", self.getAll)
//	routes.Admin.GET("/user/:userId", self.get)
//	routes.Admin.PUT("/user/:userId", self.update)
//	routes.Admin.POST("/user", self.add)
//	routes.Admin.DELETE("/user/:userId", self.delete)
//}
//
//func (self *AdminUserController) add(c *gin.Context) {
//
//	user := &models.User{}
//	//get user data
//	err := c.BindJSON(user)
//	if err != nil {
//		errors.Response(c, http.StatusBadRequest, err.Error(), err)
//		return
//	}
//
//	// get password
//	if user.NewPassword == "" {
//		errors.Response(c, http.StatusBadRequest, "New Password Field Required.", err)
//		return
//	}
//
//	// add user
//	err = self.userService.Add(user)
//	if err != nil {
//		errors.Response(c, http.StatusInternalServerError, err.Error(), err)
//		return
//	}
//
//	c.JSON(http.StatusOK, user)
//}
//
//func (self *AdminUserController) get(c *gin.Context) {
//
//	userId, err := strconv.Atoi(c.Param("userId"))
//	if err != nil {
//		errors.Response(c, http.StatusInternalServerError, err.Error(), err)
//	}
//
//	user, err := self.userService.Get(userId)
//	if err != nil {
//		errors.Response(c, http.StatusInternalServerError, "Couldn't find user.", err)
//		return
//	}
//
//	c.JSON(http.StatusOK, user)
//}
//
//func (self *AdminUserController) getAll(c *gin.Context) {
//	users, err := self.userService.GetAll()
//	if err != nil {
//		errors.Response(c, http.StatusInternalServerError, "Couldn't get users", err)
//		return
//	}
//
//	c.JSON(http.StatusOK, users)
//}
//
//func (self *AdminUserController) update(c *gin.Context) {
//	// get user to update
//	userId, err := strconv.Atoi(c.Param("userId"))
//	if err != nil {
//		errors.Response(c, http.StatusBadRequest, "Missing Id Field", err)
//		return
//	}
//
//	// get update info
//	user := &models.User{}
//	// get user data
//	err = c.BindJSON(user)
//	if err != nil {
//		errors.Response(c, http.StatusBadRequest, err.Error(), err)
//		return
//	}
//
//	// do update
//	err = self.userService.Update(userId, user)
//	if err != nil {
//		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
//		return
//	}
//
//	c.JSON(http.StatusOK, user)
//}
//
//func (self *AdminUserController) delete(c *gin.Context) {
//	userId, err := strconv.Atoi(c.Param("userId"))
//	if err != nil {
//		errors.Response(c, http.StatusBadRequest, "Missing Id Field", err)
//		return
//	}
//
//	// delete user
//	err = self.userService.Delete(userId)
//	if err != nil {
//		errors.Response(c, http.StatusInternalServerError, "Couldn't delete user.", err)
//		return
//	}
//
//	c.Status(http.StatusOK)
//}
