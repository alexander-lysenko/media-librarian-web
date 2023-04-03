#!/bin/bash

DONE_STDOUT="\033[1;32m DONE \033[0m"
WEB_UP_STDOUT="\033[1;32mWEB APP IS UP!\n\n \033[0m"

function clean_webapp_logs() {
  echo -n "Creating / Cleaning logs... "
  # Overwrites log files with an empty string
  echo -n "" >/logs/nginx-error.log
  echo -n "" >/logs/php-error.log
  echo -n "" >/logs/php-fpm-access.log
  echo -n "" >/logs/php-fpm-error.log
  echo -n "" >/logs/supervisord.log
  echo -n "" >/logs/xdebug.log
  # Make an ability to read the log files outside the container
  chown -R nginx:www-data /logs

  if [ -f "/app/storage/logs/laravel.log" ]; then
    chmod -R 777 /app/storage/logs/*
  fi
  echo -e "$DONE_STDOUT"
}

function install_composer_dependencies() {
  echo "== Installing Composer dependencies =="
  cd /app && composer install
}

function apply_migrations() {
  echo "== Applying Migrations =="
  cd /app && php artisan migrate
}

function run_services() {
  echo "== Starting supervisord and web services =="
  # Let supervisord start nginx & php-fpm81 and Laravel workers
  /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf &
}

# Entrypoint for webapp container
function webapp() {
  install_composer_dependencies && apply_migrations
  clean_webapp_logs
  run_services

  trap "echo 'A critical error occurred. Webapp cannot continue working'; exit 1" HUP INT QUIT TERM

  echo "========================================"
  echo -e "$WEB_UP_STDOUT"
  echo -e "Please make sure the front end is built from the latest version"

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
