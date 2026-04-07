FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN DATABASE_URL="postgresql://build:build@localhost:5432/hergo_build?schema=public" npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
