package config

import (
	"os"
	"strconv"
	"stash.cqlcorp.net/mp/moja-portal/utility"
)

var (
	// Debug
	Debug bool
	DebugSecurity bool

	// DB
	DbName string
	DbUser string
	DbPassword string
	DbServer string

	// App Config
	Port string

	// Authentication
	AuthKey string
	UserAuthTimeout int64
	PasswordResetTimeout int64


	// SMTP
	SMTPServer string
	SMTPPort int64
	SMTPUser string
	SMTPPassword string
	SMTPFromAddress string
	SMTPSimulate bool


)

func init() {

	// Debug
	Debug = getBoolOrFail("DEBUG")
	DebugSecurity = getBoolOrFail("DEBUG_SECURITY")


	// DB
	DbName= getStringOrFail("DB_NAME")
	DbUser= getStringOrFail("DB_USER")
	DbPassword= getStringOrFail("DB_PASSWORD")
	DbServer= getStringOrFail("DB_SERVER")

	// App Config
	Port= getStringOrFail("PORT")

	// Authentication
	AuthKey = getStringOrFail("AUTHENTICATION_KEY")
	UserAuthTimeout = getIntOrFail("USER_AUTHENTICATION_TIMEOUT")
	PasswordResetTimeout = getIntOrFail("PASSWORD_RESET_TIMEOUT")

	// SMTP
	SMTPServer = getStringOrFail("SMTP_SERVER")
	SMTPPort = getIntOrFail("SMTP_PORT")
	SMTPUser = getStringOrFail("SMTP_USER")
	SMTPPassword = getStringOrFail("SMTP_PASSWORD")
	SMTPFromAddress = getStringOrFail("SMTP_FROM_ADDRESS")
	SMTPSimulate = getBoolOrFail("SMTP_SIMULATE")


}

func getIntOrFail(envVar string) int64 {
	is := os.Getenv(envVar)
	if is == "" {
		utility.Debug("Error retrieving envVar: " + envVar)
		os.Exit(1)
	}
	i, err := strconv.ParseInt(is, 10, 34)
	if err != nil {
		utility.Debug("Error parsing envVar: " + envVar + " into int: " + err.Error())
		os.Exit(0)
	}
	return i
}

func getStringOrFail(envVar string) string {
	s := os.Getenv(envVar)
	if s == "" {
		utility.Debug("Error retrieving envVar: " + envVar)
		os.Exit(1)
	}
	return s
}
func getBoolOrFail(envVar string) bool {
	bs := os.Getenv(envVar)
	if bs == "" {
		utility.Debug("Error retrieving envVar: " + envVar)
		os.Exit(1)
	}
	b, err := strconv.ParseBool(os.Getenv(envVar))
	if err != nil {
		utility.Debug("Error parsing envVar: " + envVar + " into bool: " + err.Error())
		os.Exit(0)
	}
	return b
}