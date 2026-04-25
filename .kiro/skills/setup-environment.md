---
name: Setup Environment
description: >
  Set up a macOS development environment for the Sailwind Starter project. Checks for and installs
  Homebrew, nvm, Node.js, and pnpm, then installs project dependencies and starts the dev server.
  Use this skill when the user says "set up my environment", "I'm new — how do I get started",
  "install dependencies", or reports "command not found" errors for node, pnpm, or brew.
---

# Setup Environment

## Inputs

None — the skill auto-detects what's already installed.

## Instructions

### Step 1 — Check what's installed

Run diagnostic commands to assess the current state:

```bash
which brew && echo "Homebrew installed" || echo "Homebrew needed"
which node && node --version || echo "Node.js needed"
which pnpm && pnpm --version || echo "pnpm needed"
echo $SHELL
```

Report findings in plain language. Only install what's missing.

### Step 2 — Install missing prerequisites

**Homebrew** (if missing):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Post-install for Apple Silicon Macs:
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Node.js via nvm** (if missing):
```bash
brew install nvm
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install --lts
nvm use --lts
nvm alias default node
```

**pnpm** (if missing):
```bash
corepack enable
```

### Step 3 — Configure pnpm security policy

```bash
pnpm config set minimum-release-age 10080 --location user
```

This sets a 7-day minimum release age to protect against supply-chain attacks.

### Step 4 — Install project dependencies

If migrating from npm (has `package-lock.json`):
```bash
rm -rf node_modules
rm -f package-lock.json
```

Then:
```bash
pnpm install
```

This project includes an `.npmrc` that pins the public npm registry. If `pnpm install` fails with auth or 404 errors, verify `.npmrc` is present.

### Step 5 — Configure Kiro shell integration (if needed)

Only if the user reports garbled terminal output.

For zsh:
```bash
echo '[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path zsh)"' >> ~/.zshrc
source ~/.zshrc
```

For bash:
```bash
echo '[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path bash)"' >> ~/.bashrc
source ~/.bashrc
```

### Step 6 — Start development server

Ask the user if they already have a dev server running. If not:

```bash
pnpm run dev
```

The project will be available at http://localhost:5173.

### Step 7 — Verify

Confirm with the user:
- Browser shows the Sailwind Starter home page
- No errors in the terminal or browser console
- They can navigate to example pages

Celebrate progress at each step. Use plain language — the target user may be a designer with limited terminal experience.
