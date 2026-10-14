#!/usr/bin/env bash
# ==============================================================================
# ALPER DESIGN OS - Canonical Bootstrap Shell Script (Linux / macOS / Git Bash)
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== ALPER DESIGN OS BOOTSTRAP (BASH) ==="
echo "Repository Root: ${REPO_ROOT}"

# 1. Check Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is not installed or not in PATH." >&2
  echo "Please install Node.js >= 20.0.0 from https://nodejs.org" >&2
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/^v//' | cut -d'.' -f1)
if [ "${NODE_MAJOR}" -lt 20 ]; then
  echo "ERROR: Node.js version $(node -v) is too old. Requires >= 20.0.0." >&2
  exit 1
fi

# 2. Check Git
if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git is not installed or not in PATH." >&2
  exit 1
fi

# 3. Delegate to canonical bootstrap engine
cd "${REPO_ROOT}"
node "${REPO_ROOT}/scripts/bootstrap.js" "$@"
