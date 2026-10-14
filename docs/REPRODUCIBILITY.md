# Reproducibility Guide — Alper Design OS v1.0

This document provides step-by-step instructions for any third party or independent auditor to reproduce the build, run the tests, and verify distribution checksums from scratch.

---

## 1. Prerequisites
- **Git**: 2.30+
- **Node.js**: >= 20.0.0 (Node 22 LTS recommended)
- **Corepack**: Included with Node.js (`corepack enable`)
- **Package Manager**: pnpm 9.15.4 (enforced via `packageManager` field)

---

## 2. Clean Clone & Reproducible Build

```bash
# 1. Clone repository
git clone https://github.com/alperates58/alper-design-os.git
cd alper-design-os

# 2. Enable corepack for deterministic pnpm 9.15.4
corepack enable
corepack prepare pnpm@9.15.4 --activate

# 3. Deterministic dependency install
pnpm install --frozen-lockfile

# 4. Compile all packages via composite TypeScript build
pnpm run build

# 5. Execute full test suite
pnpm test

# 6. Run repository secret scan & license compliance
node scripts/scan-repository-secrets.js
node scripts/audit-licenses.js

# 7. Package distribution artifacts & generate SBOM
node scripts/package-distribution.js
```

---

## 3. Verifying Cryptographic Checksums

Compare generated artifacts in `dist-release/`:
```bash
cd dist-release
sha256sum -c checksums.txt
```

Verify the SPDX 2.3 SBOM:
```bash
node -e "
const fs = require('fs');
const sbom = JSON.parse(fs.readFileSync('dist-release/sbom.spdx.json'));
console.log('SPDX Version:', sbom.spdxVersion);
console.log('Packages:', sbom.packages.length);
console.log('Relationships:', sbom.relationships.length);
"
```

---

## 4. Invariant Verification
- **Deterministic Lockfile**: `pnpm-lock.yaml` ensures identical package versions across all machines.
- **Git Archive**: Distribution tarballs are generated directly via `git archive`, stripping untracked files and local state.
- **Fail-Closed Gate**: Any divergence in package version consistency or missing checksum terminates the release build with exit code 1.
