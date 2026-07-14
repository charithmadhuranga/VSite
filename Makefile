.PHONY: dev dev-server dev-frontend build run stop clean logs

dev: dev-server dev-frontend

dev-server:
	node server/index.js

dev-frontend:
	npx vite

build:
	docker compose build

run:
	docker compose up -d

stop:
	docker compose down

clean:
	docker compose down -v
	rm -rf data/

logs:
	docker compose logs -f
