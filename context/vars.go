package context

import (
	"github.com/cqlcorp/gocms/domain/setting/setting_model"
	"crypto/rsa"
	"github.com/cqlcorp/gocms/utility/log"
	"github.com/dgrijalva/jwt-go"
)

type envVars struct {
	// DB (GET FROM ENV)
	DbName     string
	DbUser     string
	DbPassword string
	DbServer   string

	// Dev & Debug
	DevMode bool
	LogLevel   int64
}

type dbVars struct {
	// Debug
	Debug         bool
	DebugSecurity bool

	// App Config
	Port                string
	MsPort                string
	PublicApiUrl        string
	RedirectRootUrl     string
	CorsHost            string
	OpenRegistration    bool
	SettingsRefreshRate int64

	// Manifest Items From Plugins
	DisableDefaultLoginPage bool

	// Authentication
	UserAuthTimeout        int64
	PasswordResetTimeout   int64
	EmailActivationTimeout int64
	DeviceAuthTimeout      int64
	TwoFactorCodeTimeout   int64
	UseTwoFactor           bool
	PasswordComplexity     int64
	PermissionsCacheLife   int64
	MicroserviceSecret	string

	// rsa
	rsaPriv             *rsa.PrivateKey
	RSAPub              *rsa.PublicKey

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
	DisableDocumentationDisplay   bool
	ErrorReportAddress	  string
	ErrorReportDelay	  int64
}

func (dbVars *dbVars) LoadDbVars(settings map[string]setting_model.Setting) {
	log.Debugf("Refresh GoCMS Settings\n")

	// Debug
	dbVars.Debug = GetBoolOrFail("DEBUG", settings)
	dbVars.DebugSecurity = GetBoolOrFail("DEBUG_SECURITY", settings)

	// App Config
	dbVars.Port = GetStringOrFail("PORT", settings)
	dbVars.MsPort = GetStringOrFail("MS_PORT", settings)
	dbVars.PublicApiUrl = GetStringOrFail("PUBLIC_API_URL", settings)
	dbVars.RedirectRootUrl = GetStringOrFail("REDIRECT_ROOT_URL", settings)
	dbVars.CorsHost = GetStringOrFail("CORS_HOST", settings)
	dbVars.SettingsRefreshRate = GetIntOrFail("SETTINGS_REFRESH_RATE", settings)

	// Authentication
	dbVars.UserAuthTimeout = GetIntOrFail("USER_AUTHENTICATION_TIMEOUT", settings)
	dbVars.PasswordResetTimeout = GetIntOrFail("PASSWORD_RESET_TIMEOUT", settings)
	dbVars.DeviceAuthTimeout = GetIntOrFail("DEVICE_AUTHENTICATION_TIMEOUT", settings)
	dbVars.TwoFactorCodeTimeout = GetIntOrFail("TWO_FACTOR_CODE_TIMEOUT", settings)
	dbVars.EmailActivationTimeout = GetIntOrFail("EMAIL_ACTIVATION_TIMEOUT", settings)
	dbVars.UseTwoFactor = GetBoolOrFail("USE_TWO_FACTOR", settings)
	dbVars.PasswordComplexity = GetIntOrFail("PASSWORD_COMPLEXITY", settings)
	dbVars.OpenRegistration = GetBoolOrFail("OPEN_REGISTRATION", settings)
	dbVars.PermissionsCacheLife = GetIntOrFail("PERMISSIONS_CACHE_LIFE", settings)
	dbVars.MicroserviceSecret = GetStringOrFail("MS_SECRET_KEY", settings)

	// RSA
	// rsa priv privKey
	rsaPrivStr := GetStringOrFail("RSA_PRIV", settings)
	privKey, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(rsaPrivStr))
	if err !=nil {
		log.Criticalf("Can't parse rsa privKey: %v\n", err.Error())
	}
	dbVars.rsaPriv = privKey

	// rsa pub privKey
	rsaPubStr := GetStringOrFail("RSA_PUB", settings)
	pubKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(rsaPubStr))
	if err !=nil {
		log.Criticalf("Can't parse rsa pubKey: %v\n", err.Error())
	}
	dbVars.RSAPub = pubKey

	// SMTP
	dbVars.SMTPServer = GetStringOrFail("SMTP_SERVER", settings)
	dbVars.SMTPPort = GetIntOrFail("SMTP_PORT", settings)
	dbVars.SMTPUser = GetStringOrFail("SMTP_USER", settings)
	dbVars.SMTPPassword = GetStringOrFail("SMTP_PASSWORD", settings)
	dbVars.SMTPFromAddress = GetStringOrFail("SMTP_FROM_ADDRESS", settings)
	dbVars.SMTPSimulate = GetBoolOrFail("SMTP_SIMULATE", settings)

	// GoCMS
	dbVars.ActiveTheme = GetStringOrFail("ACTIVE_THEME", settings)
	dbVars.ActiveThemeAssetsBase = GetStringOrFail("ACTIVE_THEME_ASSETS_BASE", settings)
	dbVars.LoginTitle = GetStringOrFail("GOCMS_LOGIN_TITLE", settings)
	dbVars.LoginSuccessRedirect = GetStringOrFail("GOCMS_LOGIN_SUCCESS_REDIRECT", settings)
	dbVars.DisableDocumentationDisplay = GetBoolOrFail("DISABLE_DOCUMENTATION_DISPLAY", settings)
	dbVars.ErrorReportAddress = GetStringOrFail("ERROR_REPORT_ADDRESS", settings)
	dbVars.ErrorReportDelay = GetIntOrFail("ERROR_EMAIL_DELAY", settings)

}

func (dbVars *dbVars) GetRsaPrivateKey(iWillBeSecure bool) *rsa.PrivateKey {
	if iWillBeSecure {
		return dbVars.rsaPriv
	}

	return nil
}