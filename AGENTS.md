# Sailwind Component Library - Agent Reference

This document provides essential guidance for AI agents (Amazon Q and Kiro) working with the Sailwind React component library for rapid Appian prototyping.

## Critical Principles

### 1. Sailwind-First Big Picture (MANDATORY)

**DEFAULT APPROACH FOR ALL UI WORK:** Build with components from `@pglevy/sailwind` first.

- For new pages, clone tasks, and redesigns, start by mapping the interface to available Sailwind components.
- Use raw HTML/Tailwind primitives only for parts the package truly does not support.
- If raw HTML is used, explicitly state why the package component was not sufficient.
- `src/components/` is for project-specific custom components only when a package component does not exist.

**Clone behavior:** If asked to "clone" an existing page/app, reproduce structure and behavior using Sailwind components rather than copying raw DOM structure.

### 2. SAIL-Exact Parameters (UPPERCASE Required)

Always use UPPERCASE for SAIL parameter values:

```tsx
// ✅ CORRECT
<TagField size="STANDARD" labelPosition="COLLAPSED" />

// ❌ WRONG
<TagField size="standard" labelPosition="collapsed" />
```

### 3. Import from Sailwind Package First

**PRIMARY SOURCE: Import components from the `@pglevy/sailwind` npm package.**

```tsx
// ✅ CORRECT - Import from npm package
import { HeadingField, CardLayout, ButtonWidget } from '@pglevy/sailwind'

// ❌ WRONG - Don't look in src/components first
import { HeadingField } from '../components'
```

**Component discovery order:**
1. **FIRST**: Check `.kiro/steering/sail-components.md` (canonical, auto-synced from installed package exports)
2. **SECOND**: If needed, verify in `node_modules/@pglevy/sailwind/dist/components/` type definitions
3. **THIRD**: Only if component doesn't exist in package, consider creating custom component in `src/components/`
4. **LAST**: Raw HTML/third-party libraries (only when absolutely necessary)

**Note:** `src/components/` is for project-specific custom components only. Most components come from the package.

### 4. Use Lucide Icons (NOT Emoji)

**CRITICAL:** Always use Lucide React icons for visual indicators, NOT emoji characters.

```tsx
// ✅ CORRECT - Use Lucide icons
import { CheckCircle, AlertCircle, FileText } from 'lucide-react'

<Icon icon={CheckCircle} color="POSITIVE" size="MEDIUM" />

// ❌ WRONG - Don't use emoji
<span>✅</span>
<div>📄</div>
```

**Why Lucide:**
- Professional, consistent design system
- Accessible with proper ARIA attributes
- Scalable and customizable
- Matches Appian's design language

**Common Lucide icons:**
- Status: `CheckCircle`, `XCircle`, `AlertCircle`, `Info`
- Actions: `Plus`, `Minus`, `Edit`, `Trash2`, `Download`, `Upload`
- Navigation: `ChevronRight`, `ChevronDown`, `ArrowLeft`, `ArrowRight`
- Files: `FileText`, `File`, `Folder`, `Image`
- UI: `Search`, `Filter`, `Settings`, `Menu`, `X`

**Import from:** `lucide-react` (already installed in this project)

### 5. UserImage is NOT a Component

**CRITICAL:** `UserImage` is a data structure, not a React component.

```tsx
// ❌ WRONG - UserImage is not a component
<UserImage name="John" imageUrl="/avatar.jpg" size="SMALL" />

// ✅ CORRECT - Use ImageField with style="AVATAR"
<ImageField
  images={[{
    imageType: 'user' as const,
    user: {
      name: "John Smith",
      photoUrl: "/avatar.jpg",
      initials: "JS"
    },
    altText: "John Smith"
  }]}
  style="AVATAR"
  size="SMALL"
  marginBelow="NONE"
/>
```

## Styling Reference

### Text Sizes
- `SMALL` → `text-xs` (12px)
- `STANDARD` → `text-base` (16px)
- `MEDIUM` → `text-lg` (18px)
- `LARGE` → `text-2xl` (24px)

### Spacing
- `NONE` → `p-0`, `m-0` (0)
- `EVEN_LESS` → `p-1`, `m-1` (4px)
- `LESS` → `p-2`, `m-2` (8px)
- `STANDARD` → `p-4`, `m-4` (16px)
- `MORE` → `p-6`, `m-6` (24px)
- `EVEN_MORE` → `p-8`, `m-8` (32px)

