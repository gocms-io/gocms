package context

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

func GetIntOrFail(s string, settings map[string]models.Setting) int64 {
	is := settings[s].Value
	i, err := strconv.ParseInt(is, 10, 34)
	if err != nil {
		fmt.Println("Error parsing string: " + s + " into int: " + err.Error())
		os.Exit(0)
	}
	return i
}

func GetStringOrFail(s string, settings map[string]models.Setting) string {

	ss := settings[s].Value
	if ss == "" {
		fmt.Println("Error retrieving string: " + s)
		os.Exit(1)
	}
	return ss
}
func GetBoolOrFail(s string, settings map[string]models.Setting) bool {
	bs := settings[s].Value
	b, err := strconv.ParseBool(bs)
	if err != nil {
		fmt.Println("Error parsing bool: " + s + " into bool: " + err.Error())
		os.Exit(0)
	}
	return b
}
