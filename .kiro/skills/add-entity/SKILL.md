---
name: add-entity
description: >
  Scaffold a new data entity module in src/db/ for a Sailwind Starter project — generates the
  TypeScript interface, mock seed data, and async CRUD functions (get/create/update/delete)
  following the project's data-layer convention, already wired for a future "connect to Appian"
  step. Use this skill whenever the user asks to "add a new data type", "create a model for X",
  "I need to track Y in the prototype", or wants to add fields/entities like tasks, comments,
  applications, documents, etc. Prefer this over inlining arrays of objects directly in a page
  component — prototype data always belongs in src/db/, and this skill is the fast, correct way
  to get it there.
metadata:
  title: Add Entity
  prompt: "Create a new data entity: "
  human-reviewer: Philip Levy
---

# Add Entity

Every piece of prototype data in this project lives in `src/db/` as a typed async function (see `.kiro/steering/data-layer.md` and AGENTS.md rule #4). Hand-writing a new entity module means re-deriving the same interface + CRUD boilerplate every time, and it's easy to drift from the convention — for example, forgetting that `id` must be first, or not wiring in the real-backend fallback that the `connect-to-appian` skill depends on later. This skill scaffolds it correctly in one step.

## When to use this vs. writing it by hand

Run the scaffold script whenever a page needs data that doesn't already have a home in `src/db/`. Check `src/db/` first — if an entity close to what you need already exists (e.g. `tasks.ts` might already cover what you're calling "to-dos"), extend that instead of creating a duplicate.

## Steps

### 1. Figure out the shape

Before running the script, work out with the user:
- The entity name (singular, PascalCase — e.g. `Comment`, `Invoice`, `Applicant`)
- Its fields beyond `id` and the standard audit fields, with types (`string`, `number`, or `boolean`)
- Whether it references a user (fields like `assignee`, `createdBy` — these are plain username strings, see `src/db/users.ts` for the mock usernames to use in seed data)
- Whether it references another entity (foreign key, e.g. `cardId: number` — note the relationship in a comment)

### 2. Scaffold it

```bash
node scripts/scaffold-entity.js --name Comment --fields "text:string,cardId:number,authorUsername:string"
```

This generates `src/db/comments.ts` with:
- The `Comment` interface (`id: number` first, then your fields, then audit fields `createdBy`/`createdOn`/`modifiedBy`/`modifiedOn`)
- One sample mock record (deliberately minimal — you'll add more)
- `getComments()`, `getComment(id)`, `createComment(data)`, `updateComment(id, data)`, `deleteComment(id)` — each already wired to fall back to real `fetch` calls via `src/db/api-config.ts` when `VITE_API_BASE` is set, matching the pattern the `connect-to-appian` skill expects

Flags:
- `--no-audit` — skip the four audit fields if they genuinely don't apply
- `--file <name>` — override the generated file name if the auto-pluralization guesses wrong. Common irregulars (person→people, child→children, etc.) are handled automatically; this is an escape hatch for anything more unusual
- `--force` — overwrite an existing file with the same name

### 3. Fill in realistic seed data

The generated file has exactly one sample row — that's not enough for a believable prototype. Add several more records with varied, realistic values. If the entity relates to another one (e.g. `cardId` pointing at `src/db/cards.ts`), make sure the IDs you use actually exist in that other file.

### 4. Wire it into a page

```typescript
import { getComments, type Comment } from '../db/comments'

const [comments, setComments] = useState<Comment[]>([])
useEffect(() => { getComments().then(setComments) }, [])
```

### 5. Verify

Run `pnpm run build` to make sure the new interface and CRUD functions type-check cleanly, especially if you hand-edited the generated file afterward.

## Notes on the script's behavior

- Function and mock-array names use correct English pluralization (`Category` → `getCategories`, not `getCategorys`) — but double-check anything unusual with `--file`.
- The generated file imports from `./api-config`, matching the pattern already used by `src/db/tasks.ts` and `src/db/lists.ts` in this project — don't strip that out even if you don't plan to connect to a real backend yet, since it's what makes `connect-to-appian` a no-op change later.
