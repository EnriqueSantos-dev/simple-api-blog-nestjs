FROM node:18-bullseye-slim as builder

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm@latest && pnpm install

COPY . .

RUN pnpm build

FROM node:18-bullseye-slim

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm@latest && pnpm install --prod --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist
COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]