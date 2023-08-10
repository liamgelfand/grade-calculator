FROM node:16-alpine

WORKDIR /server

COPY package.json .

RUN npm install
RUN npm install mongoose

COPY . .

EXPOSE 3000

CMD ["npm", "start"]