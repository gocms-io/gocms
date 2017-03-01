package main

import (
	"log"
	"os"
	"path/filepath"
	"flag"
	"io/ioutil"
	"regexp"
	"fmt"
	"time"
)

var matchX *regexp.Regexp
var docParts []string
var defaultOutPath = "./docs.js"
func main() {
	//matchX = regexp.MustCompile(``)
	matchX = regexp.MustCompile(`(?Us)(/\*\*.*\*/)`)


	outPath := flag.String("o", defaultOutPath, "Output for documents file.")
	flag.Parse()
	dirsToWalk := flag.Args()

	// for each dir look into it
	for _, dir := range dirsToWalk {
		err := walkFiles(dir)
		if err != nil {
			log.Fatalf("Error traversing %s: %s\n", dir, err.Error())
		}
	}

	f, err := os.Create(*outPath)
	if err != nil {
		log.Printf("Error creating file %s: %s\n", *outPath, err.Error())
	}
	defer f.Close()

	for i, docPart := range docParts {
		if i == 0 {
			f.WriteString(fmt.Sprintf("//File generated automatically at %s\n\n", time.Now()))
		} else {
			f.WriteString("\n\n")
		}
		f.WriteString(docPart)
	}

}
func walkFiles(dir string) error {

	// find all files
	err := filepath.Walk(dir, parseForDocs)
	if err != nil {
		log.Printf("Error walking files is %s: %s\n",dir, err.Error())
		return err
	}

	return err
}

func parseForDocs(path string, f os.FileInfo, err error) error {
	if err != nil {
		log.Printf("Error traversing in walk function. %s, %s\n", path, err.Error())
	}

	// parse files as they are found for documentation
	if f.Mode().IsRegular() {

		// read file in
		raw, err := ioutil.ReadFile(path)
		if err != nil {
			log.Printf("Error reading file %s: %s\n", path, err.Error())
			return err
		}

		//fmt.Printf("Checking file: %s: %s\n", path, raw)
		matchGroup := matchX.FindAllString(string(raw), -1)
		//log.Printf("Found %d matches in %s\n.", len(matchGroup), path)
		for _, match := range matchGroup {
			//fmt.Printf("Match %d:\n%s\n", i, match)
			docParts = append(docParts, match)
		}

	}

	return nil
}