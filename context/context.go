package context

import "time"

func Init() {

	// set config
	config := GoCMSConfig{
		DbName: GetEnvVarOrFail("DB_NAME"),
		DbUser: GetEnvVarOrFail("DB_USER"),
		DbPassword: GetEnvVarOrFail("DB_PASSWORD"),
		DbServer: GetEnvVarOrFail("DB_SERVER"),
	}
	Config = &config

	// set scheduler
	schedule := Scheduler{
		idCount: 0,
		tickers: make(map[int]*time.Ticker),
		timers: make(map[int]*time.Timer),
	}
	Schedule = &schedule

}
