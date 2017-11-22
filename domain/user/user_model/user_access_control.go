package user_model

import (
	"encoding/json"
	"github.com/gocms-io/gocms/utility/log"
)

type UserContextHeader struct {
	Id       int64    `json:"id"`
	FullName string   `json:"fullName"`
	Email    string   `json:"email"`
	ACL      *UserAcl `json:"acl"`
}

type UserAcl struct {
	Permissions []*UserAclPermission `json:"permissions"`
	Groups      []*UserAclGroup      `json:"groups"`
}

type UserAclPermission struct {
	Id                   int64  `json:"id"`
	Name                 string `json:"name"`
	InheritedFromGroupId int64  `json:"inheritedFromGroupId,omitempty"`
}

type UserAclGroup struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

func (userContextHeader *UserContextHeader) Marshal() string {

	data, err := json.Marshal(userContextHeader)
	if err != nil {
		log.Errorf("Error marshaling userContextHeader %v: %v\n", userContextHeader.Id, err.Error())
		return ""
	}
	return string(data)
}

func UnmarshalUserContextHeader(data []byte) *UserContextHeader {

	userContextHeader := UserContextHeader{}
	err := json.Unmarshal(data, &userContextHeader)
	if err != nil {
		log.Errorf("Error unmarshaling userContextHeader: %v\n", err.Error())
	}
	return &userContextHeader
}

func (user *User) GetUserAclPermissionsAndGroups() *UserAcl {

	// convert permissions to UserAclPermissions
	var userAclPermissions []*UserAclPermission
	for _, permission := range user.Permissions {
		uap := UserAclPermission{
			Id:                   permission.Id,
			Name:                 permission.Name,
			InheritedFromGroupId: permission.InheritedFromGroupId,
		}

		userAclPermissions = append(userAclPermissions, &uap)
	}

	// convert groups to UserAclGroups
	var userAclGroups []*UserAclGroup
	for _, group := range user.Groups {
		uag := UserAclGroup{
			Id:   group.Id,
			Name: group.Name,
		}

		userAclGroups = append(userAclGroups, &uag)
	}

	// build object and return
	uapg := UserAcl{
		Permissions: userAclPermissions,
		Groups:      userAclGroups,
	}

	return &uapg
}
