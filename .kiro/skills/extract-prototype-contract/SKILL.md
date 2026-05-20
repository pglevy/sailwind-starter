---
name: extract-prototype-contract
description: >
  Extract an API contract from the prototype's `src/db/` data layer, producing an `API_Contract` JSON
  that can be used to generate an importable Appian app package. Use this skill when the user says
  "extract the API contract", "generate the contract from the prototype", "what's the data model
  for this prototype?", or "prepare for Appian app generation".
---

# Extract Prototype Contract

## Inputs

| Name | Type | Required | Description |
|---|---|---|---|
| `app_name` | string | Yes | Human-readable application name (e.g., "Task Dashboard"). Used for naming Appian objects. |
| `prefix` | string | No | Short prefix for Appian object names (e.g., "TD"). If omitted, derive from `app_name` by taking the first letter of each word. If result is 1 char, use first 2 chars instead. |

## Outputs

- `appian-output/api-contract.json` — the normative API contract

## Instructions

### Step 1 — Discover entity modules

1. List all `.ts` files in `src/db/`.
2. Exclude `types.ts` and `users.ts` — these are utility files, not entities.
3. Each remaining file represents one entity (one Appian record type).

### Step 2 — Extract interfaces and fields

For each entity file:

1. Find the exported TypeScript `interface` declaration. The interface name is the entity name (singular PascalCase, e.g., `Task`).
2. Extract each field from the interface:
   - `name`: the field name as written (camelCase)
   - `type`: map the TypeScript type to an Appian type:

| TypeScript type | Appian type |
|---|---|
| `number` | `Integer` |
| `string` | `Text` |
| `boolean` | `Boolean` |
| `string` (field named `*Date`, `*On`, `*At`, or `*Time`) | `Datetime` |
| `string` (field named `assignee`, `createdBy`, `modifiedBy`, `submittedBy`, or annotated `// @user`) | `User` |
| `string \| null` | `Text` |
| `number \| null` | `Integer` |

3. The `id` field is always the record identifier (primary key).

### Step 3 — Detect user-reference fields

A field is a user reference if:
- Its name is one of: `assignee`, `createdBy`, `modifiedBy`, `submittedBy`, `reviewer`, `approver`, `owner`
- OR it has a `// @user` comment on the same line
- OR its name ends with `By` (e.g., `assignedBy`, `approvedBy`)

Mark these fields with type `User` in the contract. They will generate `MANY_TO_ONE` relationships to `SYSTEM_RECORD_TYPE_USER` in the Appian app.

### Step 4 — Map functions to endpoints

For each entity file, examine the exported async functions:

| Function pattern | Endpoint |
|---|---|
| `get<Plural>()` | `GET /<plural>` with `response_fields` from the interface |
| `get<Singular>(id)` | (Included in the GET list endpoint — Appian typically uses query params for single-record fetch) |
| `create<Singular>(data)` | `POST /write<Singular>` with `request_fields` from the interface (excluding `id`) |
| `update<Singular>(id, data)` | `POST /write<Singular>` (same endpoint — `a!writeRecords` handles both create and update) |
| `delete<Singular>(id)` | `POST /delete<Singular>` with `request_fields: [{ name: "id", type: "Integer" }]` |

**Important:** In Appian, create and update use the same `a!writeRecords` call. So `createTask` and `updateTask` map to a single `POST /write<Singular>` endpoint. If the record has an `id`, it updates; if not, it creates.

### Step 5 — Build record types

For each entity, build a record type object:

```json
{
  "name": "<PREFIX> <EntityName>",
  "uuid": "<generate-uuid>",
  "table": "<PREFIX>_<ENTITY_NAME_UPPER>",
  "fields": [
    { "name": "<fieldName>", "type": "<AppianType>" }
  ]
}
```

- `name`: prefix + space + entity name (e.g., `"TD Task"`)
- `uuid`: generate a new UUID v4
- `table`: prefix + underscore + entity name in SCREAMING_SNAKE_CASE (e.g., `"TD_TASK"`)
- `fields`: all fields from the interface, with Appian types

### Step 6 — Build endpoints

For each entity, build endpoint objects:

**GET endpoint:**
```json
{
  "method": "GET",
  "alias": "<plural lowercase>",
  "name": "<PREFIX> Get <PluralName>",
  "response_fields": [ ... all fields from the interface ... ]
}
```

**POST write endpoint** (if `create` or `update` functions exist):
```json
{
  "method": "POST",
  "alias": "write<Singular>",
  "name": "<PREFIX> Write <EntityName>",
  "request_fields": [ ... all fields from the interface ... ]
}
```

**POST delete endpoint** (if `delete` function exists):
```json
{
  "method": "POST",
  "alias": "delete<Singular>",
  "name": "<PREFIX> Delete <EntityName>",
  "request_fields": [{ "name": "id", "type": "Integer" }]
}
```

### Step 7 — Assemble the API_Contract

```json
{
  "app_name": "<app_name input>",
  "app_uuid": "<generate-uuid>",
  "base_url": "https://{host}/suite/webapi",
  "auth_tier": "session",
  "endpoints": [ ... all endpoints ... ],
  "record_types": [ ... all record types ... ]
}
```

### Step 8 — Validate

Validate the assembled contract against the schema at `schemas/api-contract.schema.json`. The schema requires:
- All top-level fields present (`app_name`, `app_uuid`, `base_url`, `auth_tier`, `endpoints`, `record_types`)
- Every endpoint has `method`, `alias`, `name`
- GET endpoints have `response_fields` or `shape: "unknown"`
- POST endpoints have `request_fields` or `shape: "unknown"`
- Every record type has `name`, `uuid`, `table`, `fields`

If validation fails, fix the issues and re-validate.

### Step 9 — Write output

1. Create the `appian-output/` directory if it doesn't exist.
2. Write the contract to `appian-output/api-contract.json` (pretty-printed).
3. Present a summary to the user:
   - Number of record types extracted
   - Number of endpoints generated
   - List of user-reference fields detected
   - Any warnings (e.g., fields that couldn't be typed)

## Example

Given `src/db/tasks.ts` with a `Task` interface and `app_name = "Task Dashboard"`, `prefix = "TD"`:

**Record type:**
```json
{
  "name": "TD Task",
  "uuid": "...",
  "table": "TD_TASK",
  "fields": [
    { "name": "id", "type": "Integer" },
    { "name": "title", "type": "Text" },
    { "name": "assignee", "type": "User" },
    { "name": "status", "type": "Text" },
    { "name": "priority", "type": "Text" },
    { "name": "category", "type": "Text" },
    { "name": "dueDate", "type": "Text" },
    { "name": "progress", "type": "Integer" },
    { "name": "createdBy", "type": "User" },
    { "name": "createdOn", "type": "Text" }
  ]
}
```

**Endpoints:**
- `GET /tasks` → TD Get Tasks
- `POST /writeTask` → TD Write Task

## Reference files

#[[file:schemas/api-contract.schema.json]]
#[[file:src/db/tasks.ts]]
#[[file:src/db/users.ts]]
