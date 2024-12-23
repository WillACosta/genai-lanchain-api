help:
	@echo "Available commands:"
	@echo "  run        Start app and services using Docker."
	@echo "  stop-all   Stop all services running on Docker."
	@echo "  remove     Remove all Docker containers."
	@echo "  clean      Remove temporary and cache files."

run:
	docker compose up -d

build:
	docker compose up --build -d

stop-all:
	docker compose stop $(docker ps -q)

remove:
	docker compose down

clean:
	rm -rf node_modules/ uploads/*.pdf
