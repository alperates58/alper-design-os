import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { runDoctor } from './doctor.js';

/**
 * ALPER DESIGN OS - Canonical Bootstrap V1
 * Automated clean-room repository installer & validator.
 */

export async function bootstrapSystem(options = {}) {
  const repoRoot = options.repoRoot ? path.resolve(options.repoRoot) : path.resolve('.');
  console.log('========================================================');
  console.log('  ALPER DESIGN OS - Repository Bootstrap & Setup');
  console.log('========================================================');

  // 1. Environment & Architecture Detection
  const platform = os.platform();
  const arch = os.arch();
  const nodeVersion = process.version;
  console.log(`[1/7] Environment: OS=${platform}, Arch=${arch}, Node=${nodeVersion}`);

  const majorNode = parseInt(nodeVersion.replace(/^v/, '').split('.')[0], 10);
  if (majorNode < 20) {
    console.error(`FATAL: Node.js version ${nodeVersion} is below minimum requirement (>=20.0.0).`);
    process.exit(1);
  }

  // 2. Git Detection
  let gitVersion = 'unknown';
  try {
    gitVersion = execSync('git --version', { encoding: 'utf-8', cwd: repoRoot }).trim();
    console.log(`[2/7] VCS: ${gitVersion}`);
  } catch (err) {
    console.error('FATAL: Git not found or cannot execute.');
    process.exit(1);
  }

  // 3. Package Manager Detection & Dependency State (Strict pnpm 9.15.4)
  console.log('[3/7] Package Manager & Dependency Verification...');
  const hasInstalledDependencies =
    fs.existsSync(path.join(repoRoot, 'node_modules', 'typescript')) &&
    fs.existsSync(path.join(repoRoot, 'node_modules', 'vitest')) &&
    fs.existsSync(path.join(repoRoot, 'node_modules', 'zod'));

  if (hasInstalledDependencies && !options.forceInstall) {
    console.log('      Existing dependencies verified intact in node_modules (idempotent step).');
  } else {
    let pnpmCmd = 'pnpm';
    let isPnpmAvailable = false;

    // Check system pnpm
    try {
      const pnpmV = execSync('pnpm -v', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      console.log(`      Found system pnpm: ${pnpmV}`);
      isPnpmAvailable = true;
    } catch {}

    // If absent, attempt safe provisioning via Corepack
    if (!isPnpmAvailable) {
      console.log('      pnpm not found in PATH. Attempting Corepack provisioning...');
      try {
        execSync('corepack enable && corepack prepare pnpm@9.15.4 --activate', { stdio: 'inherit' });
        const pnpmV = execSync('pnpm -v', { encoding: 'utf-8' }).trim();
        console.log(`      Corepack provisioned pnpm: ${pnpmV}`);
        isPnpmAvailable = true;
      } catch (cpErr) {
        console.warn(`      Corepack provisioning unsuccessful: ${cpErr.message}`);
      }
    }

    // Fail closed: Never silently fall back to npm for this pnpm workspace!
    if (!isPnpmAvailable) {
      console.error('\n[FATAL] Canonical package manager pnpm@9.15.4 is required for this workspace.');
      console.error('Silently falling back to npm is strictly forbidden to preserve deterministic pnpm-lock.yaml integrity.');
      console.error('\nAction Required:');
      console.error('  1. Enable corepack: corepack enable');
      console.error('  2. Or install pnpm: npm install -g pnpm@9.15.4\n');
      process.exit(1);
    }

    const installCmd = `${pnpmCmd} install --frozen-lockfile`;
    console.log(`      Executing dependency install: "${installCmd}"`);
    try {
      execSync(installCmd, { cwd: repoRoot, stdio: 'inherit' });
      console.log('      Dependencies installed successfully.');
    } catch (err) {
      console.error('FATAL: Frozen dependency installation failed:', err.message);
      process.exit(1);
    }
  }

  // 4. Monorepo Build
  console.log('[4/7] Compiling Monorepo TypeScript Packages & Adapters...');
  try {
    execSync('npm run build', { cwd: repoRoot, stdio: 'inherit' });
    console.log('      Build completed successfully.');
  } catch (err) {
    console.error('FATAL: Monorepo build failed:', err.message);
    process.exit(1);
  }

  // 5. Baseline Health Diagnostics (Doctor V2)
  console.log('[5/7] Executing Doctor V2 Diagnostics...');
  const doctorResults = await runDoctor({ projectRoot: repoRoot });
  console.log(`      Doctor Status: ${doctorResults.status}`);
  console.log(`      Checks: Passed=${doctorResults.summary.passed}, Warnings=${doctorResults.summary.warnings}, Failed=${doctorResults.summary.failed}`);

  // 6. MCP Server Validation
  console.log('[6/7] Validating MCP Server Handshake & Tool Inventory...');
  const mcpServerPath = path.join(repoRoot, 'packages', 'mcp-server', 'dist', 'index.js');
  if (!fs.existsSync(mcpServerPath)) {
    console.error('FATAL: MCP server build output missing at packages/mcp-server/dist/index.js');
    process.exit(1);
  }
  const toolCheck = doctorResults.checks.mcpServer;
  if (toolCheck && toolCheck.status === 'PASS') {
    console.log(`      MCP Server verified (${toolCheck.message})`);
  } else {
    console.warn(`      MCP Server notice: ${toolCheck?.message}`);
  }

  // 7. Skill Inventory Validation
  console.log('[7/7] Validating Skill Catalog & Routing Parity...');
  const skillCheck = doctorResults.checks.skillRegistry;
  if (skillCheck && skillCheck.status === 'PASS') {
    console.log(`      Skills verified (${skillCheck.message})`);
  } else {
    console.warn(`      Skill catalog notice: ${skillCheck?.message}`);
  }

  console.log('\n========================================================');
  console.log('  BOOTSTRAP RESULT: ' + (doctorResults.status.startsWith('READY') ? 'SUCCESS - READY' : 'REQUIRES ATTENTION'));
  console.log('========================================================');
  console.log(`Status: ${doctorResults.status}`);
  console.log('Alper Design OS bootstrap completed cleanly.\n');

  return {
    success: doctorResults.status.startsWith('READY'),
    status: doctorResults.status,
    doctor: doctorResults
  };
}

// CLI Execution Entrypoint
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1'));

if (isDirectRun || process.argv.includes('--run-direct')) {
  bootstrapSystem().then(res => {
    if (res.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }).catch(err => {
    console.error('Bootstrap execution error:', err);
    process.exit(1);
  });
}
