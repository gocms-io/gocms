FROM golang:1.6.2

WORKDIR /go/src/github.com/gocms-io/goCMS
Add . /go/src/github.com/gocms-io/goCMS

RUN go get -u github.com/kardianos/govendor

RUN govendor sync

RUN go install github.com/gocms-io/goCMS

EXPOSE 8080
ENTRYPOINT ["/go/bin/grnow-services"]
