FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
# Prisma loads prisma.config.ts while generating the client.
ENV DATABASE_URL=postgresql://user:555@db:5432/trans_db
RUN npx prisma generate

COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

# Apply pending migrations (non-destructive) before starting the API.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
