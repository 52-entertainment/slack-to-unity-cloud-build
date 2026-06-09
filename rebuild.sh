#!/bin/bash
echo "Stop containers"
docker stop $(docker ps -q)
echo "Prune containers"
yes | docker container prune
echo "Build new image"
docker build . -t bradshaw/cloudbuild
echo "Run image"
docker run -p 4000:4000 --name cloudbuild -d bradshaw/cloudbuild
