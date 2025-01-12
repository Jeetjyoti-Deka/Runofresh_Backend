# Variables
COMPOSE_FILE=docker-compose.yml

# Start PostgreSQL container
up:
	docker-compose -f $(COMPOSE_FILE) up -d

# Stop PostgreSQL container
down:
	docker-compose -f $(COMPOSE_FILE) down

# build the postgresql container
up_build:
	docker-compose -f $(COMPOSE_FILE) up --build -d

# Remove data volume
clean:
	docker-compose -f $(COMPOSE_FILE) down -v