package goCMS_elasticSearch_migrations

type ElasticSearchMigration struct {
	Index string
	BodyString string
}

type ElasticSearchMigrationList []*ElasticSearchMigration
