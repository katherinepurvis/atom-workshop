#!/usr/bin/env bash
yarn hmr &
JS_ASSET_HOST="https://atomworkshop-assets.local.dev-gutools.co.uk/assets/" sbt "run 9050"
