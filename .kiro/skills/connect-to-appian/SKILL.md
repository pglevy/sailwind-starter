---
name: connect-to-appian
description: >
  Rewrite the prototype's mock data layer (`src/db/`) to use real `fetch` calls against Appian Web API
  endpoints. Page components remain unchanged — only the function bodies in `src/db/` are replaced.
  Use this skill when the user says "connect to Appian", "switch to real APIs", "hook up the prototype
  to the backend", or "replace mock data with real API calls". Prerequisite: run
  `extract-prototype-contract` first and ensure the Appian app is imported.
---

# Connect to Appian

## Inputs

| Name | Type | Required | Description |
|---|---|---|---|
| `contract_path` | string | No | Path to the API_Contract JSON. Defaults to `appian-output/api-contract.json`. |
| `auth_tier` | string | No | `"session"` (default) or `"api_key"`. Determines how auth headers are built. |

## Outputs

- `src/db/api-config.ts` — new file with base URL and auth helpers
- `src/db/<entity>.ts` — each entity module rewritten with `fetch` calls
- `.env` — environment variable for the API base URL (if not already present)

## Instructions

### Step 1 — Read the contract

1. Read `appian-output/api-contract.json`.
2. Build a map of endpoint alias → endpoint object.
3. Build a map of record type name → record type object.

### Step 2 — Create `src/db/api-config.ts`

```typescript
/**
 * API configuration for connecting to Appian Web APIs.
 *
 * Set VITE_API_BASE in your .env file to point to your Appian environment:
 *   VITE_API_BASE=https://your-env.appiancloud.com/suite/webapi
 */

export const apiBase = import.meta.env.VITE_API_BASE || 'https://{host}/suite/webapi'

export function buildHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' }
}

// For api_key auth tier, uncomment and set the key via environment variable:
// export function buildHeaders(): Record<string, string> {
//   const headers: Record<string, string> = { 'Content-Type': 'application/json' }
//   const apiKey = import.meta.env.VITE_APPIAN_API_KEY
//   if (apiKey) {
//     headers['Appian-API-Key'] = apiKey
//   }
//   return headers
// }
```

If `auth_tier` is `"api_key"`, uncomment the api_key version and comment out the session version.

### Step 3 — Create `.env` file (if not present)

```
VITE_API_BASE=https://{host}/suite/webapi
```

If `.env` already exists, append the variable only if it's not already defined.

### Step 4 — Rewrite each entity module

For each entity file in `src/db/` (excluding `types.ts`, `users.ts`, `api-config.ts`):

1. **Preserve** the TypeScript interface and type exports — do not change them.
2. **Remove** the seed data array.
3. **Rewrite** each async function to use `fetch`.

**Pattern for GET functions:**

Find the matching GET endpoint from the contract (by matching the entity's plural name to the endpoint alias).

```typescript
import { apiBase, buildHeaders } from './api-config'

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${apiBase}/<alias>`, { headers: buildHeaders() })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function getTask(id: number): Promise<Task | undefined> {
  const all = await getTasks()
  return all.find(t => t.id === id)
}
```

Note: Appian's generated GET endpoint returns all records. Single-record fetch is done client-side by filtering. This matches the `queryRecordType` pattern which returns a list.

**Pattern for create/update functions:**

Find the matching POST write endpoint from the contract (alias like `write<Singular>`).

```typescript
export async function createTask(data: CreateInput<Task>): Promise<Task> {
  const res = await fetch(`${apiBase}/<writeAlias>`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function updateTask(id: number, data: UpdateInput<Task>): Promise<Task | undefined> {
  const res = await fetch(`${apiBase}/<writeAlias>`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ id, ...data }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
```

**Pattern for delete functions:**

Find the matching POST delete endpoint (alias like `delete<Singular>`).

```typescript
export async function deleteTask(id: number): Promise<boolean> {
  const res = await fetch(`${apiBase}/<deleteAlias>`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return true
}
```

### Step 5 — Leave `users.ts` unchanged

The `users.ts` file contains mock usernames for display purposes. Since Appian's User record type is system-provided and not exposed via the generated web APIs, keep the mock user lookup functions as-is. They're used for display name resolution in the UI.

### Step 6 — Verify

1. Run `getDiagnostics` on all modified files to check for TypeScript errors.
2. Run `pnpm run build` to confirm the app still builds.
3. Note that the app won't actually work until `VITE_API_BASE` is set to a real Appian environment URL and the web APIs are deployed.

### Step 7 — Present summary

```
═══════════════════════════════════════════════════════
  Prototype Connected to Appian
═══════════════════════════════════════════════════════

  Auth tier:    <session | api_key>
  API base:     Configured via VITE_API_BASE in .env

  Modified files:
    • src/db/api-config.ts  (new)
    • src/db/tasks.ts       (rewritten)
    • src/db/applications.ts (rewritten)
    • ...

  Unchanged:
    • src/db/users.ts       (mock display names)
    • src/db/types.ts       (type utilities)
    • All page components   (no changes needed)

  To test:
    1. Set VITE_API_BASE in .env to your Appian environment
    2. Ensure the Appian app is imported and web APIs are active
    3. Run the dev server and verify data loads from Appian
═══════════════════════════════════════════════════════
```

## Reference files

#[[file:schemas/api-contract.schema.json]]
#[[file:src/db/tasks.ts]]
#[[file:src/db/api-config.ts]]
