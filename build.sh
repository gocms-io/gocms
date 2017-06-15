#!/bin/bash

# for testing. comment out for release.
TRAVIS_BRANCH=dev

# grab govendor and sync
echo install govendor
go get -u github.com/kardianos/govendor

echo pulling in deps with govendor
govendor sync

# build linux64
echo build linux64
GOOS=linux GOARCH=amd64 go build -o bin/$TRAVIS_BRANCH/linux_64/gocms
cp -r content bin/$TRAVIS_BRANCH/linux_64/.
pushd bin/$TRAVIS_BRANCH/linux_64
rm -rf content/gocms/src
zip -r gocms.zip *
rm -rf gocms content
popd

#build linux32
echo build linux32
GOOS=linux GOARCH=386 go build -o bin/$TRAVIS_BRANCH/linux_32/gocms
cp -r content bin/$TRAVIS_BRANCH/linux_32/.
pushd bin/$TRAVIS_BRANCH/linux_32
rm -rf content/gocms/src
zip -r gocms.zip *
rm -rf gocms content
popd

#build arm
echo build linux_arm
GOOS=linux GOARCH=arm go build -o bin/$TRAVIS_BRANCH/linux_arm/gocms
cp -r content bin/$TRAVIS_BRANCH/linux_arm/.
pushd bin/$TRAVIS_BRANCH/linux_arm
rm -rf content/gocms/src
zip -r gocms.zip *
rm -rf gocms content
popd

#build osx
echo build osx
GOOS=darwin GOARCH=amd64 go build -o bin/$TRAVIS_BRANCH/osx/gocms
cp -r content bin/$TRAVIS_BRANCH/osx/.
pushd bin/$TRAVIS_BRANCH/osx
rm -rf content/gocms/src
zip -r gocms.zip *
rm -rf gocms content
popd

#build win64
echo build win64
GOOS=windows GOARCH=amd64 go build -o bin/$TRAVIS_BRANCH/windows_64/gocms.exe
cp -r content bin/$TRAVIS_BRANCH/windows_64/.
pushd bin/$TRAVIS_BRANCH/windows_64
rm -rf content/gocms/src
zip -r gocms.zip *
rm -rf gocms content
popd

#build win32
echo build win32
GOOS=windows GOARCH=386 go build -o bin/$TRAVIS_BRANCH/windows_32/gocms.exe
cp -r content bin/$TRAVIS_BRANCH/windows_32/.
pushd bin/$TRAVIS_BRANCH/windows_32
rm -rf content/gocms/src
zip -r gocms.zip *
rm -rf gocms content
popd