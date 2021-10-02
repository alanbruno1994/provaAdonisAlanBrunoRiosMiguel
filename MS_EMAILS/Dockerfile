FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package.json yarn.* ./

RUN apk add --no-cache git

COPY . /home/node/app/

#RUN chown -R node:node /home/node

RUN yarn

USER node

EXPOSE 8080

ENTRYPOINT ["yarn","dev"]