# Sailwind Component Library - Agent Reference

## Four Non-Negotiable Rules

1. **Import from `@pglevy/sailwind`** — never from `src/components/` or raw HTML when a Sailwind component exists.
2. **UPPERCASE prop values** — `size="STANDARD"`, not `size="standard"`. Always.
3. **Lucide icons, not emoji** — `import { CheckCircle } from 'lucide-react'`, never `✅` or `📄`.
4. **Data in `src/db/`** — all prototype data as typed async functions. Never inline in components.

## Component & Prop Reference (Steering Files)

These are auto-generated from the installed package and loaded automatically when editing pages:

- **`.kiro/steering/sail-components.md`** — canonical list of all available components and exact names
- **`.kiro/steering/sail-props.md`** — full prop tables for every component (use this to avoid guessing)
- **`.kiro/steering/sail-types.md`** — all SAIL enum types and valid values

If these seem stale: `node scripts/sync-sailwind-components.js` and `node scripts/sync-sailwind-props.js`

## Data Layer Convention

All prototype data MUST live in `src/db/` as typed async functions. See `.kiro/steering/data-layer.md` for the full convention.

```tsx
// ✅ CORRECT
import { getTasks, type Task } from '../db/tasks'
const [tasks, setTasks] = useState<Task[]>([])
useEffect(() => { getTasks().then(setTasks) }, [])

// ❌ WRONG
const tasks = [{ id: 1, title: "Review App", ... }]
```

## Page Development Workflow

1. Create file in `src/pages/`
2. Import components from `@pglevy/sailwind`
3. Add route to `src/App.tsx`
4. Add entry to `pages` array in `src/pages/home.tsx`
5. Run `pnpm run build` — fix all errors before declaring done

### Basic Page Structure

Adjust as needed:

```tsx
import { HeadingField, CardLayout } from '@pglevy/sailwind'

export default function PageName() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <HeadingField text="Page Title" size="LARGE" headingTag="H1" marginBelow="MORE" />
        <CardLayout padding="MORE" showShadow={true}>
          {/* Sailwind components here */}
        </CardLayout>
      </div>
    </div>
  )
}
```

## Appian Skills (in `.kiro/skills/`)

| Skill | Purpose |
|-------|---------|
| `extract-prototype-contract` | Reads `src/db/`, produces `appian-output/api-contract.json` |
| `generate-appian-app` | Takes contract, produces importable Appian app ZIP + DDL |
| `deploy-to-appian` | Deploys the generated package to an Appian environment |
| `connect-to-appian` | Rewrites `src/db/` to use real `fetch` calls |

## Before Declaring Page Complete

- [ ] All imports from `@pglevy/sailwind`
- [ ] Component names verified against `.kiro/steering/sail-components.md`
- [ ] All SAIL prop values UPPERCASE
- [ ] Page added to routes in `src/App.tsx`
- [ ] Page link added to `src/pages/home.tsx`
- [ ] `pnpm run build` passes with no errors
