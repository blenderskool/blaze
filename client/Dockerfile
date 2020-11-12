FROM node:10.16.3 AS base

WORKDIR /app

COPY ./client/package*.json ./client/

WORKDIR /app/client
RUN npm install

ARG WS_HOST
ARG SERVER_HOST
ARG WS_SIZE_LIMIT
ARG TORRENT_SIZE_LIMIT

ENV WS_HOST $WS_HOST
ENV SERVER_HOST $SERVER_HOST
ENV WS_SIZE_LIMIT $WS_SIZE_LIMIT
ENV TORRENT_SIZE_LIMIT $TORRENT_SIZE_LIMIT

COPY ./client .
COPY ./common ../common
RUN npm run build

FROM nginx:alpine
COPY ./client/nginx.conf /etc/nginx/nginx.conf
COPY --from=base /app/client/build /etc/nginx/html

EXPOSE 8080 80