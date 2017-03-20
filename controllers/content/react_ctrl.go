package content_ctrl

import (
	crand "crypto/rand"
	"encoding/binary"
	"fmt"
	"html/template"
	"math/rand"
	"net/http"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/eventloop"
	"github.com/dop251/goja_nodejs/require"
	"github.com/fatih/structs"
	"github.com/gin-gonic/gin"
	"github.com/nu7hatch/gouuid"
	"github.com/olebedev/gojax/fetch"
	"io/ioutil"
	"log"
)

type ReactController struct {
	react  *React
	engine *gin.Engine
}

func DefaultReactController(e *gin.Engine, react *React) *ReactController {
	rc := &ReactController{
		react:  react,
		engine: e,
	}

	rc.Default()
	return rc
}

func (rc *ReactController) Default() {
	rc.engine.NoRoute(rc.serveReact)
}
func (rc *ReactController) serveReact(c *gin.Context) {
	c.HTML(http.StatusOK, "site.tmpl", gin.H{})
}
func (rc *ReactController) serveReactIsomorphic(c *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			err := fmt.Sprintf("error: %v", r)
			log.Printf("Error: %v\n", err)
			c.HTML(http.StatusInternalServerError, "site.tmpl", Resp{})
		}
	}()

	registry := new(require.Registry)
	runtime := goja.New()
	registry.Enable(runtime)

	bundle, err := ioutil.ReadFile("./content/themes/bslf/app.js")
	if err != nil {
		panic(fmt.Errorf("Couldn't find bundle: %v", err))
	}
	value, err := runtime.RunString(string(bundle))
	if err != nil {
		panic(fmt.Errorf("Error in runtime: %v\n", err.Error()))
	} else {
		log.Printf("value: %v\n", value)
	}

	c.HTML(http.StatusOK, "react.tmpl", Resp{})

}

// React struct is contains JS vms
// pool to serve HTTP requests and
// separates some domain specific
// resources.
type React struct {
	pool
	//debug bool
	path string
}

// NewReact initialized React struct
//func NewReact(filePath string, debug bool, proxy http.Handler) *React {
func NewReact(e *gin.Engine, filePath string) *React {
	r := &React{
		//debug: debug,
		path: filePath,
	}
	// todo enable bind data so that app isn't loaded for each request
	//if !debug {
	//	r.pool = newEnginePool(filePath, runtime.NumCPU(), proxy)
	//} else {
	// Use onDemandPool to load full react
	// app each time for any http requests.
	// Useful to debug the app.
	r.pool = &onDemandPool{
		path:  filePath,
		proxy: e,
	}
	//}
	return r
}

// Handle handles all HTTP requests which
// have not been caught via static file
// handler or other middlewares.
func (r *React) Handle(c *gin.Context) error {
	//todo verify change
	UUIDs, _ := c.Get("uuid")
	UUID := UUIDs.(*uuid.UUID)
	defer func() {
		if r := recover(); r != nil {
			c.HTML(http.StatusInternalServerError, "react.html", Resp{
				UUID:  UUID.String(),
				Error: r.(string),
			})
		}
	}()

	vm := r.get()

	start := time.Now()
	select {
	case re := <-vm.Handle(map[string]interface{}{
		"url":     c.Request.URL.String(),
		"headers": map[string][]string(c.Request.Header),
		"uuid":    UUID.String(),
	}):
		// Return vm back to the pool
		r.put(vm)

		re.RenderTime = time.Since(start)

		// Handle the Response
		if len(re.Redirect) == 0 && len(re.Error) == 0 {
			// If no redirection and no errors
			c.Writer.Header().Set("X-React-Render-Time", re.RenderTime.String())
			c.HTML(http.StatusOK, "react.html", re)
			// If redirect
		} else if len(re.Redirect) != 0 {
			c.Redirect(http.StatusMovedPermanently, re.Redirect)
			// If internal error
		} else if len(re.Error) != 0 {
			c.Writer.Header().Set("X-React-Render-Time", re.RenderTime.String())
			c.HTML(http.StatusInternalServerError, "react.html", re)
		}
	case <-time.After(2 * time.Second):
		// release the context
		r.drop(vm)
		c.HTML(http.StatusInternalServerError, "react.html", Resp{
			UUID:  UUID.String(),
			Error: "timeout",
		})
	}
	return nil
}

