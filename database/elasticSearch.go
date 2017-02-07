package goCMS_database

import (
	"gopkg.in/olivere/elastic.v5"
	"log"
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
