package log_service

import (
	"github.com/myanrichal/gocms/utility"
	"github.com/myanrichal/gocms/domain/logs/log_model"
	"github.com/myanrichal/gocms/utility/errors"
	"github.com/myanrichal/gocms/init/repository"
)

type ILogService interface {
	RecordError(*log_model.ErrorLog) error
	GetLastError() (*log_model.ErrorLog, error)
}

type LogService struct {
	RepositoriesGroup *repository.RepositoriesGroup
}

func DefaultLogService(rg *repository.RepositoriesGroup) {
	logService := &LogService {
		RepositoriesGroup: rg,
	}
	return logService
}

func (ls *LogService) RecordError(record *log_model.ErrorLog) error {

}

func (ls *LogService) GetLastError() {*log_model.ErrorLog, error) {

}