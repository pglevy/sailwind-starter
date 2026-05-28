---
name: security-audit
description: >
  Run a security audit on the Sailwind Starter project. Checks for exposed secrets, suspicious
  packages, misconfigured security settings, and common mistakes designers might not know to look
  for. Use this skill when the user asks to "check security", "run a security audit", "make sure
  nothing is exposed", or "check if my API keys are safe".
metadata:
  title: Security Audit
  prompt: "Help me secure my project: "
  human-reviewer: Philip Levy
  last-reviewed: 2026-05-27
---

# Security Audit

The target user is a designer who may not have a security background. Explain findings in plain language, be specific about what the risk is and how to fix it, and prioritize by severity. Never show the actual value of a secret in your response — reference it by name only.

## Inputs

None — the skill scans the project automatically.

## Communication Style

- Use plain language: "This file contains a password that could be stolen" not "credential exposure vector"
- Always explain *why* something is a risk, not just that it is one
- Distinguish between "fix this now" (high) and "good to know" (low)
- Be encouraging — most issues are easy to fix

---

## Check 1 — Secrets in tracked files

**What we're looking for:** API keys, passwords, tokens, or credentials that have been committed to git (or are in files that *could* be committed).

Run:
```bash
# Check if .env.local is gitignored
git check-ignore -v .env.local

# Check if any .env files are tracked
git ls-files | grep -E '\.env'

# Scan tracked source files for common secret patterns
git ls-files src/ | xargs grep -l -E '(API_KEY|api_key|apiKey|SECRET|password|token|Bearer |eyJ)' 2>/dev/null
```

**What to look for:**
- `.env.local` should appear in `git check-ignore` output — if it doesn't, it's being tracked and any keys inside are exposed
- Any `.env` file showing up in `git ls-files` is a problem
- Source files in `src/` should not contain hardcoded keys or tokens

**If `.env.local` is NOT gitignored:**
```bash
echo ".env.local" >> .gitignore
git rm --cached .env.local
```
Then commit the `.gitignore` change. The file stays on disk but is no longer tracked.

**If keys are hardcoded in `src/`:**
Move them to `.env.local` and reference them via `import.meta.env.VITE_MY_KEY`. Only variables prefixed with `VITE_` are available in the browser — never put secrets there. Server-side keys (like `API_KEY` used in deploy scripts) belong only in `.env.local` and should never be `VITE_`-prefixed.

> **Important:** If a secret was ever committed to git history, changing `.gitignore` is not enough — the secret is still in the history. In that case, rotate the key (generate a new one and invalidate the old one) immediately.

---

## Check 2 — Secrets in git history

**What we're looking for:** Keys that may have been committed in the past, even if they've since been removed.

Run:
```bash
# Search git history for common secret patterns
git log --all -p --follow -- .env.local 2>/dev/null | grep -E '(API_KEY|SECRET|token|eyJ)' | head -20

# Check if .env.local was ever tracked
git log --all --full-history -- .env.local | head -5
```

**If secrets appear in history:**
The key is compromised regardless of current file state. Steps:
1. Rotate the key immediately (generate a new one in whatever service issued it)
2. Optionally clean history with `git filter-repo` — but this rewrites history and requires force-pushing, so coordinate with anyone else using the repo first

---

## Check 3 — Package integrity

**What we're looking for:** Packages that look suspicious, have unusual names, or weren't installed through normal means.

Run:
```bash
# List direct dependencies
node -e "const p = require('./package.json'); console.log('deps:', Object.keys(p.dependencies || {})); console.log('devDeps:', Object.keys(p.devDependencies || {}))"

# Check for any packages installed from git URLs or file paths (not registry)
cat pnpm-lock.yaml | grep -E '(github:|gitlab:|bitbucket:|file:)' | head -20

# Check pnpm audit
pnpm audit --audit-level moderate 2>&1 | head -50
```

**What to look for:**
- Any package name you don't recognize — look it up on npmjs.com before trusting it
- Packages installed from `github:`, `gitlab:`, or `file:` paths bypass registry security checks
- `pnpm audit` output showing "high" or "critical" vulnerabilities

