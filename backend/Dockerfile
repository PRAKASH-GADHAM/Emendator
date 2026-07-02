FROM node:18-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x start.sh

EXPOSE 5000

CMD ["./start.sh"]
