FROM node:16

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY .env ./

COPY src/ /app/src

RUN npm install
RUN npm run build

CMD [ "node", "./dist/src/index.js" ]
