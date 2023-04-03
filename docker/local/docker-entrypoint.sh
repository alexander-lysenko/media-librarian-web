#!/bin/bash

function run_services() {
  echo "== Starting supervisord and web services =="
  # Let supervisord start nginx & php-fpm81
  /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf &
}

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

function run_job_worker_default() {
  echo "== Starting Job Worker (default) =="
  cd /app && php artisan queue:work -v &
}

# Entrypoint for background container
function background() {
  install_composer_dependencies && apply_migrations
  run_job_worker_default

  trap "echo 'A critical error occurred. Background cannot continue working'; exit 1" HUP INT QUIT TERM

  echo "=========="
  echo "Background is Up!"

  while true; do
    sleep 1
  done
  exit 0
}

# Entrypoint for webapp container
function webapp() {
  clean_webapp_logs
  run_services

  trap "echo 'A critical error occurred. Webapp cannot continue working'; exit 1" HUP INT QUIT TERM

  echo "=========="
  echo "Web App is Up! Please make sure the front end is built from the latest version"

  while true; do
    sleep 1
  done
  exit 0
}

case "$1" in
"background")
  background
  ;;
"webapp")
  webapp
  ;;
*)
  exec "$@"
  ;;
esac
