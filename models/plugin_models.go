package models

import "time"

type PluginManifest struct {
	Id          string          `json:"id"`
	Version     string          `json:"version"`
	Build       int             `json:"build"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Author      string          `json:"author"`
	AuthorUrl   string          `json:"authorUrl"`
	AuthorEmail string          `json:"authorEmail"`
	Services    PluginServices  `json:"services"`
	Interface   PluginInterface `json:"interface"`
}

type PluginManifestRoute struct {
	Name   string `json:"name"`
	Route  string `json:"route"`
	Method string `json:"method"`
	Url    string `json:"url"`
}

type PluginServices struct {
	Routes []*PluginManifestRoute `json:"routes"`
	Bin    string                 `json:"bin"`
}
type PluginInterface struct {
	Public       string `json:"public"`
	PublicVendor string `json:"publicVendor"`
}

type PluginDatabaseRecord struct {
	Id       int       `db:"id"`
	PluginId string    `db:"pluginId"`
	Name     string    `db:"name"`
	Build    int       `db:"build"`
	IsActive bool      `db:"isActive"`
	Created  time.Time `db:"created"`
}
