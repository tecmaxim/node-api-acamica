FROM node:12.18.0
WORKDIR /api-acamica
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD [ "npm", "start" ]
