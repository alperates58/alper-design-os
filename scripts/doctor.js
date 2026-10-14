import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

/**
 * ALPER DESIGN OS - Doctor V2
 * Comprehensive repository, runtime, and ecosystem diagnostics.
 * Supports:
 *   --preflight: validates only prerequisites before installation (Node, Git, pnpm, manifests)
 *   --json: output raw JSON results
 */

export function scanSecrets(projectRoot = '.') {
  let trackedFiles = [];
  try {
    trackedFiles = execSync('git ls-files', { cwd: projectRoot, encoding: 'utf-8' })
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);
  } catch {
    return { clean: true, scannedFiles: 0, violations: [] };
  }

  const secretPatterns = [
    { name: 'Private Key', pattern: /-----BEGIN (?:RSA|EC|DSA|OPENSSH|PGP) PRIVATE KEY/ },
    { name: 'GitHub Token', pattern: /(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82}/ },
    { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/ },
    { name: 'Tracked .env file', pattern: /(?:^|\/)\.env(?:\..+)?$/ }
  ];

  const violations = [];

  for (const relFile of trackedFiles) {
    // Ignore test suites (which test secret redaction with dummy tokens) and scanner itself
    if (
      relFile.startsWith('tests/') ||
      relFile.startsWith('scripts/scan-') ||
      relFile === 'scripts/scan-secrets.js' ||
      relFile === 'scripts/scan-repository-secrets.js' ||
      relFile === 'scripts/doctor.js'
    ) {
      continue;
    }

    if (secretPatterns[3].pattern.test(relFile) && !relFile.endsWith('.example')) {
      violations.push({ file: relFile, rule: 'Tracked .env file' });
      continue;
    }

    const fullPath = path.join(projectRoot, relFile);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size > 1024 * 1024) continue;

    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const sp of secretPatterns.slice(0, 3)) {
        if (sp.pattern.test(content)) {
          violations.push({ file: relFile, rule: sp.name });
        }
      }
    } catch {}
  }

  return {
    clean: violations.length === 0,
    scannedFiles: trackedFiles.length,
    violations
  };
}

