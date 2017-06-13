#!/bin/bash

# for testing. comment out for release.
#TRAVIS_BRANCH="dev"

# grab govendor and sync
echo install govendor
go get -u github.com/kardianos/govendor

echo pulling in deps with govendor
govendor sync



# build linux64
echo build linux64
GOOS=linux GOARCH=amd64 go build -o bin/$TRAVIS_BRANCH/linux_64/gocms-services
pushd bin/$TRAVIS_BRANCH/linux_64
zip gocms-services.zip gocms-services
rm gocms-services
popd

#build linux32
echo build linux32
GOOS=linux GOARCH=386 go build -o bin/$TRAVIS_BRANCH/linux_32/gocms-services
pushd bin/$TRAVIS_BRANCH/linux_32
zip gocms-services.zip gocms-services
rm gocms-services
popd

#build arm
echo build linux_arm
GOOS=linux GOARCH=arm go build -o bin/$TRAVIS_BRANCH/linux_arm/gocms-services
pushd bin/$TRAVIS_BRANCH/linux_arm
zip gocms-services.zip gocms-services
rm gocms-services
popd

#build osx
echo build osx
GOOS=darwin GOARCH=amd64 go build -o bin/$TRAVIS_BRANCH/osx/gocms-services
pushd bin/$TRAVIS_BRANCH/osx
zip gocms-services.zip gocms-services
rm gocms-services
popd

#build win64
echo build win64
GOOS=windows GOARCH=amd64 go build -o bin/$TRAVIS_BRANCH/windows_64/gocms-services.exe
pushd bin/$TRAVIS_BRANCH/windows_64
zip gocms-services.zip gocms-services.exe
rm gocms-services.exe
popd

#build win32
echo build win32
GOOS=windows GOARCH=386 go build -o bin/$TRAVIS_BRANCH/windows_32/gocms-services.exe
pushd bin/$TRAVIS_BRANCH/windows_32
zip gocms-services.zip gocms-services.exe
rm gocms-services.exe
popd