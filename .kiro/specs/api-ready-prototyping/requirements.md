# API-Ready Prototyping: Requirements

## Problem Statement

Sailwind prototypes currently embed data inline in page components. When it's time to connect a prototype to a real backend (like Appian), there's a manual translation step: someone has to reverse-engineer the data model from the UI code, build the backend objects, and rewire the prototype. This slows down the path from prototype to working app.

## Goal

Make every Sailwind prototype "transition-ready" by default — with zero extra effort during vibe coding — so that a prototype's data layer can be swapped from mock to real API with minimal friction, and an importable Appian app package (record types + web APIs) can be generated directly from the prototype's data conventions.

## Audience

Internal Appian teams who want to go from prototype → Data Model they can inspect and reason about in an Appian environment.

## Requirements

### EARS Notation Key
- **Ubiquitous:** The system shall [requirement] — always applies
- **Event-driven:** When [event], the system shall [requirement]
- **State-driven:** While [state], the system shall [requirement]
- **Unwanted behavior:** If [condition], then the system shall [requirement]

---

### REQ-1: Data Layer Convention (Steering)
The system shall include a steering rule that instructs agents to place all prototype data in `src/db/` as typed async functions (e.g., `getItems()`, `createItem()`), rather than inlining data in page components.

**Acceptance:** A new steering file exists that defines the convention. Agents following it produce pages that import from `src/db/` instead of embedding data inline.

---

### REQ-2: Mock API Module Structure
The system shall provide a `src/db/` directory structure where each entity has its own module exporting async CRUD-style functions and TypeScript types.

**Acceptance:** A reference `src/db/` structure exists with at least one example entity showing the pattern (types, seed data, async functions).

---

### REQ-3: User References
The system shall provide a `src/db/users.ts` module with mock usernames (e.g., `"john.smith"`, `"alice.chen"`) that other entity modules reference for user-type fields (like `assignee`, `createdBy`). The extraction skill shall recognize user-reference fields and generate `MANY_TO_ONE` relationships to Appian's built-in `SYSTEM_RECORD_TYPE_USER` record type, joining on `SYSTEM_RECORD_TYPE_USER_FIELD_username`.

**Acceptance:** A `src/db/users.ts` file exists with mock usernames. Entity modules reference these usernames as plain strings. The extraction skill maps user-reference fields to the correct Appian system record type relationship.

---

### REQ-4: API Contract Extraction
When a user invokes the "extract contract" skill, the system shall read the `src/db/` modules and produce an `API_Contract` JSON conforming to the existing `api-contract.schema.json` schema.

**Acceptance:** A skill/steering file exists that defines how to walk `src/db/`, map TypeScript types to record type fields, and map async functions to API endpoints. The output validates against the schema.

---

### REQ-5: Appian App Generation
When a user invokes the "generate Appian app" skill with an `API_Contract`, the system shall produce:
1. DDL (`CREATE TABLE` statements) for each record type
2. Record type XML files with field definitions and DB source bindings
3. Web API XML files for each endpoint — GET endpoints using `queryRecordType`, POST endpoints using `a!writeRecords` directly (no process models)
4. Group XML files (admin + viewer)
5. An application wrapper XML
6. A `META-INF/MANIFEST.MF`
7. All of the above packaged as a ZIP importable into Appian

**Acceptance:** Given a valid `API_Contract`, the skill produces a ZIP whose structure matches the Appian app export format. POST/PUT web APIs use `a!writeRecords` with `cast` + `a!fromJson(http!request.body)` — no process models or constants are generated.

---

### REQ-6: Prototype Adaptation
When a user invokes the "connect to Appian" skill, the system shall replace the mock implementations in `src/db/` with real `fetch` calls to the generated web API endpoints, using a configurable base URL.

**Acceptance:** After running the skill, `src/db/` modules call `fetch()` against the web API aliases from the contract. Page components remain unchanged.

---

### REQ-7: Existing Page Migration (Optional)
When a user requests migration of existing pages, the system shall refactor inline data in existing page components into the `src/db/` convention.

**Acceptance:** Existing pages (like `task-dashboard.tsx`) can be refactored to use `src/db/` imports instead of inline data, without changing their visual output.

---

## Out of Scope

- Process model generation (too complex and variable)
- Appian site/interface generation
- OpenAPI YAML generation (the `API_Contract` JSON is sufficient)
- Concept model / domain documentation (Accord Kit territory)
- Automated DB provisioning on Appian environments