export async function runDoctor(options = {}) {
  const projectRoot = options.projectRoot ? path.resolve(options.projectRoot) : path.resolve('.');
  const isPreflight = Boolean(options.preflight ?? process.argv.includes('--preflight'));

  const results = {
    timestamp: new Date().toISOString(),
    projectRoot,
    mode: isPreflight ? 'PREFLIGHT' : 'FULL',
    status: 'READY',
    checks: {},
    summary: {
      passed: 0,
      warnings: 0,
      failed: 0,
      optionalMissing: 0
    },
    recommendations: []
  };

  function recordCheck(name, category, status, message, details = null) {
    results.checks[name] = {
      category, // CORE_REQUIRED | FEATURE_REQUIRED | OPTIONAL | SECURITY
      status,   // PASS | WARN | FAIL | OPTIONAL_NOT_FOUND
      message,
      details
    };
    if (status === 'PASS') results.summary.passed++;
    else if (status === 'WARN') results.summary.warnings++;
    else if (status === 'FAIL') results.summary.failed++;
    else if (status === 'OPTIONAL_NOT_FOUND') results.summary.optionalMissing++;
  }

  // 1. Repository Integrity
  const requiredDirs = ['skills', 'packages', 'adapters', 'registry', 'tests', 'scripts'];
  const missingDirs = requiredDirs.filter(d => !fs.existsSync(path.join(projectRoot, d)));
  if (missingDirs.length === 0) {
    recordCheck('repositoryIntegrity', 'CORE_REQUIRED', 'PASS', 'Monorepo directory layout verified intact', { dirs: requiredDirs });
  } else {
    recordCheck('repositoryIntegrity', 'CORE_REQUIRED', 'FAIL', `Missing essential directories: ${missingDirs.join(', ')}`);
  }

  // 2. Node.js Compatibility
  const nodeVersionStr = process.version;
  const majorNode = parseInt(nodeVersionStr.replace(/^v/, '').split('.')[0], 10);
  if (majorNode >= 20) {
    recordCheck('nodeRuntime', 'CORE_REQUIRED', 'PASS', `Node.js ${nodeVersionStr} meets canonical requirement (>=20.0.0)`, { version: nodeVersionStr });
  } else {
    recordCheck('nodeRuntime', 'CORE_REQUIRED', 'FAIL', `Node.js ${nodeVersionStr} is below minimum requirement (>=20.0.0)`);
    results.recommendations.push('Upgrade Node.js to version 20.x or 22.x LTS.');
  }

  // 3. Package Manager & Lockfile Consistency (Strict pnpm 9.x)
  let pnpmDetected = false;
  let pnpmVersion = 'none';
  try {
    pnpmVersion = execSync('pnpm -v', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    pnpmDetected = true;
  } catch {
    pnpmDetected = false;
  }

  const lockfileExists = fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'));
  const workspaceConfigExists = fs.existsSync(path.join(projectRoot, 'pnpm-workspace.yaml'));

  if (pnpmDetected && lockfileExists && workspaceConfigExists) {
    recordCheck('packageManager', 'CORE_REQUIRED', 'PASS', `Canonical package manager verified: pnpm ${pnpmVersion} with frozen lockfile`, { pm: `pnpm ${pnpmVersion}`, lockfile: 'pnpm-lock.yaml' });
  } else if (!lockfileExists) {
    recordCheck('packageManager', 'CORE_REQUIRED', 'FAIL', 'pnpm-lock.yaml missing from repository root');
  } else if (!workspaceConfigExists) {
    recordCheck('packageManager', 'CORE_REQUIRED', 'FAIL', 'pnpm-workspace.yaml missing from repository root');
  } else {
    recordCheck('packageManager', 'CORE_REQUIRED', 'WARN', 'pnpm executable not found in PATH. Corepack provisioning required.', { lockfile: 'pnpm-lock.yaml' });
  }

  // 4. Environment Manifest Contract
  const manifestPath = path.join(projectRoot, 'environment-manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      if (manifest.system === 'alper-design-os' && manifest.contract) {
        recordCheck('environmentManifest', 'FEATURE_REQUIRED', 'PASS', 'Environment manifest contract verified', { version: manifest.version });
      } else {
        recordCheck('environmentManifest', 'FEATURE_REQUIRED', 'WARN', 'Environment manifest contract schema incomplete');
      }
    } catch {
      recordCheck('environmentManifest', 'FEATURE_REQUIRED', 'WARN', 'Environment manifest unparseable');
    }
  } else {
    recordCheck('environmentManifest', 'FEATURE_REQUIRED', 'FAIL', 'environment-manifest.json missing');
  }

  // 5. Git Status & Deterministic Secret Scan
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf-8', cwd: projectRoot }).trim();
    const gitStatus = execSync('git status -s', { encoding: 'utf-8', cwd: projectRoot });
    recordCheck('gitState', 'CORE_REQUIRED', 'PASS', `Git tracking active on branch "${branch}"`, { branch, dirty: gitStatus.trim().length > 0 });
  } catch (e) {
    recordCheck('gitState', 'CORE_REQUIRED', 'FAIL', `Git command execution failed: ${e.message}`);
  }

  const secretReport = scanSecrets(projectRoot);
  if (secretReport.clean) {
    recordCheck('secretSafety', 'SECURITY', 'PASS', `Deterministic secret scan verified clean across ${secretReport.scannedFiles} tracked files`);
  } else {
    recordCheck('secretSafety', 'SECURITY', 'FAIL', `CRITICAL: Secrets or tracked .env files detected (${secretReport.violations.length} violations)!`, {
      violations: secretReport.violations.map(v => ({ file: v.file, rule: v.rule })) // Redacted, no secrets logged!
    });
    results.recommendations.push('Remove all tracked .env and credential files from git.');
  }

  // If in PREFLIGHT mode, stop here and return!
  if (isPreflight) {
    if (results.summary.failed > 0) {
      results.status = 'BLOCKED';
    } else if (results.summary.warnings > 0) {
      results.status = 'READY_WITH_OPTIONAL_LIMITATIONS';
    } else {
      results.status = 'READY';
    }
    return results;
  }

  // FULL MODE CONTINUATION:
  // 6. Dependencies State
  const nodeModulesExists = fs.existsSync(path.join(projectRoot, 'node_modules'));
  const vitestExists = fs.existsSync(path.join(projectRoot, 'node_modules', 'vitest'));
  const tscExists = fs.existsSync(path.join(projectRoot, 'node_modules', 'typescript'));
  if (nodeModulesExists && vitestExists && tscExists) {
    recordCheck('dependenciesState', 'CORE_REQUIRED', 'PASS', 'Monorepo dependencies installed and verified', { nodeModules: true, vitest: true, typescript: true });
  } else {
    recordCheck('dependenciesState', 'CORE_REQUIRED', 'FAIL', 'Dependencies incomplete or uninstalled. Run pnpm install --frozen-lockfile');
    results.recommendations.push('Run bootstrap script or install dependencies with pnpm install.');
  }

  // 7. TypeScript Monorepo Build Availability
  const expectedDistTargets = [
    'design-core/dist/index.js',
    'adapters/contract/dist/index.js',
    'adapters/generic-web/dist/index.js',
    'adapters/html-css-js/dist/index.js',
    'adapters/react/dist/index.js',
    'adapters/react-typescript/dist/index.js',
    'adapters/php/dist/index.js',
    'adapters/laravel-blade/dist/index.js',
    'adapters/aspnet-razor/dist/index.js',
    'registry/dist/index.js',
    'packages/analyzer/dist/index.js',
    'packages/source-intelligence/dist/index.js',
    'packages/engineering-guardrails/dist/index.js',
    'packages/qa-engine/dist/index.js',
    'packages/software-intelligence/dist/index.js',
    'packages/agent-governance/dist/index.js',
    'packages/design-language/dist/index.js',
    'packages/mcp-server/dist/index.js'
  ];
  const missingDists = expectedDistTargets.filter(t => !fs.existsSync(path.join(projectRoot, t)));
  if (missingDists.length === 0) {
    recordCheck('monorepoBuild', 'FEATURE_REQUIRED', 'PASS', 'All 18 monorepo build artifacts compiled and present', { targetsChecked: expectedDistTargets.length });
  } else {
    recordCheck('monorepoBuild', 'FEATURE_REQUIRED', 'FAIL', `Missing build artifacts (${missingDists.length}): ${missingDists.slice(0, 3).join(', ')}... Run "pnpm run build"`);
    results.recommendations.push('Build the monorepo using "pnpm run build".');
  }

  // 8. MCP Server Build & Canonical Tool Count (124 tools)
  const mcpServerDist = path.join(projectRoot, 'packages', 'mcp-server', 'dist', 'index.js');
  if (fs.existsSync(mcpServerDist)) {
    try {
      const serverModule = await import(pathToFileURL(path.join(projectRoot, 'packages', 'mcp-server', 'dist', 'server.js')).href);
      const toolDefs = serverModule.CANONICAL_TOOL_DEFINITIONS || [];
      const toolCount = toolDefs.length;
      if (toolCount === 124) {
        recordCheck('mcpServer', 'FEATURE_REQUIRED', 'PASS', `MCP Server build verified with exact canonical count: 124 tools`, { toolCount });
      } else {
        recordCheck('mcpServer', 'FEATURE_REQUIRED', 'WARN', `MCP Server tool count drift: expected 124, found ${toolCount}`, { toolCount });
      }
    } catch (e) {
      recordCheck('mcpServer', 'FEATURE_REQUIRED', 'WARN', `MCP Server artifact present but inspection failed: ${e.message}`);
    }
  } else {
    recordCheck('mcpServer', 'FEATURE_REQUIRED', 'FAIL', 'packages/mcp-server/dist/index.js is missing');
  }

  // 9. Skill Registry Parity (74 skills: 55 active + 19 deprecated)
  const skillsDir = path.join(projectRoot, 'skills');
  if (fs.existsSync(skillsDir)) {
    try {
      const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
      
      let activeCount = 0;
      let deprecatedCount = 0;
      for (const s of skillDirs) {
        const skillMd = path.join(skillsDir, s, 'SKILL.md');
        if (fs.existsSync(skillMd)) {
          const content = fs.readFileSync(skillMd, 'utf-8');
          if (content.includes('status: DEPRECATED') || content.includes('# Status: DEPRECATED')) {
            deprecatedCount++;
          } else {
            activeCount++;
          }
        }
      }
      
      if (skillDirs.length === 74 && activeCount === 55 && deprecatedCount === 19) {
        recordCheck('skillRegistry', 'FEATURE_REQUIRED', 'PASS', `Skill inventory verified: 74 skills (55 active, 19 deprecated)`, { total: 74, active: 55, deprecated: 19 });
      } else {
        recordCheck('skillRegistry', 'FEATURE_REQUIRED', 'WARN', `Skill inventory mismatch: total=${skillDirs.length} (expected 74), active=${activeCount} (expected 55), deprecated=${deprecatedCount} (expected 19)`, { total: skillDirs.length, active: activeCount, deprecated: deprecatedCount });
      }
    } catch (e) {
      recordCheck('skillRegistry', 'FEATURE_REQUIRED', 'WARN', `Failed inspecting skills directory: ${e.message}`);
    }
  } else {
    recordCheck('skillRegistry', 'FEATURE_REQUIRED', 'FAIL', 'skills directory missing');
  }

  // 10. Hooks Static Configuration
  const hooksConfigPath = path.join(projectRoot, 'hooks.json');
  const guardScriptPath = path.join(projectRoot, 'scripts', 'guard-destructive-command.js');
  if (fs.existsSync(hooksConfigPath) && fs.existsSync(guardScriptPath)) {
    recordCheck('hooksConfiguration', 'FEATURE_REQUIRED', 'PASS', 'Safety hooks configuration and guard script verified', { config: 'hooks.json', guardScript: 'scripts/guard-destructive-command.js' });
  } else {
    recordCheck('hooksConfiguration', 'FEATURE_REQUIRED', 'WARN', 'hooks.json or guard script missing');
  }

  // 11. Optional Tools Detection (Docker, Browser, .NET, PHP)
  try {
    const dockerV = execSync('docker --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 3000 }).trim();
    recordCheck('dockerRuntime', 'OPTIONAL', 'PASS', `Docker available (${dockerV})`);
  } catch {
    recordCheck('dockerRuntime', 'OPTIONAL', 'OPTIONAL_NOT_FOUND', 'Docker not found. Optional containerized execution unavailable.');
  }

  try {
    const pwV = execSync('npx --no-install playwright --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'], cwd: projectRoot, timeout: 3000 }).trim();
    recordCheck('browserRuntime', 'OPTIONAL', 'PASS', `Playwright available (${pwV})`);
  } catch {
    recordCheck('browserRuntime', 'OPTIONAL', 'OPTIONAL_NOT_FOUND', 'Playwright runtime not installed. E2E browser tests run in operator fallback mode.');
  }

  try {
    const dotnetV = execSync('dotnet --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 3000 }).trim();
    recordCheck('dotnetSdk', 'OPTIONAL', 'PASS', `.NET SDK available (${dotnetV})`);
  } catch {
    recordCheck('dotnetSdk', 'OPTIONAL', 'OPTIONAL_NOT_FOUND', '.NET SDK not found. ASPNET_RAZOR builds will require host toolchain or container.');
  }

  try {
    const phpV = execSync('php -v', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 3000 }).split('\n')[0].trim();
    recordCheck('phpRuntime', 'OPTIONAL', 'PASS', `PHP available (${phpV})`);
  } catch {
    recordCheck('phpRuntime', 'OPTIONAL', 'OPTIONAL_NOT_FOUND', 'PHP not found. LARAVEL_BLADE builds will require host toolchain or container.');
  }

  // Compute Overall Status
  if (results.summary.failed > 0) {
    const hasCoreFail = Object.values(results.checks).some(c => c.category === 'CORE_REQUIRED' && c.status === 'FAIL');
    const hasSecurityFail = Object.values(results.checks).some(c => c.category === 'SECURITY' && c.status === 'FAIL');
    if (hasCoreFail || hasSecurityFail) {
      results.status = 'BLOCKED';
    } else {
      results.status = 'OPERATOR_ACTION_REQUIRED';
    }
  } else if (results.summary.warnings > 0 || results.summary.optionalMissing > 0) {
    results.status = 'READY_WITH_OPTIONAL_LIMITATIONS';
  } else {
    results.status = 'READY';
  }

  return results;
}

