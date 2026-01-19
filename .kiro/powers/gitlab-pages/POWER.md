---
name: "gitlab-pages"
displayName: "GitLab Pages"
description: "Automate and guide the process of creating new internal prototype repositories on GitLab at Appian. Includes Jira ticket creation, GitLab configuration, DNS setup, and critical workarounds for branch protection rules."
keywords: ["gitlab", "appian", "repository", "setup", "internal", "prototype", "jira", "glab"]
author: "Philip Levy"
---

# GitLab Internal Repo Setup

## Overview

This power encodes the institutional knowledge and workflow for spinning up new internal repositories in GitLab at Appian. It combines automation capabilities (via Jira MCP and glab CLI) with guidance for manual steps that require human intervention.

The workflow handles a complex multi-step process involving:
- Jira ticket creation for tracking
- GitLab configuration changes via merge requests
- DNS setup coordination
- Local repository configuration
- Critical workarounds for branch protection rules

This is an excellent example of tribal knowledge that's frequently needed but easy to forget - small mistakes (like missing a blank line in YAML or targeting the wrong branch) can cause significant delays.

## Prerequisites

Before starting, ensure you have:
- Access to Jira (via remote MCP server or web interface)
- `glab` CLI installed and authenticated
- `git` CLI installed
- Access to post in GitLab Support channel
- Appropriate permissions for creating repos in the `docs/` namespace

### Installing glab CLI

If you don't have glab installed:

**macOS:**
```bash
brew install glab
```

**Linux:**
```bash
# Download from releases
# https://github.com/profclems/glab/releases
```

**Authentication:**
```bash
glab auth login
# Follow prompts to authenticate with GitLab
```

### Configuring glab for Cross-Repo MRs

When creating MRs from the `dev` repo to the `prod` repo, `glab` may ask you to configure remotes. Answer these questions:

**Question 1: "Which should be the base repository (used for e.g., querying issues)?"**
- **Answer:** Choose `appian/prod/gitlab-configuration`
- **Reason:** The prod repo is the canonical source where configuration is applied

**Question 2: "Where should branches be pushed to by default?"**
- **Answer:** Choose `appian/dev/gitlab-configuration` (origin)
- **Reason:** You work in dev and push branches there, but MRs target prod

These settings allow you to work in the dev repo while creating MRs that target the prod repo's main branch.

## Starting State

Before beginning the workflow, ensure you're starting from a clean state in the **dev repo**:

1. **Clone the dev repo** (if you haven't already):
   ```bash
   git clone https://gitlab.appian-stratus.com/appian/dev/gitlab-configuration
   cd gitlab-configuration
   ```

2. **Start on the main branch** and pull the latest changes:
   ```bash
   git checkout main
   git pull
   ```

3. **Create a new branch** describing the project you want to add:
   ```bash
   git checkout -b add-<project-name>
   ```

You're now ready to begin Step 1 of the workflow below.

## Repository Configuration

### GitLab Configuration Repo
- **URL:** `https://gitlab.appian-stratus.com/appian/dev/gitlab-configuration`
- **New projects location:** `projects/docs/`
- **Branch strategy:** Work in the dev repo, create feature branch from main, MR targets main in prod repo

### Project Configuration Template

```yaml
- name: <project-name>
  isDocs: true
  approvalsRequiredToMerge: 0
  description: <brief description>
  ownerGroups:
    - squads/ux

```

**CRITICAL:** The configuration MUST include a blank line at the end (after the final `- squads/ux` line). This blank line is required to pass linting.

## Step-by-Step Workflow

### Step 1: Create Jira Ticket

Create a UXD ticket for MR reference and tracking.

**Using Jira MCP server (if available):**
```
Use Jira MCP to create ticket with:
- Project: UXD
- Type: Task
- Summary: "Create GitLab repo for [project-name]"
```

**Using Jira web interface:**
1. Navigate to Jira
2. Create new issue in UXD project
3. Set type to "Task"
4. Set summary: "Create GitLab repo for [project-name]"
5. Save and note the ticket key (e.g., `UXD-1234`)

**Save the ticket key** - you'll reference it in commit messages and MR descriptions.

### Step 2: Configure GitLab Project

**Note:** If you haven't already, complete the "Starting State" steps above to ensure you're on a clean feature branch.

Edit the project configuration in the `gitlab-configuration` repo:

Create the project config file at `projects/docs/<project-name>.yml`:

```yaml
- name: <project-name>
  isDocs: true
  approvalsRequiredToMerge: 0
  description: <brief description>
  ownerGroups:
    - squads/ux

```

**Important settings:**
- `isDocs: true` - Required for docs projects
- `ownerGroups: - squads/ux` - Default ownership
- `approvalsRequiredToMerge: 0` - Standard for prototypes
- **Blank line at end** - Required for linting (this is NOT optional)

**Commit and push:**

```bash
# Add the new config file
git add projects/docs/<project-name>.yml

# Commit with Jira reference
git commit -m "Add <project-name> docs project [UXD-XXXX]"

# Push to remote
git push -u origin add-<project-name>
```

**Create MR targeting main in prod:**

```bash
glab mr create \
  --source-branch add-<project-name> \
  --target-branch main \
  --title "Add <project-name> docs project" \
  --description "Creating new docs project for [purpose].\n\nRef: UXD-XXXX" \
  --repo appian/prod/gitlab-configuration
```

**Important:** 
- The `--source-branch` is your branch in the dev repo
- The `--target-branch` is `main` (not `prod`) in the prod repo
- The `--repo` flag specifies the target repository (prod)
- If glab asks about remotes, see "Configuring glab for Cross-Repo MRs" above

**Note:** Do NOT add new people to the group unless absolutely necessary.

### Step 3: Request MR Review

Post in **GitLab Support** channel:

```
Hi! Could someone review this MR for a new docs project?
[MR URL]
Ref: UXD-XXXX
```

**Wait for approval and merge before proceeding.**

The MR must be approved and merged before the project will be created in GitLab.

### Step 4: Deploy to Pages (Expected to Fail Initially)

After MR is merged, attempt to deploy to Pages. This will fail due to DNS configuration - this is expected.

Post in **GitLab Support** channel:

```
The new project <project-name> needs DNS configuration for Pages to work.
Project URL: https://gitlab.appian-stratus.com/docs/<project-name>
```

Wait for confirmation that DNS has been configured before proceeding.

### Step 5: Set Up Local Repository

You have two scenarios here:

#### Scenario A: New Repository (No Existing Content)

If you're starting fresh:

```bash
# Clone the new repo
git clone https://gitlab.appian-stratus.com/docs/<project-name>.git
cd <project-name>

# Add your content
# ... create files ...

# Commit and push
git add .
git commit -m "Initial content"
git push
```

#### Scenario B: Existing Git Repository (Workaround Required)

If you have an existing git repository with content, you cannot simply force push because the main branch is protected. The remote comes with an initial commit including a README.

**Use this workaround to respect branch protection while replacing the initial README:**

**Step 1: Rename the remote main branch**

```bash
# Via glab CLI
glab api --method POST "/projects/<project-id>/repository/branches/main/rename" \
  -f new_name=delete-me
```

*UI Fallback:* Navigate to Repository > Branches, click the settings icon next to `main`, select "Rename branch", enter `delete-me`

**Step 2: Set delete-me as default branch temporarily**

```bash
# Via glab CLI
glab api --method PUT "/projects/<project-id>" -f default_branch=delete-me
```

*UI Fallback:* Go to Settings > Repository > Default Branch dropdown, select `delete-me`, click "Save changes"

**Step 3: Push your local main**

```bash
cd existing_repo
git remote add origin https://gitlab.appian-stratus.com/docs/<project-name>.git
git branch -M main
git push -u origin main
```

**Step 4: Set your main as the default branch**

```bash
# Via glab CLI
glab api --method PUT "/projects/<project-id>" -f default_branch=main
```

*UI Fallback:* Go to Settings > Repository > Default Branch dropdown, select `main`, click "Save changes"

**Step 5: Delete the delete-me branch**

```bash
# Via glab CLI
glab api --method DELETE "/projects/<project-id>/repository/branches/delete-me"
```

*UI Fallback:* Go to Repository > Branches, find `delete-me`, click the trash icon to delete

**Notes:**
- You can get the project ID from `glab repo view` or from the GitLab UI (it's shown under the project name)
- If glab API commands fail, the UI fallback works reliably but requires more clicking
- This workaround respects branch protection rules while replacing the initial README

### Step 6: Wait for DNS Propagation

DNS changes can take time to propagate. The Pages URL will be:

```
https://<project-name>.docs.appian-stratus.com
```

If the site doesn't load immediately after DNS is configured:
- Wait 5-15 minutes for DNS propagation
- Clear DNS cache (see troubleshooting below)
- Verify the Pages deployment succeeded in GitLab CI/CD

## Troubleshooting

### DNS Cache Issues in Chrome

If the Pages URL isn't loading after DNS is configured:

1. Open Chrome DevTools (F12)
2. Right-click the reload button
3. Select "Empty Cache and Hard Reload"

Alternatively, clear DNS cache at the system level:

**macOS:**
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Linux:**
```bash
sudo systemd-resolve --flush-caches
```

### Git Unrelated Histories Error

If you get "refusing to merge unrelated histories":

**Cause:** This is expected due to branch protection on the remote main branch.

**Solution:** Use the branch rename workaround documented in Step 5, Scenario B. Do NOT attempt to force push to main (it's protected and will fail).

### Linting Errors in MR

If the MR has linting errors:

**Common causes:**
- Missing blank line at the end of the YAML file (most common!)
- Incorrect YAML indentation (must be 2 spaces, not tabs)
- Fields don't match the template exactly
- Typos in field names

**Solution:**
1. Check for the blank line at the end of the YAML file
2. Verify YAML indentation (2 spaces, not tabs)
3. Compare your config against the template
4. Fix errors and push updated commit to the same branch

### Pages Deployment Fails

**Common reasons:**
- DNS not configured yet (expected on first deploy - see Step 4)
- No `index.html` or proper static site structure in the repo
- Build configuration issues in `.gitlab-ci.yml`
- Build errors in the CI/CD pipeline

**Solutions:**
1. Check GitLab CI/CD pipeline logs for specific errors
2. Verify your site has an `index.html` at the root or in a `public/` directory
3. Review `.gitlab-ci.yml` configuration
4. Ensure all build dependencies are specified

### MR Targeting Wrong Branch

**Problem:** Created MR with incorrect target branch or repository

**Solution:**
1. Close the incorrect MR:
   ```bash
   glab mr close <MR_NUMBER>
   ```
2. Create a new MR targeting main in prod:
   ```bash
   glab mr create \
     --source-branch add-<project-name> \
     --target-branch main \
     --title "Add <project-name> docs project" \
     --description "Creating new docs project for [purpose].\n\nRef: UXD-XXXX" \
     --repo appian/prod/gitlab-configuration
   ```

**Common mistakes:**
- Targeting `prod` branch instead of `main` branch (the target is the main branch in the prod repo)
- Not specifying `--repo` which causes glab to guess incorrectly
- Not specifying `--source-branch` explicitly
- Answering glab's remote configuration questions incorrectly

### MR Shows No Changes or Has Conflicts

**Problem:** MR was created but shows no changes or has unexpected conflicts

**Cause:** Usually happens when:
- The source branch wasn't pushed to the dev repo before creating the MR
- The MR is targeting the wrong branch (e.g., `prod` instead of `main`)
- glab remote configuration is incorrect

**Solution:**
1. Verify your branch exists in dev repo:
   ```bash
   git branch -a | grep add-<project-name>
   ```
2. Ensure your changes are committed and pushed:
   ```bash
   git status
   git push -u origin add-<project-name>
   ```
3. Close the problematic MR and create a new one with explicit parameters:
   ```bash
   glab mr close <MR_NUMBER>
   glab mr create \
     --source-branch add-<project-name> \
     --target-branch main \
     --title "Add <project-name> docs project" \
     --description "Creating new docs project for [purpose].\n\nRef: UXD-XXXX" \
     --repo appian/prod/gitlab-configuration
   ```

### Project ID Not Found

**Problem:** Need project ID for glab API commands

**Solutions:**

**Option 1: Using glab CLI**
```bash
cd <project-directory>
glab repo view
# Look for "ID: 12345" in the output
```

**Option 2: Using GitLab UI**
- Navigate to the project in GitLab
- The project ID is shown under the project name at the top
- Format: "Project ID: 12345"

**Option 3: Using glab API**
```bash
glab api "/projects/docs%2F<project-name>" | grep '"id"'
```

## Best Practices

- **Work in the dev repo, branch from main** - Create your feature branch from main in the dev repo, then MR targets main in the prod repo
- **Use explicit flags with glab mr create** - Don't rely on defaults, specify `--source-branch`, `--target-branch`, and `--repo`
- **Include the Jira ticket reference** in commit messages and MR description for traceability
- **Don't add new people to groups unless necessary** - Use existing ownership structure
- **The blank line at the end of the YAML is NOT optional** - Linting will fail without it
- **The branch rename workaround is required** for existing repos due to main branch protection
- **DNS propagation is not instant** - Be patient and allow 5-15 minutes
- **Test the Pages URL** after DNS is configured to verify everything works
- **Document the repo purpose** in the description field for future reference

## Key Reminders

- Branch strategy: Work in dev repo, branch from main, MR targets main in prod repo
- MR command: Always use `--source-branch`, `--target-branch main`, and `--repo appian/prod/gitlab-configuration`
- YAML linting: Blank line at end is required
- Branch protection: Use rename workaround for existing repos
- DNS: Not instant, requires patience
- Jira reference: Include in all commits and MRs

## Tools Used

- **Jira** - For creating tracking tickets (via MCP or web interface)
- **glab CLI** - For creating merge requests and API operations
- **git** - For repository operations
- **GitLab Support** - Manual communication channel (no automation available)

## Value Proposition

This workflow is an excellent example of when documentation powers shine:

1. **Frequent but not daily** - Used often enough that forgetting steps is common
2. **Complex sequencing** - Multiple tools and systems must be orchestrated in the right order
3. **Critical details** - Small mistakes (missing blank line, wrong branch target) cause significant delays
4. **Tribal knowledge** - The branch protection workaround isn't documented anywhere else
5. **Partial automation** - Some steps can be automated, others require human judgment

Without this power, each repo setup requires either: (a) consulting multiple sources of documentation, (b) asking a colleague who remembers the process, or (c) trial-and-error learning. With this power, the entire flow can be followed consistently.

---

**Configuration Repo:** `https://gitlab.appian-stratus.com/appian/dev/gitlab-configuration`
**Project Location:** `projects/docs/`
**Pages URL Format:** `https://<project-name>.docs.appian-stratus.com`
