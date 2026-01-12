---
inclusion: manual
---

# Development Environment Setup Guide for Designers

This steering file provides instructions for helping designers (who may not have development experience) set up their Mac to run the Sailwind Starter project from scratch.

## Target User Profile

- Designer with limited or no terminal/command-line experience
- Working on macOS
- May not have Node.js, npm, or development tools installed
- Needs step-by-step guidance with clear explanations
- Should feel confident and supported throughout the process

## Setup Workflow

When a user asks for help setting up the project, follow this systematic approach:

### 1. Check Current Environment

**FIRST: Assess what's already installed before suggesting installations.**

Run these diagnostic commands to understand the current state:

```bash
# Check if Homebrew is installed
which brew

# Check if Node.js is installed
which node
node --version

# Check if npm is installed
which npm
npm --version

# Check if nvm is installed
which nvm
nvm --version

# Check current shell
echo $SHELL
```

**Explain findings in plain language:**
- "You already have Node.js version X.X.X installed, which is great!"
- "I don't see Node.js installed yet, so we'll need to install it."
- "You're using zsh as your shell, which is the default on modern Macs."

> **Note on Shell Configuration:** 
> Modern Macs use `zsh` by default. If you've run through official dev environment setup scripts, you may be using `bash` instead. 
> - For **zsh**: Use `~/.zshrc` in the commands below
> - For **bash**: Use `~/.bashrc` instead
> 
> Check which you're using: `echo $SHELL` (you'll see `/bin/zsh` or `/bin/bash`)

### 2. Install Prerequisites (Only What's Missing)

#### Homebrew (Package Manager)

**Check first:** If `which brew` returns nothing, Homebrew needs to be installed.

**Installation command:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Post-installation:** The installer will provide shell configuration commands. Make sure to run them!

**Typical post-install for Apple Silicon Macs:**
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Verify:**
```bash
brew --version
```

#### Node.js via nvm (Node Version Manager)

**Why nvm?** It allows designers to easily switch Node versions if needed for different projects.

**Check first:** If `which nvm` returns nothing, install nvm.

**Installation:**
```bash
brew install nvm
```

**Shell configuration for nvm:**
```bash
# Create nvm directory
mkdir -p ~/.nvm

# Add to shell profile
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"' >> ~/.zshrc

# Reload shell configuration
source ~/.zshrc
```

**Install Node.js LTS (Long Term Support):**
```bash
nvm install --lts
nvm use --lts
nvm alias default node
```

**Verify:**
```bash
node --version
npm --version
```

**Expected:** Node v20+ and npm v10+

### 3. Clone or Locate Project

**If project is already downloaded:**
- Ask user where they saved it
- Navigate to that directory: `cd /path/to/sailwind-starter`

**If project needs to be cloned from GitHub:**
```bash
# Navigate to desired location (e.g., Documents)
cd ~/Documents

# Clone the repository
git clone [REPOSITORY_URL] sailwind-starter

# Navigate into project
cd sailwind-starter
```

**If user downloaded as ZIP:**
- Extract the ZIP file
- Navigate to the extracted folder in terminal
- Use `cd` command to get there

**Verify you're in the right place:**
```bash
# Should show package.json and other project files
ls -la
```

### 4. Install Project Dependencies

**This is REQUIRED before running the project.**

```bash
npm install
```

**What this does (explain to user):**
- Downloads all the libraries and tools the project needs
- Creates a `node_modules` folder with dependencies
- Takes 1-3 minutes depending on internet speed
- Only needs to be done once (or when dependencies change)

**Watch for errors:**
- If errors occur, check Node.js version compatibility
- Ensure user has write permissions in the directory
- Check internet connection

### 5. Configure Kiro Shell Integration (If Needed)

**If you're seeing garbled or missing terminal output in Kiro, you may need to add shell integration.**

This is a one-time setup that helps Kiro properly display terminal output.

**For zsh users (default on modern Macs):**

Add this line to your `~/.zshrc` file:
```bash
[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path zsh)"
```

**For bash users:**

Add this line to your `~/.bashrc` file:
```bash
[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path bash)"
```

**How to add it:**

Option 1 - Using terminal:
```bash
# For zsh
echo '[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path zsh)"' >> ~/.zshrc

# For bash
echo '[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path bash)"' >> ~/.bashrc
```

Option 2 - Manual editing:
- Open `~/.zshrc` (or `~/.bashrc`) in a text editor
- Add the appropriate line at the end
- Save the file

**After adding, reload your shell:**
```bash
source ~/.zshrc  # for zsh
source ~/.bashrc # for bash
```

**Note:** Only add this if you're experiencing terminal display issues. If everything looks fine, you can skip this step.

### 6. Start Development Server

**Once dependencies are installed:**

```bash
npm run dev
```

**What this does (explain to user):**
- Starts a local web server
- Watches for file changes and auto-reloads
- Makes the project available at http://localhost:5173
- Keeps running until you stop it (Ctrl+C)

