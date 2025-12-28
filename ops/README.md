<!-- ops/README.md -->
# Ops Toolkit (TODO List on EC2)

This folder contains operational scripts for the **single-EC2** deployment of the TODO List app.
The goal is to keep EC2 as a deployment target while keeping operational tooling **versioned in the repo**.

## Files

- `health.sh`  
  One-command “health snapshot” for:
  - container state (`docker compose ps`)
  - user-visible endpoint checks (`/` and `/api/tasks`)
  - basic host metrics (uptime/load, disk, memory)
  - recent docker events (best-effort)

- `incident-bundle.sh`  
  Generates an “incident bundle” directory under `/var/log/todo-list/` including:
  - system snapshot (disk/mem/ports/docker info)
  - endpoint checks
  - compose + config copies
  - bounded container logs
  - container health JSON
  - a tarball for easy sharing

## Expected Deployment Layout on EC2

- Repo: `/home/ubuntu/todo-list`
- Ops scripts installed to: `/opt/todo-list/`
- Logs written to: `/var/log/todo-list/`

## Install on EC2

From the repo on EC2:

```bash
cd ~/todo-list
git pull

sudo mkdir -p /opt/todo-list
sudo mkdir -p /var/log/todo-list

sudo cp ops/health.sh /opt/todo-list/health.sh
sudo chmod +x /opt/todo-list/health.sh

sudo cp ops/incident-bundle.sh /opt/todo-list/incident-bundle.sh
sudo chmod +x /opt/todo-list/incident-bundle.sh
