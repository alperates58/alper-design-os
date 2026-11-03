#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ALLOWED_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
  '0BSD',
  'CC0-1.0',
  'Unlicense',
  'Python-2.0'
]);

export const PROHIBITED_LICENSES = new Set([
  'GPL-2.0',
  'GPL-2.0-only',
  'GPL-2.0-or-later',
  'GPL-3.0',
  'GPL-3.0-only',
  'GPL-3.0-or-later',
  'AGPL-3.0',
  'AGPL-3.0-only',
  'AGPL-3.0-or-later',
  'SSPL',
  'SSPL-1.0',
  'Commons-Clause',
  'BUSL-1.1',
  'BSL-1.1'
]);

export const WORKSPACE_MANIFESTS = [
  'package.json',
  'design-core/package.json',
  'adapters/contract/package.json',
  'adapters/generic-web/package.json',
  'adapters/html-css-js/package.json',
  'adapters/react/package.json',
  'adapters/react-typescript/package.json',
  'adapters/php/package.json',
  'adapters/laravel-blade/package.json',
  'adapters/aspnet-razor/package.json',
  'registry/package.json',
  'packages/analyzer/package.json',
  'packages/source-intelligence/package.json',
  'packages/engineering-guardrails/package.json',
  'packages/qa-engine/package.json',
  'packages/software-intelligence/package.json',
  'packages/agent-governance/package.json',
  'packages/design-language/package.json',
  'packages/mcp-server/package.json'
];

export function resolvePackageLicenseMetadata(pkgObj) {
  if (!pkgObj || typeof pkgObj !== 'object') {
    return 'UNKNOWN';
  }
  let license = pkgObj.license;
  if (typeof license === 'object' && license !== null) {
    license = license.type || license.name;
  }
  if (typeof license === 'string' && license.trim().length > 0) {
    return license.trim();
  }
  return 'UNKNOWN';
}

export function findInstalledPackageJson(rootDir, depName) {
  const workspaceDirs = WORKSPACE_MANIFESTS.map(m => path.dirname(path.join(rootDir, m)));
  for (const wsDir of workspaceDirs) {
    const candidate = path.join(wsDir, 'node_modules', depName, 'package.json');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Check pnpm virtual store if present
  const pnpmDir = path.join(rootDir, 'node_modules', '.pnpm');
  if (fs.existsSync(pnpmDir)) {
    const normalizedPrefix = `${depName.replace('/', '+')}@`;
    try {
      const entries = fs.readdirSync(pnpmDir);
      const match = entries.find(e => e.startsWith(normalizedPrefix));
      if (match) {
        const candidate = path.join(pnpmDir, match, 'node_modules', depName, 'package.json');
        if (fs.existsSync(candidate)) {
          return candidate;
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  return null;
}

export function auditWorkspaceLicenses(rootDir = process.cwd()) {
  const violations = [];
  const scannedPackages = new Map();
  const prodDeps = new Set();

  for (const relPath of WORKSPACE_MANIFESTS) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) continue;
    try {
      const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      const pkgLicense = resolvePackageLicenseMetadata(pkg);
      scannedPackages.set(pkg.name || relPath, {
        version: pkg.version || '0.0.0',
        license: pkgLicense,
        source: 'WORKSPACE_MANIFEST'
      });

      if (PROHIBITED_LICENSES.has(pkgLicense)) {
        violations.push({
          package: pkg.name || relPath,
          version: pkg.version || '0.0.0',
          license: pkgLicense,
          reason: 'PROHIBITED_COPYLEFT_OR_COMMERCIAL'
        });
      }

      if (pkg.dependencies) {
        for (const dep of Object.keys(pkg.dependencies)) {
          if (!dep.startsWith('@alper-design-os/')) {
            prodDeps.add(dep);
          }
        }
      }
    } catch (err) {
      console.warn(`Warning reading ${relPath}: ${err.message}`);
    }
  }

  for (const dep of prodDeps) {
    const pkgJsonPath = findInstalledPackageJson(rootDir, dep);
    if (!pkgJsonPath) {
      // Never fabricate 'MIT' when package metadata is missing; keep 'UNKNOWN'
      scannedPackages.set(dep, {
        version: 'unresolved',
        license: 'UNKNOWN',
        source: 'UNRESOLVED_DEPENDENCY'
      });
      violations.push({
        package: dep,
        version: 'unresolved',
        license: 'UNKNOWN',
        reason: 'MISSING_LICENSE_METADATA'
      });
      continue;
    }

    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      const license = resolvePackageLicenseMetadata(pkg);

      let isPermissive = false;
      let isProhibited = false;

      for (const allowed of ALLOWED_LICENSES) {
        if (license.includes(allowed)) {
          isPermissive = true;
          break;
        }
      }

      for (const prohibited of PROHIBITED_LICENSES) {
        if (license.includes(prohibited)) {
          isProhibited = true;
          break;
        }
      }

      if (license === 'UNKNOWN' || isProhibited || !isPermissive) {
        violations.push({
          package: dep,
          version: pkg.version || '0.0.0',
          license,
          reason:
            license === 'UNKNOWN'
              ? 'MISSING_LICENSE_METADATA'
              : isProhibited
                ? 'PROHIBITED_COPYLEFT_OR_COMMERCIAL'
                : 'UNRECOGNIZED_NON_PERMISSIVE_LICENSE'
        });
      }

      scannedPackages.set(dep, {
        version: pkg.version || '0.0.0',
        license,
        source: 'INSTALLED_PACKAGE'
      });
    } catch (err) {
      console.warn(`Warning inspecting ${dep}: ${err.message}`);
    }
  }

  return {
    scannedPackages,
    violations,
    prodDepsCount: prodDeps.size,
    compliant: violations.length === 0
  };
}

const isDirectRun = Boolean(
  process.argv[1] &&
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(fileURLToPath(import.meta.url)).toLowerCase()
);

if (isDirectRun) {
  console.log('========================================================');
  console.log('        ALPER DESIGN OS - LICENSE COMPLIANCE AUDIT       ');
  console.log('========================================================\n');

  const result = auditWorkspaceLicenses(process.cwd());
  console.log(`Discovered ${result.prodDepsCount} external production runtime dependencies.`);
  console.log('Audited Packages:');
  for (const [name, meta] of result.scannedPackages.entries()) {
    console.log(` - ${name}@${meta.version} : [${meta.license}]`);
  }

  console.log('\n========================================================');
  console.log(`Total packages audited: ${result.scannedPackages.size}`);
  console.log(`Compliance violations:  ${result.violations.length}`);

  if (result.compliant) {
    console.log('STATUS: [COMPLIANT] 100% of runtime dependencies use verified permissive licenses.');
    console.log('LICENSE_COMPLIANCE_GATE: PASS');
    console.log('========================================================\n');
    process.exit(0);
  } else {
    console.error('STATUS: [NON-COMPLIANT] Prohibited or unverified licenses detected:');
    for (const v of result.violations) {
      console.error(` - ${v.package}@${v.version} -> ${v.license} (${v.reason})`);
    }
    console.log('LICENSE_COMPLIANCE_GATE: FAIL');
    console.log('========================================================\n');
    process.exit(1);
  }
}
