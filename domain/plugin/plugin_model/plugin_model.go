package plugin_model

import (
	"os/exec"
	"time"
	"github.com/gocms-io/gocms/domain/plugin/plugin_proxies/plugin_routes_proxy"
	"github.com/gocms-io/gocms/domain/plugin/plugin_proxies/plugin_middleware_proxy"
	"database/sql"
)

// Plugin is the default plugin object used by GoCMS. For a default plugin look at:
// github.com/gocms-io/plugin-contact-form
type Plugin struct {
	PluginRoot        string
	BinaryFile        string
	Schema            string
	Manifest          *PluginManifest
	RoutesProxy       *plugin_routes_proxy.PluginRoutesProxy
	MiddlewareProxies []*plugin_middleware_proxy.PluginMiddlewareProxy
	Cmd               *exec.Cmd
	Running           bool
	Database          *PluginDatabaseRecord
	IsExternal     bool           `db:"isExternal"`
	ExternalSchema sql.NullString `db:"externalSchema"`
	ExternalHost   sql.NullString `db:"externalHost"`
	ExternalPort   sql.NullInt64 `db:"externalPort"`
}

// PluginManifest is the root manifest object.
type PluginManifest struct {
	// Id is used as a unique identifier. Think of it as the namespace. No 2 plugins can have the same Id.
	Id string `json:"id"`
	// Version is used to indicate the version of the plugin installed.
	Version string `json:"version"`
	// Build similar to the version this is the actual build number. This will be used later in the plugin store.
	Build int `json:"build"`
	// Name display name for the plugin within the GoCMS settings.
	Name string `json:"name"`
	// Description is a short description displayed in the GoCMS settings.
	Description string `json:"description"`
	// Author displayed in GoCMS
	Author string `json:"author"`
	// AuthorUrl this is a link to the Author's website.
	AuthorUrl string `json:"authorUrl"`
	// AuthorEmail this is the contact information for the author of the plugin.
	AuthorEmail string `json:"authorEmail"`
	// Services see "PluginServices"
	Services PluginServices `json:"services"`
	// Interface see "Plugin Interface"
	Interface PluginInterface `json:"interface"`
}

// PluginServices should the plugin provide backend services, like an API, that configuration is done in this section.
type PluginServices struct {
	// Routes See "Plugin ManifestRoute"
	Routes      []*PluginManifestRoute      `json:"routes"`
	Middleware  []*PluginManifestMiddleware `json:"middleware"`
	Bin         string                      `json:"bin"`
	Docs        string                      `json:"docs"`
	HealthCheck bool                        `json:"healthCheck"`
}

// PluginManifestRoute routes for the api services are defined here. Currently only HTTP Request are supported through a reverse proxy provided by the GoCMS Parent Service
type PluginManifestRoute struct {
	// Name the name of the route. This will be used in the future for logging and other items.
	Name string `json:"name"`
	// Route the actual GoCMS route to register an endpoint against. Available routes can be found here:
	// github.com/gocms-io/gocms/blob/alpha-release/routes/routes.go
	Route string `json:"route"`
	// Method for the HTTP request. Ex GET, POST, UPDATE, DELETE
	Method string `json:"method"`
	// URL the path for the reverse proxy to redirect on if the Route, Method, and URL, match on.
	Url string `json:"url"`
	// DisableNamespace GoCMS will utilize the plugin id and prepend it to the URL to guarantee that all plugins play nice. This can cause for ugly api endpoints.
	// this functionality can be disabled. When disabled the URL will be only what is specified. If there is a conflict with another plugin GoCMS will crash.
	DisableNamespace bool `json:"disableNamespace"`
	// Permissions required for access to this endpoint. This requires "Route=Auth". If no permissions are specified the assumption is that the user must simply be authenticated.
	// Plugin specific permissions can be specified. Additionally, default GoCMS permissions can be specified. For a list of GoCMS provided permissions
	// look here:
	// github.com/gocms-io/gocms/tree/alpha-release/domain/acl/permissions/permissions.go
	Permissions []string `json:"permissions,omitempty"`
}

// PluginManifestRoute manifest for the api services are defined here. Currently only HTTP Request are supported through a reverse proxy provided by the GoCMS Parent Service
// Request go out to the plugin over a reserved <HOST>:<PLUGIN PORT>/middleware/ request
type PluginManifestMiddleware struct {
	// Name the name of the middleware. This will be used in the future for logging and other items.
	Name string `json:"name"`
	// ExecutionRank order lower numbers execute first. Based on a 1k scale.
	// 0 middleware doesn't run
	// 1-999 is pre-gocms middleware.
	// 1000-1999 post gocms middlware but pre gocms auth
	// 2000-2999 post gocms auth but before gocms routes
	// 3000 -3999 after gocms routes before plugin routes
	// 4000 -> after plugin routes but before gocms no routes handler
	ExecutionRank int64 `json:"executionRank"`
	// Headers that the middleware should respond to the proxy with
	HeadersToReceive []string `json:"headersToReceive"`
	// If the middleware should modify the body of the original request
	CopyBody bool `json:"copyBody"`
	// Continue executing request on error
	ContinueOnError bool `json:"continueOnError"`
	// If the middleware error response should be passed along
	PassAlongError bool `json:"passAlongError"`
	// DisableNamespace GoCMS will utilize the plugin id and prepend it to the URL to guarantee that all plugins play nice. This can cause for ugly api endpoints.
	// this functionality can be disabled. When disabled the URL will be only what is specified. If there is a conflict with another plugin GoCMS will crash.
	DisableNamespace bool `json:"disableNamespace"`
}

// PluginInterface when plugins provide front-end functionality they must serve specific files. More details on this later. For now see the Contact Form Plugin Example:
// github.com/gocms-io/plugin-contact-form
type PluginInterface struct {
	Public       string `json:"public"`
	PublicVendor string `json:"publicVendor"`
	PublicStyle  string `json:"publicStyle"`
	Admin        string `json:"admin"`
	AdminVendor  string `json:"adminVendor"`
	AdminStyle   string `json:"adminStyle"`
}

// PluginDatabaseRecord is utilized internally by GoCMS. This is NOT part of the manifest.
type PluginDatabaseRecord struct {
	Id             int            `db:"id"`
	PluginId       string         `db:"pluginId"`
	Name           string         `db:"name"`
	Build          int            `db:"build"`
	IsActive       bool           `db:"isActive"`
	IsExternal     bool           `db:"isExternal"`
	ExternalSchema sql.NullString `db:"externalSchema"`
	ExternalHost   sql.NullString `db:"externalHost"`
	ExternalPort   sql.NullInt64 `db:"externalPort"`
	ManifestData   sql.NullString `db:"manifest"`
	Manifest       *PluginManifest `db:"-"`
	Created        time.Time      `db:"created"`
	LastModified   time.Time      `db:"lastModified"`
}
