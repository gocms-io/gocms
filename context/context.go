package context

import (
	"time"
	"strconv"
	"github.com/gocms-io/gocms/utility/log"
)

var Config *Context

type Context struct {
	EnvVars *envVars
	DbVars  *dbVars
}

func Init() {

	logLevel, err := strconv.ParseInt(GetEnvVarOrFail("Log_Level"), 10, 32)
	if err != nil {
		logLevel = 4
	}
	log.LogLevel = logLevel

	// set config
	config := Context{

		EnvVars: &envVars{
			DbName:     GetEnvVarOrFail("DB_NAME"),
			DbUser:     GetEnvVarOrFail("DB_USER"),
			DbPassword: GetEnvVarOrFail("DB_PASSWORD"),
			DbServer:   GetEnvVarOrFail("DB_SERVER"),
			LogLevel:   logLevel,
		},
		DbVars: &dbVars{},
	}

	Config = &config

	// set scheduler
	schedule := Scheduler{
		idCount: 0,
		tickers: make(map[int]*time.Ticker),
		timers:  make(map[int]*time.Timer),
	}
	Schedule = &schedule
}
