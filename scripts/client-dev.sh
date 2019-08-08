#!/usr/bin/env bash

IS_DEBUG=false
for arg in "$@"
do
    if [ "$arg" == "--debug" ]; then
        IS_DEBUG=true
        shift
    fi
done

fileExists() {
  test -e "$1"
}

if ! fileExists "$NVM_DIR/nvm.sh"; then
  node_version=`cat .nvmrc`
  echo -e "${red}nvm not found ${plain} NVM is required to run this project"
  echo -e "Install it from https://github.com/creationix/nvm#installation"
  exit 1
else
  source "$NVM_DIR/nvm.sh"
  nvm install
fi

export JS_ASSET_HOST="https://atomworkshop-assets.local.dev-gutools.co.uk/assets/"

if [ "$IS_DEBUG" = true ] ; then
    yarn hmr & sbt -jvm-debug 5055 "run 9050"
else
    yarn hmr & sbt "run 9050"
fi
