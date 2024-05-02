FROM alpine
RUN apk update
RUN apk add --upgrade brotli
RUN apk add brotli nginx nginx-mod-http-brotli

WORKDIR /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/http.d/default.conf

COPY ssl/impuls131.ru.key /etc/nginx/impuls131.ru.key
COPY ssl/impuls131.ru.crt /etc/nginx/impuls131.ru.crt


EXPOSE 80
EXPOSE 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]
