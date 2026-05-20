---
name: upgrade-from-template
description: >
  Sync an existing Sailwind Starter project with the latest tooling from the template repo.
  Fetches files directly from GitHub so the skill never goes stale. Use this skill when the user
  says "upgrade from template", "sync with starter", "update tooling", or "check for template changes".
---

# Upgrade from Template

Syncs an existing Sailwind Starter project with the latest tooling from the template repo. Fetches files directly from GitHub so the skill itself never goes stale.

**Repository:** `pglevy/sailwind-starter` (branch: `main`)
**Base URL:** `https://raw.githubusercontent.com/pglevy/sailwind-starter/main/`

## Inputs

None — the skill fetches the latest template files automatically.

## Instructions

### Step 1 — Fetch and compare tooling files

For each file listed below, fetch the latest version from the template repo using the web fetch tool (read-only). Then compare it against the local file.

- If the file **does not exist locally**: show the user what it does (one sentence) and offer to add it.
- If the file **exists but differs**: summarize what changed and ask if they want to update.
- If the file **matches**: skip silently.

Present all results as a single summary table before making any changes. Wait for the user to approve before writing files.

#### Writing approved files

**CRITICAL:** Do NOT write files using agent file-writing tools (fsWrite, strReplace, etc.). These tools can introduce subtle differences (encoding, whitespace, line endings).

Instead, use `curl -o` to download and write each approved file in a single step:

```bash
curl -o <local-path> https://raw.githubusercontent.com/pglevy/sailwind-starter/main/<file-path>
```

This guarantees byte-for-byte identical copies from the source. Create any missing directories first with `mkdir -p` if needed.

#### Files to sync

**Scripts:**
- `scripts/check-color-palette.js` — Lints Tailwind classes for off-palette color steps
- `scripts/check-sailwind-update.js` — Predev script: checks for Sailwind updates + syncs steering files
- `scripts/sync-sailwind-components.js` — Generates steering file with available component names from package

**Hooks:**
- `.kiro/hooks/check-color-palette.kiro.hook` — Manual trigger to run color palette check
- `.kiro/hooks/check-sailwind-updates.kiro.hook` — Manual trigger to check for Sailwind package updates
- `.kiro/hooks/verify-build.kiro.hook` — Manual trigger to verify build passes

**Steering files:**
- `.kiro/steering/sail-types.md` — SAIL type definitions (auto-synced by predev script)
- `.kiro/steering/sail-components.md` — Available component list (auto-synced by predev script)

**Skills:**
- `.kiro/skills/setup-environment/SKILL.md` — Environment setup skill
- `.kiro/skills/upgrade-from-template/SKILL.md` — This skill (self-update)

### Step 2 — Check package.json scripts

Fetch `package.json` from the template repo. Compare ONLY the `scripts` section with the local `package.json`.

- Flag any missing script entries (e.g., `check:colors`, `predev`)
- Flag any scripts with different commands
- Do NOT touch `dependencies`, `devDependencies`, or any other section
- Ask the user before adding or changing any scripts

### Step 3 — Run steering sync

After any file changes are applied, run the sync scripts to generate steering files from the locally installed Sailwind package:

```bash
node scripts/sync-sailwind-components.js
node scripts/check-sailwind-update.js
```

This ensures the steering files reflect the user's actual installed package version, not the template's.

### Step 4 — Audit AGENTS.md

Scan the local `AGENTS.md` for sections that are now redundant given the hooks and steering files. Present suggestions as a table:

| Section topic | Now handled by |
|---|---|
| Repeated "run npm run build" instructions | `verify-build` hook |
| Color palette / approved Tailwind color steps | `check-color-palette` hook + `scripts/check-color-palette.js` |
| Common SAIL Type Definitions | `sail-types.md` steering file (auto-synced from package) |
| Available Sailwind Components list | `sail-components.md` steering file (auto-synced from package) |

These are suggestions only. Do NOT automatically edit AGENTS.md. Let the user decide what to keep or remove.

### Step 5 — Summary

Report what was added, updated, or skipped. Remind the user to:
- Run `pnpm run dev` to trigger the predev steering sync
- Review any AGENTS.md suggestions they haven't addressed
- Commit the changes when satisfied

## Important notes

- This skill only modifies tooling files — never touch application code in `src/`
- Steering files will be regenerated from the installed Sailwind package on next `pnpm run dev`
- All hooks are set to `userTriggered` — the user controls when they run
- All changes require user approval before writing — never auto-apply
