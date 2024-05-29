FROM alpine:3.20

# Install packages
RUN apk add --update bash shadow supervisor git curl mc nginx
RUN apk add php82 php82-fpm php82-common php82-cli php82-curl php82-pecl-memcached
RUN apk add php82-mbstring php82-xml php82-json php82-zip php82-gd php82-phar php82-dom \
    php82-openssl php82-tokenizer php82-fileinfo php82-xmlwriter php82-simplexml \
    php82-pdo php82-pdo_pgsql php82-sqlite3 php82-pdo_sqlite php82-redis
RUN apk add php82-pecl-xdebug

RUN cd /root && wget https://getcomposer.org/download/2.7.5/composer.phar && \
    chmod +x composer.phar && ln -s /root/composer.phar /usr/bin/composer

# Copy configurations
COPY ./nginx /etc/nginx

COPY ./config/.bashrc /root/.bashrc
COPY ./config/.bashrc /var/lib/nginx/.bashrc

COPY ./config/php-fpm.conf /etc/php82/php-fpm.conf
COPY ./config/xdebug.ini /etc/php82/conf.d/xdebug.ini

COPY ./docker-entrypoint.sh /root/docker-entrypoint.sh
COPY ./config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Prepare things to execute

RUN unlink /usr/bin/php || ln -s /usr/bin/php82 /usr/bin/php
RUN chmod +x /root/docker-entrypoint.sh
RUN usermod -u 1000 nginx

# Starting containers
WORKDIR /app
ENTRYPOINT ["/root/docker-entrypoint.sh"]
CMD ["/bin/bash"]
