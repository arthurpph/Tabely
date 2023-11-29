FROM node:18

WORKDIR /back

COPY package*.json ./

RUN npm install

RUN npm install --build-from-source bcrypt

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]