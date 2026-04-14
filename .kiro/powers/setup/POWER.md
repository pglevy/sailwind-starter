---
name: "setup"
displayName: "Sailwind Starter Setup"
description: "Automatically set up development environment and launch the Sailwind Starter project"
keywords: ["setup", "install", "environment", "dev", "start", "begin"]
---

# Onboarding

## Step 1: Check what's installed

Check for required tools:

```bash
which brew && echo "✅ Homebrew installed" || echo "❌ Homebrew needed"
which node && echo "✅ Node.js installed" || echo "❌ Node.js needed"
which pnpm && echo "✅ pnpm installed" || echo "❌ pnpm needed"
```

## Step 2: Install missing prerequisites

**If Homebrew is missing:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**If Node.js is missing:**
```bash
brew install nvm
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install --lts
nvm use --lts
```

**If pnpm is missing (easiest via corepack):**
```bash
corepack enable
```

Or install directly:
```bash
brew install pnpm
```

## Step 3: Configure pnpm security policy

Set a minimum release age so pnpm only installs packages published for at least 7 days. This protects against supply chain attacks.

```bash
pnpm config set minimum-release-age 10080 --location user
```

The value `10080` is 7 days in minutes. This writes to `~/Library/Preferences/pnpm/rc` on macOS.

## Step 4: Install project dependencies

If migrating from an npm-based setup (has `package-lock.json`), clean up first:
```bash
rm -rf node_modules
rm -f package-lock.json
```

Then install:
```bash
pnpm install
```

**Note about the registry:** This project includes an `.npmrc` file that sets `registry=https://registry.npmjs.org/`. This ensures packages are fetched from the public npm registry even if you have a different registry configured globally (e.g., a corporate Artifactory). If `pnpm install` fails with authentication or 404 errors, verify the `.npmrc` file is present in the project root.

## Step 5: Configure Kiro shell integration (if needed)

If you're experiencing terminal output issues in Kiro, add shell integration to your config:

**For zsh (~/.zshrc):**
```bash
[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path zsh)"
```

**For bash (~/.bashrc):**
```bash
[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path bash)"
```

After adding, reload your shell:
```bash
source ~/.zshrc  # for zsh
source ~/.bashrc # for bash
```

## Step 6: Start development server

```bash
pnpm run dev
```

The project will be available at http://localhost:5173

# Best Practices

- Only install what's missing - check first
- Use nvm for Node.js version management
- Keep dev server running while working
- Press Ctrl+C to stop the server when done
- If terminal output looks broken, add Kiro shell integration
