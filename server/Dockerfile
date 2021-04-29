FROM node:14.16.1 AS base
WORKDIR /app

COPY ./server/package*.json ./server/

WORKDIR /app/server
RUN npm install

COPY ./server ./
COPY ./common ../common

ENV NODE_ENV "production"
ENV ORIGIN=
ENV PORT=
ENV WS_SIZE_LIMIT=

EXPOSE 3030

CMD ["npm", "start"]