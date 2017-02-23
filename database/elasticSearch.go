package goCMS_database

import (
	"gopkg.in/olivere/elastic.v5"
	"log"
	"github.com/menklab/goCMS/database/migrations/elasticSearch"
	"context"
	"github.com/smartystreets/go-aws-auth"
	"net/http"
	"github.com/menklab/goCMS/context"
)

type ElasticSearch struct {
	Client *elastic.Client
}

/////////////////// fix for aws signing ////////////////////////
type AWSSigningTransport struct {
	HTTPClient  *http.Client
	Credentials awsauth.Credentials
}

// RoundTrip implementation
func (a AWSSigningTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	return a.HTTPClient.Do(awsauth.Sign4(req, a.Credentials))
}
/////////////////// fix for aws signing ////////////////////////

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

	// do crazy aws stuff
	signingTransport := AWSSigningTransport{
		Credentials: awsauth.Credentials{
			AccessKeyID:     goCMS_context.Config.ElasticSearchAwsUser,
			SecretAccessKey: goCMS_context.Config.ElasticSearchAwsSecret,
		},
		HTTPClient: http.DefaultClient,
	}
	signingClient := &http.Client{Transport: http.RoundTripper(signingTransport)}

	// create client
	client, err := elastic.NewClient(
		elastic.SetURL(goCMS_context.Config.ElasticSearchConnectionUrl),
		elastic.SetScheme("https"),
		elastic.SetHttpClient(signingClient),
		elastic.SetSniff(false),)
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
