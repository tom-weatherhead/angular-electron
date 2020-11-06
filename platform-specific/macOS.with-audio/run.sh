#!/bin/sh

# Note: If PulseAudio will not start on the Mac,
# $ rm -rf $HOME/.config/pulse
# ... then reboot. Then start PulseAudio via:
# $ pulseaudio --load=module-native-protocol-tcp --exit-idle-time=-1 --daemon
# Note that if you enter the 'pacmd' and then exit it, the PulseAudio daemon will shut down.

xhost local:root

# Getting pulseaudio working on macOS: See perhaps https://stackoverflow.com/questions/40136606/how-to-expose-audio-from-docker-container-to-a-mac/40139001
# $ brew install pulseaudio
# Run the daemon: $ pulseaudio --load=module-native-protocol-tcp --exit-idle-time=-1 --daemon

# You can run a test like this to see if PulseAudio and Docker are working well together:
# $ docker run -it -e PULSE_SERVER=docker.for.mac.localhost \
#	-v ~/.config/pulse:/home/pulseaudio/.config/pulse --entrypoint speaker-test \
#	--rm jess/pulseaudio -c 2 -l 1 -t wav

# macOS 2019-07-17 : See https://github.com/moby/moby/issues/8710 :
# $ brew install socat
# Kill XQuartz (BTW, XQuartz can be installed via: $ brew install xquartz)
# killall socat

test_socat() {
	ps aux | grep -v grep | grep -q socat
}

# If a socat process isn't running, launch it.
test_socat || socat TCP-LISTEN:6000,reuseaddr,fork UNIX-CLIENT:\"$DISPLAY\" &

test_pulseaudio() {
	ps aux | grep -v grep | grep -q pulseaudio
}

# pulseaudio -k # Kills the pulseaudio daemon.
# killall pulseaudio
# rm -rf ~/.config/pulse

# If a pulseaudio process isn't running, launch it.
test_pulseaudio || pulseaudio --load=module-native-protocol-tcp --exit-idle-time=-1 --daemon -vvvv

# or:
# brew services stop pulseaudio 2>/dev/null
# brew services start pulseaudio

# !!! These two lines are needed for PulseAudio in the container
# to connect to PulseAudio on a macOS host:
	# -e PULSE_SERVER=docker.for.mac.localhost \
	# -v ~/.config/pulse/cookie:/home/<user_in_container>/.config/pulse/cookie \

docker run --rm -m 512m \
	--security-opt seccomp=unconfined \
	-e DISPLAY=docker.for.mac.host.internal:0 \
	-e PULSE_SERVER=docker.for.mac.localhost \
	-v /tmp/.X11-unix:/tmp/.X11-unix \
	-v ~/.config/pulse/cookie:/home/tomw/.config/pulse/cookie \
	angular-electron:latest
