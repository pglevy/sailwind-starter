---
name: configure-environment
description: >
  Configure or troubleshoot the development environment for this Sailwind Starter project.
  Delegates to the global "setup-sailwind" skill for full setup, or directs users to the
  UX Manual if that skill isn't installed. Use this skill when the user says "set up my
  environment", "configure my environment", "something's not working", "install dependencies",
  "I'm new — how do I get started", or reports "command not found" errors for node, pnpm, or brew.
metadata:
  title: Configure Environment
  prompt: "Help me configure my environment: "
  human-reviewer: Philip Levy
  last-reviewed: 2026-05-27
---

# Configure Environment

This skill handles environment configuration and troubleshooting for the Sailwind Starter project. The heavy lifting lives in the global **setup-sailwind** skill — this skill's job is to route there or help when things aren't working as expected.

## Instructions

### Step 1 — Check for the setup-sailwind skill

Look for the `setup-sailwind` skill in the user's global Kiro skills (typically `~/.kiro/skills/setup-sailwind/SKILL.md`).

**If the skill is available:** activate it and follow its instructions. It covers the full setup flow — Homebrew, Node.js, pnpm, cloning, dependencies, and verification.

**If the skill is NOT available:** let the user know:

> The **setup-sailwind** skill isn't installed on your machine yet. You can get it (along with the full suite of approved UX skills) from the UX Manual:
>
> https://docs.appian-stratus.io/ux-sites/ux-manual/
>
> There's a script on that site that installs everything in one go. Once installed, come back here and we'll pick up where we left off.

### Step 2 — Quick diagnostics (if troubleshooting)

If the user already has things set up but something isn't working, run a quick health check:

```bash
echo "=== Environment Health Check ==="
echo "Shell: $SHELL"
which brew && brew --version || echo "❌ Homebrew not found"
which node && node --version || echo "❌ Node.js not found"
which pnpm && pnpm --version || echo "❌ pnpm not found"
echo "---"
ls package.json 2>/dev/null && echo "✓ In a project directory" || echo "❌ Not in a project directory"
ls node_modules/.pnpm 2>/dev/null && echo "✓ Dependencies installed" || echo "❌ Dependencies not installed"
```

Report findings in plain language and address each issue. Common fixes:

| Symptom | Fix |
|---------|-----|
| `command not found: brew` | Re-run Homebrew install or add to PATH (`eval "$(/opt/homebrew/bin/brew shellenv)"`) |
| `command not found: node` | `brew install node` |
| `command not found: pnpm` | `corepack enable` |
| Dependencies not installed | `pnpm install` |
| Port 5173 in use | `lsof -ti:5173 \| xargs kill -9` then `pnpm run dev` |
| Module not found errors | `rm -rf node_modules && pnpm install` |
| Garbled terminal in Kiro | Add shell integration (see below) |

### Step 3 — Kiro shell integration (if needed)

Only if the user reports garbled terminal output in Kiro:

```bash
echo '[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### Step 4 — Verify

Once issues are resolved, confirm:
- `pnpm run dev` starts without errors
- Browser shows the project at http://localhost:5173
- No errors in the browser console

## Communication Style

The target user is a designer. Use plain language, explain what commands do, and don't assume terminal familiarity.
