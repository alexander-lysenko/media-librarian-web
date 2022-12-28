#!/bin/bash

function run_services() {
    echo "== Registering services =="
    openrc -q
    rc-update add nginx
    rc-update add php-fpm8

    echo "== Starting services =="
    rc-service nginx start
    rc-service php-fpm8 start
}

function clean_webapp_logs() {
    echo -n "Creating / Cleaning logs... "
    # Overwrites log files with an empty string
    echo -n "" >/logs/nginx-error.log
    echo -n "" >/logs/php-error.log
    echo -n "" >/logs/php-fpm-access.log
    echo -n "" >/logs/php-fpm-error.log
    echo -n "" >/logs/xdebug.log
    # Make an ability to read the log files outside the container
    chown -R nginx:www-data /logs

    if [ -f "/app/storage/logs/laravel.log" ]; then
        chmod -R 777 /app/storage/logs/*
    fi
    echo "Done"
}

function install_composer_dependencies() {
    echo "Installing Composer dependencies..."
    cd /app && composer install
}

function apply_migrations() {
    echo "== Applying Migrations =="
    cd /app && php artisan migrate
}

# Entrypoint for webapp container
function webapp() {
    clean_webapp_logs
    run_services
    install_composer_dependencies && apply_migrations

    echo "=========="
    echo "Media Librarian Web App is Up! Please make sure the front end is built from the latest version"
    while true; do
        sleep 1
    done
    exit 0
}

case "$1" in
"webapp")
    webapp
    ;;
*)
    exec "$@"
    ;;
esac
