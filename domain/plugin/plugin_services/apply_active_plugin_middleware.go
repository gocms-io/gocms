package plugin_services

import (
	"sort"
	"github.com/gocms-io/gocms/domain/plugin/plugin_model"
	"github.com/gocms-io/gocms/domain/plugin/plugin_proxies/plugin_middleware_proxy"
)

type MiddlewareRank string

const MIDDLEWARE_RANK_0 MiddlewareRank = "0"
const MIDDLEWARE_RANK_1 MiddlewareRank = "1-999"
const MIDDLEWARE_RANK_1000 MiddlewareRank = "1000-1999"
const MIDDLEWARE_RANK_2000 MiddlewareRank = "2000-2999"
const MIDDLEWARE_RANK_3000 MiddlewareRank = "3000+"

type MiddlewareByRank struct {
	Middleware0    []*plugin_middleware_proxy.PluginMiddlewareProxy
	Middleware1    []*plugin_middleware_proxy.PluginMiddlewareProxy
	Middleware1000 []*plugin_middleware_proxy.PluginMiddlewareProxy
	Middleware2000 []*plugin_middleware_proxy.PluginMiddlewareProxy
	Middleware3000 []*plugin_middleware_proxy.PluginMiddlewareProxy
}

func (ps *PluginsService) ApplyPluginMiddleware(executionRank int) error {

	// loop through all plugins
	for _, plugin := range ps.GetActivePlugins() {
		// loop through all middleware per plugin
		for _, middleware := range plugin {
			if middleware.
		}
	}

	sort.Ints(ps.activeMiddlewareByRank)

	return nil
}
