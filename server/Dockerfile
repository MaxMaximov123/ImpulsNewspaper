FROM node:latest

COPY server/package.json server/package-lock.json ./
RUN npm install

COPY ./ ./

WORKDIR "/server"

CMD ["npm", "run", "start"]