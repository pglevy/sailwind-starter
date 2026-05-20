---
name: sailwind-migration
description: >
  FULL MIGRATION for projects that don't follow sailwind-starter conventions or are on old Sailwind versions.
  Performs complete scaffolding replacement, CSS import fixes, public asset copying, build fixing, and optional
  code convention updates (emoji→icons, HTML→components). Use for brownfield projects, old Sailwind versions,
  or when components render grey/unstyled. For projects already using sailwind-starter that just need tooling updates,
  use the "upgrade-from-template" skill instead.
---

# Sailwind Migration Skill

**FULL MIGRATION** for projects that don't follow sailwind-starter conventions or are on old Sailwind versions (v0.5.0 → v0.13.2+).

## When to Use This Skill vs Upgrade-from-Template

### Use **Sailwind Migration** (this skill) when:
- Project is on old Sailwind version (v0.5.0, v0.10.0, etc.)
- Project doesn't follow sailwind-starter structure
- Components render grey/unstyled (missing CSS imports)
- Missing public assets (ApplicationHeader shows broken images)
- Need complete scaffolding overhaul
- Want to fix code conventions (emoji → icons, HTML → components)
- First-time migration to sailwind-starter

### Use **Upgrade-from-Template** skill when:
- Project already uses sailwind-starter structure
- Just need latest scripts/hooks/steering files
- Want incremental updates with comparison
- Project is already on recent Sailwind version

**Trigger phrases for this skill:**
- "migrate to the new starter"
- "full migration to sailwind-starter"
- "upgrade from old sailwind"
- "components are rendering grey"
- "fix my sailwind project"
- "migrate from v0.5.0"

## Key Principle

**User content lives in `src/` and `public/`.** Everything else is scaffolding that can be replaced. The migration upgrades scaffolding in-place within the user's existing repo — no new clone, no lost git history.

## Critical: Use Sailwind-Starter as Source of Truth

