#!/bin/bash

# exit if any of the intermediate steps fail
set -e

browser=$1

if [ -z "$browser" ]; then
  echo "Specify target browser"
  echo "chrome, firefox, edge"
  exit 1
fi

# set current working directory to directory of the shell script
cd "$(dirname "$0")"

mkdir -p ../vendor

# build deps
sh jquery/build.sh
sh mdc/build.sh
sh mithril/build.sh

# archive
mkdir -p tmp
mkdir -p tmp/screenshot-capture
cd ..
cp -r background content icons options vendor build/tmp/screenshot-capture/

if [ "$browser" = "chrome" ]; then
  cp manifest.json build/tmp/screenshot-capture/
elif [ "$browser" = "firefox" ]; then
  cp manifest.firefox.json build/tmp/screenshot-capture/manifest.json
elif [ "$browser" = "edge" ]; then
  cp manifest.edge.json build/tmp/screenshot-capture/manifest.json
fi

# zip the screenshot-capture folder itself
if [ "$browser" = "chrome" ] || [ "$browser" = "edge" ]; then
  cd build/tmp/
  zip -r ../../screenshot-capture.zip screenshot-capture
  cd ..
# zip the contents of the screenshot-capture folder
elif [ "$browser" = "firefox" ]; then
  cd build/tmp/screenshot-capture/
  zip -r ../../../screenshot-capture.zip .
  cd ../../
fi

rm -rf tmp/
