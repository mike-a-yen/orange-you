#!/bin/bash

# see https://itnext.io/how-to-build-a-chrome-extension-to-analyze-text-as-you-write-a1c0ab1923f9

build() {
 echo ‘building react’
rm -rf dist/*
export INLINE_RUNTIME_CHUNK=false
 export GENERATE_SOURCEMAP=false
react-scripts build
mkdir -p dist
 cp -r build/* dist
mv dist/index.html dist/popup.html
}
build