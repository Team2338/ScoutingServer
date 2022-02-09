# Docker Springboot Gearscout Server

## How to build

1. Create jarfile for gearscout
2. Copy jarfile as `latest.jar` to this directory
3. Run `docker build -t gearscout .` from this directory

## How to run

1. `docker create --name gearscout --restart always --network host -v /path/to/application.yaml:/root/mount gearscout:latest`
2. `docker start gearscout`
