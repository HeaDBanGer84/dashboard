FROM node:lts-alpine3.13

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "node", "index.js" ]