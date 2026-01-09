# Setup Dev Environment Power

Automatically sets up your development environment and launches the Sailwind Starter project.

## What It Does

1. ✅ Checks what's already installed (Homebrew, nvm, Node.js)
2. 📦 Installs missing prerequisites
3. 📦 Runs `npm install` to get project dependencies
4. 🚀 Starts the dev server at http://localhost:5173

## Usage

```bash
/setup
```

That's it! Go from template download to running demo in one command.

## Requirements

- macOS (uses Homebrew and zsh)
- Internet connection
- Terminal access

## What Gets Installed

If not already present:
- **Homebrew** - Package manager for macOS
- **nvm** - Node Version Manager
- **Node.js LTS** - Latest long-term support version

## Troubleshooting

If the power fails, you can set up manually:

1. Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2. Install nvm: `brew install nvm`
3. Install Node: `nvm install --lts`
4. Install dependencies: `npm install`
5. Start server: `npm run dev`

See `.kiro/steering/SETUP.md` for detailed manual setup instructions.
