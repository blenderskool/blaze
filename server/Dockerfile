FROM node:10.16.3 AS base
WORKDIR /app

FROM base AS build
COPY ./server ./server
COPY ./common ./common
WORKDIR server
RUN npm install
ENV NODE_ENV "production"
ENV ORIGIN=
ENV PORT=
ENV WS_SIZE_LIMIT=
EXPOSE 3030
CMD ["npm", "start"]