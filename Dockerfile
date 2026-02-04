FROM node:25-alpine

WORKDIR /app

ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}

COPY package*.json ./

RUN echo "@atsuo-tech:registry=https://npm.pkg.github.com" > .npmrc \
	&& echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc \
	&& npm ci \
	&& rm -f .npmrc

COPY . .

RUN npm run build

CMD ["sh", "-c", "npx next start -p $PORT"]
