FROM node:16.19.0-alpine as base

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

FROM node:16.19.0-alpine

# Installing nginx and gettext alpine packages
# gettext is for envsubst command
RUN apk add --update nginx gettext
RUN mkdir -p /run/nginx

COPY ./nginx/image-nginx.template /etc/nginx/nginx.template
COPY --from=base /app/client/build /etc/nginx/html

WORKDIR /app

COPY ./server/package*.json ./server/

WORKDIR /app/server

ENV NODE_ENV "production"
ENV TRUST_PROXY true
ENV DISABLE_SSE_EVENTS=
RUN npm install

COPY ./server .
COPY ./common ../common
COPY ./package*.json ../

EXPOSE 3030

CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/nginx.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;' & PORT=3030 npm run start"]