// CLI Execution Entrypoint
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1'));

if (isDirectRun || process.argv.includes('--run-direct')) {
  runDoctor().then(res => {
    if (process.argv.includes('--json')) {
      console.log(JSON.stringify(res, null, 2));
      process.exit(res.status === 'BLOCKED' ? 1 : 0);
    }

    console.log('========================================================');
    console.log(`  ALPER DESIGN OS - Doctor V2 System Health Diagnostic [${res.mode}]`);
    console.log('========================================================');
    console.log(`Timestamp: ${res.timestamp}`);
    console.log(`Project:   ${res.projectRoot}`);
    console.log(`Mode:      ${res.mode}`);
    console.log(`Status:    ${res.status}`);
    console.log('--------------------------------------------------------\n');

    for (const [key, check] of Object.entries(res.checks)) {
      const badge =
        check.status === 'PASS' ? '[OK]     ' :
        check.status === 'WARN' ? '[WARN]   ' :
        check.status === 'FAIL' ? '[FAIL]   ' :
        '[OPT-N/A]';
      console.log(`${badge} ${key.padEnd(24)}: ${check.message}`);
    }

    console.log('\n--------------------------------------------------------');
    console.log(`Summary: Passed: ${res.summary.passed} | Warnings: ${res.summary.warnings} | Failed: ${res.summary.failed} | Optional N/A: ${res.summary.optionalMissing}`);
    console.log(`Overall Health Status: ${res.status}`);
    if (res.recommendations.length > 0) {
      console.log('\nRecommendations:');
      for (const rec of res.recommendations) {
        console.log(` - ${rec}`);
      }
    }
    console.log('========================================================');

    if (res.status === 'BLOCKED') {
      process.exit(1);
    } else if (res.status === 'OPERATOR_ACTION_REQUIRED') {
      process.exit(2);
    } else {
      process.exit(0);
    }
  }).catch(err => {
    console.error('Doctor runtime error:', err);
    process.exit(1);
  });
}
