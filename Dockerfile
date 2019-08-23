FROM node:10.15.3-jessie-slim

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

COPY . .

CMD [ "npm", "start" ]