# Upgrade & Rollback Guide — Alper Design OS

This document provides clear operational instructions for upgrading to **v1.0.0-rc.1** (Phase 1K Hardened Release Candidate) and safely rolling back to earlier verified baselines if necessary.

---

## 1. Upgrading to v1.0.0-rc.1

### From Git Repository (Automatic Safe-Update)
Execute the non-destructive safe update script:
- **Windows (CMD or PowerShell):**
  ```cmd
  scripts\safe-update.cmd
  ```
- **Direct Node Engine:**
  ```bash
  node scripts/safe-update.js
  ```
Safe-update automatically creates a safety checkpoint branch (`backup-before-update-<timestamp>`), fast-forward pulls upstream commits, and runs bootstrap verification. If uncommitted changes exist, it halts safely without modifying or discarding any files.

### Manual Git Upgrade
```bash
git fetch origin
git checkout main
pnpm install --frozen-lockfile
pnpm run build
pnpm test
node scripts/doctor.js
```

### From Distribution Tarball
1. Download `dist-release/alper-design-os-1.0.0-rc.1.tar.gz`.
2. Verify checksum against `dist-release/checksums.txt`:
   ```bash
   sha256sum -c checksums.txt
   ```
3. Extract archive:
   ```bash
   tar -xzf alper-design-os-1.0.0-rc.1.tar.gz
   cd alper-design-os
   ```
4. Run bootstrap:
   - On Windows: `bootstrap.cmd`
   - On Unix: `./scripts/bootstrap.sh` or `node scripts/bootstrap.js`

---

## 2. Rolling Back

If unexpected regressions, toolchain conflicts, or environment incompatibilities occur, roll back to verified historical baselines:

### Rollback to Phase 1J Verified Baseline (`aeda13a`)
```bash
git fetch origin
git checkout aeda13a543981cc0c58464d01cc2d7d41375e87e
pnpm install --frozen-lockfile
pnpm run build
pnpm test
```

### Rollback to Phase 1I Verified Baseline (`5978b40`)
```bash
git fetch origin
git checkout 5978b4097be27d481cee5355229027bd01ef28bc
pnpm install --frozen-lockfile
pnpm run build
pnpm test
```

### Rollback to Phase 1H.2B Closure Baseline (`50cb2e6`)
```bash
git fetch origin
git checkout 50cb2e6005bc181f215039d5e305e9a4f4756ea4
pnpm install --frozen-lockfile
pnpm run build
pnpm test
```

---

## 3. Database & Project Intelligence Migration Safety

- Project intelligence fact stores (`.alper-design-os/project/`) use append-only JSON files and ADR markdown records with strict schema versioning.
- Upgrading to `1.0.0-rc.1` does not alter or corrupt historical decision files or architecture graphs.
- If rolling back, historical `.alper-design-os/` stores remain fully readable by earlier releases.
- No schema migrations or destructive database operations are executed during upgrade or rollback.
