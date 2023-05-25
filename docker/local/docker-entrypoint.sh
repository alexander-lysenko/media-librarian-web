#!/bin/bash
# https://techstop.github.io/bash-script-colors/

DONE_STDOUT="\e[1;32m DONE \e[0m"
WEB_UP_STDOUT="\e[1;32mWEB APP IS UP!\e[0m"
NPM_BUILD_STDOUT="\e[1;33mcd src && npm run build\e[0m\n"

function clean_webapp_logs() {
  echo "== Creating / Cleaning log files =="
  # Overwrites log files with an empty string
  echo -n "" >/logs/nginx-error.log && \
  echo -e "Processing file: /logs/nginx-error.log ... $DONE_STDOUT"
  echo -n "" >/logs/php-error.log && \
  echo -e "Processing file: /logs/php-error.log ... $DONE_STDOUT"
  echo -n "" >/logs/php-fpm-access.log && \
  echo -e "Processing file: /logs/php-fpm-access.log ... $DONE_STDOUT"
  echo -n "" >/logs/php-fpm-error.log && \
  echo -e "Processing file: /logs/php-fpm-error.log ... $DONE_STDOUT"
  echo -n "" >/logs/supervisord.log && \
  echo -e "Processing file: /logs/supervisord.log ... $DONE_STDOUT"
  echo -n "" >/logs/xdebug.log && \
  echo -e "Processing file: /logs/xdebug.log ... $DONE_STDOUT"

  # Make an ability to read the log files outside the container
  chown -R nginx:www-data /logs && \
  echo -e "Fixing permissions for root logs directory ... $DONE_STDOUT"

  # Make an ability to read the log files outside the container
  if [ -f "/app/storage/logs/laravel.log" ]; then
    chmod -R 777 /app/storage/logs/* && \
    echo -e "Fixing permissions for Laravel logs directory ... $DONE_STDOUT"
  fi
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
  echo -e "This environment uses the production built of front-end"
  echo -e "You have to build it outside the container using the following command:"
  echo -e "$NPM_BUILD_STDOUT"

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
