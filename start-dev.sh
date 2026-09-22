#!/usr/bin/env bash
set -euo pipefail

#################################
## Run application in DEV mode ##
#################################

COMPOSE="docker compose --file docker-compose-dev.yaml"
started_at=$(date +"%s")

echo "-----> Provisioning containers"
$COMPOSE up -d
echo ""

echo "-----> Waiting for database ..."
for i in {1..60}; do
  if $COMPOSE exec -T db-dev pg_isready -U postgres -d todo-dev >/dev/null 2>&1; then
    echo "<----- Database is ready"
    break
  fi
  [ "$i" -eq 60 ] && { echo "!!! Database did not become ready in 60s"; exit 1; }
  sleep 1
done

# Run Sequelize's migrations.
echo "-----> Running application migrations"
$COMPOSE exec -T server-dev npx sequelize-cli db:migrate
echo ""

# Run Sequelize's seeds.
echo "-----> Running application seeds"
$COMPOSE exec -T server-dev npx sequelize-cli db:seed:all
echo "<----- Seeds created"

ended_at=$(date +"%s")
minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "-----> Done in ${minutes}m${seconds}s"
