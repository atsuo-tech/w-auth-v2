FROM node:25-alpine

WORKDIR /app

ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

CMD ["sh", "-c", "npx next start -p $PORT"]
