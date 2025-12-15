# Tiny Tasks (Todo List)

## What this is
A lightweight task tracker with a React frontend and Node/Express backend.

## How to run (recommended)
### Prereqs
- Docker + Docker Compose

### Start
docker compose up --build

### Open
- App: http://localhost:8080
- API: http://localhost:3001/health

### Stop
docker compose down

## Notes
- Data persists in `server/data` (mounted into the container)
- If port 3001 is busy, stop the other service using it or change docker-compose ports.
