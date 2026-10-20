import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

/**
 * ALPER DESIGN OS - Antigravity MCP Registration
 * Registers the alper-design-os MCP server into Antigravity configuration.
 * By default registers ONLY alper-design-os into repository-scoped .agents/mcp_config.json.
 * Optional flags:
 *   --global          Write to ~/.gemini/config/mcp_config.json
 *   --with-devtools   Include pinned chrome-devtools-mcp
 *   --with-playwright Include pinned @playwright/mcp
 */

export function registerMcp(options = {}) {
  const projectRoot = options.projectRoot ? path.resolve(options.repoRoot || options.projectRoot) : path.resolve('.');
  const args = options.args || process.argv.slice(2);
  const isGlobal = options.global ?? args.includes('--global');
  const withDevtools = options.withDevtools ?? args.includes('--with-devtools');
  const withPlaywright = options.withPlaywright ?? args.includes('--with-playwright');

  const configDir = isGlobal
    ? path.join(os.homedir(), '.gemini', 'config')
    : path.join(projectRoot, '.agents');

  const configFile = path.join(configDir, 'mcp_config.json');

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  let config = { mcpServers: {} };
  let originalRaw = null;
  if (fs.existsSync(configFile)) {
    try {
      const raw = fs.readFileSync(configFile, 'utf-8').replace(/^\uFEFF/, '');
      originalRaw = raw;
      config = JSON.parse(raw);
      if (!config.mcpServers || typeof config.mcpServers !== 'object') {
        config.mcpServers = {};
      }
    } catch {
      console.warn('[!] Failed to parse existing config, creating fresh structure.');
      config = { mcpServers: {} };
    }
  }

  // Register CANONICAL ALPER DESIGN OS server ONLY
  const mcpServerPath = path.join(projectRoot, 'packages', 'mcp-server', 'dist', 'index.js');
  config.mcpServers['alper-design-os'] = {
    command: 'node',
    args: [mcpServerPath],
    env: {
      NODE_ENV: 'production',
      ALPER_DESIGN_OS_HOME: projectRoot
    }
  };

  // Optional tool hooks (strictly opt-in with pinned reviewed versions)
  if (withDevtools) {
    config.mcpServers['chrome-devtools'] = {
      command: 'npx',
      args: ['-y', 'chrome-devtools-mcp@0.12.0']
    };
    console.log('[+] Registered optional chrome-devtools-mcp (pinned v0.12.0)');
  }

  if (withPlaywright) {
    config.mcpServers['playwright'] = {
      command: 'npx',
      args: ['-y', '@playwright/mcp@0.0.6']
    };
    console.log('[+] Registered optional @playwright/mcp (pinned v0.0.6)');
  }

  const newContent = JSON.stringify(config, null, 2);

  // Backup existing config only if meaningful changes were made
  if (originalRaw && originalRaw !== newContent) {
    const backupFile = `${configFile}.bak.${Date.now()}`;
    fs.writeFileSync(backupFile, originalRaw, 'utf-8');
    console.log(`[+] Backed up existing Antigravity MCP config to: ${backupFile}`);
  }

  fs.writeFileSync(configFile, newContent, 'utf-8');
  console.log(`[+] Successfully registered 'alper-design-os' in: ${configFile}`);

  return {
    success: true,
    configFile,
    servers: Object.keys(config.mcpServers)
  };
}

// CLI Execution Entrypoint
const isDirectRun = Boolean(
  process.argv[1] &&
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(fileURLToPath(import.meta.url)).toLowerCase()
);

if (isDirectRun || process.argv.includes('--run-direct')) {
  try {
    registerMcp();
  } catch (err) {
    console.error('MCP registration failed:', err.message);
    process.exit(1);
  }
}
