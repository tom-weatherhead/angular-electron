#!/bin/sh

xhost local:root

docker run --rm -it \
	--security-opt seccomp=unconfined \
	-e DISPLAY=$DISPLAY \
	-v /tmp/.X11-unix:/tmp/.X11-unix \
	angular-electron:latest
