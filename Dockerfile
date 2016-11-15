FROM golang:1.6.2

WORKDIR /go/src/bitbucket.org/menklab/grnow-services
Add . /go/src/bitbucket.org/menklab/grnow-services

RUN go get -u github.com/kardianos/govendor

RUN govendor sync

RUN go install bitbucket.org/menklab/grnow-services

EXPOSE 8080
ENTRYPOINT ["/go/bin/grnow-services"]
