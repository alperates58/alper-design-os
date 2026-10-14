# Installation & Setup Guide — ALPER DESIGN OS

ALPER DESIGN OS is an agentic, technology-agnostic Design/UX Development OS with Domain Intelligence.

---

## ⚡ Quick Start (One Command)

### 1. Clone & Bootstrap

#### **Linux / macOS / Git Bash:**
```bash
git clone https://github.com/alperates58/alper-design-os.git
cd alper-design-os
./scripts/bootstrap.sh
```

#### **Windows (PowerShell):**
```powershell
git clone https://github.com/alperates58/alper-design-os.git
cd alper-design-os
.\scripts\bootstrap.ps1
```

### 2. Verify Health
```bash
npm run doctor
```
If all checks display `[OK]`, your installation is complete and ready.

---

## 📋 System Prerequisites

| Component | Minimum | Recommended | Purpose |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 20.0.0` | `22.x LTS` | Core runtime, MCP server, TypeScript compiler |
| **Git** | `>= 2.30.0` | Latest | Repository management and safe atomic updates |
| **Package Manager** | `pnpm >= 9` or `npm >= 10` | `pnpm` | Dependency resolution and lockfile consistency |

### Optional Toolchains (for Generated Projects)
- **.NET SDK** (`>= 8.0`): For native compilation of generated `ASPNET_RAZOR` projects (`dotnet build`).
- **PHP** (`>= 8.2`) & **Composer**: For syntax validation of generated `LARAVEL_BLADE` projects.
- **Docker**: For isolated containerized project runs.
- **Playwright**: For headless browser E2E test journeys.

---

## 🤖 Antigravity IDE Integration

To expose ALPER DESIGN OS skills, rules, and MCP tools directly to Google Antigravity:

```bash
node scripts/register-mcp.js
```
This automatically registers the `alper-design-os` MCP server into `~/.gemini/config/mcp_config.json`. Restart Antigravity to activate all 124 MCP tools.

---

## 🔄 Safe Update Workflow

ALPER DESIGN OS enforces a non-destructive update guarantee. It will never run destructive resets (`git reset --hard`) or discard your local work.

```bash
npm run update
```

If you have uncommitted changes, safe-update will halt and instruct you to commit or stash first:
```bash
git stash save "local-edits"
npm run update
git stash pop
```

---

## 🛡️ Enterprise / Corporate Restricted Environments

In locked-down environments protected by EDR, AppLocker, or strict Software Restriction Policies (SRP):
1. Execute commands via **Git Bash** rather than native PowerShell if child-process elevation is restricted:
   ```bash
   & "C:\Program Files\Git\bin\bash.exe" -c "./scripts/bootstrap.sh"
   ```
2. If agent tool-use commands are blocked by corporate policy, utilize the **Operator-Assisted Execution** workflow:
   - Use the `create_manual_run_bundle` MCP tool.
   - Run the generated script manually as an authorized operator.
   - Verify logs using `verify_manual_run_evidence`.

---

## 🛠️ Troubleshooting

- **Doctor reports missing MCP dist?** Run `npm run build` to recompile all 18 TypeScript packages and adapters.
- **Node version too low?** Upgrade Node.js via [nvm](https://github.com/nvm-sh/nvm) (Linux/macOS) or [nvm-windows](https://github.com/coreybutler/nvm-windows).
- **Git status shows .env tracked?** Untrack it immediately: `git rm --cached .env`.
