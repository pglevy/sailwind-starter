---
inclusion: always
---

# Data Layer Convention

All prototype data MUST live in `src/db/` as typed async functions. Pages MUST import from `src/db/` — never inline data directly in components.

## Entity Module Pattern

Each entity gets its own file: `src/db/<entity>.ts` (plural, lowercase, e.g., `tasks.ts`, `applications.ts`, `documents.ts`).

Every entity module follows this structure:

```typescript
// 1. Export the TypeScript interface (singular, PascalCase)
export interface Task {
  id: number          // Always first, always number
  title: string
  assignee: string    // User references are plain username strings
  status: string
  createdBy: string   // User references are plain username strings
  createdOn: string
}

// 2. Seed data as a module-level mutable array
const tasks: Task[] = [
  { id: 1, title: "Review Application", assignee: "john.smith", ... },
]

// 3. Async CRUD functions
export async function getTasks(): Promise<Task[]> {
  return tasks
}

export async function getTask(id: number): Promise<Task | undefined> {
  return tasks.find(t => t.id === id)
}

export async function createTask(data: Omit<Task, 'id'>): Promise<Task> {
  const newTask = { ...data, id: Math.max(0, ...tasks.map(t => t.id)) + 1 }
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

## Naming Conventions

- Interface name: singular PascalCase (`Task`, `Document`, `Application`)
- File name: plural lowercase (`tasks.ts`, `documents.ts`, `applications.ts`)
- Functions: `get<Plural>`, `get<Singular>`, `create<Singular>`, `update<Singular>`, `delete<Singular>`
- The `id` field is always `number` and always the first field in the interface

## User References

Fields that reference Appian users (like `assignee`, `createdBy`, `modifiedBy`) are plain `string` fields containing a username like `"john.smith"`. Import mock usernames from `src/db/users.ts`.

See `src/db/users.ts` for the list of available mock usernames.

## Special Files

- `src/db/users.ts` — Mock usernames for user-reference fields. Not a regular entity.
- `src/db/types.ts` — Shared type utilities (if needed).

## Why This Convention

This pattern makes every prototype "transition-ready" for connecting to a real Appian backend:
- Async functions match real API call patterns — pages don't change when swapping mock for real
- One file per entity maps 1:1 to Appian record types
- TypeScript interfaces define the data contract that can be extracted into an API spec
- User-reference fields map directly to Appian's `SYSTEM_RECORD_TYPE_USER` relationships

## Page Usage

Pages use React state + useEffect to load data:

```typescript
import { getTasks } from '../db/tasks'

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])

  // render using tasks...
}
```
