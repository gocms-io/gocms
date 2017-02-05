package goCMS_database

import (
	_"github.com/go-sql-driver/mysql"
)



type Database struct {
	SQL *SQL
	ElasticSearch *ElasticSearch
}

func Default() *Database{

	database := Database{
		SQL: DefaultSQL(),
		ElasticSearch: DefaultElasticSearch(),
	}

	return &database
}








