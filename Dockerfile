FROM node:20-alpine AS base


ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /app


COPY package.json pnpm-lock.yaml ./
RUN pnpm install
RUN pnpm add -g @nestjs/cli

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm exec prisma generate
RUN pnpm build

FROM base AS deploy


RUN apk add --update openssl && \
  rm -rf /var/cache/apk/*


WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules


CMD ["node", "dist/main"] 