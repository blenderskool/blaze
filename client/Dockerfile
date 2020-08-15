FROM node:10.16.3 AS base

WORKDIR /app

ARG WS_HOST
ARG WS_SIZE_LIMIT
ARG TORRENT_SIZE_LIMIT

ENV WS_HOST $WS_HOST
ENV WS_SIZE_LIMIT $WS_SIZE_LIMIT
ENV TORRENT_SIZE_LIMIT $TORRENT_SIZE_LIMIT

COPY ./client ./client
COPY ./common ./common
WORKDIR client
RUN npm install && \
    npm run build

FROM nginx:alpine

COPY --from=base /app/client/build /etc/nginx/html

EXPOSE 8080 80