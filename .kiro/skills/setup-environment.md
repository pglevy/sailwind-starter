---
name: Setup Environment
description: >
  Set up a macOS development environment for the Sailwind Starter project. Checks for and installs
  Homebrew, nvm, Node.js, and pnpm, then installs project dependencies and starts the dev server.
  Use this skill when the user says "set up my environment", "I'm new — how do I get started",
  "install dependencies", or reports "command not found" errors for node, pnpm, or brew.
---

# Setup Environment

The target user is a designer with limited or no terminal experience. Use plain language, explain what commands do, celebrate progress at each step, and never assume familiarity with dev tooling.

## Inputs

None — the skill auto-detects what's already installed.

## Communication Style

- **Instead of:** "We need to initialize the package manager and install dependencies."
- **Say:** "We need to download the libraries this project uses. This is like installing apps on your phone."
- Always provide context for commands (e.g., "This checks if Node.js is installed on your computer")
- Set expectations before long operations ("This will take about 2-3 minutes")
- Celebrate each successful step ("Great! Node.js is installed and working.")
- Break complex steps into smaller pieces if the user seems confused
- Don't assume the user knows what pnpm, Node.js, git, or terminal commands are
- Don't use jargon without explaining it first

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

> **Note on Shell Configuration:**
> Modern Macs use `zsh` by default (`~/.zshrc`). Some users may be on `bash` (`~/.bashrc`).
> Check with `echo $SHELL`. Adjust config file paths accordingly in the steps below.

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

Verify: `brew --version`

**Node.js via nvm** (if missing):
```bash
brew install nvm
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"' >> ~/.zshrc
source ~/.zshrc
nvm install --lts
nvm use --lts
nvm alias default node
```

Verify: `node --version` (expect v20+)

**pnpm** (if missing):
```bash
corepack enable
```

Verify: `pnpm --version` (expect v10+)

### Step 3 — Configure pnpm security policy

```bash
pnpm config set minimum-release-age 10080 --location user
```

This sets a 7-day minimum release age to protect against supply-chain attacks.

### Step 4 — Clone or locate the project

**If the project is already downloaded:** ask the user where they saved it and navigate there.

**If it needs to be cloned:**
```bash
cd ~/Documents
git clone [REPOSITORY_URL] sailwind-starter
cd sailwind-starter
```

**If downloaded as ZIP:** extract it and navigate to the folder.

Verify you're in the right place:
```bash
ls package.json
```

### Step 5 — Install project dependencies

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

### Step 6 — Configure Kiro shell integration (if needed)

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

### Step 7 — Start development server

Ask the user if they already have a dev server running. If not:

```bash
pnpm run dev
```

The project will be available at http://localhost:5173. Leave the terminal open while working.

### Step 8 — Verify

Confirm with the user:
- Browser shows the Sailwind Starter home page
- Can navigate to example pages
- No error messages in browser console (F12 to open)
- Terminal shows "ready" message without errors

## Troubleshooting

### "command not found: brew"
Homebrew not installed or not in PATH.
- Install using the command in Step 2
- Run the post-install shell config commands
- Restart terminal or `source ~/.zshrc`

### "command not found: nvm"
nvm not configured in shell profile.
- Verify installed: `brew list | grep nvm`
- Add nvm config to `~/.zshrc` (see Step 2)
- `source ~/.zshrc` and retry

### "pnpm install" fails with permission errors
Don't use sudo. This indicates a permissions issue.
- Ensure you own the project directory
- With nvm, Node installs in user space — no sudo needed
- Check: `ls -la ~/.nvm` should show your username

### Port 5173 already in use
Another process is using that port.
- Stop other Vite dev servers
- Or: `lsof -ti:5173 | xargs kill -9`
- Retry `pnpm run dev`

### "Cannot find module" errors
Dependencies not installed properly.
- `rm -rf node_modules`
- `pnpm install`

### Browser shows blank page or errors
- Open DevTools (F12 or Cmd+Option+I) → Console tab
- Try hard refresh: Cmd+Shift+R

### Terminal output garbled in Kiro
Add shell integration (see Step 6). Restart Kiro's terminal if needed.

## Quick Reference

```bash
brew --version          # Check Homebrew
nvm --version           # Check nvm
node --version          # Check Node.js
pnpm --version          # Check pnpm
pnpm install            # Install dependencies
pnpm run dev            # Start dev server
pnpm run build          # Validate code
Ctrl+C                  # Stop dev server
source ~/.zshrc         # Reload shell config
```

## Post-Setup Guidance

Remind the user:
- **To start working:** `pnpm run dev` in the project folder
- **To stop:** Ctrl+C
- **To restart:** `pnpm run dev` again
- **Next steps:** Review example pages in `src/pages/`, check AGENTS.md, ask Kiro to help build new pages
