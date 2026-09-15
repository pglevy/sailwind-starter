---
name: add-page
description: >
  Scaffold a new prototype page in a Sailwind Starter project — creates the file in src/pages/,
  registers the route in src/App.tsx, and adds an entry to the home page list. Use this skill
  whenever the user asks to "create a new page", "add a page for X", "make a prototype for Y",
  or wants to start a new screen/flow/view in the project. Prefer this over manually creating
  files and editing App.tsx by hand — it handles all three steps and their exact formatting
  in one shot, so nothing gets forgotten.
metadata:
  title: Add Page
  prompt: "Create a new page for: "
  human-reviewer: Philip Levy
---

# Add Page

Creating a new page in this project is a three-step chore (README → "Creating New Pages"): create the file, register the route in `App.tsx`, and link it from `home.tsx`. It's easy to do one and forget another — this skill does all three with a script so the mechanical parts are never the source of an error.

## When to use this vs. writing the page by hand

Always run the scaffold script first, even for a page you're about to heavily customize. It gets the boilerplate (imports, route registration, home link) exactly right, and then you fill in the actual content. Don't hand-write `App.tsx` edits or a new file from scratch — that's exactly the kind of repetitive step where a forgotten import or a missed home-page entry creeps in.

## Steps

### 1. Scaffold the page

Run the bundled script with a descriptive name and (ideally) a one-line description for the home page listing:

```bash
node scripts/scaffold-page.js --name "Task Dashboard" --description "Track and manage tasks across the team"
```

This will:
- Create `src/pages/task-dashboard.tsx` with a minimal starter using `HeadingField` + `CardLayout`
- Register the route (import + `pages` array entry) in `src/App.tsx`
- Add a link to the page in the `pages` array in `src/pages/home.tsx`, if that array exists there

Flags:
- `--path /custom-path` — override the auto-generated route (defaults to a kebab-case slug of `--name`)
- `--force` — overwrite an existing page file with the same slug
- If the script can't find a `const pages = [...]` array in `App.tsx` or `home.tsx` (e.g. the project structure has diverged), it prints a warning telling you exactly what to add by hand — don't ignore that warning.

### 2. Build out the actual content

The scaffolded file is intentionally minimal — a heading and an empty card. Now build the real interface:
- Import components from `@pglevy/sailwind` — check `.kiro/steering/sail-components.md` for exact names and `.kiro/steering/sail-props.md` for props
- If the page needs data, don't inline it — see whether an entity already exists in `src/db/`, and if not, use the `add-entity` skill to scaffold one
- All SAIL prop values are UPPERCASE (`size="STANDARD"`, not `size="standard"`)
- Icons come from `lucide-react`, never emoji

### 3. Verify

Run `pnpm run build` and fix any errors. It's also worth running `node scripts/prototype-review.js src/pages/<slug>.tsx` (see the `prototype-review` skill) to catch convention violations before calling the page done.

## Notes on the script's behavior

- Multi-word names like `"Task Dashboard"` become the slug `task-dashboard`, the component `TaskDashboard`, and the route `/task-dashboard`. Pass `--path` if you want something different.
- If a page with that slug already exists, the script refuses to overwrite it unless you pass `--force` — this is a safety net, not a bug.
- The script matches the *existing* indentation style of the `pages` array it's editing, so it won't mangle formatting even if the arrays have been hand-edited since the project was created.
