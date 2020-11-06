docker.exe run --rm -m 512m --security-opt seccomp=unconfined -e DISPLAY=192.168.0.98:0.0 -e PULSE_SERVER=tcp:192.168.0.98 angular-electron:latest
