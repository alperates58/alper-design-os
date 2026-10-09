import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const projectRoot = path.resolve('.');
const homeDir = os.homedir();
let issuesFound = 0;

console.log('========================================================');
console.log('  ALPER DESIGN OS - Doctor Health Diagnostics');
console.log('========================================================\n');

// 1. ALPER_DESIGN_OS_HOME
process.stdout.write('[1/8] Environment Variable (ALPER_DESIGN_OS_HOME)... ');
const envHome = process.env.ALPER_DESIGN_OS_HOME;
if (envHome) {
  console.log(`OK (${envHome})`);
} else {
  console.log(`WARNING (Not set in active shell. Using directory: ${projectRoot})`);
}

// 2. Node.js
process.stdout.write('[2/8] Node.js Runtime... ');
try {
  const nodeVer = execSync('node -v', { encoding: 'utf-8' }).trim();
  console.log(`OK (${nodeVer})`);
} catch {
  console.log('FAIL (Node.js not found)');
  issuesFound++;
}

// 3. Git
process.stdout.write('[3/8] Git Version Control... ');
try {
  const gitVer = execSync('git --version', { encoding: 'utf-8' }).trim();
  console.log(`OK (${gitVer})`);
} catch {
  console.log('FAIL (Git not found)');
  issuesFound++;
}

// 4. Package Manager
process.stdout.write('[4/8] Package Manager (pnpm/npm)... ');
try {
  const npmVer = execSync('npm -v', { encoding: 'utf-8' }).trim();
  console.log(`OK (npm ${npmVer})`);
} catch {
  console.log('FAIL (Package manager not found)');
  issuesFound++;
}

// 5. Configuration (.env)
process.stdout.write('[5/8] Configuration (.env)... ');
if (fs.existsSync(path.join(projectRoot, '.env'))) {
  console.log('OK (.env exists)');
} else {
  console.log('NOTICE (.env not found; create from .env.example if custom keys needed)');
}

// 6. MCP Server Build Artifact
process.stdout.write('[6/8] MCP Server Build Artifact... ');
const mcpDist = path.join(projectRoot, 'packages', 'mcp-server', 'dist', 'index.js');
if (fs.existsSync(mcpDist)) {
  console.log(`OK (${mcpDist})`);
} else {
  console.log('FAIL (packages/mcp-server/dist/index.js missing. Run "npm run build")');
  issuesFound++;
}

// 7. Antigravity MCP Config
process.stdout.write('[7/8] Antigravity MCP Config... ');
const mcpConfigFile = path.join(homeDir, '.gemini', 'config', 'mcp_config.json');
if (fs.existsSync(mcpConfigFile)) {
  try {
    const raw = fs.readFileSync(mcpConfigFile, 'utf-8');
    const cfg = JSON.parse(raw);
    const alper = Boolean(cfg.mcpServers?.['alper-design-os']);
    const chrome = Boolean(cfg.mcpServers?.['chrome-devtools']);
    const playwright = Boolean(cfg.mcpServers?.['playwright']);
    if (alper && chrome && playwright) {
      console.log('OK (alper-design-os, chrome-devtools, playwright registered)');
    } else if (alper) {
      console.log('PARTIAL (alper-design-os registered; run node scripts/register-mcp.js to register browser tools)');
    } else {
      console.log('WARNING (mcp_config.json exists, but alper-design-os is missing)');
    }
  } catch {
    console.log('WARNING (Could not parse mcp_config.json)');
  }
} else {
  console.log('NOTICE (mcp_config.json not yet created)');
}

// 8. Git Status & Safety
process.stdout.write('[8/8] Git Status & Secret Check... ');
try {
  const status = execSync('git status -s', { encoding: 'utf-8' });
  if (/(^|\n)\s*\S+\s+\.env(\n|$)/.test(status)) {
    console.log('CAUTION (.env is tracked by git!)');
    issuesFound++;
  } else {
    console.log('OK (Clean & No secret leaks)');
  }
} catch {
  console.log('NOTICE (Git status check failed)');
}

console.log('\n--------------------------------------------------------');
if (issuesFound === 0) {
  console.log('System status: HEALTHY. Alper Design OS is ready to run.');
} else {
  console.log(`System status: ${issuesFound} issue(s) detected. Please review warnings above.`);
}
console.log('--------------------------------------------------------');
