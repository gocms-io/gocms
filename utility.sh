#!/bin/bash

COMMAND="$1"

 if [ "$COMMAND" = "run-docker" ];
        then
                echo "run"
                docker build -t theGoApp .
                docker run --publish 9090:8080  --name theGoApp --env-file .env --rm theGoApp

fi
if [ "$COMMAND" = "build" ]; then
            echo "build"
            rm -rf dist/
            govendor sync
            mkdir dist
            zip -r dist/build.zip .*
fi


