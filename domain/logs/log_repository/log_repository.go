package log_repository

import (
	"database/sql"
	"github.com/myanrichal/gocms/domain/logs/log_model"
	"github.com/myanrichal/gocms/utility/log"
	"github.com/myanrichal/gocms/utility/errors"
	"github.com/jmoiron/sqlx"
	"time"
)

type ILogRepository interface {
	RecordError(*log_model.ErrorLog) error
	GetLastError() (*log_model.ErrorLog, error)
}

type LogRepository struct {
	database *sqlx.DB
}

func DefaultLogRepository(dbx *sqlx.DB) *LogRepository {
	logRepository := &LogRepository {
		database: dbx,
	}
	return logRepository
}

func (lr *LogRepository) RecordError(record *log_model.ErrorLog) error {

}

func (lr *LogRepository) GetLastError() (*log_model.ErrorLog, error) {
	
}
