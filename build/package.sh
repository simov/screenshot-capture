#!/bin/bash

# exit if any of the intermediate steps fail
set -e

browser=$1

if [ -z "$browser" ]; then
  echo "Specify target browser"
  echo "chrome, firefox"
  exit 1
fi

# set current working directory to directory of the shell script
cd "$(dirname "$0")"

# cleanup
rm -rf ../vendor
rm ../screenshot-capture.zip
mkdir -p ../vendor

# build deps
sh jquery/build.sh
sh mdc/build.sh
sh mithril/build.sh

# copy files
mkdir -p tmp
mkdir -p tmp/screenshot-capture
cd ..
cp -r background content icons options vendor LICENSE build/tmp/screenshot-capture/

if [ "$browser" = "chrome" ]; then
  cp manifest.chrome.json build/tmp/screenshot-capture/manifest.json
  cp manifest.chrome.json manifest.json
elif [ "$browser" = "firefox" ]; then
  cp manifest.firefox.json build/tmp/screenshot-capture/manifest.json
  cp manifest.firefox.json manifest.json
fi

# archive the screenshot-capture folder itself
if [ "$browser" = "chrome" ]; then
  cd build/tmp/
  zip -r ../../screenshot-capture.zip screenshot-capture
  cd ..
# archive the contents of the screenshot-capture folder
elif [ "$browser" = "firefox" ]; then
  cd build/tmp/screenshot-capture/
  zip -r ../../../screenshot-capture.zip .
  cd ../../
fi

# cleanup
rm -rf tmp/
