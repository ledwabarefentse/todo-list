# Design (v1)

## Architecture
- Client: React (Vite)
- Server: Node.js (Express)
- Storage: JSON file on server filesystem

## API
- GET /health -> { ok: true }
- GET /tasks -> Task[]
- POST /tasks { title, dueDate? } -> Task
- PATCH /tasks/:id/toggle -> Task
- DELETE /tasks/:id -> 204

## Data Model
Task:
- id: string (uuid)
- title: string (required)
- dueDate: string | null (ISO)
- done: boolean
- createdAt: string (ISO)

## Key Decisions
- JSON storage chosen for fastest SDLC cycle and simplicity.
- Write-then-rename strategy used to reduce corruption risk.
- App factory pattern (createApp) used to enable Supertest integration tests.
