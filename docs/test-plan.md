# Test Plan (v1)

## Scope
Verify core user stories: create, toggle, filter, persistence.

## Automated Tests (Server)
- GET /health returns ok
- POST /tasks validates title
- POST /tasks creates task; GET /tasks returns it
- PATCH /tasks/:id/toggle flips done
- DELETE /tasks/:id removes a task

## Manual Smoke Test
1. Start server + client
2. Create task "A"
3. Toggle task "A" done
4. Switch filters: All/Open/Done
5. Refresh page -> task state persists

## Exit Criteria
- All automated tests pass
- Smoke test passes
- No console errors in browser for basic flows
