# API-Ready Prototyping: Design

## Overview

This design adds a data layer convention to the Sailwind Starter template and a set of skills that enable generating an importable Appian app package from a prototype's data model. The approach is "always-on" — every prototype uses the mock API pattern by default, making it transition-ready without opt-in decisions.

## Architecture

```
src/
  db/
    types.ts              ← Shared TypeScript types for all entities
    users.ts              ← User definitions + useCurrentUser hook + UserSwitcher
    <entity>.ts           ← One file per entity (seed data + async CRUD functions)
  pages/
    *.tsx                 ← Pages import from src/db/, never inline data
```

Skills (in `.kiro/skills/`):
```
extract-prototype-contract.md   ← Reads src/db/, produces API_Contract JSON
generate-appian-app.md          ← Takes API_Contract, produces importable ZIP
connect-to-appian.md            ← Swaps mock implementations for real fetch calls
```

Steering (in `.kiro/steering/`):
```
data-layer.md                   ← Convention: all data goes in src/db/
```

---

## Design Decisions

### DD-1: `src/db/` as the single data layer

All prototype data lives in `src/db/` as typed async functions. This is the only place data is defined — pages never embed data inline.

**Why async functions?** Even though mock data is synchronous, wrapping it in `async` means the call sites already use `await`/`.then()` patterns. When swapped to real `fetch` calls, the page code doesn't change at all.

**Why one file per entity?** Each file maps 1:1 to an Appian record type. The extraction skill can walk the directory and produce one record type per file. Clean, predictable, no ambiguity.

**Resolves:** REQ-1, REQ-2

---

### DD-2: Entity module pattern

Each entity file follows a consistent structure:

```typescript
// src/db/tasks.ts

export interface Task {
  id: number
  title: string
  assignee: string
  status: string
  priority: string
  dueDate: string
  progress: number
}

const tasks: Task[] = [
  { id: 1, title: "Review Application #1234", assignee: "user1", ... },
  { id: 2, title: "Process Document Review", assignee: "user1", ... },
]

export async function getTasks(): Promise<Task[]> {
  return tasks
}

export async function getTask(id: number): Promise<Task | undefined> {
  return tasks.find(t => t.id === id)
}

export async function createTask(data: Omit<Task, 'id'>): Promise<Task> {
  const newTask = { ...data, id: Math.max(...tasks.map(t => t.id)) + 1 }
  tasks.push(newTask)
  return newTask
}

export async function updateTask(id: number, data: Partial<Task>): Promise<Task | undefined> {
  const idx = tasks.findIndex(t => t.id === id)
  if (idx === -1) return undefined
  tasks[idx] = { ...tasks[idx], ...data }
  return tasks[idx]
}
```

**Convention rules:**
- Interface name = singular entity name, PascalCase (e.g., `Task`, `Document`, `Application`)
- Functions follow `get<Plural>`, `get<Singular>`, `create<Singular>`, `update<Singular>`, `delete<Singular>`
- The `id` field is always `number` and always the first field
- Seed data is a module-level array (mutable for mock CRUD operations)

**Resolves:** REQ-2

---

### DD-3: User references (not a custom record type)

Appian has a built-in `User` system record type (with fields like `uuid`, `username`, `firstName`, etc.). Custom record types form `MANY_TO_ONE` relationships *to* it — you don't create a User record type yourself.

For the mock data layer:
- `src/db/users.ts` exports a list of mock usernames and display names for reference
- Entity fields that reference users (like `assignee`, `createdBy`) are plain `string` fields containing a username like `"john.smith"`
- The extraction skill recognizes user-reference fields by naming convention (`assignee`, `createdBy`, `modifiedBy`, or any field annotated with a `// @user` comment) and generates the appropriate relationship

```typescript
// src/db/users.ts
export const mockUsers = [
  { username: "john.smith", displayName: "John Smith" },
  { username: "alice.chen", displayName: "Alice Chen" },
  { username: "bob.martinez", displayName: "Bob Martinez" },
]
```

