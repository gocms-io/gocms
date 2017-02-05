package goCMS_context

import (
	"os"
	"fmt"
	"strconv"
)

func GetEnvVarOrFail(envVar string) string {
	is := os.Getenv(envVar)
	if is == "" {
		fmt.Println("Error retrieving envVar: " + envVar)
		os.Exit(1)
	}
	return is
}

func GetIntOrFail(is string) int64 {
	i, err := strconv.ParseInt(is, 10, 34)
	if err != nil {
		fmt.Println("Error parsing string: " + is + " into int: " + err.Error())
		os.Exit(0)
	}
	return i
}

func GetStringOrFail(s string) string {
	if s == "" {
		fmt.Println("Error retrieving string: " + s)
		os.Exit(1)
	}
	return s
}
func GetBoolOrFail(bs string) bool {
	b, err := strconv.ParseBool(bs)
	if err != nil {
		fmt.Println("Error parsing bool: " + bs + " into bool: " + err.Error())
		os.Exit(0)
	}
	return b
}