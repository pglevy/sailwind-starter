#!/usr/bin/env bash
# deploy-site.sh — Build sailwind-starter, copy to ux-sites repo, and open a merge request
# Usage: pnpm run deploy:site --site <site-name>
set -euo pipefail

# --- Parse arguments ---------------------------------------------------------
SITE_NAME=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --site)
      SITE_NAME="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: $0 --site <site-name>"
      exit 1
      ;;
  esac
done

if [[ -z "$SITE_NAME" ]]; then
  echo "Error: --site <site-name> is required."
  echo "Usage: $0 --site <site-name>"
  exit 1
fi

# --- Config ------------------------------------------------------------------
SITES_REPO="/Users/philip.levy/Documents/GitLab/ux-sites"
TARGET="$SITES_REPO/sites/$SITE_NAME"
BRANCH="deploy/$SITE_NAME-$(shuf -i 10000-99999 -n 1)"
SOURCE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# --- Build -------------------------------------------------------------------
echo "▸ Building site..."
cd "$SOURCE_DIR"
pnpm build

# --- Sync to ux-sites --------------------------------------------------------
echo "▸ Syncing build to ux-sites/sites/$SITE_NAME..."
rm -rf "$TARGET"
cp -r "$SOURCE_DIR/dist" "$TARGET"

# --- Branch, commit, push, MR ------------------------------------------------
echo "▸ Creating branch and MR..."
cd "$SITES_REPO"
git checkout main
git pull
git checkout -b "$BRANCH"
git add "sites/$SITE_NAME"
git commit -m "Deploy $SITE_NAME site build"
git push -u origin "$BRANCH"
glab mr create --fill --yes --target-branch main

echo "✔ Done. MR created on branch: $BRANCH"
