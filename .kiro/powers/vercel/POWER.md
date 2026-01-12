---
name: "vercel"
displayName: "Deploy to Vercel"
description: "Deploy and share hobby prototypes on Vercel with GitHub/GitLab integration, CLI deployment, and secure preview sharing using Deployment Protection and Shareable Links."
keywords: ["vercel", "deployment", "hobby", "prototype", "github", "gitlab", "cli", "preview", "shareable links", "deployment protection"]
author: "Vercel Documentation"
---

# Vercel Hobby Prototypes

Deploy and share your hobby prototypes on Vercel with ease. This power guides you through account setup, repository connections, CLI usage, and secure preview sharing—perfect for getting feedback on your projects without exposing them publicly.

## Overview

Vercel's Hobby plan is ideal for personal projects and prototypes. This power focuses on the essential workflows you need to:

- Set up your Vercel account
- Connect GitHub or GitLab repositories for automatic deployments
- Use the Vercel CLI for quick deployments
- Protect your preview deployments with Deployment Protection
- Share protected previews securely using Shareable Links

## Onboarding

### Creating a Vercel Account

You can sign up for Vercel in two ways:

**Option 1: Sign up with Email**
1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Enter your email address
3. You'll receive a six-digit one-time password (OTP)
4. Enter the OTP to complete signup

Note: When signing up with email, no Git provider is connected by default. You'll need to connect one later to import repositories.

**Option 2: Sign up with a Git Provider (Recommended)**
1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Choose to sign up with GitHub, GitLab, or Bitbucket
3. Authorize Vercel to access your Git provider account
4. This becomes your default login connection

Signing up with a Git provider is recommended because it automatically connects your repositories and simplifies the deployment process.

### Understanding Vercel Plans

When you sign up, you'll be on the **Hobby plan**, which includes:
- Unlimited deployments
- Automatic HTTPS
- Preview deployments for every push
- Deployment Protection features
- Custom domains

The Hobby plan is free and perfect for personal projects and prototypes.

## Connecting Repositories

### Importing a Repository from GitHub or GitLab

Once you have a Vercel account with a connected Git provider, you can import repositories:

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Under **Import Git Repository**, you'll see your connected repositories
4. Find the repository you want to deploy and click **Import**
5. Configure your project settings:
   - **Project Name**: Auto-generated from your repo name (you can change it)
   - **Framework Preset**: Vercel auto-detects your framework (Next.js, React, Vue, etc.)
   - **Root Directory**: Leave as default unless your app is in a subdirectory
   - **Build Command**: Auto-detected (e.g., `npm run build`)
   - **Output Directory**: Auto-detected (e.g., `dist`, `.next`)
6. Click **Deploy**

Vercel will build and deploy your project. Future commits to your default branch will automatically trigger new production deployments, and pull requests will create preview deployments.

### Connecting Additional Git Providers

If you signed up with email or want to connect additional Git providers:

1. Click your profile picture in the top-right corner
2. Select **Settings**
3. Go to **Authentication** in the left sidebar
4. Under **Login Connections**, click the Git provider you want to connect
5. Authorize Vercel to access your account

### Repository Access Requirements

