# Указываем базовый образ Node.js
FROM --platform=linux/amd64 node:18.16

# Установка необходимых инструментов и Google Chrome
RUN apt-get update && apt-get install -y \
    vim wget gnupg ca-certificates locales \
    && locale-gen ru_RU.UTF-8 \
    && update-locale LANG=ru_RU.UTF-8 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/* \
    && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
    && chmod +x /usr/sbin/wait-for-it.sh

# Устанавливаем глобально npm 7 и Knex
RUN npm install -g npm@7 knex

# Устанавливаем переменные окружения для локали
ENV LANG=ru_RU.UTF-8
ENV LANGUAGE=ru_RU:ru
ENV LC_ALL=ru_RU.UTF-8

# Настройка рабочей директории
WORKDIR /app

# Копируем зависимости
COPY vk-scanner/package.json vk-scanner/package-lock.json ./
RUN npm install

# Копируем остальные файлы проекта
COPY vk-scanner/ ./

# Устанавливаем переменные окружения для приложения
ENV IS_HEADLESS=true
ENV IS_DOCKERIZED=true

# Запуск приложения
CMD ["npm", "run", "start"]