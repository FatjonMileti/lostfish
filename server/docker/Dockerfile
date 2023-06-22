FROM node:16.16

RUN apt update

ENV TZ Europe/Bucharest

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

VOLUME [ "/home/node/app/node_modules" ]

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

USER node

CMD [ "/bin/sh", "./docker/run.sh" ]

EXPOSE 3000
