# Installation & Setup Guide — ALPER DESIGN OS

**ALPER DESIGN OS** is an AI-Native, Technology-Agnostic Design/UX Development Operating System built for Google Antigravity and the Model Context Protocol (MCP).

---

## ⚡ Quick Start (One Command)

### 1. Clone & Bootstrap

#### **Windows (CMD or PowerShell):**
```cmd
git clone https://github.com/alperates58/alper-design-os.git
cd alper-design-os
bootstrap.cmd
```
*(If PowerShell execution policy is restricted, `bootstrap.cmd` runs safely via CMD without requiring policy changes or administrative elevation.)*

#### **Linux / macOS / Git Bash:**
```bash
git clone https://github.com/alperates58/alper-design-os.git
cd alper-design-os
./scripts/bootstrap.sh
```

#### **Direct Node.js Engine (Any Platform):**
```bash
node scripts/bootstrap.js
```

---

## 🩺 System Health Diagnostics (Doctor V2)

Run Doctor V2 to verify system health and repository integrity:

```cmd
doctor.cmd
```
or
```bash
node scripts/doctor.js
```

### Preflight Diagnostics (Before Dependency Installation)
```bash
node scripts/doctor.js --preflight
```

### Machine-Readable JSON Mode
```bash
node scripts/doctor.js --json
```

---

## 🤖 Antigravity IDE Integration

To expose all 124 MCP tools directly to Google Antigravity:

```bash
node scripts/register-mcp.js --global
```

This safely registers the `alper-design-os` MCP server into `%USERPROFILE%\.gemini\config\mcp_config.json` while completely preserving any existing servers (such as `postgres`, `redis`, `figma`, or `playwright`).

---

## 🔄 Safe Non-Destructive Update Workflow

ALPER DESIGN OS enforces a zero-data-loss update guarantee. It will never run destructive resets (`git reset --hard`) or discard your local work.

```cmd
scripts\safe-update.cmd
```
or
```bash
node scripts/safe-update.js
```

If you have uncommitted changes, safe-update will halt and instruct you to commit or stash first:
```bash
git stash save "local-edits-before-update"
node scripts/safe-update.js
git stash pop
```

---

## 📋 System Prerequisites

| Component | Minimum | Recommended | Purpose |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 20.0.0` | `22.x LTS` or `24.x` | Core runtime, MCP server, TypeScript compiler |
| **Git** | `>= 2.30.0` | Latest | Repository management and atomic updates |
| **Package Manager** | `pnpm@9.15.4` | `pnpm 9.15.4` | Deterministic frozen lockfile dependency resolution |

### Optional Toolchains (for Generated Projects)
- **.NET SDK** (`>= 8.0`): For native compilation of generated `ASPNET_RAZOR` projects (`dotnet build`).
- **PHP** (`>= 8.2`) & **Composer**: For real framework boot validation of generated `LARAVEL_BLADE` projects.
- **Docker**: For isolated containerized project runs.
- **Playwright**: For headless browser E2E test journeys.

---

## 🤖 Agent Installation Protocol

For autonomous AI coding assistants (Antigravity, Claude Code, Cursor), refer to the canonical 10-stage contract in [INSTALL_AGENT.md](INSTALL_AGENT.md):
```
INSPECT → SELECT DESTINATION → CLONE/UPDATE → BOOTSTRAP → BUILD → TEST → REGISTER → DOCTOR → MCP HANDSHAKE → REPORT
```
