#!/bin/bash

#
# This script starts the project, deploy-script.sh, uses this script to start the project
#

. $HOME/.bashrc
export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;
WORKING_PATH="$(dirname $( dirname  $(readlink -f "${BASH_SOURCE}")  ))"
. $WORKING_PATH/.env
FLAG=$WORKING_PATH/../frontend-flag
cd $WORKING_PATH

echo deploying...
touch $FLAG
#start deploy
git pull

nvm use `cat .nvmrc`
echo Installing dependencies...
npm i --legacy-peer-deps
echo Building...
npm run build

#end deploy
rm $FLAG
