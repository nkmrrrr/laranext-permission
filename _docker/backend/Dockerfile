FROM php:8.3-fpm-alpine


RUN apk add --no-cache \
bash git unzip curl icu-dev libzip-dev oniguruma-dev libpng-dev \
&& docker-php-ext-configure intl \
&& docker-php-ext-install pdo_mysql intl zip mbstring exif \
&& rm -rf /var/cache/apk/*


COPY --from=composer:2 /usr/bin/composer /usr/bin/composer


WORKDIR /var/www/html


RUN addgroup -g 1000 app && adduser -D -G app -u 1000 app \
&& chown -R app:app /var/www/html
USER app