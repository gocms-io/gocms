package context

import (
	"github.com/gocms-io/gocms/domain/setting/setting_model"
	"github.com/gocms-io/gocms/utility/log"
	"os"
	"strconv"
)

func GetEnvVarOrFail(envVar string) string {
	is := os.Getenv(envVar)
	if is == "" {
		log.Criticalf("Error retrieving envVar: " + envVar)
		os.Exit(1)
	}
	return is
}

func GetIntOrFail(s string, settings map[string]setting_model.Setting) int64 {
	is := settings[s].Value
	i, err := strconv.ParseInt(is, 10, 34)
	if err != nil {
		log.Criticalf("Error parsing string: " + s + " into int: " + err.Error())
		os.Exit(0)
	}
	return i
}

func GetStringOrFail(s string, settings map[string]setting_model.Setting) string {

	ss := settings[s].Value
	if ss == "" {
		log.Criticalf("Error retrieving string: " + s)
		os.Exit(1)
	}
	return ss
}
func GetBoolOrFail(s string, settings map[string]setting_model.Setting) bool {
	bs := settings[s].Value
	b, err := strconv.ParseBool(bs)
	if err != nil {
		log.Criticalf("Error parsing bool: " + s + " into bool: " + err.Error())
		os.Exit(0)
	}
	return b
}
