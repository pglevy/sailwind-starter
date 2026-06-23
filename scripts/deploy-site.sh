#!/usr/bin/env bash
# deploy-site.sh — Build sailwind-starter, push to ux-sites repo, and open a merge request
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
SITES_REPO_URL="https://gitlab.appian-stratus.com/docs/ux-sites.git"
BRANCH="deploy/$SITE_NAME-$(shuf -i 10000-99999 -n 1)"
SOURCE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMP_DIR="$(mktemp -d)"

# Clean up temp dir on exit (success or failure)
trap 'rm -rf "$TMP_DIR"' EXIT

# --- Build -------------------------------------------------------------------
echo "▸ Building site..."
cd "$SOURCE_DIR"
pnpm build

# --- Clone ux-sites into temp dir --------------------------------------------
echo "▸ Cloning ux-sites..."
git clone --depth 1 "$SITES_REPO_URL" "$TMP_DIR/ux-sites"

# --- Sync build to target folder ---------------------------------------------
TARGET="$TMP_DIR/ux-sites/sites/$SITE_NAME"
echo "▸ Syncing build to sites/$SITE_NAME..."
rm -rf "$TARGET"
cp -r "$SOURCE_DIR/dist" "$TARGET"

# --- Branch, commit, push, MR ------------------------------------------------
echo "▸ Creating branch and MR..."
cd "$TMP_DIR/ux-sites"
git checkout -b "$BRANCH"
git add "sites/$SITE_NAME"
git commit -m "Deploy $SITE_NAME site build"
git push -u origin "$BRANCH"
glab mr create --fill --yes --target-branch main

echo "✔ Done. MR created on branch: $BRANCH"
