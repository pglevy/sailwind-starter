---
inclusion: manual
---

# Sailwind Migration Skill

Migrate an existing Sailwind prototype project to the latest sailwind-starter conventions. This upgrades the scaffolding in-place while preserving all user content.

## When to Use

Trigger this skill when the user says things like:
- "migrate to the new starter"
- "upgrade my project"
- "update to latest sailwind-starter"
- "migrate from old sailwind"

## Key Principle

**User content lives in `src/` and `public/`.** Everything else is scaffolding that can be replaced. The migration upgrades scaffolding in-place within the user's existing repo — no new clone, no lost git history.

---

## Migration Workflow

### Phase 1: Replace Scaffolding

Replace the project's tooling and config files with the latest from the starter template. These are the **scaffolding files** (everything outside `src/` and `public/`):

**Config files to replace:**
- `package.json` — Merge: keep user's `name`/`description`, take starter's `scripts`, `dependencies`, `devDependencies`
- `vite.config.ts`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `eslint.config.js`
- `postcss.config.js`
- `index.html`
- `.gitignore`
- `.npmrc`
- `pnpm-workspace.yaml` (if present)

**Directories to replace entirely:**
- `scripts/` — Utility scripts (color checker, component sync, etc.)
- `.kiro/hooks/` — Agent hooks
- `.kiro/steering/` — Steering files (auto-generated ones will be regenerated)
- `.kiro/skills/` — Skills including this one
- `.vscode/` — Editor settings

**Do NOT touch:**
- `src/` — All user pages, components, and data
- `public/` — Static assets
- `.git/` — Git history
- Any user-created files at root that aren't in the starter (e.g., `docs/`, `.env`)

**How to replace files:**

Fetch each file from the template repo and write it directly:

```bash
curl -o <local-path> https://raw.githubusercontent.com/pglevy/sailwind-starter/main/<file-path>
```

For `package.json`, merge carefully:
1. Fetch the starter's `package.json`
2. Keep the user's `name`, `version`, and `description`
3. Take the starter's `scripts`, `dependencies`, and `devDependencies`
4. Write the merged result

After replacing files:

```bash
pnpm install
```

### Phase 2: Build and Auto-Fix

Run the build to surface breaking changes:

```bash
pnpm build
```

**Common issues the build will catch:**
- Removed or renamed component exports from `@pglevy/sailwind`
- Changed prop types or signatures
- TypeScript version mismatches
- Missing dependencies

**Auto-fix approach:**
- Read each error from the build output
- For import errors: check the new `sail-components.md` steering file for correct component names
- For type errors: check `sail-types.md` for current SAIL type definitions
- Fix and re-run until the build passes

Loop `pnpm build` → fix → `pnpm build` until exit code 0.

### Phase 3: Generate Migration Report

After the build passes, scan `src/` for convention issues. Check each category and compile findings into a single report:

#### Categories to scan:

**1. Emoji → Lucide Icons**
```bash
grep -rn '[✅❌📄📋🔍⚠️✏️🗑️🔒🔓💡��📊🎯🚀⭐️]' src/ --include="*.tsx"
```
Suggest replacing each emoji with the appropriate `lucide-react` icon.

**2. Raw HTML → Sailwind Components**
```bash
grep -rn '<button\b\|<select\b\|<input\b\|<h[1-6]\b\|<img\b' src/ --include="*.tsx" | grep -v node_modules
```
Flag HTML elements that have Sailwind equivalents (buttons, inputs, headings, images, etc.).

**3. Off-Palette Colors**
```bash
node scripts/check-color-palette.js
```
Finds Tailwind color classes using families or steps not in the Sailwind token palette.

**4. Lowercase SAIL Parameters**
```bash
grep -rn 'size="\(small\|standard\|medium\|large\)"\|style="\(solid\|outline\|ghost\)"\|color="\(accent\|positive\|negative\)"' src/ --include="*.tsx"
```
SAIL parameter values must be UPPERCASE.

**5. Wrong Import Sources**
```bash
grep -rn "from '\.\./components\|from '\./components" src/ --include="*.tsx"
```
Components should come from `@pglevy/sailwind` unless they're truly project-specific custom components.

#### Report format:

Present findings as a categorized summary:

```
## Migration Report

### Emoji (3 files, 7 instances)
- src/pages/dashboard.tsx:45 — ✅ → CheckCircle
- src/pages/dashboard.tsx:52 — ❌ → XCircle
...

### Off-Palette Colors (2 files, 4 instances)
- src/pages/settings.tsx:12 — slate-500 → gray-500
- src/pages/settings.tsx:28 — emerald-600 → green-600
...

### Raw HTML (1 file, 3 instances)
- src/pages/form.tsx:20 — <button> → ButtonWidget
...
```

### Phase 4: Apply Fixes (User Choice)

Present the report and ask the user how they want to proceed:

1. **"Yes to all"** — Apply every suggested fix across all categories
2. **"By category"** — Let the user accept/reject each category (e.g., "fix all emoji but skip HTML replacements")
3. **"Let me review"** — Walk through findings one by one

After applying fixes, run `pnpm build` one final time to confirm everything still compiles.

### Phase 5: Verify and Summarize

1. Run `pnpm build` — must pass
2. Run `pnpm run dev` — triggers predev script which syncs steering files
3. Summarize what was done:
   - Files replaced
   - Build errors fixed
   - Convention fixes applied
   - Anything skipped or flagged for manual review

Remind the user to commit when satisfied.

---

## Important Notes

- **Git is the safety net.** All changes happen in the user's existing repo. They can `git diff` to review or `git checkout .` to revert.
- **Steering files auto-regenerate.** `sail-components.md` and `sail-types.md` are synced from the installed package on `pnpm run dev`. No need to maintain them manually.
- **Don't memorize component lists or parameter values.** Point to the steering files — they stay current automatically.
- **Never force changes to `src/`.** Phase 3-4 are suggestions the user opts into, not automatic rewrites.
- **The upgrade-from-template skill** handles ongoing incremental syncs after the initial migration. This skill is for the first big migration from an older project structure.
