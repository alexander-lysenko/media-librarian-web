FROM alpine:3.16

# Copy configurations
COPY ./docker-entrypoint.sh /root/docker-entrypoint.sh
COPY ./etc/.bashrc /root/.bashrc
COPY ./nginx /etc/nginx
COPY ./php-fpm.conf /etc/php8/php-fpm.conf
COPY ./etc/xdebug.ini /etc/php8/conf.d/50-xdebug.ini

# Install packages
RUN cd /root && wget https://getcomposer.org/download/2.3.5/composer.phar && \
    chmod +x composer.phar && ln -s /root/composer.phar /usr/bin/composer

RUN apk add --update bash shadow openrc git curl mc nginx
RUN apk add php8 php8-fpm php8-common php8-cli php8-pecl-xdebug php8-pecl-memcache php8-curl
RUN apk add php8-pdo php8-pdo_pgsql php8-sqlite3 php8-pdo_sqlite php8-redis php8-pecl-memcache \
    php8-mbstring php8-xml php8-json php8-zip php8-gd php8-phar \
    php8-openssl php8-dom php8-tokenizer php8-fileinfo php8-xmlwriter php8-simplexml

# Prepare things to execute
RUN mkdir /logs && mkdir /run/openrc && touch /run/openrc/softlevel
RUN chmod +x /root/docker-entrypoint.sh
RUN usermod -u 1000 nginx

# Starting containers
WORKDIR /app
ENTRYPOINT ["/root/docker-entrypoint.sh"]
CMD ["/bin/bash"]
