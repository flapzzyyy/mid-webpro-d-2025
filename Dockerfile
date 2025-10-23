# ========================================
# Stage 1: Build Laravel (Composer + npm)
# ========================================

FROM php:8.4-cli AS build

RUN apt-get update && apt-get install -y \
    unzip git curl nginx bash libpng-dev libzip-dev zip npm \
    && docker-php-ext-install pdo_mysql gd zip

WORKDIR /var/www/html

COPY . .

RUN curl -sS https://getcomposer.org/installer | php \
    && php composer.phar install --no-dev --optimize-autoloader --no-interaction

RUN npm install && npm run build || echo "Skipping vite build (no vite config)"

# ========================================
# Stage 2: Production image
# ========================================

FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    mysql-client \
    nginx \
    && docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

COPY --from=build /var/www/html /var/www/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R nobody:nobody /var/www/html/storage \
    && chown -R nobody:nobody /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

EXPOSE 8080
CMD php-fpm -D && nginx -g "daemon off;"
