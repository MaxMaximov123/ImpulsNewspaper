# Указываем базовый образ Node.js
FROM --platform=linux/amd64 node:18.16

# Устанавливаем необходимые пакеты, включая локали
RUN apt-get update && apt-get install -y \
    vim wget gnupg ca-certificates locales \
    && echo "ru_RU.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen \
    && update-locale LANG=ru_RU.UTF-8 LANGUAGE=ru_RU:ru LC_ALL=ru_RU.UTF-8 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/* \
    && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
    && chmod +x /usr/sbin/wait-for-it.sh

# Устанавливаем глобальные пакеты npm
RUN npm install -g npm@7 knex

# Устанавливаем переменные окружения для приложения
ENV LANG=ru_RU.UTF-8
ENV LANGUAGE=ru_RU:ru
ENV LC_ALL=ru_RU.UTF-8
ENV IS_HEADLESS=true
ENV IS_DOCKERIZED=true

# Настройка рабочей директории
WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY vk-scanner/package.json vk-scanner/package-lock.json ./
RUN npm install

# Копируем остальные файлы проекта
COPY vk-scanner/ ./

# Запуск приложения
CMD ["npm", "run", "start"]