import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

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
  const projectRoot = options.projectRoot ? path.resolve(options.projectRoot) : path.resolve('.');
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
  if (fs.existsSync(configFile)) {
    try {
      const raw = fs.readFileSync(configFile, 'utf-8');
      config = JSON.parse(raw);
      if (!config.mcpServers) config.mcpServers = {};

      // Backup existing config
      const backupFile = `${configFile}.bak.${Date.now()}`;
      fs.writeFileSync(backupFile, raw, 'utf-8');
      console.log(`[+] Backed up existing Antigravity MCP config to: ${backupFile}`);
    } catch {
      console.warn('[!] Failed to parse existing config, creating fresh structure.');
      config = { mcpServers: {} };
    }
  }

  // Register CANONICAL ALPER DESIGN OS server
  config.mcpServers['alper-design-os'] = {
    command: 'node',
    args: [path.join(projectRoot, 'packages', 'mcp-server', 'dist', 'index.js')],
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

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`[+] Successfully registered 'alper-design-os' in: ${configFile}`);

  return {
    success: true,
    configFile,
    servers: Object.keys(config.mcpServers)
  };
}

// CLI Execution Entrypoint
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1'));

if (isDirectRun) {
  try {
    registerMcp();
  } catch (err) {
    console.error('MCP registration failed:', err.message);
    process.exit(1);
  }
}
