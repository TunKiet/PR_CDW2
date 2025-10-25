FROM php:8.2-fpm

# ---------------------------
# 1️⃣ Cài system dependencies
# ---------------------------
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ---------------------------
# 2️⃣ Cài PHP extensions
# ---------------------------
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# ---------------------------
# 3️⃣ Cài Composer
# ---------------------------
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ---------------------------
# 4️⃣ Set working directory
# ---------------------------
WORKDIR /var/www

# ---------------------------
# 5️⃣ Copy source code
# ---------------------------
COPY . /var/www

# ---------------------------
# 6️⃣ Dọn cache Laravel để tránh lỗi "Target class [auth]"
# ---------------------------
RUN rm -rf bootstrap/cache/*.php

# ---------------------------
# 7️⃣ Cài dependencies PHP (composer)
# ---------------------------
RUN composer install --no-interaction --prefer-dist --optimize-autoloader \
    && composer dump-autoload --optimize

# ---------------------------
# 8️⃣ Cài Redis (nếu cần)
# ---------------------------
RUN pecl install redis && docker-php-ext-enable redis

# ---------------------------
# 9️⃣ Phân quyền storage & bootstrap/cache
# ---------------------------
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# ---------------------------
# 🔟 Expose port & khởi động app
# ---------------------------
EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
