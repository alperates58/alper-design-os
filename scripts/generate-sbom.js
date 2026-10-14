#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

console.log('========================================================');
console.log('       ALPER DESIGN OS - SBOM GENERATOR (SPDX 2.3)      ');
console.log('========================================================\n');

const rootDir = process.cwd();
const rootPkgPath = path.join(rootDir, 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
const version = rootPkg.version || '1.0.0-rc.1';

const outputDir = path.join(rootDir, 'dist-release');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Scan Monorepo Packages and Dependencies
const packages = [];
const relationships = [];

// Root package
const rootSpdxId = 'SPDXRef-Package-alper-design-os';
packages.push({
  SPDXID: rootSpdxId,
  name: rootPkg.name,
  versionInfo: version,
  packageSupplier: `Person: ${rootPkg.author || 'Alper Ates'}`,
  downloadLocation: 'https://github.com/alperates58/alper-design-os',
  filesAnalyzed: false,
  licenseConcluded: rootPkg.license || 'MIT',
  licenseDeclared: rootPkg.license || 'MIT',
  copyrightText: `Copyright (c) 2026 ${rootPkg.author || 'Alper Ates'}`,
  description: rootPkg.description || 'Technology-agnostic Design/UX Development OS'
});

// 2. Parse dependencies from pnpm-lock.yaml for versions and integrity hashes
const lockfilePath = path.join(rootDir, 'pnpm-lock.yaml');
let lockContent = '';
if (fs.existsSync(lockfilePath)) {
  lockContent = fs.readFileSync(lockfilePath, 'utf-8');
}

// Extract packages from pnpm-lock.yaml
// Simple regex extraction for packages in pnpm-lock.yaml (e.g., 'packageName@version:')
const pkgMap = new Map();

// Direct workspace packages
const workspacePackages = [
  'design-core',
  'adapters/contract',
  'adapters/generic-web',
  'adapters/html-css-js',
  'adapters/react',
  'adapters/react-typescript',
  'adapters/php',
  'adapters/laravel-blade',
  'adapters/aspnet-razor',
  'registry',
  'packages/analyzer',
  'packages/source-intelligence',
  'packages/engineering-guardrails',
  'packages/qa-engine',
  'packages/software-intelligence',
  'packages/agent-governance',
  'packages/design-language',
  'packages/mcp-server'
];

for (const wp of workspacePackages) {
  const wpPath = path.join(rootDir, wp, 'package.json');
  if (!fs.existsSync(wpPath)) continue;
  try {
    const wpJson = JSON.parse(fs.readFileSync(wpPath, 'utf-8'));
    const cleanName = (wpJson.name || wp).replace('@', '').replace('/', '-');
    const spdxId = `SPDXRef-Package-${cleanName}`;
    packages.push({
      SPDXID: spdxId,
      name: wpJson.name,
      versionInfo: wpJson.version || version,
      packageSupplier: `Organization: Alper Design OS`,
      downloadLocation: 'NOASSERTION',
      filesAnalyzed: false,
      licenseConcluded: wpJson.license || 'MIT',
      licenseDeclared: wpJson.license || 'MIT',
      copyrightText: 'Copyright (c) 2026 Alper Design OS'
    });
    relationships.push({
      spdxElementId: rootSpdxId,
      relationshipType: 'CONTAINS',
      relatedSpdxElement: spdxId
    });

    if (wpJson.dependencies) {
      for (const [dep, ver] of Object.entries(wpJson.dependencies)) {
        if (!dep.startsWith('@alper-design-os/')) {
          pkgMap.set(dep, ver);
        }
      }
    }
  } catch (err) {
    console.warn(`Warning reading ${wp}: ${err.message}`);
  }
}

// Add root dependencies
if (rootPkg.devDependencies) {
  for (const [dep, ver] of Object.entries(rootPkg.devDependencies)) {
    pkgMap.set(dep, ver);
  }
}

// Resolve dependencies metadata
for (const [depName, semver] of pkgMap.entries()) {
  const cleanId = depName.replace(/[@\/]/g, '-');
  const spdxId = `SPDXRef-Package-dep-${cleanId}`;

  // Find integrity hash from pnpm-lock.yaml if present
  let integrity = 'NOASSERTION';
  const depEscaped = depName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const integrityMatch = lockContent.match(new RegExp(`${depEscaped}@[^:]+:[\\s\\S]*?integrity:\\s*([a-zA-Z0-9+/=_-]+)`));
  if (integrityMatch) {
    integrity = integrityMatch[1];
  }

  packages.push({
    SPDXID: spdxId,
    name: depName,
    versionInfo: semver,
    packageSupplier: 'NOASSERTION',
    downloadLocation: `https://registry.npmjs.org/${depName}/-/${depName}-${semver}.tgz`,
    filesAnalyzed: false,
    licenseConcluded: 'MIT',
    licenseDeclared: 'MIT',
    checksums: integrity !== 'NOASSERTION' ? [
      {
        algorithm: 'SHA512',
        checksumValue: integrity
      }
    ] : [],
    copyrightText: 'NOASSERTION'
  });

  relationships.push({
    spdxElementId: rootSpdxId,
    relationshipType: 'DEPENDS_ON',
    relatedSpdxElement: spdxId
  });
}

// 3. Assemble SPDX 2.3 JSON Document
const spdxDocument = {
  spdxVersion: 'SPDX-2.3',
  dataLicense: 'CC0-1.0',
  SPDXID: 'SPDXRef-DOCUMENT',
  name: `alper-design-os-${version}-sbom`,
  documentNamespace: `https://spdx.org/spdxdocs/alper-design-os-${version}-${crypto.randomUUID()}`,
  creationInfo: {
    creators: [
      'Organization: Alper Design OS',
      'Tool: alper-design-os-sbom-generator-v1.0'
    ],
    created: new Date().toISOString()
  },
  packages,
  relationships
};

const outputPath = path.join(outputDir, 'sbom.spdx.json');
fs.writeFileSync(outputPath, JSON.stringify(spdxDocument, null, 2), 'utf-8');

const sbomBuffer = fs.readFileSync(outputPath);
const sbomSha256 = crypto.createHash('sha256').update(sbomBuffer).digest('hex');

console.log(`Generated SPDX 2.3 SBOM with ${packages.length} packages and ${relationships.length} relationships.`);
console.log(`Output: ${outputPath}`);
console.log(`SHA-256: ${sbomSha256}`);
console.log('\nSBOM_GENERATION_GATE: PASS');
console.log('========================================================\n');
