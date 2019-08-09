#!/usr/bin/env bash

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR=${DIR}/..

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

brew bundle --file=${ROOT_DIR}/Brewfile

dev-nginx setup-app ${ROOT_DIR}/nginx/nginx-mapping.yml

printf "\n\rSetting up client side dependancies... \n\r\n\r"
printf "\n\rInstalling NPM packages via yarn... \n\r\n\r"

yarn

printf "\n\Compiling Javascript... \n\r\n\r"

yarn build

printf "\n\rDone.\n\r\n\r"
