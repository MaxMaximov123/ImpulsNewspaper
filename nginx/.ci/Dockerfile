FROM alpine
RUN apk update
RUN apk add --upgrade brotli
RUN apk add brotli nginx nginx-mod-http-brotli

WORKDIR /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/http.d/default.conf
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]
