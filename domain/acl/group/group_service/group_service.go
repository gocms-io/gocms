package group_service

import (
	"github.com/gocms-io/gocms/init/repository"
)

type IGroupService interface {
	//Add(group *group_model.Group) error
	//	Delete(int64) error
	//	GetAll() (*[]group_model.Group, error)
	//
	//	GetUserGroups(userId int) ([]*group_model.Group, error)
		AddUserToGroupByName(userId int64, groupName string) error
		RemoveUserFromGroupByName(userId int64, groupName string) error
	//
}

type GroupService struct {
	RepositoriesGroup *repository.RepositoriesGroup
}

func DefaultGroupService(rg *repository.RepositoriesGroup) *GroupService {
	groupService := &GroupService{
		RepositoriesGroup: rg,
	}

	return groupService
}


func (gs *GroupService) AddUserToGroupByName(userId int64, groupName string) error {

	err := gs.RepositoriesGroup.GroupsRepository.AddUserToGroupByName(userId, groupName)
	if err != nil {
		return err
	}

	return nil
}


func (gs *GroupService) RemoveUserFromGroupByName(userId int64, groupName string) error {

	err := gs.RepositoriesGroup.GroupsRepository.RemoveUserFromGroupByName(userId, groupName)
	if err != nil {
		return err
	}

	return nil
}
