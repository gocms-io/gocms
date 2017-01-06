package config

import (
	"github.com/menklab/goCMS/models"
)

var (
	// Debug
	Debug bool
	DebugSecurity bool

	// App Config
	Port string
	PublicApiUrl string
	RedirectRootUrl string
	CorsHost string
	OpenRegistration bool

	// Authentication
	AuthKey string
	UserAuthTimeout int64
	PasswordResetTimeout int64
	EmailActivationTimeout int64
	DeviceAuthTimeout int64
	TwoFactorCodeTimeout int64
	UseTwoFactor bool
	PasswordComplexity int64


	// SMTP
	SMTPServer string
	SMTPPort int64
	SMTPUser string
	SMTPPassword string
	SMTPFromAddress string
	SMTPSimulate bool

)

func SetSettingsFromDb(settings map[string]models.Setting) {

	// Debug
	Debug = getBoolOrFail(settings["DEBUG"].Value)
	DebugSecurity = getBoolOrFail(settings["DEBUG_SECURITY"].Value)


	// App Config
	Port= getStringOrFail(settings["PORT"].Value)
	PublicApiUrl = getStringOrFail(settings["PUBLIC_API_URL"].Value)
	RedirectRootUrl = getStringOrFail(settings["REDIRECT_ROOT_URL"].Value)
	CorsHost = getStringOrFail(settings["CORS_HOST"].Value)

	// Authentication
	AuthKey = getStringOrFail(settings["AUTHENTICATION_KEY"].Value)
	UserAuthTimeout = getIntOrFail(settings["USER_AUTHENTICATION_TIMEOUT"].Value)
	PasswordResetTimeout = getIntOrFail(settings["PASSWORD_RESET_TIMEOUT"].Value)
	DeviceAuthTimeout = getIntOrFail(settings["DEVICE_AUTHENTICATION_TIMEOUT"].Value)
	TwoFactorCodeTimeout = getIntOrFail(settings["TWO_FACTOR_CODE_TIMEOUT"].Value)
	EmailActivationTimeout = getIntOrFail(settings["EMAIL_ACTIVATION_TIMEOUT"].Value)
	UseTwoFactor = getBoolOrFail(settings["USE_TWO_FACTOR"].Value)
	PasswordComplexity = getIntOrFail(settings["PASSWORD_COMPLEXITY"].Value)
	OpenRegistration = getBoolOrFail(settings["OPEN_REGISTRATION"].Value)

	// SMTP
	SMTPServer = getStringOrFail(settings["SMTP_SERVER"].Value)
	SMTPPort = getIntOrFail(settings["SMTP_PORT"].Value)
	SMTPUser = getStringOrFail(settings["SMTP_USER"].Value)
	SMTPPassword = getStringOrFail(settings["SMTP_PASSWORD"].Value)
	SMTPFromAddress = getStringOrFail(settings["SMTP_FROM_ADDRESS"].Value)
	SMTPSimulate = getBoolOrFail(settings["SMTP_SIMULATE"].Value)
}