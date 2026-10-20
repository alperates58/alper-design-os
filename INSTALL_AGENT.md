# Agent Installation & Upgrade Contract — ALPER DESIGN OS

This document defines the canonical, machine-verifiable protocol for AI coding assistants (such as Google Antigravity, Claude Code, or Cursor) to install, bootstrap, upgrade, and configure **ALPER DESIGN OS** without manual developer intervention or destructive operations.

---

## 🎯 Target User Prompts
When a user instructs an agent:
> *"Install Alper Design OS from https://github.com/alperates58/alper-design-os"*  
> *"Update my Alper Design OS installation"*  
> *"Configure Alper Design OS MCP tools into Antigravity"*

The agent MUST follow the deterministic 10-step sequence below:

```
INSPECT → SELECT DESTINATION → CLONE/UPDATE → BOOTSTRAP → BUILD → TEST → REGISTER → DOCTOR → MCP HANDSHAKE → REPORT
```

---

## 📋 The 10-Stage Canonical Agent Protocol

### Stage 1: INSPECT (Host Prerequisites)
1. Verify Node.js runtime:
   ```bash
   node -v
   ```
   *Invariant: Node.js version MUST be `>= 20.0.0`.*
2. Verify Git:
   ```bash
   git --version
   ```
   *Invariant: Git MUST be present in PATH.*
3. Verify Package Manager:
   - On Windows: check `pnpm.cmd -v` or `pnpm -v`.
   - On Unix: check `pnpm -v`.
   - If pnpm is not in PATH, use Corepack: `corepack enable && corepack prepare pnpm@9.15.4 --activate`.
   *Invariant: Never fall back to unpinned npm or alter pnpm-lock.yaml.*

### Stage 2: SELECT DESTINATION (Path Verification)
1. Prompt or derive the destination path from user intent.
2. Confirm the destination path is inside an authorized user workspace (e.g. `C:\Users\<user>\Desktop\...` or `~/projects/...`).
3. Check for existing directory:
   - If destination does not exist, proceed to Stage 3 (CLONE).
   - If destination exists, proceed to Stage 3 (UPDATE).

### Stage 3: CLONE or UPDATE (Non-Destructive Handling)
#### Case A: Destination does NOT exist
Clone cleanly into the user-specified directory:
```bash
git clone https://github.com/alperates58/alper-design-os.git "<destination>"
cd "<destination>"
```

#### Case B: Destination ALREADY exists
1. Check if destination is a Git repository:
   ```bash
   git status -s
   ```
2. **Dirty Workspace Protection**:
   - If uncommitted changes exist, **DO NOT PROCEED**.
   - NEVER execute `git reset --hard` or `git clean -fd`.
   - Report dirty files to the user and request stash/commit.
3. **Safe-Update Evaluation**:
   - Execute safe non-destructive update:
     ```bash
     node scripts/safe-update.js
     ```
   - Safe-update creates a rollback safety branch (`backup-before-update-<timestamp>`) and fast-forward pulls upstream commits.
   - If local commits have diverged, safe-update stops and requests manual rebase.

### Stage 4: BOOTSTRAP (Deterministic Dependency Setup)
Execute the bootstrap engine:
- **Windows (CMD / PowerShell safe):**
  ```cmd
  bootstrap.cmd
  ```
- **Direct Node Engine:**
  ```bash
  node scripts/bootstrap.js
  ```
*Invariants handled by bootstrap:*
- Automatically detects and repairs stale junctions/symlinks if the workspace was relocated.
- Enforces `pnpm install --frozen-lockfile` using pinned `pnpm@9.15.4`.

### Stage 5: BUILD (Composite Monorepo Compilation)
Compile all 18 TypeScript packages and stack adapters:
- **Windows:**
  ```cmd
  npm.cmd run build
  ```
- **Unix:**
  ```bash
  npm run build
  ```
Verify that `packages/mcp-server/dist/index.js` and all 18 targets exist.

### Stage 6: TEST (Automated Verification)
Execute the complete test suite:
- **Windows:**
  ```cmd
  node node_modules/vitest/vitest.mjs run
  ```
- **Unix:**
  ```bash
  npm test
  ```
*Invariant: All 25 test suites (538+ tests) must pass with zero failures.*

### Stage 7: REGISTER (Antigravity MCP Registration)
Register the canonical `alper-design-os` MCP server into Antigravity global configuration:
```bash
node scripts/register-mcp.js --global
```
*Guarantees enforced by register-mcp:*
- Updates ONLY the `alper-design-os` server entry.
- Completely preserves all existing third-party servers (`playwright`, `chrome-devtools`, `postgres`, `redis`, `figma`).
- Sets `ALPER_DESIGN_OS_HOME` to the absolute canonical repository root.
- Handles UTF-8 with BOM cleanly without JSON parsing exceptions.
- Keeps browser and DevTools integrations strictly opt-in with pinned versions.

### Stage 8: DOCTOR (Health Diagnostic)
Execute Doctor V2 in machine-readable JSON mode:
```bash
node scripts/doctor.js --json
```
Verify:
- Health status is `READY` or `READY_WITH_OPTIONAL_LIMITATIONS`.
- 18 monorepo packages present.
- Canonical 124 tools verified.
- 74 skills verified (55 active, 19 deprecated).
- Zero secret violations.

### Stage 9: MCP HANDSHAKE (Runtime Protocol Verification)
Perform a stdio JSON-RPC handshake against `packages/mcp-server/dist/index.js`:
1. Send `initialize` -> verify server returns name `alper-design-os` and version `1.0.0-rc.1`.
2. Send `notifications/initialized`.
3. Send `tools/list` -> verify exact canonical tool count: 124 tools.
4. Execute test invocation of read-only safe tool (`get_design_tokens` with format `css`).

### Stage 10: REPORT (Structured Completion Receipt)
Report structured evidence back to the user:
```markdown
### ALPER DESIGN OS Installation Summary
- **Repository Root**: `<absolute_path>`
- **Version**: 1.0.0-rc.1
- **Monorepo Packages**: 18 compiled artifacts verified
- **MCP Server**: 124 canonical tools registered
- **Skill Inventory**: 74 skills (55 active, 19 deprecated)
- **Doctor Status**: READY (or READY_WITH_OPTIONAL_LIMITATIONS)
- **Host Integration**: ANTIGRAVITY_MCP_RUNTIME = VERIFIED
- **Next Steps**: Invoke any Alper Design OS skill (e.g. `/alper-domain-intelligence`, `/alper-ui-blueprint`).
```

---

## 🚨 Safety & Idempotency Invariants

1. **Fail-Closed Safety**: Any prerequisite or security check failure must abort execution with a non-zero exit code.
2. **Never Overwrite or Discard User Edits**: No `git reset --hard`, `git clean -fd`, or automated deletion of user directories.
3. **Zero Secret Leakage**: Tracked files are audited for secrets; `.env` is gitignored.
4. **Idempotency**: Rerunning the installation on an existing clean installation must complete cleanly with status `ALREADY_UP_TO_DATE` or `SUCCESS - READY`.
