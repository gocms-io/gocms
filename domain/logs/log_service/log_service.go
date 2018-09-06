package log_service

import (
	// "github.com/cqlcorp/gocms/utility"
	"github.com/cqlcorp/gocms/domain/logs/log_model"
	// "github.com/cqlcorp/gocms/utility/errors"
	"github.com/cqlcorp/gocms/init/repository"
	"time"
	"github.com/cqlcorp/gocms/context"
)

type ILogService interface {
	RecordError(*log_model.ErrorLog) error
	GetLastError() (*log_model.ErrorLog, error)
	RecentError(*log_model.ErrorLog) (bool, error)
}

type LogService struct {
	RepositoriesGroup *repository.RepositoriesGroup
}

func DefaultLogService(rg *repository.RepositoriesGroup) *LogService{
	logService := &LogService {
		RepositoriesGroup: rg,
	}
	return logService
}

func (ls *LogService) RecordError(record *log_model.ErrorLog) error {
	err := ls.RepositoriesGroup.LogRepository.RecordError(record)
	if err != nil {
		return err
	}
	return nil
}

func (ls *LogService) GetLastError() (*log_model.ErrorLog, error) {
	_, err := ls.RepositoriesGroup.LogRepository.GetLastError()
	if err != nil {
		return nil, err
	}
	var dat log_model.ErrorLog
	return &dat, nil
}

func (ls *LogService) RecentError(record *log_model.ErrorLog) (bool, error) {
	
	lastError, err := ls.RepositoriesGroup.LogRepository.RecentError(record.Route)
	if err != nil {
		return false, err
	}

	interval := lastError.Time.Add(time.Minute * time.Duration(context.Config.DbVars.ErrorReportDelay))

	if time.Now().After(interval) {
		//record the error its new and recent
		err := ls.RepositoriesGroup.LogRepository.RecordError(record)
		if err != nil {
			return true, err
		}

		return true, nil
	}
	return false, nil
}