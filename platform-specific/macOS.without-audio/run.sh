#!/bin/sh

xhost local:root

# macOS 2019-07-17 : See https://github.com/moby/moby/issues/8710 :
# $ brew install socat
# Kill XQuartz (BTW, XQuartz can be installed via: $ brew install xquartz)
# killall socat

test_socat() {
	ps aux | grep -v grep | grep -q socat
}

# If a socat process isn't running, launch it.
test_socat || socat TCP-LISTEN:6000,reuseaddr,fork UNIX-CLIENT:\"$DISPLAY\" &

# docker run --rm -it -m 512m
docker run --rm -m 512m \
	--security-opt seccomp=unconfined \
	-e DISPLAY=docker.for.mac.host.internal:0 \
	-v /tmp/.X11-unix:/tmp/.X11-unix \
	angular-electron:latest
