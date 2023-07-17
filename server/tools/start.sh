#!/bin/bash

#
# This script starts the project, deploy-script.sh, uses this script to start the project
#


. $HOME/.bashrc
WORKING_PATH="$(dirname $( dirname  $(readlink -f "${BASH_SOURCE}")  ))"
. $WORKING_PATH/.env
export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;
FLAG=$WORKING_PATH/../backend-flag
echo starting/deploying project...
touch $FLAG

cd $WORKING_PATH
# Update, rebuild and restart project

echo Pulling changes
git pull
nvm use `cat .nvmrc`
echo Installing dependencies
npm i
echo Building project
npm run build
pm2 restart $PM2_FILE
pm2 reset $PM2_FILE

#end deploy
rm $FLAG
