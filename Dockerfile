FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn build

COPY . .

CMD ["yarn", "start"]