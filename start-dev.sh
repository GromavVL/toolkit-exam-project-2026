#!/usr/bin/env bash

#################################
## Run application in DEV mode ##
#################################


started_at=$(date +"%s")

echo "-----> Provisioning containers"
docker compose --file docker-compose-dev.yaml up -d
echo ""

echo "-----> Database pending ..."
sleep 5

# Run Sequalize's migrations.
echo "-----> Running application migrations"
docker exec -it toolkit-exam-project-2026-server-dev-1 npx sequelize-cli db:migrate
echo ""

# Run Sequalize's seeds.
echo "-----> Running application seeds"
docker exec -it toolkit-exam-project-2026-server-dev-1 npx sequelize-cli db:seed:all
echo "<----- Seeds created"

ended_at=$(date +"%s")

minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "-----> Done in ${minutes}m${seconds}s"