import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { runDoctor } from '../scripts/doctor.js';
import { validateVersionConsistency, computeFileSha256 } from '../scripts/package-distribution.js';
import { safeUpdate } from '../scripts/safe-update.js';
import { installFromRepository } from '../scripts/install-from-repo.js';
import { verifyGeneratedBuilds } from '../scripts/verify-generated-builds.js';

describe('Phase 1I: Portability, CI/CD, Bootstrap & Distribution V1', () => {
  const repoRoot = path.resolve('.');

  // 1. Environment Manifest Contract
  it('1. validates environment-manifest.json machine-readable compatibility contract', () => {
    const manifestPath = path.join(repoRoot, 'environment-manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const rootPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf-8'));
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.system).toBe('alper-design-os');
    expect(manifest.version).toBe(rootPkg.version);
    expect(manifest.contract).toBeDefined();

    const { coreRequired, featureRequired, optional, operatorFallback } = manifest.contract;
    expect(coreRequired.some((c: any) => c.id === 'node')).toBe(true);
    expect(coreRequired.some((c: any) => c.id === 'git')).toBe(true);
    expect(coreRequired.some((c: any) => c.id === 'packageManager')).toBe(true);

    expect(featureRequired.some((c: any) => c.id === 'typescript')).toBe(true);
    expect(featureRequired.some((c: any) => c.id === 'vitest')).toBe(true);

    expect(optional.some((c: any) => c.id === 'dotnet')).toBe(true);
    expect(optional.some((c: any) => c.id === 'php')).toBe(true);
    expect(optional.some((c: any) => c.id === 'docker')).toBe(true);
    expect(optional.some((c: any) => c.id === 'playwright')).toBe(true);

    expect(operatorFallback.strategy).toBe('MANUAL_RUN_BUNDLE');
    expect(operatorFallback.model).toBe('OPERATOR_ASSISTED_EXECUTION');
  });

  // 2. Package Manager & Engine Pinning
  it('2. validates canonical package-manager pinning and Node engine contract in package.json', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf-8'));
    expect(pkg.packageManager).toBe('pnpm@9.15.4');
    expect(pkg.engines.node).toBe('>=20.0.0');
    expect(pkg.pnpm.onlyBuiltDependencies).toContain('esbuild');
  });

  // 3. Monorepo Version Consistency
  it('3. validates zero version drift across all monorepo packages, adapters, and manifests', () => {
    const rootPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf-8'));
    const result = validateVersionConsistency(repoRoot);
    expect(result.isConsistent).toBe(true);
    expect(result.canonicalVersion).toBe(rootPkg.version);
    expect(result.discrepancies.length).toBe(0);
  });

  // 4. Doctor V2 System Health Diagnostic
  it('4. executes Doctor V2 and validates repository integrity, tool count, and skill inventory', async () => {
    const doc = await runDoctor({ projectRoot: repoRoot });
    expect(doc.status).toMatch(/^READY/);
    expect(doc.checks.repositoryIntegrity.status).toBe('PASS');
    expect(doc.checks.nodeRuntime.status).toBe('PASS');
    expect(doc.checks.monorepoBuild.status).toBe('PASS');
    expect(doc.checks.mcpServer.status).toBe('PASS');
    expect(doc.checks.mcpServer.details.toolCount).toBe(124);
    expect(doc.checks.skillRegistry.status).toBe('PASS');
    expect(doc.checks.skillRegistry.details.total).toBe(74);
    expect(doc.checks.skillRegistry.details.active).toBe(55);
    expect(doc.checks.skillRegistry.details.deprecated).toBe(19);
    expect(doc.checks.secretSafety.status).toBe('PASS');
  });

  // 5. Safe Update Dirty-Worktree Protection
  it('5. strictly prevents non-destructive updates when dirty workspace files are detected', async () => {
    // Test safe update dirty check guard
    const fakeDirtyFile = path.join(repoRoot, 'uncommitted-dirty-test-file.tmp');
    fs.writeFileSync(fakeDirtyFile, 'dirty content', 'utf-8');

    try {
      const updateRes = await safeUpdate({ repoRoot });
      expect(updateRes.success).toBe(false);
      expect(updateRes.status).toBe('DIRTY_WORKTREE_ABORTED');
      expect(updateRes.message).toContain('Aborted due to uncommitted local changes');
    } finally {
      if (fs.existsSync(fakeDirtyFile)) {
        fs.unlinkSync(fakeDirtyFile);
      }
    }
  });

  // 6. Install from Repository URL Validation
  it('6. validates URL formatting and safely guards existing non-empty targets', async () => {
    // 1. Rejects invalid protocols
    await expect(installFromRepository({ repoUrl: 'ftp://bad-url.com/repo' }))
      .rejects.toThrow(/Invalid repository URL/);

    // 2. Refuses to overwrite unrelated non-empty directories
    const nonGitDir = path.join(repoRoot, 'tests', 'fixtures');
    const result = await installFromRepository({
      repoUrl: 'https://github.com/alperates58/alper-design-os.git',
      targetDir: nonGitDir
    });
    expect(result.success).toBe(false);
    expect(result.status).toBe('DIRECTORY_NOT_EMPTY');
  });

  // 7. Portable Paths Audit
  it('7. verifies no hardcoded machine-specific Windows paths exist in package production source', () => {
    const srcDirs = ['packages', 'adapters', 'registry'];
    const forbiddenPatterns = [
      /C:\\Users\\/i,
      /\/Users\/[a-zA-Z0-9_-]+\//,
      /alper\.ates\.LIDER/i
    ];

    const violations: { file: string; line: number; match: string }[] = [];

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
            scanDir(fullPath);
          }
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
          const lines = fs.readFileSync(fullPath, 'utf-8').split('\n');
          lines.forEach((line, idx) => {
            for (const pattern of forbiddenPatterns) {
              if (pattern.test(line)) {
                violations.push({ file: fullPath, line: idx + 1, match: line.trim() });
              }
            }
          });
        }
      }
    }

    for (const d of srcDirs) {
      scanDir(path.join(repoRoot, d));
    }

    expect(violations).toEqual([]);
  });

  // 8. Secret Redaction & Version Control Safety
  it('8. verifies .env is gitignored and not tracked by git', () => {
    const gitignore = fs.readFileSync(path.join(repoRoot, '.gitignore'), 'utf-8');
    expect(gitignore).toContain('.env');
    expect(gitignore).toContain('.env.local');

    // Verify .env does not exist or is not tracked
    const envExists = fs.existsSync(path.join(repoRoot, '.env'));
    if (envExists) {
      const { execSync } = require('node:child_process');
      const tracked = execSync('git ls-files .env', { cwd: repoRoot, encoding: 'utf-8' }).trim();
      expect(tracked).toBe('');
    }
  });

  // 9. Release Manifest & Distribution Artifact
  it('9. verifies distribution packaging generates valid release-manifest and SHA256 checksums', async () => {
    const { packageDistribution } = await import('../scripts/package-distribution.js');
    const packResult = await packageDistribution({ repoRoot });
    expect(packResult.success).toBe(true);

    const manifestPath = path.join(repoRoot, 'dist-release', 'release-manifest.json');
    const checksumsPath = path.join(repoRoot, 'dist-release', 'checksums.txt');

    expect(fs.existsSync(manifestPath)).toBe(true);
    expect(fs.existsSync(checksumsPath)).toBe(true);

    const rootPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf-8'));
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.version).toBe(rootPkg.version);
    expect(manifest.contracts.canonicalMcpTools).toBe(124);
    expect(manifest.contracts.skills.total).toBe(74);
    expect(manifest.contracts.skills.active).toBe(55);
    expect(manifest.contracts.skills.deprecated).toBe(19);

    const checksumContent = fs.readFileSync(checksumsPath, 'utf-8');
    expect(checksumContent.length).toBeGreaterThan(0);
    expect(checksumContent).toContain(`alper-design-os-${rootPkg.version}.tar.gz`);
  });

  // 10. Generated Project Native Build Evidence Ingestion
  it('10. verifies generated project build matrix produces verifiable evidence records across all 4 stacks', async () => {
    const { execSync } = await import('node:child_process');
    const summary = await verifyGeneratedBuilds({ repoRoot });
    expect(summary.totalStacks).toBe(4);
    expect(summary.results.length).toBe(4);

    const plainRes = summary.results.find(r => r.stack === 'PLAIN_HTML_CSS_JS');
    expect(plainRes).toBeDefined();
    expect(plainRes?.evidenceKind).toBe('STATIC_ANALYSIS');
    expect(plainRes?.verificationStatus).toBe('VERIFIED');

    const reactRes = summary.results.find(r => r.stack === 'REACT_TYPESCRIPT');
    expect(reactRes).toBeDefined();
    expect(reactRes?.evidenceKind).toBe('STATIC_ANALYSIS');
    expect(reactRes?.verificationStatus).toBe('VERIFIED');

    // Optional toolchain detection
    let hasPhp = false;
    try {
      execSync('php -v', { stdio: 'pipe' });
      hasPhp = true;
    } catch {}

    const laravelRes = summary.results.find(r => r.stack === 'LARAVEL_BLADE');
    expect(laravelRes).toBeDefined();
    expect(laravelRes?.evidenceKind).toBe('STATIC_ANALYSIS');
    if (hasPhp) {
      expect(laravelRes?.verificationStatus).toBe('VERIFIED');
    }

    let hasDotnet = false;
    try {
      execSync('dotnet --version', { stdio: 'pipe' });
      hasDotnet = true;
    } catch {}

    const aspnetRes = summary.results.find(r => r.stack === 'ASPNET_RAZOR');
    expect(aspnetRes).toBeDefined();
    expect(aspnetRes?.evidenceKind).toBe('STATIC_ANALYSIS');
    if (hasDotnet) {
      expect(aspnetRes?.verificationStatus).toBe('VERIFIED');
    }

    if (hasPhp && hasDotnet) {
      expect(summary.globalDebtStatus).toBe('VERIFIED');
      expect(summary.allVerified).toBe(true);
    } else {
      expect(['PARTIALLY_VERIFIED', 'NOT_VERIFIED']).toContain(summary.globalDebtStatus);
      expect(summary.allVerified).toBe(false);
    }
  }, 60000);

  // 11. Doctor Preflight Mode
  it('11. verifies doctor --preflight checks prerequisites without requiring build artifacts', async () => {
    const doc = await runDoctor({ projectRoot: repoRoot, preflight: true });
    expect(doc.mode).toBe('PREFLIGHT');
    expect(doc.status).toMatch(/^READY/);
    expect(doc.checks.repositoryIntegrity.status).toBe('PASS');
    expect(doc.checks.nodeRuntime.status).toBe('PASS');
    expect(doc.checks.environmentManifest.status).toBe('PASS');
    expect(doc.checks.secretSafety.status).toBe('PASS');
    // Preflight does not require built mcpServer or dist files
    expect(doc.checks.mcpServer).toBeUndefined();
    expect(doc.checks.monorepoBuild).toBeUndefined();
  });

  // 12. Register MCP Scoping & Pinned Opt-in Dependencies
  it('12. verifies registerMcp registers only alper-design-os by default and pins optional tools without @latest', async () => {
    const { registerMcp } = await import('../scripts/register-mcp.js');
    const tempDir = path.join(repoRoot, 'tests', 'workspaces', 'temp-mcp-test');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    try {
      // Default: Only alper-design-os in local .agents/
      const resDefault = registerMcp({ projectRoot: tempDir, args: [] });
      expect(resDefault.success).toBe(true);
      expect(resDefault.configFile).toBe(path.join(tempDir, '.agents', 'mcp_config.json'));
      expect(resDefault.servers).toEqual(['alper-design-os']);

      const cfgDefault = JSON.parse(fs.readFileSync(resDefault.configFile, 'utf-8'));
      expect(cfgDefault.mcpServers['alper-design-os']).toBeDefined();
      expect(cfgDefault.mcpServers['chrome-devtools']).toBeUndefined();
      expect(cfgDefault.mcpServers['playwright']).toBeUndefined();

      // Opt-in: Includes pinned versions, never @latest
      const resOptIn = registerMcp({
        projectRoot: tempDir,
        withDevtools: true,
        withPlaywright: true,
        args: []
      });
      expect(resOptIn.servers).toContain('chrome-devtools');
      expect(resOptIn.servers).toContain('playwright');

      const cfgOptIn = JSON.parse(fs.readFileSync(resOptIn.configFile, 'utf-8'));
      const devtoolsArgs = cfgOptIn.mcpServers['chrome-devtools'].args.join(' ');
      const playwrightArgs = cfgOptIn.mcpServers['playwright'].args.join(' ');

      expect(devtoolsArgs).toContain('0.12.0');
      expect(devtoolsArgs).not.toContain('@latest');
      expect(playwrightArgs).toContain('0.0.6');
      expect(playwrightArgs).not.toContain('@latest');
    } finally {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  // 13. Package Distribution Fail-Closed
  it('13. verifies packageDistribution throws and fails closed when git archive is missing or invalid', async () => {
    const { packageDistribution } = await import('../scripts/package-distribution.js');
    // Calling packageDistribution on non-git directory must fail closed
    const nonGitDir = path.join(repoRoot, 'tests', 'fixtures');
    await expect(packageDistribution({ repoRoot: nonGitDir })).rejects.toThrow();
  });
});
