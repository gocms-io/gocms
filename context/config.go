package context

import (
	"github.com/gocms-io/gocms/models/runtime_models"
	"log"
)

var Config *RuntimeConfig

type RuntimeConfig struct {
	// DB (GET FROM ENV)
	DbName     string
	DbUser     string
	DbPassword string
	DbServer   string

	// Debug
	Debug         bool
	DebugSecurity bool

	// App Config
	Port                string
	PublicApiUrl        string
	RedirectRootUrl     string
	CorsHost            string
	OpenRegistration    bool
	SettingsRefreshRate int64

	// Manifest Items From Plugins
	DisableDefaultLoginPage bool

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
	SMTPServer      string
	SMTPPort        int64
	SMTPUser        string
	SMTPPassword    string
	SMTPFromAddress string
	SMTPSimulate    bool

	// GoCMS
	ActiveTheme           string
	ActiveThemeAssetsBase string
	LoginTitle            string
	LoginSuccessRedirect  string
}

func (c *RuntimeConfig) ApplySettingsToConfig(settings map[string]runtime_models.Setting) {

	log.Printf("Refresh GoCMS Settings\n")

	// Debug
	c.Debug = GetBoolOrFail("DEBUG", settings)
	c.DebugSecurity = GetBoolOrFail("DEBUG_SECURITY", settings)

	// App Config
	c.Port = GetStringOrFail("PORT", settings)
	c.PublicApiUrl = GetStringOrFail("PUBLIC_API_URL", settings)
	c.RedirectRootUrl = GetStringOrFail("REDIRECT_ROOT_URL", settings)
	c.CorsHost = GetStringOrFail("CORS_HOST", settings)
	c.SettingsRefreshRate = GetIntOrFail("SETTINGS_REFRESH_RATE", settings)

	// Authentication
	c.AuthKey = GetStringOrFail("AUTHENTICATION_KEY", settings)
	c.UserAuthTimeout = GetIntOrFail("USER_AUTHENTICATION_TIMEOUT", settings)
	c.PasswordResetTimeout = GetIntOrFail("PASSWORD_RESET_TIMEOUT", settings)
	c.DeviceAuthTimeout = GetIntOrFail("DEVICE_AUTHENTICATION_TIMEOUT", settings)
	c.TwoFactorCodeTimeout = GetIntOrFail("TWO_FACTOR_CODE_TIMEOUT", settings)
	c.EmailActivationTimeout = GetIntOrFail("EMAIL_ACTIVATION_TIMEOUT", settings)
	c.UseTwoFactor = GetBoolOrFail("USE_TWO_FACTOR", settings)
	c.PasswordComplexity = GetIntOrFail("PASSWORD_COMPLEXITY", settings)
	c.OpenRegistration = GetBoolOrFail("OPEN_REGISTRATION", settings)

	// SMTP
	c.SMTPServer = GetStringOrFail("SMTP_SERVER", settings)
	c.SMTPPort = GetIntOrFail("SMTP_PORT", settings)
	c.SMTPUser = GetStringOrFail("SMTP_USER", settings)
	c.SMTPPassword = GetStringOrFail("SMTP_PASSWORD", settings)
	c.SMTPFromAddress = GetStringOrFail("SMTP_FROM_ADDRESS", settings)
	c.SMTPSimulate = GetBoolOrFail("SMTP_SIMULATE", settings)

	// GoCMS
	c.ActiveTheme = GetStringOrFail("ACTIVE_THEME", settings)
	c.ActiveThemeAssetsBase = GetStringOrFail("ACTIVE_THEME_ASSETS_BASE", settings)
	c.LoginTitle = GetStringOrFail("GOCMS_LOGIN_TITLE", settings)
	c.LoginSuccessRedirect = GetStringOrFail("GOCMS_LOGIN_SUCCESS_REDIRECT", settings)

}
