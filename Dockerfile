FROM node:20-alpine as testing

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV=prod
CMD [ "npm", "run", "start:prod" ]


FROM node:20-alpine as production

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --from=testing --chown=node:node /home/node/app/package*.json ./
RUN npm ci --omit=dev

COPY --from=testing --chown=node:node /home/node/app .

EXPOSE 3333

ENV NODE_ENV=prod
CMD [ "npm", "run", "start:prod" ]