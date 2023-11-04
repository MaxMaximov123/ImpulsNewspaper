FROM node:latest

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm install

COPY site/live.sport/server/ ./

CMD ["node", "server.js"]