```typescript
// src/db/tasks.ts
export interface Task {
  id: number
  title: string
  assignee: string    // ← username like "john.smith"
  createdBy: string   // ← username like "alice.chen"
  // ...
}
```

When generating the record type XML, user-reference fields produce:
- A field with type `{http://www.appian.com/ae/types/2009}User` and `sourceFieldType: "VARCHAR"`
- A `recordRelationshipCfg` with `targetRecordTypeUuid: "SYSTEM_RECORD_TYPE_USER"` and `relationshipType: "MANY_TO_ONE"`, joining on `SYSTEM_RECORD_TYPE_USER_FIELD_username`

This matches exactly how the Case Management export handles `assigneeUser`, `createdByUser`, and `modifiedByUser`.

**Resolves:** REQ-3

---

### DD-4: Contract extraction via skill

The `extract-prototype-contract` skill reads `src/db/` and produces an `API_Contract` JSON:

1. Walk `src/db/*.ts` files (excluding `users.ts` and `types.ts`)
2. For each file, extract the TypeScript interface → becomes a record type
3. Map interface fields to Appian types:
   - `number` → `Integer`
   - `string` → `Text`
   - `boolean` → `Boolean`
   - `Date` / date-like strings → `Datetime`
4. Map exported async functions → become endpoints:
   - `get<Plural>()` → `GET /<plural>`
   - `get<Singular>(id)` → `GET /<plural>/{id}` (or just the list endpoint)
   - `create<Singular>(data)` → `POST /new<Singular>`
   - `update<Singular>(id, data)` → `POST /update<Singular>`
   - `delete<Singular>(id)` → `POST /delete<Singular>` (Appian convention: POST for mutations)
5. Generate UUIDs for all objects
6. Assemble and validate against `api-contract.schema.json`

**Output location:** `appian-output/api-contract.json`

**Resolves:** REQ-4

---

### DD-5: Appian app generation via skill

The `generate-appian-app` skill takes an `API_Contract` and produces a ZIP:

**Directory structure of the generated ZIP:**
```
<AppName>/
  META-INF/
    MANIFEST.MF
  application/
    <app-uuid>.xml
  recordType/
    <record-uuid>.xml        ← One per record type
  webApi/
    <api-uuid>.xml           ← One per endpoint
  group/
    <admin-group-uuid>.xml   ← Admin group
    <viewer-group-uuid>.xml  ← Viewer group
```

No `processModel/`, `processModelFolder/`, or `content/` directories are needed.

**Record type XML generation:**
- Uses the field definitions from the contract
- Maps contract field types to Appian XML types (`Integer` → `{http://www.appian.com/ae/types/2009}Integer`, etc.)
- Sets `sourceType` to `RDBMS_TABLE`
- Sets `friendlyName` to the table name (derived from entity name: `Task` → `PREFIX_TASK`)
- Generates field UUIDs and wires them into the source configuration
- Includes a basic list view template expression
- Wires role maps to the generated admin/viewer groups
- For user-reference fields: generates `recordRelationshipCfg` entries with `targetRecordTypeUuid: "SYSTEM_RECORD_TYPE_USER"` and `relationshipType: "MANY_TO_ONE"`

**Web API XML generation — GET endpoints:**
Uses the `queryRecordType` system rule pattern (matching the existing `generate-web-apis.py` output):
```
a!localVariables(
  local!records: #"SYSTEM_SYSRULES_queryRecordType_v2"(
    recordType: #"urn:appian:record-type:v1:<record-type-uuid>",
    pagingInfo: #"SYSTEM_SYSRULES_pagingInfo"(
      startIndex: 1,
      batchSize: 500
    )
  ).data,
  #"SYSTEM_SYSRULES_httpResponse_v1"(
    headers: {
      #"SYSTEM_SYSRULES_httpHeader"(name: "Content-Type", value: "application/json")
    },
    body: #"SYSTEM_SYSRULES_toJson_v1"(value: local!records)
  )
)
```

