#!/bin/bash
#

docker build -t localhost:5000/watch-tonight-front:latest next-app
docker build -t localhost:5000/watch-tonight-server:latest server


docker push localhost:5000/watch-tonight-front:latest 
docker push localhost:5000/watch-tonight-server:latest 
