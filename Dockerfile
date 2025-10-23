# ========================================
# Stage 1: Build Laravel (Composer + npm)
# ========================================

FROM php:8.4-cli AS build

RUN apt-get update && apt-get install -y \
    unzip git curl libpng-dev libzip-dev zip npm \
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

RUN apk add --no-cache libpng libzip

WORKDIR /var/www/html

COPY --from=build /var/www/html /var/www/html

EXPOSE 9000
CMD ["php-fpm"]