**Red flags in package names:**
- Typosquatting: packages with names very similar to popular ones (e.g., `reakt` instead of `react`, `lodahs` instead of `lodash`)
- Packages with very few downloads or no documentation
- Packages that claim to do something unrelated to what you need

**This project's protections already in place:**
- `block-exotic-subdeps=true` in `.npmrc` — blocks transitive dependencies from using git/tarball sources
- `minimumReleaseAge: 2880` in `pnpm-workspace.yaml` — blocks packages published less than 2 days ago (protects against "package takeover" attacks where someone publishes a malicious version of a popular package)
- `allowBuilds` allowlist — only `esbuild` and `@tailwindcss/oxide` can run install scripts, which is a common malware vector

---

## Check 4 — What gets built into the app

**What we're looking for:** Secrets that end up in the compiled JavaScript that ships to users.

Run:
```bash
# Check for VITE_ prefixed vars in .env.local (these ARE included in the build)
grep 'VITE_' .env.local 2>/dev/null

# Check if any non-VITE_ vars are referenced in src/ (they won't work, but might indicate confusion)
grep -r 'import\.meta\.env\.' src/ | grep -v 'VITE_'

# After a build, check if any secrets appear in the output
grep -r 'eyJ\|API_KEY\|api_key' dist/assets/*.js 2>/dev/null | head -5
```

**The rule:** In Vite, only `VITE_`-prefixed variables from `.env.local` get bundled into the JavaScript that users download. This means:
- `VITE_API_KEY=abc123` → **visible to anyone** who opens DevTools
- `API_KEY=abc123` → stays on your machine, never shipped

For this project, the Appian API key used by deploy scripts should **never** be `VITE_`-prefixed. If you need to call an API from the prototype itself, use a public/read-only key or a proxy.

---

## Check 5 — Repository visibility and sharing

**What we're looking for:** Whether the repo is public (which would expose everything in git history to the world).

Run:
```bash
# Check remote URL
git remote get-url origin 2>/dev/null

# If using GitHub CLI
gh repo view --json visibility -q .visibility 2>/dev/null
```

**If the repo is public:**
- Any secret ever committed to history is now public
- Rotate all keys immediately
- Consider making the repo private if it contains proprietary prototype work

---

## Check 6 — .gitignore coverage

**What we're looking for:** Files that should be ignored but aren't.

Run:
```bash
# Show all tracked files that look like they might contain secrets
git ls-files | grep -E '\.(env|key|pem|p12|pfx|secret|credentials|token)' 

# Check common sensitive files
for f in .env .env.local .env.production .env.staging; do
  git check-ignore -v "$f" 2>/dev/null || echo "WARNING: $f is NOT gitignored"
done
```

**Files that should always be in `.gitignore`:**
- `.env`, `.env.local`, `.env.*.local`
- Any file ending in `.key`, `.pem`, `.p12`
- `*.secret`, `*credentials*`

---

## Reporting Results

After running all checks, summarize findings in three buckets:

### 🔴 Fix now
Issues where secrets may already be exposed or could be exposed on next push. Include exact steps to fix.

### 🟡 Worth addressing
Configuration gaps or practices that increase risk but aren't immediately dangerous.

### 🟢 Already protected
Call out what's working well — the designer put effort into security and deserves to know it's paying off. Specifically mention:
- `block-exotic-subdeps` in `.npmrc`
- `minimumReleaseAge` in `pnpm-workspace.yaml`
- `allowBuilds` allowlist
- `.env.local` being gitignored (if confirmed)

---

## Quick Reference

```bash
git check-ignore -v .env.local     # Is this file gitignored?
git ls-files | grep .env           # Any .env files tracked?
pnpm audit                         # Known vulnerabilities in packages
git log --all -p -- .env.local     # Was this file ever committed?
grep 'VITE_' .env.local            # What gets bundled into the app?
gh repo view --json visibility     # Is the repo public or private?
```
