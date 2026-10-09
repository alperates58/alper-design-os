import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const projectRoot = path.resolve('.');
const homeDir = os.homedir();
const antigravityConfigDir = path.join(homeDir, '.gemini', 'config');
const mcpConfigFile = path.join(antigravityConfigDir, 'mcp_config.json');

if (!fs.existsSync(antigravityConfigDir)) {
  fs.mkdirSync(antigravityConfigDir, { recursive: true });
}

let config = { mcpServers: {} };
if (fs.existsSync(mcpConfigFile)) {
  try {
    const raw = fs.readFileSync(mcpConfigFile, 'utf-8');
    config = JSON.parse(raw);
    if (!config.mcpServers) config.mcpServers = {};
    
    // Backup
    const backupFile = `${mcpConfigFile}.bak.${Date.now()}`;
    fs.writeFileSync(backupFile, raw, 'utf-8');
    console.log(`[+] Backed up existing Antigravity MCP config to: ${backupFile}`);
  } catch (e) {
    console.warn('[!] Failed to parse existing config, creating fresh structure.');
    config = { mcpServers: {} };
  }
}

config.mcpServers['alper-design-os'] = {
  command: 'node',
  args: [path.join(projectRoot, 'packages', 'mcp-server', 'dist', 'index.js')],
  env: {
    NODE_ENV: 'production',
    ALPER_DESIGN_OS_HOME: projectRoot
  }
};

config.mcpServers['chrome-devtools'] = {
  command: 'npx',
  args: ['-y', 'chrome-devtools-mcp@latest']
};

config.mcpServers['playwright'] = {
  command: 'npx',
  args: ['-y', '@playwright/mcp@latest']
};

fs.writeFileSync(mcpConfigFile, JSON.stringify(config, null, 2), 'utf-8');
console.log(`[+] Successfully registered 'alper-design-os', 'chrome-devtools', and 'playwright' in ${mcpConfigFile}`);
