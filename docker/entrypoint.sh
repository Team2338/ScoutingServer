#! /bin/bash

cd /root
cp /root/mount/application.yaml /root/application.yaml
java -jar latest.jar > log.log 2>&1