// Resp is a struct for convinient
// react app Response parsing.
// Feel free to add any other keys to this struct
// and return value for this key at ecmascript side.
// Keep it sync with: src/app/client/router/toString.js:23
type Resp struct {
	UUID       string        `json:"uuid"`
	Error      string        `json:"error"`
	Redirect   string        `json:"redirect"`
	App        string        `json:"app"`
	Title      string        `json:"title"`
	Meta       string        `json:"meta"`
	Initial    string        `json:"initial"`
	RenderTime time.Duration `json:"-"`
}

// HTMLApp returns a application template
func (r Resp) HTMLApp() template.HTML {
	return template.HTML(r.App)
}

// HTMLTitle returns a title data
func (r Resp) HTMLTitle() template.HTML {
	return template.HTML(r.Title)
}

// HTMLMeta returns a meta data
func (r Resp) HTMLMeta() template.HTML {
	return template.HTML(r.Meta)
}

// Interface to serve React app on demand or from prepared pool.
type pool interface {
	get() *JSVM
	put(*JSVM)
	drop(*JSVM)
}

// newEnginePool return pool of JS vms.
func newEnginePool(filePath string, size int, proxy http.Handler) *enginePool {
	pool := &enginePool{
		path:  filePath,
		ch:    make(chan *JSVM, size),
		proxy: proxy,
	}

	go func() {
		for i := 0; i < size; i++ {
			pool.ch <- newJSVM(filePath, proxy)
		}
	}()

	return pool
}

type enginePool struct {
	ch    chan *JSVM
	path  string
	proxy http.Handler
}

func (o *enginePool) get() *JSVM {
	return <-o.ch
}

func (o *enginePool) put(ot *JSVM) {
	o.ch <- ot
}

func (o *enginePool) drop(ot *JSVM) {
	ot.Stop()
	ot = nil
	o.ch <- newJSVM(o.path, o.proxy)
}

// newJSVM loads bundle.js into context.
func newJSVM(filePath string, proxy http.Handler) *JSVM {
	fmt.Println("init JSVM", filePath)
	vm := &JSVM{
		EventLoop: eventloop.NewEventLoop(),
		ch:        make(chan Resp, 1),
	}

	vm.EventLoop.Start()
	fetch.Enable(vm.EventLoop, proxy)
	bundle, err := ioutil.ReadFile(filePath)
	if err != nil {
		panic(fmt.Errorf("Couldn't find bundle: %v", err))
	}

	vm.EventLoop.RunOnLoop(func(_vm *goja.Runtime) {
		var seed int64
		if err := binary.Read(crand.Reader, binary.LittleEndian, &seed); err != nil {
			panic(fmt.Errorf("Could not read random bytes: %v", err))
		}
		_vm.SetRandSource(goja.RandSource(rand.New(rand.NewSource(seed)).Float64))

		_, err := _vm.RunScript("app.js", string(bundle))
		if err != nil {
			panic(err)
		}

		if fn, ok := goja.AssertFunction(_vm.Get("main")); ok {
			vm.fn = fn
		} else {
			fmt.Println("fn assert failed")
		}

		_vm.Set("__goServerCallback__", func(call goja.FunctionCall) goja.Value {
			obj := call.Argument(0).Export().(map[string]interface{})
			re := &Resp{}
			for _, field := range structs.Fields(re) {
				if n := field.Tag("json"); len(n) > 1 {
					field.Set(obj[n])
				}
			}
			vm.ch <- *re
			return nil
		})
	})

	return vm
}

// JSVM wraps goja EventLoop
type JSVM struct {
	*eventloop.EventLoop
	ch chan Resp
	fn goja.Callable
}

// Handle handles http requests
func (r *JSVM) Handle(req map[string]interface{}) <-chan Resp {
	r.EventLoop.RunOnLoop(func(vm *goja.Runtime) {
		r.fn(nil, vm.ToValue(req), vm.ToValue("__goServerCallback__"))
	})
	return r.ch
}

type onDemandPool struct {
	path  string
	proxy http.Handler
}

func (f *onDemandPool) get() *JSVM {
	return newJSVM(f.path, f.proxy)
}

func (f onDemandPool) put(c *JSVM) {
	c.Stop()
}

func (f *onDemandPool) drop(c *JSVM) {
	f.put(c)
}