**Web API XML generation — POST endpoints (create/update):**
Uses `a!writeRecords` directly — no process models needed:
```
a!localVariables(
  local!value: cast(
    'recordType!{<record-type-uuid>}<RecordTypeName>',
    a!fromJson(http!request.body)
  ),
  a!writeRecords(
    records: local!value,
    onSuccess: a!httpResponse(
      statusCode: 200,
      headers: {
        a!httpHeader(name: "Content-Type", value: "application/json")
      },
      body: a!toJson(fv!recordsUpdated)
    ),
    onError: a!httpResponse(
      statusCode: 500,
      headers: {
        a!httpHeader(name: "Content-Type", value: "application/json")
      },
      body: a!toJson(
        a!map(
          message: "Write request has failed",
          error: fv!error
        )
      )
    )
  )
)
```

This is a significant simplification over the `startProcess` pattern — it eliminates the need for process models, process model folders, and content objects (constants). The `a!writeRecords` function handles both create and update: if the record has an `id` it updates, if not it creates.

**Note on expression forms:** The GET endpoint uses system rule references (`#"SYSTEM_SYSRULES_..."`) because that's what the Appian export format produces. The POST endpoint uses the human-readable form (`a!writeRecords`, `a!fromJson`) because that's the form Appian accepts on import and it's more maintainable. Both forms are valid in web API XML.

**DDL generation:**
- Produces a `ddl.sql` file alongside the ZIP
- One `CREATE TABLE` per record type
- Maps Appian types to SQL types (`Integer` → `INTEGER`, `Text` → `VARCHAR(255)`, `Datetime` → `TIMESTAMP`, `User` → `VARCHAR(255)`)
- Includes primary key constraints
- User-reference fields are `VARCHAR(255)` columns (storing usernames)

**Resolves:** REQ-5

---

### DD-6: Prototype adaptation via skill

The `connect-to-appian` skill rewrites `src/db/` modules to use real `fetch` calls:

```typescript
// src/db/tasks.ts (after adaptation)
import { apiBase, buildHeaders } from './api-config'

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${apiBase}/tasks`, { headers: buildHeaders() })
  return res.json()
}
```

A new `src/db/api-config.ts` file provides the base URL and auth headers:

```typescript
export const apiBase = import.meta.env.VITE_API_BASE || 'https://{host}/suite/webapi'

export function buildHeaders() {
  return { 'Content-Type': 'application/json' }
}
```

**The key property:** Page components don't change. Only `src/db/` internals are rewritten.

**Resolves:** REQ-6

---

### DD-7: Naming prefix convention

Appian objects use a short prefix (e.g., `CM` for Case Management, `TD` for Task Dashboard). The extraction skill derives this from the app name:
- Take the first letter of each word in the app name
- If the result is 1 character, use the first 2 characters of the name instead
- User can override via skill input

This prefix is used for: table names (`TD_TASK`), web API names (`TD Get Tasks`), group names (`TD Admins`).

---

## Implementation Order

1. **Steering rule** (`data-layer.md`) — defines the convention
2. **Reference `src/db/` structure** — example entity + user context + types
3. **Wire into App.tsx** — add UserProvider, optionally add UserSwitcher
4. **Extract contract skill** — reads src/db/, produces API_Contract
5. **Generate Appian app skill** — takes contract, produces ZIP + DDL
6. **Connect to Appian skill** — rewrites src/db/ for real API calls

Steps 1-3 change the template itself. Steps 4-6 are skills that operate on the template.

---

## Risk: Record Type XML Fidelity

The biggest risk is generating record type XML that Appian actually accepts on import. The XML format is complex (see the Case Management example). Mitigation: start with the minimal required elements, test against a real Appian instance, and iterate. The DDL + web APIs are the higher-value artifacts anyway — if record type import fails, the user can create record types manually using the DDL as a guide.

## Risk: Convention Adoption

If agents don't follow the `src/db/` convention consistently, the extraction skill breaks. Mitigation: the steering rule is explicit and the pattern is simple. We can also add a build-time check or hook that warns if data is inlined in pages.