**The sailwind-starter repository (https://github.com/pglevy/sailwind-starter) is the canonical source for all migration files and configurations.** This is crucial because:

1. **Token-based components**: sailwind-starter uses the correct token-based implementations of Sailwind components (like `HeadingField` with proper design tokens)
2. **Complete scaffolding**: It includes all necessary config files, scripts, hooks, and steering files
3. **Tested integration**: The starter template ensures all pieces work together correctly
4. **Up-to-date conventions**: It reflects the latest best practices and patterns

**Do NOT use the base @pglevy/sailwind package as a reference** — it's a component library, not a complete project template. Always fetch files from the sailwind-starter repo.

---

## Migration Workflow

### Phase 1: Replace Scaffolding

Replace the project's tooling and config files with the latest from the starter template. These are the **scaffolding files** (everything outside `src/` and `public/`):

**Config files to replace:**
- `vite.config.ts`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `eslint.config.js`
- `postcss.config.js`
- `index.html`
- `.gitignore`
- `.npmrc`
- `pnpm-workspace.yaml` (if present)

**CRITICAL: CSS/Styling files:**
- `src/index.css` — **Special handling required:**
  - **DO NOT replace the entire file** (user may have custom styles)
  - **Verify these imports exist at the top:**
    ```css
    @import "tailwindcss";
    @import "@pglevy/sailwind/theme.css";
    @source "../node_modules/@pglevy/sailwind/dist";
    ```
  - If missing, **add them at the very top** of the file
  - The `@import "@pglevy/sailwind/theme.css"` line is **essential** for Sailwind components to render with proper design tokens (gradients, colors, spacing, etc.)
  - Without it, components will render grey/unstyled
  - Preserve all user's custom CSS below these imports

**Scripts directory (copy entire directory):**
- `scripts/check-sailwind-update.js`
- `scripts/check-color-palette.js`
- `scripts/sync-sailwind-components.js`
- `scripts/sync-sailwind-props.js`
- Any other scripts in the starter's `scripts/` directory

**Kiro configuration (copy entire directories):**
- `.kiro/hooks/` — All hook files
- `.kiro/steering/` — All steering files (they'll be regenerated on first dev run)
- `.kiro/skills/` — All skill files including this migration skill

**VSCode settings:**
- `.vscode/settings.json`
- `.vscode/extensions.json` (if present)

**Documentation (optional but recommended):**
- `AGENTS.md` — Agent reference documentation
- `CLAUDE.md` — Claude-specific guidance (if present)
- `README.md` — Update to match starter's README structure

**Public assets (REQUIRED for ApplicationHeader and other components):**
- `public/images/` — Copy all images from sailwind-starter
  - `icon-appian-header.png` — **Required** for ApplicationHeader component
  - `icon-app.svg` — Application icon
  - `icon-interface.svg` — Interface icon
  - `icon-record-type.svg` — Record type icon
  - `icon-expression-rule.svg` — Expression rule icon
  - `icon-compare-deploy.svg` — Compare/deploy icon
  - `icon-cog.svg` — Settings icon

Without these images, ApplicationHeader and other components will show broken image icons.

**Config files to merge:**
- `package.json` — Special handling required:
  - **Preserve**: `name`, `version`, `description`, all existing `dependencies` and `devDependencies`
  - **Update**: `@pglevy/sailwind` to match the exact version from sailwind-starter's package.json (fetch from https://raw.githubusercontent.com/pglevy/sailwind-starter/main/package.json)
  - **Add missing scripts**: `predev`, `check:colors` (if not present)
  - **Update devDependencies**: Only update versions if there are known conflicts (e.g., TypeScript, Vite, ESLint major version bumps)

**Do NOT touch:**
- `src/` — All user pages, components, and data (including `src/db/` if present)
- `public/` — Static assets (except adding missing Appian icons)
- `.git/` — Git history
- Any user-created files at root that aren't in the starter (e.g., `docs/`, `.env`, custom config files)

**How to replace files:**

All scaffolding files must be fetched from the sailwind-starter repository:

```bash
curl -o <local-path> https://raw.githubusercontent.com/pglevy/sailwind-starter/main/<file-path>
```

For `package.json`, merge carefully to preserve project dependencies:
1. Fetch the sailwind-starter's `package.json` from https://raw.githubusercontent.com/pglevy/sailwind-starter/main/package.json
2. Keep the user's `name`, `version`, and `description`
3. **Merge scripts**: Add any new starter scripts (like `predev`), keep existing project scripts
4. **Merge dependencies**: 
   - Keep ALL existing user dependencies (they're project-specific)
   - Update `@pglevy/sailwind` to match the exact version from sailwind-starter (e.g., `^0.13.2`)
   - Add `lucide-react` if not present (Sailwind requirement)
5. **Merge devDependencies**: 
   - Keep all existing devDependencies
   - Update versions only if there are known conflicts
   - Add any new starter devDependencies (like `tsx` for scripts)
6. Update `packageManager` to match starter if present
7. Write the merged result

**Critical**: Never remove user dependencies. Projects may use additional UI libraries (@mui, @radix-ui), editors (@tiptap), animation (framer-motion), charts (recharts), etc. These are legitimate project needs, not migration targets.

After replacing files:

```bash
pnpm install
```

**Why copying ALL scaffolding matters:**

The sailwind-starter repo includes critical configuration that ensures Sailwind components render correctly with design tokens:

1. **Vite config**: Proper module resolution and build settings
2. **TypeScript config**: Correct path mappings and type checking
3. **Tailwind/PostCSS config**: Token-based styling system
4. **CSS imports**: The `@import "@pglevy/sailwind/theme.css"` line in `src/index.css` is **non-negotiable** — without it, all Sailwind components will render grey/unstyled
5. **Scripts**: Component sync scripts that generate up-to-date steering files
6. **Steering files**: Auto-generated component and prop documentation
7. **Public assets**: Images required by ApplicationHeader and other components

Without these files, components like `HeadingField` and `ApplicationHeader` may not render with proper design tokens, resulting in incorrect styling. **Always copy the complete scaffolding from sailwind-starter, not just the package version.**

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

**1. Dependency Audit (Security)**
Compare the project's `package.json` dependencies against the sailwind-starter template:

```bash
# Get template dependencies
curl -s https://raw.githubusercontent.com/pglevy/sailwind-starter/main/package.json | grep -A 50 '"dependencies"'
```

List all dependencies that are NOT in the template. Present them as a security audit:

```
## Dependency Audit

### Non-Template Dependencies (Supply-Chain Risk Review)

The following dependencies are not part of sailwind-starter. We're preserving them, but consider whether you're still using them and remove if not needed to reduce supply-chain attack surface:

**UI Libraries:**
- @mui/material (v7.3.5) - Material-UI components
- @radix-ui/react-dialog (v1.1.15) - Dialog primitives
- @radix-ui/react-tabs (v1.1.13) - Tab primitives
- @emotion/react (v11.14.0) - CSS-in-JS styling
- @emotion/styled (v11.14.1) - Styled components

**Icons:**
- @fortawesome/fontawesome-svg-core (v7.1.0) - FontAwesome icons
- @fortawesome/free-solid-svg-icons (v7.1.0) - FontAwesome icon set
- @fortawesome/react-fontawesome (v3.1.0) - FontAwesome React wrapper

**Utilities:**
- @floating-ui/react (v0.27.16) - Positioning library
- @tiptap/... - Rich text editor (if present)
- framer-motion - Animation library (if present)
- recharts - Charting library (if present)

**Security Recommendation:** Review each dependency:
1. Is it still being used in the codebase?
2. Can it be replaced with a Sailwind component or native solution?
3. Is it actively maintained? (check npm for last publish date)
4. Does it have known vulnerabilities? (run `pnpm audit`)

**Note:** Even well-known libraries like @radix-ui, @mui, and lucide-react represent supply-chain risk. Consider the tradeoff between functionality and attack surface.
```

**2. Emoji → Lucide Icons**
```bash
grep -rn '[✅❌📄📋🔍⚠️✏️🗑️🔒🔓💡📈📊🎯🚀⭐️]' src/ --include="*.tsx"
```
Suggest replacing each emoji with the appropriate `lucide-react` icon.

**3. Raw HTML → Sailwind Components**
```bash
grep -rn '<button\b\|<select\b\|<input\b\|<h[1-6]\b\|<img\b' src/ --include="*.tsx" | grep -v node_modules
```
Flag HTML elements that have Sailwind equivalents (buttons, inputs, headings, images, etc.).

**4. Custom Layout Components → Sailwind Layout Components**
```bash
grep -rn 'Header\|Footer\|Nav\|Sidebar' src/components/ --include="*.tsx"
```
Check for custom layout components that could be replaced with Sailwind equivalents:
- Custom `Header` → `ApplicationHeader`
- Custom `Nav` or `Navbar` → `SiteNav`
- Custom `Sidebar` or `SideNav` → `SideNavAdmin`

Review each custom component to see if it can be replaced with the Sailwind version.

**Smart replacement rules:**
- **Replace simple cases**: Standalone `<h1>`, `<h2>`, etc. → `HeadingField`
- **Replace simple buttons**: `<button>` with text/onClick → `ButtonWidget`
- **Skip complex integrations**: Elements inside @radix-ui, @mui, or other third-party component wrappers
- **Skip form libraries**: Elements managed by form libraries (react-hook-form, formik, etc.)
- **Manual review recommended**: Present findings but let user decide which to replace

**5. Off-Palette Colors**
```bash
node scripts/check-color-palette.js
```
Finds Tailwind color classes using families or steps not in the Sailwind token palette.

**6. Lowercase SAIL Parameters**
```bash
grep -rn 'size="\(small\|standard\|medium\|large\)"\|style="\(solid\|outline\|ghost\)"\|color="\(accent\|positive\|negative\)"' src/ --include="*.tsx"
```
SAIL parameter values must be UPPERCASE.

**7. Wrong Import Sources**
```bash
grep -rn "from '\.\./components\|from '\./components" src/ --include="*.tsx"
```
Components should come from `@pglevy/sailwind` unless they're truly project-specific custom components.

#### Report format:

Present findings as a categorized summary with smart filtering:

```
## Migration Report

### Dependency Audit (7 non-template dependencies)
**Supply-Chain Risk Review** - These dependencies are not in sailwind-starter:
- @mui/material (v7.3.5) - Used in 3 files
- @radix-ui/react-dialog (v1.1.15) - Used in 2 files
- @fortawesome/react-fontawesome (v3.1.0) - Used in 5 files
...

Run `pnpm audit` to check for known vulnerabilities.
Consider: Can any be replaced with Sailwind components or removed?

### Emoji (3 files, 7 instances)
- src/pages/dashboard.tsx:45 — ✅ → CheckCircle
- src/pages/dashboard.tsx:52 — ❌ → XCircle
...

### Off-Palette Colors (2 files, 4 instances)
- src/pages/settings.tsx:12 — slate-500 → gray-500
- src/pages/settings.tsx:28 — emerald-600 → green-600
...

### Raw HTML - Safe to Replace (3 files, 8 instances)
Simple headers and buttons that can be safely converted:
- src/pages/dashboard.tsx:20 — <h1> → HeadingField
- src/pages/form.tsx:45 — <button> → ButtonWidget
...

### Raw HTML - Manual Review Recommended (5 files, 15 instances)
Complex integrations that need manual review:
- src/components/Dialog.tsx:30 — <button> inside @radix-ui/Dialog
- src/components/Form.tsx:12 — <input> managed by react-hook-form
...
```

**Categorization logic:**
- **Safe to replace**: Standalone elements not inside third-party component wrappers
- **Manual review**: Elements inside @radix-ui, @mui, form libraries, or with complex state management

### Phase 4: Apply Fixes (User Choice)

Present the report and ask the user how they want to proceed:

1. **"Yes to all"** — Apply every suggested fix across all categories
   - Emojis → Lucide icons (always safe)
   - Off-palette colors → Approved colors (always safe)
   - Lowercase SAIL params → UPPERCASE (always safe)
   - Raw HTML → Sailwind components (use smart replacement rules, skip complex integrations)
   
2. **"By category"** — Let the user accept/reject each category (e.g., "fix all emoji but skip HTML replacements")

3. **"Let me review"** — Walk through findings one by one

**Smart HTML Replacement Strategy:**

When replacing raw HTML with Sailwind components:

1. **Headers (`<h1>` - `<h6>`)**: 
   - Replace with `HeadingField` when they're simple text headers
   - Preserve `className` styles by mapping to Sailwind props (size, color, fontWeight)
   - Skip if inside complex component wrappers

2. **Buttons (`<button>`)**:
   - Replace with `ButtonWidget` for simple onClick buttons
   - Map common patterns: `className` → `style` prop, `onClick` → `onClick`
   - Skip if part of @radix-ui, @mui, or other library components

3. **Inputs/Selects**:
   - Flag for manual review (form state management is complex)
   - Don't auto-replace (too risky)

4. **Images (`<img>`)**:
   - Replace with `ImageField` for simple images
   - Skip if part of avatar/profile components (may need specific structure)

After applying fixes, run `pnpm build` one final time to confirm everything still compiles.

### Phase 5: Verify and Summarize

1. Run `pnpm build` — must pass
2. Run `pnpm run dev` — triggers predev script which syncs steering files
3. **Verify CSS imports are working**:
   - Open the dev server in browser
   - Check that Sailwind components render with proper design tokens
   - ApplicationHeader should show Appian gradient (blue-to-purple)
   - Components should NOT appear grey/unstyled
   - If components look wrong, verify `src/index.css` has `@import "@pglevy/sailwind/theme.css"`
4. Summarize what was done:
   - Files replaced
   - Build errors fixed
   - Convention fixes applied
   - Anything skipped or flagged for manual review

Remind the user to commit when satisfied.

## Verification Checklist

After migration, verify these critical elements:

### CSS Imports (CRITICAL)
- [ ] `src/index.css` contains `@import "@pglevy/sailwind/theme.css"`
- [ ] `src/index.css` contains `@source "../node_modules/@pglevy/sailwind/dist"`
- [ ] Dev server shows components with proper Appian styling (not grey)
- [ ] ApplicationHeader shows blue-to-purple gradient

### Public Assets
- [ ] `public/images/icon-appian-header.png` exists
- [ ] All other Appian icons copied from sailwind-starter
- [ ] ApplicationHeader displays logo correctly

### Package Configuration
- [ ] `@pglevy/sailwind` version matches sailwind-starter
- [ ] `lucide-react` is installed
- [ ] All user dependencies preserved
- [ ] `pnpm install` completed successfully

### Build & Dev
- [ ] `pnpm build` passes with no errors
- [ ] `pnpm run dev` starts successfully
- [ ] Steering files auto-generated in `.kiro/steering/`

### Component Usage
- [ ] Pages import from `@pglevy/sailwind` (not `../components`)
- [ ] SAIL parameter values are UPPERCASE
- [ ] No emoji in code (use Lucide icons instead)

---

## Important Notes

- **Git is the safety net.** All changes happen in the user's existing repo. They can `git diff` to review or `git checkout .` to revert.
- **Steering files auto-regenerate.** `sail-components.md` and `sail-types.md` are synced from the installed package on `pnpm run dev`. No need to maintain them manually.
- **Don't memorize component lists or parameter values.** Point to the steering files — they stay current automatically.
- **Never force changes to `src/`.** Phase 3-4 are suggestions the user opts into, not automatic rewrites.

## After Migration: Ongoing Updates

After completing this full migration, use the **`upgrade-from-template` skill** for future incremental updates:
- Syncs latest scripts, hooks, and steering files
- Compares files before updating (shows diffs)
- More conservative approach for projects already on sailwind-starter
- Run periodically to stay current with template improvements

**This migration skill is for the big one-time overhaul. The upgrade skill is for ongoing maintenance.**
