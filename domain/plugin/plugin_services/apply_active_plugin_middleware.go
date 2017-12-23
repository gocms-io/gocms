package plugin_services

import (
	"sort"
	"github.com/gocms-io/gocms/domain/plugin/plugin_proxies/plugin_middleware_proxy"
)

type MiddlewareRank string

const MIDDLEWARE_RANK_0 MiddlewareRank = "0"
const MIDDLEWARE_RANK_1 MiddlewareRank = "1-999"
const MIDDLEWARE_RANK_1000 MiddlewareRank = "1000-1999"
const MIDDLEWARE_RANK_2000 MiddlewareRank = "2000-2999"
const MIDDLEWARE_RANK_3000 MiddlewareRank = "3000+"

type PluginMiddlewareProxyByRank struct {
	Middleware0    []*plugin_middleware_proxy.PluginMiddlewareProxy
	Middleware1    []*plugin_middleware_proxy.PluginMiddlewareProxy
	Middleware1000 []*plugin_middleware_proxy.PluginMiddlewareProxy
	Middleware2000 []*plugin_middleware_proxy.PluginMiddlewareProxy
	Middleware3000 []*plugin_middleware_proxy.PluginMiddlewareProxy
}

// todo add a "NewPluginMiddleware" that sorts the middleware into the correct categories. Then use apply to sort and apply them
func (ps *PluginsService) NewPluginMiddlewareProxyByRank() *PluginMiddlewareProxyByRank{

	m0 := []*plugin_middleware_proxy.PluginMiddlewareProxy{}
	m1 := []*plugin_middleware_proxy.PluginMiddlewareProxy{}
	m1000 := []*plugin_middleware_proxy.PluginMiddlewareProxy{}
	m2000 := []*plugin_middleware_proxy.PluginMiddlewareProxy{}
	m3000 := []*plugin_middleware_proxy.PluginMiddlewareProxy{}

	// loop through all plugins
	for _, plugin := range ps.GetActivePlugins() {
		// loop through all middleware per plugin
		for _, mProxy := range plugin.MiddlewareProxies {
			if mProxy.ExecutionRank == 0 { // set proxies of rank 0
				m0 = append(m0, mProxy)
			} else if mProxy.ExecutionRank <= 999 { // set proxies of rank 1-999
				m1 = append(m1, mProxy)
			} else if mProxy.ExecutionRank <= 1999 { // set proxies of rank 1000-1999
				m1000 = append(m1000, mProxy)
			} else if mProxy.ExecutionRank <= 2999 { // set proxies of rank 2000-2999
				m2000 = append(m2000, mProxy)
			} else if mProxy.ExecutionRank >= 3000 { // set proxies of rank 3000 +
				m3000 = append(m3000, mProxy)
			}
		}
	}

	// sort all the slices
	sortByRank(m0)
	sortByRank(m1)
	sortByRank(m1000)
	sortByRank(m2000)
	sortByRank(m3000)

	pmpr := PluginMiddlewareProxyByRank{
		Middleware0: m0,
		Middleware1: m1,
		Middleware1000: m1000,
		Middleware2000: m2000,
		Middleware3000: m3000,
	}

	return &pmpr
}

func sortByRank(a []*plugin_middleware_proxy.PluginMiddlewareProxy) {
	sort.Slice(a, func(i, j int) bool {
		return a[i].ExecutionRank < a[j].ExecutionRank
	})
}