### Shape (Border Radius)
- `SQUARED` → `rounded-none` (0)
- `SEMI_ROUNDED` → `rounded-sm` (4px)
- `ROUNDED` → `rounded-md` (8px)

## Quick Reference Patterns

### Card with Content
```tsx
<CardLayout padding="STANDARD" showShadow={true}>
  <HeadingField text="Title" size="MEDIUM" marginBelow="STANDARD" />
  <RichTextDisplayField value={["Content here"]} />
</CardLayout>
```

### User Avatar
```tsx
<ImageField
  images={[{
    imageType: 'user' as const,
    user: {
      name: user.name,
      photoUrl: user.imageUrl,
      initials: user.name?.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    altText: user.name
  }]}
  style="AVATAR"
  size="SMALL"
  marginBelow="NONE"
/>
```

### Tags
```tsx
<TagField
  tags={[{ 
    text: "Status",
    backgroundColor: "ACCENT"
  }]}
  size="SMALL"
  marginBelow="NONE"
/>
```

### Buttons
```tsx
<ButtonArrayLayout
  buttons={[
    { label: "Save", style: "SOLID", color: "ACCENT" },
    { label: "Cancel", style: "OUTLINE", color: "SECONDARY" }
  ]}
  align="END"
/>
```

### Icons (Lucide)
```tsx
import { CheckCircle, AlertCircle, FileText } from 'lucide-react'

// Status indicator
<Icon icon={CheckCircle} color="POSITIVE" size="MEDIUM" />

// With text
<div className="flex items-center gap-2">
  <Icon icon={FileText} color="ACCENT" size="SMALL" />
  <TextItem text="Document.pdf" />
</div>

// In buttons (if supported by ButtonWidget)
<ButtonWidget 
  label="Download"
  icon={Download}
  style="OUTLINE"
  color="SECONDARY"
/>
```

## Development Workflow

### Data Layer Convention

**CRITICAL: All prototype data MUST live in `src/db/` as typed async functions.**

- Never inline data directly in page components
- Each entity gets its own file: `src/db/<entity>.ts` (plural, lowercase)
- Each file exports: a TypeScript interface, seed data, and async CRUD functions
- User-reference fields (like `assignee`, `createdBy`) are plain `string` fields containing Appian usernames
- See `.kiro/steering/data-layer.md` for the full convention and examples

```tsx
// ✅ CORRECT - Import data from src/db/
import { getTasks, type Task } from '../db/tasks'

const [tasks, setTasks] = useState<Task[]>([])
useEffect(() => { getTasks().then(setTasks) }, [])

// ❌ WRONG - Inline data in components
const tasks = [{ id: 1, title: "Review App", ... }]
```

### Appian Skills (in `.kiro/skills/`)

| Skill | Purpose |
|-------|---------|
| `extract-prototype-contract` | Reads `src/db/`, produces `appian-output/api-contract.json` |
| `generate-appian-app` | Takes contract, produces importable Appian app ZIP + DDL |
| `deploy-to-appian` | Deploys the generated package to an Appian environment via the Deployment API |
| `connect-to-appian` | Rewrites `src/db/` to use real `fetch` calls |

### Page Development (Default Location: `src/pages/`)

**CRITICAL: This is a starter template. Components come from the npm package.**

1. **Import from `@pglevy/sailwind` package** - All standard components are available here
2. **Use EXACT component names** from the Available Components list below (case-sensitive!)
3. **ONLY create custom components** in `src/components/` if truly needed for project-specific needs
4. **Add page to routes** in `src/App.tsx`
5. **Add page link to Home page** in `src/pages/home.tsx` - Add entry to the `pages` array
6. **REQUIRED: Run `npm run build` and fix all errors before declaring completion**

### Standard Page Structure
```tsx
import { HeadingField, CardLayout } from '@pglevy/sailwind'

export default function PageName() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <HeadingField
          text="Page Title"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />
        <CardLayout padding="MORE" showShadow={true}>
          {/* Compose existing Sailwind components here */}
        </CardLayout>
      </div>
    </div>
  )
}
```

### Available Sailwind Components (Canonical Source)

