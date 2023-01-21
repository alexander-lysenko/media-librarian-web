FROM alpine:3.16

# Install packages
RUN cd /root && wget https://getcomposer.org/download/2.5.1/composer.phar && \
    chmod +x composer.phar && ln -s /root/composer.phar /usr/bin/composer

RUN apk add --update bash shadow openrc git curl mc nginx
RUN apk add php81 php81-fpm php81-common php81-cli php81-curl php81-pecl-xdebug php81-pecl-memcached
RUN apk add php81-pdo php81-pdo_pgsql php81-sqlite3 php81-pdo_sqlite php81-redis \
    php81-mbstring php81-xml php81-json php81-zip php81-gd php81-phar \
    php81-openssl php81-dom php81-tokenizer php81-fileinfo php81-xmlwriter php81-simplexml

# Copy configurations
COPY ./docker-entrypoint.sh /root/docker-entrypoint.sh
COPY ./etc/.bashrc /root/.bashrc
COPY ./etc/.bashrc /var/lib/nginx/.bashrc
COPY ./nginx /etc/nginx
COPY ./php-fpm.conf /etc/php81/php-fpm.conf
COPY ./etc/xdebug.ini /etc/php81/conf.d/20_xdebug.ini

# Prepare things to execute
RUN mkdir /logs && mkdir /run/openrc && touch /run/openrc/softlevel
RUN ln -s /usr/bin/php81 /usr/bin/php
RUN chmod +x /root/docker-entrypoint.sh
RUN usermod -u 1000 nginx

# Starting containers
WORKDIR /app
ENTRYPOINT ["/root/docker-entrypoint.sh"]
CMD ["/bin/bash"]
