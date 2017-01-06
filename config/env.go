package config


var (
	// DB
	DbName string
	DbUser string
	DbPassword string
	DbServer string
)

func init() {
	// DB
	DbName= getStringOrFail(getEnvVarOrFail("DB_NAME"))
	DbUser= getStringOrFail(getEnvVarOrFail("DB_USER"))
	DbPassword= getStringOrFail(getEnvVarOrFail("DB_PASSWORD"))
	DbServer= getStringOrFail(getEnvVarOrFail("DB_SERVER"))
}

