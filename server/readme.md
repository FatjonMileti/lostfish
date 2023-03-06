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

Run with **nodemon**: `npm run dev`

Add a default user `npm run cli`

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
