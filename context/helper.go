package goCMS_context

import (
	"fmt"
	"os"
	"strconv"
	"github.com/menklab/goCMS/models"
)

func GetEnvVarOrFail(envVar string) string {
	is := os.Getenv(envVar)
	if is == "" {
		fmt.Println("Error retrieving envVar: " + envVar)
		os.Exit(1)
	}
	return is
}

func GetIntOrFail(s string, settings map[string]goCMS_models.Setting) int64 {
	is := settings[s].Value
	i, err := strconv.ParseInt(is, 10, 34)
	if err != nil {
		fmt.Println("Error parsing string: " + is + " into int: " + err.Error())
		os.Exit(0)
	}
	return i
}

func GetStringOrFail(s string, settings map[string]goCMS_models.Setting) string {

	s = settings[s].Value
	if s == "" {
		fmt.Println("Error retrieving string: " + s)
		os.Exit(1)
	}
	return s
}
func GetBoolOrFail(s string, settings map[string]goCMS_models.Setting) bool {
	bs := settings[s].Value
	b, err := strconv.ParseBool(bs)
	if err != nil {
		fmt.Println("Error parsing bool: " + bs + " into bool: " + err.Error())
		os.Exit(0)
	}
	return b
}
