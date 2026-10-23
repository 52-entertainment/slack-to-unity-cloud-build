#!/bin/bash
set -e
echo "Build new image"
docker build --pull . -t bradshaw/cloudbuild
echo "Replace container"
docker rm -f cloudbuild 2>/dev/null || true
docker run -p 4000:4000 --name cloudbuild --restart unless-stopped -d bradshaw/cloudbuild
docker exec cloudbuild node -v
