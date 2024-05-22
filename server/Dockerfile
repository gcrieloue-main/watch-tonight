FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV production

COPY *.ts ./
COPY watch.txt ./

EXPOSE 3000

ENV PORT 3000

CMD npx ts-node server.ts