**Do not maintain a manual component list in this file.**

Use `.kiro/steering/sail-components.md` as the source of truth for available components and exact names.

- That file is auto-generated from installed package exports by `scripts/sync-sailwind-components.js`
- It is triggered by `scripts/check-sailwind-update.js` (via `npm run dev` / predev workflow)
- If component guidance seems stale, run: `node scripts/sync-sailwind-components.js`

**For complete API details, see:** https://github.com/pglevy/sailwind

### Adding Links to Home Page

**IMPORTANT:** After creating a new page, add it to the Home page for easy navigation.

In `src/pages/home.tsx`, add an entry to the `pages` array:

```tsx
const pages = [
  { title: 'Task Dashboard', path: '/task-dashboard', description: 'Example task management interface' },
  { title: 'Application Status', path: '/application-status', description: 'Application tracking with milestones' },
  { title: 'Document Review', path: '/document-review', description: 'Document approval workflow' },
  // Add your new page here:
  { title: 'Your Page Name', path: '/your-route', description: 'Brief description of your page' },
]
```

This allows users to easily navigate to your new page from the home screen.

### Error Resolution Pattern

When encountering "Module has no exported member" errors:

1. **FIRST: Check component name** - Compare against exact names in `.kiro/steering/sail-components.md` (canonical source)
2. Verify you're importing from `@pglevy/sailwind` (not `../components`)
3. Check the component name spelling and capitalization (case-sensitive!)
4. Check if it's a data structure (like `UserImage`) vs a component
5. Use alternative components (like `ImageField` for avatars)
6. Consult TypeScript definitions in `node_modules/@pglevy/sailwind/dist/components/`

## Common Mistakes to Avoid

1. ❌ Looking in `src/components/` for Sailwind components (they're in the npm package!)
2. ❌ Importing from `../components` instead of `@pglevy/sailwind`
3. ❌ Using wrong component names (e.g., `TextFieldInput` instead of `TextField`)
4. ❌ Importing `UserImage` as a component (it's a data structure)
5. ❌ Using lowercase SAIL parameter values
6. ❌ Using raw HTML when Sailwind component exists in the package
7. ❌ Using emoji characters (✅❌📄) instead of Lucide icons
8. ❌ Using color steps other than those defined in the tokens file (`node_modules/@pglevy/sailwind/dist/tokens.json`)
9. ❌ Forgetting to add the page link to `src/pages/home.tsx`

## Component vs Page Development

### Default Workflow: Page Development (Pragmatic Prototyping)
**This is the PRIMARY use case for this starter template.**

- Import components from `@pglevy/sailwind` npm package
- Compose interfaces from existing Sailwind components
- Create pages in `src/pages/`
- Add routes to `src/App.tsx`

### Advanced Workflow: Custom Component Development (Only When Needed)
**ONLY create custom components when Sailwind package doesn't have what you need.**

- Create in `src/components/` directory (you may need to create this directory)
- MUST use exact SAIL parameter names (UPPERCASE)
- Export from `src/components/index.ts`
- Import in pages as needed
- Document why custom component was necessary
- Include SAIL translation examples if applicable

## Resources

- **Sailwind Package:** `@pglevy/sailwind` (imported in this project)
- **Sailwind Repo:** https://github.com/pglevy/sailwind
- **SAIL Official Docs:** https://docs.appian.com/suite/help/25.3/
- **Tailwind CSS:** https://tailwindcss.com/

## Success Criteria

- ✅ Components imported from `@pglevy/sailwind` package
- ✅ Components use exact SAIL parameter names and values (UPPERCASE)
- ✅ Existing Sailwind components used wherever available from the package
- ✅ Pages added to routes in `src/App.tsx`
- ✅ Visual testing passes without errors
- ✅ Consistent Sailwind token color palette usage

## Before Declaring Page Complete

Use this checklist for EVERY page you create:

- [ ] Page file created in `src/pages/`
- [ ] All imports are from `@pglevy/sailwind` package
- [ ] **Component names verified against `.kiro/steering/sail-components.md`**
- [ ] All SAIL parameters use UPPERCASE values
- [ ] Page added to routes in `src/App.tsx`
- [ ] **Page link added to `src/pages/home.tsx` in the `pages` array**
- [ ] Dev server shows page loading without console errors