**Expected output:**
```
VITE v7.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Next steps:**
- Open browser to http://localhost:5173
- You should see the Sailwind Starter home page
- Leave the terminal window open while working

### 7. Verify Everything Works

**Checklist to confirm with user:**
- [ ] Browser shows the Sailwind Starter home page
- [ ] Can navigate to example pages (Task Dashboard, Application Status, Document Review)
- [ ] No error messages in browser console (F12 to open)
- [ ] Terminal shows "ready" message without errors
- [ ] Terminal output is readable (not garbled or missing)

## Common Issues and Solutions

### "command not found: brew"

**Solution:** Homebrew not installed or not in PATH.
- Install Homebrew using the command in section 2
- Run the post-installation commands to add to PATH
- Restart terminal or run `source ~/.zshrc`

### "command not found: nvm"

**Solution:** nvm not configured in shell profile.
- Verify nvm is installed: `brew list | grep nvm`
- Add nvm configuration to ~/.zshrc (see section 2)
- Run `source ~/.zshrc`
- Try `nvm --version` again

### "npm install" fails with permission errors

**Solution:** Don't use sudo! This indicates a permissions issue.
- Ensure you own the project directory
- If using nvm, Node should be installed in user space (no sudo needed)
- Check: `ls -la ~/.nvm` should show your username as owner

### Port 5173 already in use

**Solution:** Another process is using that port.
- Stop other Vite dev servers
- Or kill the process: `lsof -ti:5173 | xargs kill -9`
- Try `npm run dev` again

### "Cannot find module" errors

**Solution:** Dependencies not installed properly.
- Delete `node_modules` folder: `rm -rf node_modules`
- Delete `package-lock.json`: `rm package-lock.json`
- Reinstall: `npm install`

### Browser shows blank page or errors

**Solution:** Check browser console for specific errors.
- Open DevTools (F12 or Cmd+Option+I)
- Look at Console tab for error messages
- Common issue: JavaScript disabled or browser cache
- Try hard refresh: Cmd+Shift+R

### Terminal output is garbled or missing in Kiro

**Solution:** Add Kiro shell integration to your shell config.
- See section 5 above for detailed instructions
- Add the appropriate line to `~/.zshrc` (zsh) or `~/.bashrc` (bash)
- Reload your shell with `source ~/.zshrc` or `source ~/.bashrc`
- Restart Kiro's terminal if needed

## Communication Guidelines

### Use Plain Language

**Instead of:** "We need to initialize the npm package manager and install dependencies."
**Say:** "We need to download the libraries this project uses. This is like installing apps on your phone."

### Explain What Commands Do

**Always provide context:**
```bash
# This checks if Node.js is installed on your computer
node --version
```

### Set Expectations

**Before long operations:**
- "This will take about 2-3 minutes to download everything."
- "You'll see a lot of text scroll by - that's normal!"
- "Keep the terminal window open while you work on the project."

### Celebrate Progress

**After each successful step:**
- "Great! Node.js is installed and working."
- "Perfect! The development server is running."
- "You're all set! The project is ready to use."

### Be Patient and Supportive

**If user is confused:**
- Break down steps into smaller pieces
- Offer to explain what a command does
- Provide screenshots or visual descriptions when helpful
- Reassure that it's normal to find this unfamiliar

## Quick Reference Commands

### Check Installation Status
```bash
brew --version          # Check Homebrew
nvm --version          # Check nvm
node --version         # Check Node.js
npm --version          # Check npm
```

### Navigate Directories
```bash
pwd                    # Show current directory
ls                     # List files in current directory
cd ~/Documents         # Go to Documents folder
cd sailwind-starter    # Go into project folder
```

### Project Commands
```bash
npm install            # Install dependencies (first time)
npm run dev            # Start development server
npm run build          # Build for production (validate code)
```

### Stop Running Processes
```
Ctrl+C                 # Stop the dev server
```

### Reload Shell Configuration
```bash
source ~/.zshrc        # Apply changes to shell config
```

## Success Criteria

A successful setup is complete when:

1. ✅ Node.js and npm are installed and working
2. ✅ User can navigate to project directory in terminal
3. ✅ `npm install` completes without errors
4. ✅ `npm run dev` starts successfully
5. ✅ Browser shows Sailwind Starter home page at localhost:5173
6. ✅ User can navigate between example pages
7. ✅ User understands how to start/stop the dev server

## Post-Setup Guidance

**After successful setup, remind user:**

- **To start working:** Run `npm run dev` in the project folder
- **To stop the server:** Press Ctrl+C in the terminal
- **To restart:** Run `npm run dev` again
- **If you close terminal:** Just open a new one, navigate to project folder, and run `npm run dev`

**Next steps for prototyping:**
- Review the example pages in `src/pages/`
- Check out AGENTS.md for guidance on creating new pages
- Ask Kiro to help create new prototype pages!

## When to Use This Guide

Invoke this guidance when users:
- Say they're new to development or terminal
- Ask "how do I get started" or "how do I set this up"
- Report errors that suggest missing prerequisites
- Mention they just downloaded/cloned the project
- Ask about installing Node.js, npm, or related tools
- Need help with "command not found" errors

## What NOT to Assume

- Don't assume user has any development tools installed
- Don't assume user knows what npm, Node.js, or terminal commands are
- Don't assume user has used git or GitHub before
- Don't assume user knows how to navigate directories in terminal
- Don't use jargon without explaining it first

## Tone and Approach

- **Encouraging:** "You're doing great! This is the trickiest part."
- **Clear:** Explain what each command does and why
- **Patient:** Break complex steps into smaller pieces
- **Practical:** Focus on getting it working, not theory
- **Supportive:** Acknowledge that this might be new and unfamiliar
