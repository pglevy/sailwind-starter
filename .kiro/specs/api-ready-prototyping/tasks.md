# API-Ready Prototyping: Tasks

## Task 1: Add data layer steering rule
- [x] Create `.kiro/steering/data-layer.md` that instructs agents to:
  - Place all prototype data in `src/db/<entity>.ts` as typed async functions
  - Never inline data directly in page components
  - Follow the entity module pattern (interface + seed data + CRUD functions)
  - Use `useCurrentUser()` for user-dependent data
- **Resolves:** REQ-1

## Task 2: Create reference `src/db/` structure with example entity
- [x] Create `src/db/types.ts` with shared type utilities
- [x] Create `src/db/users.ts` with mock usernames and display names (e.g., `"john.smith"`, `"alice.chen"`) for use as user-reference field values in other entities
- [x] Create one example entity file (e.g., `src/db/tasks.ts`) showing the full pattern: interface, seed data, `getTasks()`, `getTask()`, `createTask()`, `updateTask()` — with user-reference fields like `assignee` using mock usernames
- **Resolves:** REQ-2, REQ-3

## Task 3: Verify the app builds with the new data layer
- [x] Verify the app builds and runs without errors after adding `src/db/`
- [x] Confirm the example entity module exports work correctly
- **Resolves:** REQ-2

## Task 4: Migrate existing example pages to use `src/db/`
- [x] Refactor `src/pages/task-dashboard.tsx` to import from `src/db/tasks.ts` instead of inline data
- [x] Refactor `src/pages/application-status.tsx` to import from a new `src/db/applications.ts`
- [x] Refactor `src/pages/document-review.tsx` to import from a new `src/db/documents.ts`
- [x] Verify all pages render correctly with the new data layer
- **Resolves:** REQ-7

## Task 5: Create the "extract prototype contract" skill
- [x] Create `.kiro/skills/extract-prototype-contract.md` that defines how to:
  - Walk `src/db/*.ts` files and identify entity modules
  - Extract TypeScript interfaces and map field types to Appian types
  - Map exported async functions to API endpoints
  - Generate UUIDs for all objects
  - Assemble an `API_Contract` JSON conforming to `api-contract.schema.json`
  - Write output to `appian-output/api-contract.json`
- [x] Copy `api-contract.schema.json` to project root (or reference from skillset)
- **Resolves:** REQ-4

## Task 6: Create the "generate Appian app" skill
- [x] Create `.kiro/skills/generate-appian-app.md` that defines how to:
  - Read an `API_Contract` JSON
  - Generate DDL (`CREATE TABLE` statements) for each record type
  - Generate record type XML files following the Appian export format, including `MANY_TO_ONE` relationships to `SYSTEM_RECORD_TYPE_USER` for user-reference fields
  - Generate web API XML files: GET endpoints using `queryRecordType` system rules, POST endpoints using `a!writeRecords` directly (no process models)
  - Generate group XML files (admin + viewer)
  - Generate application wrapper XML
  - Generate `META-INF/MANIFEST.MF`
  - Package everything into a ZIP
  - Write output to `appian-output/<app-name>/`
- [x] Include XML templates derived from the Case Management export and the `a!writeRecords` expression pattern
- **Resolves:** REQ-5

## Task 7: Create the "connect to Appian" skill
- [x] Create `.kiro/skills/connect-to-appian.md` that defines how to:
  - Read the `API_Contract` from `appian-output/api-contract.json`
  - Create `src/db/api-config.ts` with base URL and auth header helpers
  - Rewrite each entity module in `src/db/` to replace mock data with `fetch` calls
  - Preserve TypeScript interfaces (only the function bodies change)
  - Add `.env` support for `VITE_API_BASE`
- **Resolves:** REQ-6

## Task 8: Update project documentation
- [x] Update `README.md` to document the data layer convention
- [x] Update `AGENTS.md` to reference the `src/db/` pattern and new skills
- [x] Add `appian-output/` to `.gitignore`
