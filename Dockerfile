FROM node:23.11-alpine3.21 AS builder

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:23.11-alpine3.21 AS production

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --production
COPY --from=builder /app/dist ./dist
EXPOSE 3002
CMD ["node", "dist/main.js"]
