---
inclusion: always
---

# Git Workflow Guidance for Designers

This guide helps AI agents assist designers with git workflows in Sailwind prototyping projects.

## Core Principles

### Designer-Friendly Approach
- Use clear, non-technical language when explaining git concepts
- Offer to handle git commands rather than expecting designers to run them
- Provide context for why we're doing git operations (e.g., "This creates a checkpoint of your work")
- Suggest git operations proactively at natural breakpoints

### CLI Tool Preference
- **Prefer `gh` CLI** for GitHub operations (creating PRs, managing issues, etc.)
- **Prefer `glab` CLI** for GitLab operations
- Use git CLI for standard operations (commit, branch, push, pull)
- Avoid MCP tools for git operations when CLI tools are available

### Installation Support
- Check if `gh` or `glab` are installed before using them
- Offer installation guidance if tools are missing:
  - **macOS:** `brew install gh` or `brew install glab`
  - **Other:** Provide links to official installation docs
- Verify authentication status and help with `gh auth login` or `glab auth login` if needed

## Repository Setup

### Initialization
- Check if git is initialized (`.git` directory exists)
- If not initialized, offer to set it up:
  ```bash
  git init
  git branch -M main
  ```
- Use `main` as the default branch name (not `master`)

### First Commit
- After initialization, suggest creating an initial commit:
  ```bash
  git add .
  git commit -m "Initial commit: Sailwind prototype setup"
  ```

### Remote Connection
- If working with GitHub/GitLab, help connect the remote:
  ```bash
  # GitHub
  gh repo create project-name --private --source=. --remote=origin
  
  # GitLab
  glab repo create project-name --private
  ```

## Branching Strategy

### When to Create Branches
**Create a new branch for:**
- New pages or features (e.g., `feature/task-dashboard`)
- Significant UI changes or redesigns
- Adding multiple related components
- Experimental work or prototypes

**Don't create branches for:**
- Minor text changes or typos
- Small styling tweaks
- Single-line fixes
- Quick iterations on existing work

### Branch Naming
Use descriptive, lowercase names with hyphens:
- `feature/user-profile-page`
- `update/navigation-styling`
- `fix/button-alignment`
- `experiment/dark-mode`

### Branch Operations
```bash
# Create and switch to new branch
git checkout -b feature/page-name

# Switch back to main
git checkout main

# List all branches
git branch -a

# Delete a branch (after merging)
git branch -d feature/page-name
```

## Commit Strategy

### When to Commit
Suggest commits at natural breakpoints:
- After completing a page
- After adding a new component
- After fixing a bug or issue
- Before trying something experimental
- At the end of a work session

### Commit Message Format
Use clear, descriptive messages:
- **Good:** `Add task dashboard page with status filters`
- **Good:** `Update home page navigation with new links`
- **Good:** `Fix button alignment in card layout`
- **Avoid:** `updates`, `changes`, `wip`

### Commit Commands
```bash
# Stage all changes
git add .

# Stage specific files
git add src/pages/new-page.tsx

# Commit with message
git commit -m "Add document review page"

# Amend last commit (if needed)
git commit --amend -m "Updated message"
```

## Pull Request Workflow

### When to Create PRs
- After completing a feature branch
- When work is ready for review or feedback
- Before merging significant changes to main
- When collaborating with others

### Creating PRs with gh CLI
```bash
# Create PR with title and description
gh pr create --title "Add task dashboard page" --body "Implements task management interface with filtering and status updates"

# Create PR interactively (prompts for details)
gh pr create

# Create draft PR for work in progress
gh pr create --draft

# View PR in browser
gh pr view --web
```

### PR Best Practices
- Include clear title describing what was added/changed
- Add description with:
  - What was built
  - Key features or components
  - Any design decisions or notes
  - Screenshots if helpful
- Link to related issues if applicable
- Request review from team members if needed

## Common Workflows

### Starting New Feature
```bash
# 1. Make sure main is up to date
git checkout main
git pull

# 2. Create feature branch
git checkout -b feature/new-page

# 3. Build the feature...

# 4. Commit progress
git add .
git commit -m "Add new page with initial layout"

# 5. Push to remote
git push -u origin feature/new-page

# 6. Create PR when ready
gh pr create --title "Add new page" --body "Description here"
```

### Quick Fix on Main
```bash
# For minor changes, work directly on main
git checkout main

# Make the change...

# Commit and push
git add .
git commit -m "Fix typo in home page"
git push
```

### Syncing with Remote
```bash
# Get latest changes
git pull

# If there are conflicts, offer to help resolve them
# Push local changes
git push
```

## Proactive Suggestions

### Offer git operations at these moments:
1. **After creating a new page:** "I've created the page. Would you like me to commit this progress?"
2. **Before major changes:** "Before we refactor this, let me create a branch so we can experiment safely."
3. **After completing a feature:** "The feature is complete. Should I create a pull request for review?"
4. **At natural breakpoints:** "We've made good progress. Want me to commit these changes?"

### Check git status periodically:
- Mention uncommitted changes if there are many
- Suggest commits before switching tasks
- Warn about untracked files that should be committed

## Troubleshooting

### Common Issues

**Uncommitted changes blocking branch switch:**
```bash
# Stash changes temporarily
git stash

# Switch branch
git checkout other-branch

# Restore changes later
git stash pop
```

**Merge conflicts:**
- Explain what happened in simple terms
- Offer to help resolve conflicts
- Show which files have conflicts
- Guide through resolution process

**Accidentally committed to wrong branch:**
```bash
# Move commit to correct branch
git checkout correct-branch
git cherry-pick commit-hash
git checkout wrong-branch
git reset --hard HEAD~1
```

## Communication Style

### Do:
- "Let me commit this progress so we have a checkpoint"
- "I'll create a branch for this new feature to keep main stable"
- "Should I push these changes to GitHub?"
- "Want me to create a pull request for review?"

### Don't:
- Use jargon without explanation
- Assume designer knows git commands
- Make git operations without explaining why
- Skip commits to "save time"

## Integration with Build Process

### Pre-commit checks:
- Always run `npm run build` before committing
- Verify no TypeScript errors
- Check that dev server runs without errors
- Mention if there are issues that should be fixed first

### Commit only working code:
- Don't commit broken builds
- Fix errors before suggesting commit
- If experimental, use a branch and mention it's WIP

## Summary Checklist

Before declaring work complete:
- [ ] All changes committed with clear messages
- [ ] Branch pushed to remote (if using branches)
- [ ] PR created if appropriate
- [ ] Build passes successfully
- [ ] No uncommitted changes left behind
- [ ] Designer knows how to access the work (branch name, PR link, etc.)