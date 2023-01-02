FROM node:16.19.0 AS base
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
ENV DISABLE_SSE_EVENTS=
ENV TRUST_PROXY=

EXPOSE 3030

CMD ["npm", "start"]