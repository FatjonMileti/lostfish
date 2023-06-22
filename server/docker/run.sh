#!/bin/sh

echo '==============================================='
echo 'Node & NPM Versions'
echo '==============================================='
echo ''

node -v
npm -v

echo ''
echo '==============================================='
echo "Running node in NODE_ENV: ${NODE_ENV}"
echo '==============================================='
echo ''

if [ "${NODE_ENV}" = 'development' ] || [ "${NODE_ENV}" = 'dev' ]; then
  npm run start
elif [ "${NODE_ENV}" = 'production' ] || [ "${NODE_ENV}" = 'prod' ]; then
# No modo prod, só roda o build
  npm run start:prod
fi
