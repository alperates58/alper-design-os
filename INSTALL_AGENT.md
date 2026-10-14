# Agent Installation Contract — ALPER DESIGN OS

This document defines the canonical machine protocol for AI coding assistants (such as Google Antigravity, Claude Code, or Cursor) to install, bootstrap, and configure ALPER DESIGN OS from a Git repository URL without requiring manual developer intervention.

---

## 🎯 Target User Prompt
When a user says:
> *"Install Alper Design OS from https://github.com/alperates58/alper-design-os"*

The agent MUST follow the 7-step sequence below:
`INSPECT → CLONE → BOOTSTRAP → VERIFY → REGISTER → DOCTOR → REPORT`

---

## 📋 The 7-Step Protocol

### Step 1: INSPECT (Pre-Installation Checks)
1. Verify Node.js runtime:
   ```bash
   node -v
   ```
   *Requirement: Version must be `>= 20.0.0`.*
2. Verify Git:
   ```bash
   git --version
   ```
   *Requirement: Git must be available in PATH.*
3. Inspect target installation directory. If destination exists and contains uncommitted changes, **ABORT** and prompt the user rather than overwriting.

### Step 2: CLONE
Clone the canonical repository into the designated workspace:
```bash
git clone https://github.com/alperates58/alper-design-os.git
cd alper-design-os
```

### Step 3: BOOTSTRAP
Execute the canonical bootstrap entrypoint:
- **Linux / macOS / Git Bash:**
  ```bash
  ./scripts/bootstrap.sh
  ```
- **Windows (PowerShell):**
  ```powershell
  .\scripts\bootstrap.ps1
  ```
- **Direct Node Engine:**
  ```bash
  node scripts/bootstrap.js
  ```
*Bootstrap automatically performs frozen dependency installation, compiles all 18 TypeScript packages/adapters, and validates baseline health.*

### Step 4: VERIFY (Test Suite)
Run the automated verification suite:
```bash
npm test
```
*Ensure all test files pass without failures.*

### Step 5: REGISTER (Antigravity MCP Integration)
Register the MCP server with the host Antigravity environment:
```bash
node scripts/register-mcp.js
```
*This configures `alper-design-os` (and browser tool hooks) into `~/.gemini/config/mcp_config.json`.*

### Step 6: DOCTOR (Final Health Diagnosis)
Run Doctor V2 in machine-readable JSON mode:
```bash
node scripts/doctor.js --json
```
Verify that the output `status` is either `READY` or `READY_WITH_OPTIONAL_LIMITATIONS`.

### Step 7: REPORT
Report the installation summary back to the user:
- Monorepo build: **18 packages compiled**
- Canonical MCP Tools: **124 tools active**
- Skill Catalog: **74 skills (55 active, 19 deprecated)**
- Doctor Health: **READY**
- Next Action: Prompt the user to restart Antigravity or invoke an Alper Design OS skill (e.g., `/alper-greenfield-generator` or `/alper-project-analyzer`).

---

## 🚨 Safety & Idempotency Invariants

1. **Never use destructive git commands:** The agent must never run `git reset --hard` or `git clean -fd` to resolve install issues.
2. **Never expose secrets:** `.env` files must remain untracked and unlogged.
3. **Corporate Environment Fallback:** If command execution fails due to endpoint security (AppLocker/EDR/SRP), run through Git Bash or generate a Manual Run Bundle using `create_manual_run_bundle`.
