FROM alpine:3.18

# Install packages
RUN apk add --update bash shadow supervisor git curl mc nginx
RUN apk add php81 php81-fpm php81-common php81-cli php81-curl php81-pecl-memcached
RUN apk add php81-mbstring php81-xml php81-json php81-zip php81-gd php81-phar php81-dom \
    php81-openssl php81-tokenizer php81-fileinfo php81-xmlwriter php81-simplexml \
    php81-pdo php81-pdo_pgsql php81-sqlite3 php81-pdo_sqlite php81-redis
RUN apk add php81-pecl-xdebug

RUN cd /root && wget https://getcomposer.org/download/2.6.6/composer.phar && \
    chmod +x composer.phar && ln -s /root/composer.phar /usr/bin/composer

# Copy configurations
COPY ./nginx /etc/nginx

COPY ./config/.bashrc /root/.bashrc
COPY ./config/.bashrc /var/lib/nginx/.bashrc

COPY ./config/php-fpm.conf /etc/php81/php-fpm.conf
COPY ./config/xdebug.ini /etc/php81/conf.d/xdebug.ini

COPY ./docker-entrypoint.sh /root/docker-entrypoint.sh
COPY ./config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Prepare things to execute

RUN unlink /usr/bin/php && ln -s /usr/bin/php81 /usr/bin/php
RUN chmod +x /root/docker-entrypoint.sh
RUN usermod -u 1000 nginx

# Starting containers
WORKDIR /app
ENTRYPOINT ["/root/docker-entrypoint.sh"]
CMD ["/bin/bash"]
