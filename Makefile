run:
	docker compose up -d

build:
	docker compose up --build -d

stop-all:
	docker compose stop $(docker ps -q)

clean:
	rm -rf node_modules/ uploads/*.pdf