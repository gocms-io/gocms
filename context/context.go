package context

import "time"

var Config *Context

type Context struct {
	EnvVars *envVars
	DbVars  *dbVars
}

func Init() {

	// set config
	config := Context{
		EnvVars: &envVars{
			DbName:     GetEnvVarOrFail("DB_NAME"),
			DbUser:     GetEnvVarOrFail("DB_USER"),
			DbPassword: GetEnvVarOrFail("DB_PASSWORD"),
			DbServer:   GetEnvVarOrFail("DB_SERVER"),
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