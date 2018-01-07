package gocms_plugin_util

import (
	"github.com/gocms-io/gocms/utility/gocms_plugin_util/manifest_utl"
	"flag"
)

func Init(manifestFilePath string, db interface{}) (port int) {

	// define flags
	p := flag.Int("port", 30001, "port to run on.")
	insertManifest := flag.Bool("um", false, "update plugin manifest in database")

	// parse
	if !flag.Parsed() {
		flag.Parse()
	}

	// do manifest stuff
	if *insertManifest {
		manifest_utl.InsertManifest(manifestFilePath, db)
	}

	return *p
}