FROM node:12.3.0

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/package.json
RUN npm install
COPY . /usr/src/app

ENTRYPOINT node index.js