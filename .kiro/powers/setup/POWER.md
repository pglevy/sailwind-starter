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
which npm && echo "✅ npm installed" || echo "❌ npm needed"
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

## Step 3: Install project dependencies

```bash
npm install
```

## Step 4: Start development server

```bash
npm run dev
```

The project will be available at http://localhost:5173

# Best Practices

- Only install what's missing - check first
- Use nvm for Node.js version management
- Keep dev server running while working
- Press Ctrl+C to stop the server when done
