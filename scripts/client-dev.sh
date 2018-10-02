#!/usr/bin/env bash

IS_DEBUG=false
for arg in "$@"
do
    if [ "$arg" == "--debug" ]; then
        IS_DEBUG=true
        shift
    fi
done

export JS_ASSET_HOST="https://atomworkshop-assets.local.dev-gutools.co.uk/assets/"

if [ "$IS_DEBUG" = true ] ; then
    yarn hmr & sbt -jvm-debug 5055 "run 9050"
else
    yarn hmr & sbt "run 9050"
fi
