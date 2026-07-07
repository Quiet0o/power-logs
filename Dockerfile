FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN mkdir -p /app/data && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=/app/data/sqlite.db

EXPOSE 3000

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json

USER node

CMD ["node", ".output/server/index.mjs"]
