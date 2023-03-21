FROM node:18-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN npm install -g pnpm@latest && pnpm install

COPY . .

RUN pnpm build 

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]
