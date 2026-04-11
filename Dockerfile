FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl libssl

COPY hergo-back/package*.json ./
RUN npm install

COPY hergo-back/ ./
RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
