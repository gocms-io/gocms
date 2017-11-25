package context

import (
	"github.com/gocms-io/gocms/utility/log"
	"strconv"
	"time"
)

var Config *Context

type Context struct {
	EnvVars *envVars
	DbVars  *dbVars
}

func Init() {

	// log level
	logLevel, err := strconv.ParseInt(GetEnvVarOrFail("LOG_LEVEL"), 10, 32)
	if err != nil {
		logLevel = 4
	}
	log.LogLevel = logLevel

	devMode, err := strconv.ParseBool(GetEnvVarOrFail("DEV_MODE"))
	if err != nil {
		devMode = false
	}

	// set config
	config := Context{

		EnvVars: &envVars{
			DbName:     GetEnvVarOrFail("DB_NAME"),
			DbUser:     GetEnvVarOrFail("DB_USER"),
			DbPassword: GetEnvVarOrFail("DB_PASSWORD"),
			DbServer:   GetEnvVarOrFail("DB_SERVER"),
			LogLevel:   logLevel,
			DevMode:    devMode,
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
