FROM node:lts-alpine3.10

WORKDIR /app

COPY package.json ./

COPY client/package.json client/
RUN npm run install-client --omit=dev


COPY server/package.json server/
RUN npm run install-server --omit=dev


COPY server/ server/
USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000

