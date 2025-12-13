# Requirements (v1)

## User Stories

### US1: Create Task
As a user, I want to add a task so I can track it.
**Acceptance Criteria**
- Title is required (min length 1)
- Task appears immediately in list
- Task is persisted after refresh

### US2: Toggle Done
As a user, I want to mark a task done/not done so I can track progress.
**Acceptance Criteria**
- Clicking toggle updates the UI state
- Change persists after refresh

### US3: Filter Tasks
As a user, I want to filter tasks so I can focus.
**Acceptance Criteria**
- Filters: All, Open, Done
- Correct tasks show under each filter

## Non-Functional Requirements
- Basic input validation and user feedback
- Handles up to 500 tasks without noticeable lag
- API responds within 300ms locally for normal operations

## Out of Scope
- Auth, multi-user, tags, search, reminders, notifications
