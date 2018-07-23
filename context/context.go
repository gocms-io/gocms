package context

import (
	"github.com/myanrichal/gocms/utility/log"
	_ "github.com/joho/godotenv/autoload"
	"os"
	"strconv"
	"time"
)

var Config *Context

type Context struct {
	EnvVars *envVars
	DbVars  *dbVars
}

func init() {

	// log level
	logLevel, err := strconv.ParseInt(os.Getenv("LOG_LEVEL"), 10, 32)
	if err != nil {
		logLevel = 4
	}
	log.LogLevel = logLevel

	devMode, err := strconv.ParseBool(os.Getenv("DEV_MODE"))
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
