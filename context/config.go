package context

import "github.com/menklab/goCMS/models"

var Config *GoCMSConfig

type GoCMSConfig struct {
	// DB (GET FROM ENV)
	DbName                 string
	DbUser                 string
	DbPassword             string
	DbServer               string

	// Debug
	Debug                  bool
	DebugSecurity          bool

	// App Config
	Port                   string
	PublicApiUrl           string
	RedirectRootUrl        string
	CorsHost               string
	OpenRegistration       bool

	// Authentication
	AuthKey                string
	UserAuthTimeout        int64
	PasswordResetTimeout   int64
	EmailActivationTimeout int64
	DeviceAuthTimeout      int64
	TwoFactorCodeTimeout   int64
	UseTwoFactor           bool
	PasswordComplexity     int64


	// SMTP
	SMTPServer             string
	SMTPPort               int64
	SMTPUser               string
	SMTPPassword           string
	SMTPFromAddress        string
	SMTPSimulate           bool
}

func Init() {
	config := GoCMSConfig{
		DbName: GetEnvVarOrFail("DB_NAME"),
		DbUser: GetEnvVarOrFail("DB_USER"),
		DbPassword: GetEnvVarOrFail("DB_PASSWORD"),
		DbServer: GetEnvVarOrFail("DB_SERVER"),
	}

	Config = &config
}

func (c *GoCMSConfig) ApplySettingsToConfig(settings map[string]models.Setting) {
	// Debug
	c.Debug = GetBoolOrFail(settings["DEBUG"].Value)
	c.DebugSecurity = GetBoolOrFail(settings["DEBUG_SECURITY"].Value)


	// App Config
	c.Port = GetStringOrFail(settings["PORT"].Value)
	c.PublicApiUrl = GetStringOrFail(settings["PUBLIC_API_URL"].Value)
	c.RedirectRootUrl = GetStringOrFail(settings["REDIRECT_ROOT_URL"].Value)
	c.CorsHost = GetStringOrFail(settings["CORS_HOST"].Value)

	// Authentication
	c.AuthKey = GetStringOrFail(settings["AUTHENTICATION_KEY"].Value)
	c.UserAuthTimeout = GetIntOrFail(settings["USER_AUTHENTICATION_TIMEOUT"].Value)
	c.PasswordResetTimeout = GetIntOrFail(settings["PASSWORD_RESET_TIMEOUT"].Value)
	c.DeviceAuthTimeout = GetIntOrFail(settings["DEVICE_AUTHENTICATION_TIMEOUT"].Value)
	c.TwoFactorCodeTimeout = GetIntOrFail(settings["TWO_FACTOR_CODE_TIMEOUT"].Value)
	c.EmailActivationTimeout = GetIntOrFail(settings["EMAIL_ACTIVATION_TIMEOUT"].Value)
	c.UseTwoFactor = GetBoolOrFail(settings["USE_TWO_FACTOR"].Value)
	c.PasswordComplexity = GetIntOrFail(settings["PASSWORD_COMPLEXITY"].Value)
	c.OpenRegistration = GetBoolOrFail(settings["OPEN_REGISTRATION"].Value)

	// SMTP
	c.SMTPServer = GetStringOrFail(settings["SMTP_SERVER"].Value)
	c.SMTPPort = GetIntOrFail(settings["SMTP_PORT"].Value)
	c.SMTPUser = GetStringOrFail(settings["SMTP_USER"].Value)
	c.SMTPPassword = GetStringOrFail(settings["SMTP_PASSWORD"].Value)
	c.SMTPFromAddress = GetStringOrFail(settings["SMTP_FROM_ADDRESS"].Value)
	c.SMTPSimulate = GetBoolOrFail(settings["SMTP_SIMULATE"].Value)
}
