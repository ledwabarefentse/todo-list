# ops/incident-bundle.sh
#!/usr/bin/env bash
set -euo pipefail

# === CONFIG ===
PROJECT_DIR="${PROJECT_DIR:-/home/ubuntu/todo-list}"
OUT_BASE="${OUT_BASE:-/var/log/todo-list}"
TAIL_LINES="${TAIL_LINES:-800}"
PUBLIC_BASE_URL="${PUBLIC_BASE_URL:-http://localhost}"
API_TASKS_PATH="${API_TASKS_PATH:-/api/tasks}"

TS="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_DIR="${OUT_BASE}/incident-${TS}"

mkdir -p "$OUT_DIR"
cd "$PROJECT_DIR"

echo "Collecting incident bundle into: $OUT_DIR"

# --- Snapshot ---
{
  echo "== time =="; date -u; echo
  echo "== who =="; who; echo
  echo "== uptime/load =="; uptime; echo
  echo "== disk =="; df -h /; echo
  echo "== memory =="; free -h; echo
  echo "== kernel =="; uname -a; echo
  echo "== listening ports (summary) ==";
  ss -lntup 2>/dev/null | sed -n '1,200p' || true
  echo
  echo "== docker version =="; docker version 2>/dev/null || true; echo
  echo "== docker info (top) =="; docker info 2>/dev/null | sed -n '1,200p' || true; echo
  echo "== docker compose ps =="; docker compose ps; echo
} > "${OUT_DIR}/snapshot.txt" 2>&1

# --- Endpoint checks (what a user sees) ---
{
  echo "== endpoints =="
  curl -sS -o /dev/null -w "client_http=%{http_code}\n" "${PUBLIC_BASE_URL}/"
  curl -sS -o /dev/null -w "api_tasks_http=%{http_code}\n" "${PUBLIC_BASE_URL}${API_TASKS_PATH}"
} > "${OUT_DIR}/endpoints.txt" 2>&1 || true

# --- Compose & configs (for diffs) ---
cp -f docker-compose.yml "${OUT_DIR}/docker-compose.yml" 2>/dev/null || true
cp -f compose.yaml "${OUT_DIR}/compose.yaml" 2>/dev/null || true
cp -f .env "${OUT_DIR}/.env" 2>/dev/null || true

if [ -f client/nginx/default.conf ]; then
  mkdir -p "${OUT_DIR}/nginx"
  cp -f client/nginx/default.conf "${OUT_DIR}/nginx/default.conf" || true
fi

# --- Container logs (bounded) ---
docker compose logs --no-color --tail="${TAIL_LINES}" client > "${OUT_DIR}/client.log" 2>&1 || true
docker compose logs --no-color --tail="${TAIL_LINES}" server > "${OUT_DIR}/server.log" 2>&1 || true

# --- Health status JSON (if available) ---
{
  echo "== container health (client) =="
  CID_CLIENT="$(docker compose ps -q client 2>/dev/null || true)"
  if [ -n "${CID_CLIENT}" ]; then
    docker inspect --format='{{json .State.Health}}' "${CID_CLIENT}" || true
  else
    echo "client container id not found"
  fi
  echo
  echo "== container health (server) =="
  CID_SERVER="$(docker compose ps -q server 2>/dev/null || true)"
  if [ -n "${CID_SERVER}" ]; then
    docker inspect --format='{{json .State.Health}}' "${CID_SERVER}" || true
  else
    echo "server container id not found"
  fi
} > "${OUT_DIR}/health.json.txt" 2>&1

# --- Recent cron + system logs (useful for “why didn’t it run”) ---
{
  echo "== cron status =="; systemctl status cron --no-pager || true; echo
  echo "== last 200 syslog lines ==";
  tail -n 200 /var/log/syslog 2>/dev/null || true
} > "${OUT_DIR}/system.txt" 2>&1

# --- Tarball for easy sharing ---
tar -czf "${OUT_BASE}/incident-${TS}.tar.gz" -C "${OUT_BASE}" "incident-${TS}" 2>/dev/null || true

echo "Done."
echo "Bundle directory: ${OUT_DIR}"
echo "Tarball (if created): ${OUT_BASE}/incident-${TS}.tar.gz"
