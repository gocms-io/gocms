package log

import (
	"github.com/fatih/color"
	"log"
	"os"
	"runtime/debug"
)

var LogLevel int64 = 3

const LOG_LEVEL_CRITICAL = 0
const LOG_LEVEL_ERROR = 1
const LOG_LEVEL_WARNING = 2
const LOG_LEVEL_DEBUG = 3

// Criticalf print always. Print color.
func Criticalf(msg string, args ...interface{}) {
	if LogLevel >= LOG_LEVEL_CRITICAL {
		color.Set(color.FgRed)
		defer color.Unset()
		log.Printf(msg, args...)
		debug.PrintStack()
		os.Exit(1)
	}
}

// Errorf print if error is enabled. Print color.
func Errorf(msg string, args ...interface{}) {
	if LogLevel >= LOG_LEVEL_ERROR {
		color.Set(color.FgRed)
		defer color.Unset()
		log.Printf(msg, args...)
		debug.PrintStack()
	}
}

// Warningf print if warning is enabled. Print color.
func Warningf(msg string, args ...interface{}) {
	if LogLevel >= LOG_LEVEL_WARNING {
		color.Set(color.FgYellow)
		defer color.Unset()
		log.Printf(msg, args...)
	}
}

// Debugf print if debug mode is enabled. print no color
func Debugf(msg string, args ...interface{}) {
	if LogLevel >= LOG_LEVEL_DEBUG {
		log.Printf(msg, args...)
	}
}

// Infof print always. Print no color
func Infof(msg string, args ...interface{}) {
	color.Set(color.FgBlue)
	defer color.Unset()
	log.Printf(msg, args...)
}
