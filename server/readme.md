# Lost Fish API

```sh
npm i
npm start

visit http://localhost:3000/docs
visit http://localhost:3000/form
```

## VSCode Development requirements

Install and enable the TSLint extension from https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin

Install and enable the Prettier extension from https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

## Uses

-   dotenv
-   compression
-   helmet
-   typescript
-   mongodb
-   cookies
-   session
-   csrf
-   file upload
-   rate-limiter
-   npm audit clean
-   CRUD endpoints
-   apidoc
-   new relic (basic integration)
-   dockerfile (basic)

### ⚠️ All non-typescript files need to be at **root** level. Example: `/uploads`, `/docs` and `/views`

```
./src
    ./api - api endpoints grouped in controllers
    ./bin/www - entrypoint
    ./data - typescript interfaces and mongoose schemas
    ./middleware - general app middlewares
    ./routes - MVC routes that end in res.render
    ./app.ts - main app file
```

## Dev

copy `.env.example` to `.env`

Run mongodb

Run with **nodemon**: `npm run start`

Add a default user `npm run cli`

## Offr Io integration

Since now we are getting some data from offr io api we need to sync them to have it locally on order to be able to 
make a basic renting flow.

To do that we need to run this commands:

Build app: `npm run build`

Run sync script: `node dist/src/workers/sync-offrio-data.worker.js`

PS. To do this you will need a token from Offr.io to be able to access their api.

This is the variable needed to be set in .env file: `OFFR_IO_TOKEN`

## Docs

Run: `npm run docs`

Visit: http://localhost:3000/docs

## Production

Run: `npm run build`. The `/dist` folder gets populated with the javascript version.

To run the production version: `node ./dist/bin/www`

## Mongodb server configuration

To turn off profiling `nano /etc/mongod.conf` and set

```
operationProfiling:
 mode: off
 slowOpThresholdMs: 10800000
setParameter:
 cursorTimeoutMillis: 10800000
```
