import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * ALPER DESIGN OS - Release & Distribution Packager
 * Validates version consistency and generates pre-v1 distribution artifacts.
 */

export function computeFileSha256(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function validateVersionConsistency(repoRoot = '.') {
  const rootPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf-8'));
  const canonicalVersion = rootPkg.version;
  const discrepancies = [];

  // Check packages and adapters
  const checkDirs = [
    'packages/agent-governance',
    'packages/analyzer',
    'packages/design-language',
    'packages/engineering-guardrails',
    'packages/mcp-server',
    'packages/qa-engine',
    'packages/software-intelligence',
    'packages/source-intelligence',
    'adapters/aspnet-razor',
    'adapters/contract',
    'adapters/generic-web',
    'adapters/html-css-js',
    'adapters/laravel-blade',
    'adapters/php',
    'adapters/react-typescript',
    'adapters/react'
  ];

  for (const dir of checkDirs) {
    const pkgPath = path.join(repoRoot, dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.version !== canonicalVersion) {
        discrepancies.push({ file: pkgPath, expected: canonicalVersion, actual: pkg.version });
      }
    }
  }

  // Check environment-manifest.json
  const envManifestPath = path.join(repoRoot, 'environment-manifest.json');
  if (fs.existsSync(envManifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(envManifestPath, 'utf-8'));
    if (manifest.version !== canonicalVersion) {
      discrepancies.push({ file: envManifestPath, expected: canonicalVersion, actual: manifest.version });
    }
  }

  return {
    canonicalVersion,
    isConsistent: discrepancies.length === 0,
    discrepancies
  };
}

export async function packageDistribution(options = {}) {
  const repoRoot = options.repoRoot ? path.resolve(options.repoRoot) : path.resolve('.');
  console.log('========================================================');
  console.log('  ALPER DESIGN OS - Distribution Packaging');
  console.log('========================================================');

  // 1. Version Consistency Check
  console.log('[1/4] Checking version consistency across repository...');
  const verCheck = validateVersionConsistency(repoRoot);
  if (!verCheck.isConsistent) {
    console.error('FATAL: Version drift detected:');
    for (const d of verCheck.discrepancies) {
      console.error(` - ${d.file}: ${d.actual} (expected ${d.expected})`);
    }
    throw new Error('Version consistency validation failed.');
  }
  console.log(`      Canonical version is unified: ${verCheck.canonicalVersion}`);

  // 2. Prepare Distribution Output Directory
  const distDir = path.join(repoRoot, 'dist-release');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 3. Git Metadata
  let commitSha = 'unknown';
  try {
    commitSha = execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf-8' }).trim();
  } catch {}

  // 4. Generate Archive via git archive (pure, clean, ignores gitignored scratch)
  const archiveName = `alper-design-os-${verCheck.canonicalVersion}.tar.gz`;
  const archivePath = path.join(distDir, archiveName);
  console.log(`[2/4] Generating reproducible source archive: "${archiveName}"...`);

  try {
    execSync(`git archive --format=tar.gz --prefix=alper-design-os/ -o "${archivePath}" HEAD`, { cwd: repoRoot, stdio: 'pipe' });
    console.log(`      Source archive created (${archivePath})`);
  } catch (err) {
    console.error(`FATAL: git archive failed: ${err.message}`);
    throw new Error(`Failed to generate source archive via git archive: ${err.message}`);
  }

  if (!fs.existsSync(archivePath) || fs.statSync(archivePath).size === 0) {
    throw new Error(`Archive was not created or is empty at "${archivePath}"`);
  }

  // 5. Generate Release Manifest & SHA256 Checksums
  console.log('[3/4] Generating release manifest and SHA256 checksums...');
  const manifest = {
    name: 'alper-design-os',
    version: verCheck.canonicalVersion,
    stage: 'PRE_V1_DISTRIBUTION_CANDIDATE',
    commitSha,
    packagedAt: new Date().toISOString(),
    contracts: {
      canonicalMcpTools: 124,
      skills: {
        total: 74,
        active: 55,
        deprecated: 19
      },
      supportedStacks: [
        'REACT_TYPESCRIPT',
        'LARAVEL_BLADE',
        'ASPNET_RAZOR',
        'PLAIN_HTML_CSS_JS'
      ]
    },
    artifacts: []
  };

  const checksumLines = [];
  const sha = computeFileSha256(archivePath);
  const size = fs.statSync(archivePath).size;
  manifest.artifacts.push({
    file: archiveName,
    sizeBytes: size,
    sha256: sha
  });
  checksumLines.push(`${sha}  ${archiveName}`);

  // Generate and register SBOM in release artifacts
  const sbomPath = path.join(distDir, 'sbom.spdx.json');
  try {
    execSync('node scripts/generate-sbom.js', { cwd: repoRoot, stdio: 'pipe' });
    if (fs.existsSync(sbomPath)) {
      const sbomSha = computeFileSha256(sbomPath);
      const sbomSize = fs.statSync(sbomPath).size;
      manifest.artifacts.push({
        file: 'sbom.spdx.json',
        sizeBytes: sbomSize,
        sha256: sbomSha
      });
      checksumLines.push(`${sbomSha}  sbom.spdx.json`);
      console.log(`      SPDX 2.3 SBOM generated and included in distribution: ${sbomPath}`);
    }
  } catch (err) {
    console.warn(`Warning generating SBOM during packaging: ${err.message}`);
  }

  if (manifest.artifacts.length === 0 || checksumLines.length === 0) {
    throw new Error('No distribution artifacts were generated for release packaging.');
  }

  const manifestPath = path.join(distDir, 'release-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`      Manifest written to: ${manifestPath}`);

  const checksumsPath = path.join(distDir, 'checksums.txt');
  fs.writeFileSync(checksumsPath, checksumLines.join('\n') + '\n', 'utf-8');
  console.log(`      Checksums written to: ${checksumsPath}`);

  console.log('\n[4/4] Release packaging complete.');
  console.log(`Status: DISTRIBUTION_READY (Pre-v1 Candidate v${verCheck.canonicalVersion})`);
  console.log('Notice: Distribution artifacts prepared locally in dist-release/. No automatic public release created.');

  return {
    success: true,
    version: verCheck.canonicalVersion,
    manifestPath,
    archivePath,
    manifest
  };
}

// CLI Execution Entrypoint
const isDirectRun = Boolean(
  process.argv[1] &&
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(fileURLToPath(import.meta.url)).toLowerCase()
);

if (isDirectRun || process.argv.includes('--run-direct')) {
  packageDistribution().then(res => {
    console.log('\nPackage distribution finished successfully.');
    process.exit(0);
  }).catch(err => {
    console.error('Packaging error:', err);
    process.exit(1);
  });
}
