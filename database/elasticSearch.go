package goCMS_database

import (
	"gopkg.in/olivere/elastic.v5"
	"log"
	"github.com/menklab/goCMS/database/migrations/elasticSearch"
	"context"
	"github.com/menklab/goCMS/context"
	"github.com/sha1sum/aws_signing_client"
	"github.com/aws/aws-sdk-go/aws/signer/v4"
	"github.com/aws/aws-sdk-go/aws/credentials"
)

type ElasticSearch struct {
	Client *elastic.Client
}

func DefaultElasticSearch() *ElasticSearch {
	// Create a client
	client, err := elastic.NewClient(elastic.SetURL(goCMS_context.Config.ElasticSearchConnectionUrl))
	if err != nil {
		log.Fatalf("Error connecting to elastic search: %s\n", err.Error())
	}

	es := ElasticSearch{
		Client: client,
	}

	return &es
}

func DefaultAWSElasticSearch() *ElasticSearch {

	signer := v4.NewSigner(credentials.NewStaticCredentials(goCMS_context.Config.ElasticSearchAwsUser, goCMS_context.Config.ElasticSearchAwsSecret, ""))
	awsClient, err := aws_signing_client.New(signer, nil, "es", goCMS_context.Config.ElasticSearchAwsRegion)
	if err != nil {
		log.Fatalf("Error creating aws client: %s\n", err.Error())
	}
	client, err := elastic.NewClient(
		elastic.SetURL(goCMS_context.Config.ElasticSearchConnectionUrl),
		elastic.SetScheme("https"),
		elastic.SetHttpClient(awsClient),
		elastic.SetSniff(false), // See note below
	)
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
			log.Printf("Elastic search created index %s.\n", migration.Index)
		}
	}
}
