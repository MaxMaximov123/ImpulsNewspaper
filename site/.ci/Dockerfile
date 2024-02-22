FROM node:16.13 AS prepare
RUN apt-get update && apt-get install -y vim
RUN npm install -g npm@7
WORKDIR /usr/src/app/site
COPY site/package*.json ./
RUN npm ci
COPY site .
RUN npm run papersPaths
RUN npm run build

FROM nginx:stable-alpine as build
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=prepare /usr/src/app/site/dist .
COPY --from=prepare /usr/src/app/site/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 82
CMD ["nginx", "-g", "daemon off;"]
#