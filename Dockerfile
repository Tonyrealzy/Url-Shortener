FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm install

COPY prisma ./prisma
COPY . .

RUN npm run build
RUN npx prisma generate

EXPOSE 10000

CMD ["npm", "start"]
