---
name: "upgrade"
displayName: "Sailwind Starter Upgrade"
description: "Sync your project with the latest tooling from the Sailwind Starter template"
keywords: ["upgrade", "update", "sync", "template", "tooling"]
---

# Sailwind Starter Upgrade

Syncs an existing Sailwind Starter project with the latest tooling from the template repo. Fetches files directly from GitHub so the power itself never goes stale.

**Repository:** `pglevy/sailwind-starter` (branch: `main`)
**Base URL:** `https://raw.githubusercontent.com/pglevy/sailwind-starter/main/`

## Step 1: Fetch and compare tooling files

For each file listed below, fetch the latest version from the template repo using the base URL above. Then compare it against the local file.

- If the file **does not exist locally**: show the user what it does (one sentence) and offer to add it.
- If the file **exists but differs**: summarize what changed and ask if they want to update.
- If the file **matches**: skip silently.

Present all results as a single summary table before making any changes. Wait for the user to approve before writing files.

### Files to sync

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

## Step 2: Check package.json scripts

Fetch `package.json` from the template repo. Compare ONLY the `scripts` section with the local `package.json`.

- Flag any missing script entries (e.g., `check:colors`, `predev`)
- Flag any scripts with different commands
- Do NOT touch `dependencies`, `devDependencies`, or any other section
- Ask the user before adding or changing any scripts

## Step 3: Run steering sync

After any file changes are applied, run the sync scripts to generate steering files from the locally installed Sailwind package:

```bash
node scripts/sync-sailwind-components.js
node scripts/check-sailwind-update.js
```

This ensures the steering files reflect the user's actual installed package version, not the template's.

## Step 4: Audit AGENTS.md

Scan the local `AGENTS.md` for sections that are now redundant given the new hooks and steering files. Present suggestions as a table:

| Section topic | Now handled by |
|---|---|
| Repeated "run npm run build" / "MANDATORY build validation" instructions | `verify-build` hook |
| Color palette / approved Tailwind color steps | `check-color-palette` hook + `scripts/check-color-palette.js` |
| Common SAIL Type Definitions | `sail-types.md` steering file (auto-synced from package) |
| Available Sailwind Components list | `sail-components.md` steering file (auto-synced from package) |

These are suggestions only. Do NOT automatically edit AGENTS.md. Let the user decide what to keep or remove. Some users may want to keep abbreviated versions of these sections as fallback context.

## Step 5: Summary

Report what was added, updated, or skipped. Remind the user to:
- Run `npm run dev` to trigger the predev steering sync
- Review any AGENTS.md suggestions they haven't addressed
- Commit the changes when satisfied

## Important notes

- This power only modifies tooling files — never touch application code in `src/`
- Steering files will be regenerated from the installed Sailwind package on next `npm run dev`
- All hooks are set to `userTriggered` — the user controls when they run
- All changes require user approval before writing — never auto-apply
