FROM node:10.16.3 AS base
WORKDIR /app

FROM base AS build
COPY . .
RUN npm install && \
    npm run build

FROM base AS release
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/index.js ./
EXPOSE 3030
CMD ["node", "index.js"]