**GitHub:**
- You need access to the repository to import it
- For organizations, ensure the Vercel GitHub App is installed
- Check permissions at [github.com/settings/installations](https://github.com/settings/installations)

**GitLab:**
- You need **Maintainer** access to the repository
- For GitLab groups, you need Maintainer access to the group as well
- Vercel configures webhooks to automatically deploy commits

### How Automatic Deployments Work

Once connected:
- **Production deployments**: Commits to your default branch (usually `main` or `master`) deploy to production
- **Preview deployments**: Pull requests and commits to other branches create preview deployments
- **Build logs**: View real-time build logs in the Vercel dashboard
- **Deployment URLs**: Each deployment gets a unique URL (e.g., `your-project-abc123.vercel.app`)

## Using the Vercel CLI

The Vercel CLI lets you deploy from your local machine and manage projects from the terminal.

**Important CLI Limitations:**
- The CLI **cannot** configure Deployment Protection settings (requires web interface)
- The CLI **cannot** create or manage Shareable Links (requires web interface)
- The `vercel git connect` command often fails and requires GitHub App authorization through the web interface
- For these tasks, you'll need to use the Vercel dashboard

The CLI is best for: deploying projects, inspecting deployments, viewing logs, and managing environment variables.

### Installing the Vercel CLI

Install globally using your preferred package manager:

```bash
# npm
npm install -g vercel

# pnpm
pnpm add -g vercel

# yarn
yarn global add vercel
```

### Logging In

Authenticate with your Vercel account:

```bash
vercel login
```

This will:
1. Open your browser for authentication
2. Ask you to confirm the login
3. Store your credentials locally

### Deploying a Project

**First-time deployment:**

```bash
# Navigate to your project directory
cd my-project

# Deploy (use --yes to skip prompts and accept defaults)
vercel --yes
```

The CLI will:
1. Ask which scope (team) to deploy to (or auto-select with --yes)
2. Ask if you want to link to an existing project or create a new one
3. Confirm project settings (name, framework, build command)
4. Build and deploy your project
5. Provide a preview URL
6. Create a `.vercel/` directory (automatically added to `.gitignore`)

**Note:** The initial deployment may show an error about connecting to GitHub - this is expected. You'll connect GitHub through the web interface in the next step.

**Subsequent deployments:**

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Useful CLI Commands

```bash
# Deploy to production
vercel --prod

# Deploy with build logs
vercel --debug

# Link local directory to existing project
vercel link

# List your deployments for a project
vercel ls <project-name>

# List all your projects
vercel project ls

# View deployment details
vercel inspect <deployment-url>

# View project details
vercel project inspect <project-name>

# Open project in browser
vercel open

# Remove a deployment
vercel rm <deployment-url>
```

### CLI Configuration

The CLI stores configuration in `.vercel/` directory:
- `.vercel/project.json`: Links your local directory to a Vercel project
- Add `.vercel` to your `.gitignore` to avoid committing credentials

### Testing Protected Deployments with CLI

When you have Deployment Protection enabled, use these commands to test protected deployments:

```bash
# Make HTTP requests with automatic protection bypass
vercel curl <deployment-url>

# Visualize HTTP timing with protection bypass
vercel httpstat <deployment-url>
```

These commands automatically handle protection bypass tokens, so you don't need to manually manage secrets.

## Deployment Protection

Deployment Protection secures your preview deployments so only authorized users can access them. This is essential for hobby prototypes that aren't ready for public viewing.

### Understanding Deployment Protection

Vercel offers several protection methods:

1. **Vercel Authentication**: Requires visitors to log in with a Vercel account
2. **Password Protection**: Requires a password to access deployments
3. **Trusted IPs**: Restricts access to specific IP addresses (Pro/Enterprise only)

For hobby prototypes, **Vercel Authentication** and **Password Protection** are the most useful.

### Vercel Authentication (Standard Protection)

Vercel Authentication restricts access to:
- Members of your Vercel team
- Users you explicitly grant access to
- Anyone with a Shareable Link

**Enabling Vercel Authentication:**

1. Go to your project in the [Vercel dashboard](https://vercel.com/dashboard)
2. Click **Settings** → **Deployment Protection**
3. Under **Vercel Authentication**, toggle it **On**
4. Choose which environments to protect:
   - **Preview Deployments**: Protects all preview deployments (recommended)
   - **Production Deployments**: Protects your production site (use cautiously)
5. Click **Save**

**How it works:**
- When someone visits a protected deployment, they're prompted to log in with Vercel
- If they don't have access, they can request it
- You'll receive an email notification for access requests
- You can approve or deny requests from the deployment page

**Access Requests:**
When someone requests access:
1. You receive an email and Vercel notification
2. Go to the deployment page
3. Click **Share** → **Access** to manage requests
4. Approve or deny the request

### Password Protection

Password Protection requires visitors to enter a password before accessing deployments.

**Enabling Password Protection:**

1. Go to your project settings → **Deployment Protection**
2. Under **Password Protection**, toggle it **On**
3. Enter a password (minimum 8 characters)
4. Choose which environments to protect
5. Click **Save**

**How it works:**
- Visitors see a password prompt when accessing protected deployments
- Once they enter the correct password, a cookie is set
- They won't need to re-enter the password unless it changes
- You can change the password anytime, which invalidates all existing cookies

**Best practices:**
- Use a strong, unique password
- Share the password securely (don't post it publicly)
- Change the password if it's compromised
- Consider using Vercel Authentication instead for better security

### Deployment Protection by Environment

You can configure protection differently for each environment:

- **Preview Deployments**: Protects all preview deployments (PRs and branch deployments)
- **Production Deployments**: Protects your production site
- **Development Deployments**: Protects local development deployments (rarely used)

For hobby prototypes, typically you want to:
- **Enable protection for Preview Deployments** (to control who sees your work-in-progress)
- **Disable protection for Production Deployments** (if you want your final product public)

### Combining Protection Methods

You can use multiple protection methods together:
- **Vercel Authentication + Password Protection**: Requires both login and password
- **Vercel Authentication + Trusted IPs**: Requires login from specific IPs (Pro/Enterprise)

For hobby projects, using just **Vercel Authentication** is usually sufficient.

## Shareable Links

Shareable Links let you give external users access to protected deployments without requiring them to have a Vercel account or know a password.

### What are Shareable Links?

A Shareable Link is a special URL with a secure query parameter that bypasses Deployment Protection. Anyone with the link can access the deployment, even if it's protected.

Example:
```
https://your-project-abc123.vercel.app?token=secure-random-token
```

### Creating Shareable Links

**From the Deployment Page:**

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Click on a deployment (preview or production)
4. Click the **Share** button
5. Toggle **Anyone with the link** to **On**
6. Copy the generated Shareable Link
7. Share it with your collaborators

**Who can create Shareable Links:**
- Project members (on your Vercel team)
- Anyone with access to the deployment page

### Using Shareable Links

**Sharing with external collaborators:**
1. Create a Shareable Link as described above
2. Send the link via email, Slack, or your preferred communication method
3. Recipients can access the deployment without logging in
4. They can also leave comments if Comments are enabled

**Shareable Links and Comments:**
- Recipients with Shareable Links can leave comments on your deployment
- This is great for getting feedback from clients, stakeholders, or beta testers
- Comments appear in the Vercel dashboard and trigger email notifications

### Managing Shareable Links

**Viewing all Shareable Links:**

1. Go to your team's **Settings** → **Deployment Protection**
2. Click the **Access** tab
3. Click **All Access** → **Shareable Links**
4. You'll see a list of all active Shareable Links for your team

**Revoking access:**

To revoke access for a Shareable Link:
1. Go to the deployment page
2. Click **Share**
3. Toggle **Anyone with the link** to **Off** (changes to **Only people with access**)
4. The Shareable Link will no longer work

Note: If you've also shared the deployment with individual users, you'll need to remove them separately from the Share popover.

**Security considerations:**
- Shareable Links are secure but can be shared by anyone who has them
- Don't post Shareable Links publicly (e.g., on social media or public forums)
- Revoke links when you no longer need them
- Create new links for different groups of collaborators to maintain control

### Shareable Links vs. Other Access Methods

| Method | Requires Vercel Account | Requires Password | Can be Revoked | Best For |
|--------|------------------------|-------------------|----------------|----------|
| Shareable Link | No | No | Yes (by disabling link) | External collaborators, quick feedback |
| Vercel Authentication | Yes | No | Yes (per user) | Team members, controlled access |
| Password Protection | No | Yes | Yes (by changing password) | Simple protection, known group |

## Common Workflows

### Workflow 1: Deploy a New Prototype (Recommended)

This workflow combines CLI deployment with web-based configuration for the best experience:

1. **Deploy with CLI:**
   ```bash
   cd my-project
   vercel --yes
   ```
   This creates your project and provides a production URL.

2. **Connect GitHub (Web Interface):**
   - Go to your project settings: `https://vercel.com/<username>/<project-name>/settings/git`
   - Click **Connect Git Repository**
   - Authorize the Vercel GitHub App if prompted
   - Select your repository and click **Connect**
   - This enables automatic deployments on push

3. **Enable Deployment Protection (Web Interface):**
   - Go to: `https://vercel.com/<username>/<project-name>/settings/deployment-protection`
   - Toggle **Vercel Authentication** to **On**
   - Select **Preview Deployments**
   - Click **Save**

4. **Create Shareable Link (Web Interface):**
   - Go to your project deployments
   - Click on a deployment
   - Click **Share** → Toggle **Anyone with the link** to **On**
   - Copy and share the link

### Workflow 2: Deploy from GitHub First

1. Create your project locally
2. Initialize a Git repository: `git init`
3. Create a GitHub or GitLab repository
4. Push your code: `git push origin main`
5. Go to [vercel.com/new](https://vercel.com/new)
6. Import your repository
7. Configure and deploy
8. Enable Deployment Protection in project settings
9. Share the deployment URL or create a Shareable Link

### Workflow 3: Get Feedback on a Feature Branch

### Workflow 3: Get Feedback on a Feature Branch

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make your changes and commit: `git commit -m "Add new feature"`
3. Push to GitHub/GitLab: `git push origin feature/new-feature`
4. Vercel automatically creates a preview deployment
5. Go to your Vercel dashboard and find the preview deployment
6. Click **Share** and create a Shareable Link
7. Send the link to your reviewers
8. Reviewers can view the deployment and leave comments
9. Make changes based on feedback and push again
10. The preview deployment updates automatically

### Workflow 4: Quick Local Deployment

1. Navigate to your project: `cd my-project`
2. Make changes to your code
3. Deploy with CLI: `vercel`
4. Get instant preview URL
5. Test your changes
6. Deploy to production when ready: `vercel --prod`

### Workflow 5: Protect and Share a Deployment

1. Go to project **Settings** → **Deployment Protection**
2. Enable **Vercel Authentication** for preview deployments
3. Deploy your code (via Git or CLI)
4. Go to the deployment page
5. Click **Share** → Toggle **Anyone with the link** to **On**
6. Copy the Shareable Link
7. Send to external collaborators
8. They can access and comment without a Vercel account
9. Revoke access by toggling the link off when done

## Troubleshooting

### Framework-Specific Considerations

**Vite Projects:**
- Remove any `base` configuration from `vite.config.js` when deploying to Vercel
- The `base` option is typically used for GitHub Pages but should be removed for Vercel
- Example of what to remove:
  ```javascript
  // Remove this for Vercel:
  export default defineConfig({
    plugins: [react()],
    base: '/my-project/', // ❌ Remove this line
  });
  ```

**Create React App:**
- Vercel auto-detects CRA projects
- Build command: `npm run build`
- Output directory: `build`

**Next.js:**
- Vercel has first-class Next.js support
- No configuration needed in most cases
- Automatic API routes and serverless functions

### Repository Not Showing in Import List

**GitHub:**
- Ensure the Vercel GitHub App is installed: [github.com/settings/installations](https://github.com/settings/installations)
- Check that the app has access to the repository (not just selected repos)
- Verify you have access to the repository

**GitLab:**
- Ensure you have **Maintainer** access to the repository
- For GitLab groups, you need Maintainer access to the group
- Check your GitLab permissions

### CLI Login Issues

**Problem:** `vercel login` doesn't work

**Solutions:**
- Ensure you have a stable internet connection
- Try clearing CLI cache: `rm -rf ~/.vercel`
- Reinstall the CLI: `npm uninstall -g vercel && npm install -g vercel`
- Check if your firewall is blocking the CLI

**Problem:** `vercel` command not found after installation

**Solutions:**
- If using nvm, the path may be lazy-loaded. Run `node --version` first to initialize the path
- Restart your terminal
- Check if vercel is in your PATH: `which vercel`
- Verify installation: `npm list -g vercel`

### Deployment Fails to Build

**Common causes:**
- Missing dependencies in `package.json`
- Build command is incorrect
- Environment variables not set
- Node.js version mismatch

**Solutions:**
1. Check build logs in the Vercel dashboard
2. Verify your build command works locally: `npm run build`
3. Set environment variables in project settings
4. Specify Node.js version in `package.json`:
   ```json
   {
     "engines": {
       "node": "18.x"
     }
   }
   ```

### Can't Access Protected Deployment

**Problem:** Getting authentication prompt on your own deployment

**Solutions:**
- Ensure you're logged into Vercel in your browser
- Check that you're a member of the project's team
- Request access if you're not a member
- Use a Shareable Link if available

### Shareable Link Not Working

**Problem:** Shareable Link shows authentication prompt

**Solutions:**
- Verify the link includes the token parameter: `?token=...`
- Check if the link was revoked (toggle might be off)
- Ensure Deployment Protection is enabled
- Try generating a new Shareable Link

### Preview Deployment Not Created

**Problem:** Push to branch doesn't create preview deployment

**Solutions:**
- Verify the repository is connected to Vercel
- Check that the branch is not ignored in project settings
- Ensure the commit contains changes (empty commits are skipped)
- Check build logs for errors

### GitHub Connection Fails via CLI

**Problem:** `vercel git connect` shows "Failed to connect" error

**Solutions:**
- This is expected behavior - the CLI cannot complete GitHub authorization
- Use the web interface instead:
  1. Go to your project settings: `https://vercel.com/<username>/<project-name>/settings/git`
  2. Click **Connect Git Repository**
  3. Authorize the Vercel GitHub App
  4. Select your repository
- The GitHub App requires browser-based OAuth which the CLI cannot handle

## Best Practices

### For Hobby Prototypes

1. **Always enable Deployment Protection** for preview deployments to control access
2. **Use Shareable Links** for external feedback instead of making deployments public
3. **Connect via Git** for automatic deployments rather than manual CLI deployments
4. **Use feature branches** for experiments and get preview deployments automatically
5. **Enable Comments** to gather feedback directly on deployments
6. **Set up custom domains** for production deployments to make them memorable
7. **Monitor build times** and optimize if they're too slow
8. **Use environment variables** for API keys and secrets (never commit them)

### Security

1. **Don't post Shareable Links publicly** (social media, forums, etc.)
2. **Revoke Shareable Links** when you no longer need them
3. **Use Vercel Authentication** for sensitive prototypes
4. **Change passwords regularly** if using Password Protection
5. **Review access requests** before approving them
6. **Keep your Git repository private** if your code is sensitive

### Performance

1. **Optimize images** before deploying (use Next.js Image Optimization if using Next.js)
2. **Minimize bundle size** by removing unused dependencies
3. **Use caching** for static assets
4. **Enable compression** in your framework
5. **Monitor Core Web Vitals** in the Vercel dashboard

### Collaboration

1. **Use descriptive commit messages** so preview deployments are easy to identify
2. **Enable Comments** for feedback on preview deployments
3. **Create Shareable Links per reviewer** to track who has access
4. **Use pull requests** to get automatic preview deployments
5. **Document your deployment process** in your repository README

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Deployment Protection Docs](https://vercel.com/docs/security/deployment-protection)
- [Git Integration Docs](https://vercel.com/docs/git)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)
