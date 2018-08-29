package log_repository

import (
	"github.com/myanrichal/gocms/domain/logs/log_model"
	"github.com/jmoiron/sqlx"
	"database/sql"
	"fmt"
)

type ILogRepository interface {
	RecordError(*log_model.ErrorLog) error
	GetLastError() (*log_model.ErrorLog, error)
	RecentError(string) (*log_model.ErrorLog, error)
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
	_, err := lr.database.NamedExec(`
	INSERT INTO gocms_error_logs (route, status, body, date)
		VALUES (:route, :status, :body, :date)
	`, record);
	if err != nil {
		return err
	}
	return nil
}

func (lr *LogRepository) RecentError(route string) (*log_model.ErrorLog, error) {
	var lastLog log_model.ErrorLog
	err := lr.database.Get(&lastLog, `
	SELECT * FROM gocms_error_logs 
	WHERE route = ?
	ORDER BY date desc
	LIMIT 1;
	`, route)

	if err != nil && err != sql.ErrNoRows {
		fmt.Println("throwing error")
		return nil, err
	}
	return &lastLog, nil
}


func (lr *LogRepository) GetLastError() (*log_model.ErrorLog, error) {
	var lastLog log_model.ErrorLog
	err := lr.database.Get(&lastLog, `
	SELECT * FROM gocms_error_logs 
	ORDER BY date desc
	LIMIT 1;
	`)
	if err != nil {
		return nil, err
	}
	return &lastLog, nil
}
