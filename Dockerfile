FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache openssl openssl-dev
COPY hergo-back/package*.json ./
COPY hergo-back/prisma ./prisma
RUN npm install
RUN npx prisma generate
COPY hergo-back/ ./
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
