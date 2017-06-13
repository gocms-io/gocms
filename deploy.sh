#!/bin/bash

# vars for testing. comment out for release.
#AWS_SECRET="XiILbK7edn2s7tmN2CuNzhw9NwYU5Yt6r1bdtB5d"
#AWS_BUCKET="release.gocms.io"
#AWS_KEY="AKIAJJOXWVHFZZEJIQRQ"
#TRAVIS_BRANCH="dev"
#TRAVIS_BUILD_NUMBER="1"
#TRAVIS_COMMIT="lkjdaldsfasa"

# copy files to s3
echo copy files to current release dir
AWS_ACCESS_KEY_ID=$AWS_KEY AWS_SECRET_ACCESS_KEY=$AWS_SECRET aws s3 cp \
    --recursive bin/$TRAVIS_BRANCH/ s3://release.gocms.io/$TRAVIS_BRANCH/current/

# copy files to build number bucket
echo copy files to build # release dir
AWS_ACCESS_KEY_ID=$AWS_KEY AWS_SECRET_ACCESS_KEY=$AWS_SECRET aws s3 cp \
    --recursive s3://release.gocms.io/$TRAVIS_BRANCH/current/ s3://release.gocms.io/$TRAVIS_BRANCH/$TRAVIS_BUILD_NUMBER-$TRAVIS_COMMIT/