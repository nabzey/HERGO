FROM node:20-alpine

WORKDIR /app

COPY hergo-back/package*.json ./
RUN npm install

COPY hergo-back/ ./

ENV DATABASE_URL="postgresql://build:build@localhost:5432/hergo_build?schema=public"
RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
