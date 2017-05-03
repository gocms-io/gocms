#!/bin/bash

COMMAND="$1"

 if [ "$COMMAND" = "run-docker" ];
        then
                echo "run"
                docker build -t theGoApp .
                docker run --publish 9090:8080  --name theGoApp --env-file .env --rm theGoApp

fi
if [ "$COMMAND" = "build-dist" ]; then
            echo "build"
            rm -rf dist/
            govendor sync
            mkdir dist
            zip -r dist/grnow-services.0.0.0.zip ./ --exclude .env *.git* \dist *.idea*
fi
if [ "$COMMAND" = "test-vendor" ]; then
            echo "test vendor"
            mv vendor/vendor.json .
            rm -rf vendor/*
            mv vendor.json vendor/.
            govendor sync
fi




