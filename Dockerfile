FROM golang:1.6.2

WORKDIR /go/src/theGoApp
Add . /go/src/theGoApp

go get -u github.com/kardianos/govendor

RUN go install theGoApp

EXPOSE 8080
ENTRYPOINT ["/go/bin/theGoApp"]
