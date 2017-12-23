package log

import (
	"github.com/fatih/color"
	"log"
	"os"
	"runtime/debug"
	"encoding/json"
	"fmt"
)

var LogLevel int64 = 3

const LOG_LEVEL_CRITICAL = 0
const LOG_LEVEL_ERROR = 1
const LOG_LEVEL_WARNING = 2
const LOG_LEVEL_DEBUG = 3
const LOG_LEVEL_WITH_STACK_TRACE = 4

// Criticalf print always. Print color.
func Criticalf(msg string, args ...interface{}) {
	if LogLevel >= LOG_LEVEL_CRITICAL {
		color.Set(color.FgRed)
		defer color.Unset()
		log.Printf("[CRITICAL] - "+msg, args...)
		if LogLevel >= LOG_LEVEL_WITH_STACK_TRACE {
			debug.PrintStack()
		}
		os.Exit(1)
	}
}

// Errorf print if error is enabled. Print color.
func Errorf(msg string, args ...interface{}) {
	if LogLevel >= LOG_LEVEL_ERROR {
		color.Set(color.FgRed)
		defer color.Unset()
		log.Printf("[ERROR] - "+msg, args...)
		if LogLevel >= LOG_LEVEL_WITH_STACK_TRACE {
			debug.PrintStack()
		}
	}
}

// Warningf print if warning is enabled. Print color.
func Warningf(msg string, args ...interface{}) {
	if LogLevel >= LOG_LEVEL_WARNING {
		color.Set(color.FgYellow)
		defer color.Unset()
		log.Printf("[WARNING] - "+msg, args...)
	}
}

// Debugf print if debug mode is enabled. print no color
func Debugf(msg string, args ...interface{}) {
	if LogLevel >= LOG_LEVEL_DEBUG {
		log.Printf("[DEBUG] - "+msg, args...)
	}
}

// Infof print always. Print no color
func Infof(msg string, args ...interface{}) {
	color.Set(color.FgBlue)
	defer color.Unset()
	log.Printf("[INFO] - "+msg, args...)
}

func PrettyPrint(v interface{}) string {
	b, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		Errorf("Error trying to pretty print output: %v\n", err)
	}
	s := fmt.Sprint(string(b))
	return  s
}