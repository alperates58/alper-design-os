# Upgrade & Rollback Guide — Alper Design OS

This document provides clear operational instructions for upgrading to **v1.0.0-rc.1** and rolling back to earlier verified baselines if necessary.

---

## 1. Upgrading to v1.0.0-rc.1

### From Git Repository
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
   ```bash
   node scripts/bootstrap.js
   ```

---

## 2. Rolling Back

If unexpected regressions or toolchain conflicts occur, roll back to verified historical baselines:

### Rollback to Phase 1H.2B Closure Baseline (`50cb2e6`)
```bash
git fetch origin
git checkout 50cb2e6
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

---

## 3. Database & Project Intelligence Migration Safety
- Project intelligence fact stores (`.agents/project-intelligence/`) use append-only memory and ADR records with schema versioning.
- Upgrading to `1.0.0-rc.1` does not alter or corrupt historical decision files or architecture graphs.
- If rolling back, historical `.agents/` stores remain readable by earlier releases.
