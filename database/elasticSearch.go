package goCMS_database

import (
	"gopkg.in/olivere/elastic.v5"
	"log"
	"github.com/menklab/goCMS/database/migrations/elasticSearch"
	"context"
)

type ElasticSearch struct {
	Client *elastic.Client
}

func DefaultElasticSearch() *ElasticSearch {
	// Create a client
	client, err := elastic.NewClient()
	if err != nil {
		log.Fatalf("Error connecting to elastic search: %s\n", err.Error())
	}

	es := ElasticSearch{
		Client: client,
	}

	return &es
}

func (database *Database) MigrateElasticSearch(migrations goCMS_elasticSearch_migrations.ElasticSearchMigrationList) {
	for _, migration := range migrations {

		// Check if the index exists
		exists, err := database.ElasticSearch.Client.IndexExists(migration.Index).Do(context.Background())
		if err != nil {
			log.Fatalf("Error checking if elastic search index %v exists: %s\n", migration.Index, err.Error())
		}
		if !exists {
			//create index
			createIndex, err := database.ElasticSearch.Client.CreateIndex(migration.Index).BodyString(migration.BodyString).Do(context.Background())
			if err != nil {
				log.Fatalf("Error creating index %v in elastic search: %s\n", migration.Index, err.Error())
			}
			if !createIndex.Acknowledged {
				log.Fatalf("Error creating index %v in elastic search: not acknowledged.\n", migration.Index)
			}
			log.Printf("Created Index %s.\n", migration.Index)
		}
	}
}
