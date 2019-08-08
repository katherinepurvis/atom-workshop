#!/usr/bin/env bash

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

yarn build-dev &
sbt "run 9050"
