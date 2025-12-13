# Release Notes — v1.0 Tiny Tasks

## Features
- Create tasks (title required, optional due date)
- Toggle done
- Filter All/Open/Done
- Persistence via server-side JSON file

## Quality
- Automated backend tests (Jest + Supertest) passing
- Manual smoke test completed

## How to run
- Server: `cd server && npm run dev`
- Client: `cd client && npm run dev`

## Known limitations
- No auth, no multi-user
- JSON storage not designed for high concurrency
- Docker deployment pending (environment constraint)
