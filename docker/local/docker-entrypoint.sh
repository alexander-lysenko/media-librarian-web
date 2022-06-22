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
    echo "Creating / Cleaning logs..."
    # Overwrites log files with an empty string
    echo -n "" >/logs/nginx-error.log
    echo -n "" >/logs/php-error.log
    echo -n "" >/logs/php-fpm-access.log
    echo -n "" >/logs/php-fpm-error.log
    echo -n "" >/logs/xdebug.log
    # Make an ability to read the log files outside the container
    chown -R nginx:www-data /logs
}

function install_composer_dependencies() {
    echo "Installing Composer dependencies..."
    cd /app && composer install
}

function apply_migrations() {
    echo "== Applying Migrations =="
}

# Entrypoint for webapp container
function webapp() {
    clean_webapp_logs
    run_services
#    install_composer_dependencies && apply_migrations

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
