# ops/health.sh
#!/usr/bin/env bash
set -euo pipefail

# === CONFIG ===
PROJECT_DIR="${PROJECT_DIR:-/home/ubuntu/todo-list}"
PUBLIC_BASE_URL="${PUBLIC_BASE_URL:-http://localhost}"
API_TASKS_PATH="${API_TASKS_PATH:-/api/tasks}"

# Optional: if you add a backend health endpoint later, set:
# API_HEALTH_PATH="${API_HEALTH_PATH:-/api/health}"

# === EXECUTION ===
cd "$PROJECT_DIR"

echo "== time =="
date -u

echo "== docker compose ps =="
docker compose ps

echo "== endpoints (via nginx/public entrypoint) =="
curl -sS -o /dev/null -w "client_http=%{http_code}\n" "${PUBLIC_BASE_URL}/"
curl -sS -o /dev/null -w "api_tasks_http=%{http_code}\n" "${PUBLIC_BASE_URL}${API_TASKS_PATH}"

echo "== host resources =="
echo "-- uptime/load --"
uptime

echo "-- disk --"
df -h /

echo "-- memory --"
free -h

echo "== last container events (recent) =="
# Helpful when diagnosing restarts/pulls (non-fatal if docker events unavailable)
docker events --since 10m --until 0s 2>/dev/null | tail -n 50 || true
