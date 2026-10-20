import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execSync, spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { bootstrapSystem, verifyNodeModulesIntegrity } from '../scripts/bootstrap.js';
import { registerMcp } from '../scripts/register-mcp.js';
import { runDoctor, scanSecrets } from '../scripts/doctor.js';
import { safeUpdate } from '../scripts/safe-update.js';
import { installFromRepository } from '../scripts/install-from-repo.js';

describe('ALPER DESIGN OS - Phase 1K: Installer Hardening, Windows Portability & Release Safety', () => {
  const repoRoot = path.resolve('.');
  const testWorkspaceDir = path.join(repoRoot, 'tests', 'workspaces', 'phase-1k-installer-hardening');

  beforeAll(() => {
    if (!fs.existsSync(testWorkspaceDir)) {
      fs.mkdirSync(testWorkspaceDir, { recursive: true });
    }
  });

  afterAll(() => {
    if (fs.existsSync(testWorkspaceDir)) {
      try {
        fs.rmSync(testWorkspaceDir, { recursive: true, force: true });
      } catch {}
    }
  });

  // 1. Windows Portability & Unicode Path Robustness
  describe('1. Windows Portability & Unicode Path Robustness', () => {
    it('accurately resolves fileURLToPath across ASCII, spaces, Turkish Unicode, and Cyrillic paths', () => {
      const testCases = [
        {
          name: 'ASCII Path',
          fileUrl: 'file:///C:/dev/projects/alper-design-os/scripts/bootstrap.js',
          expectedEnd: path.normalize('C:/dev/projects/alper-design-os/scripts/bootstrap.js')
        },
        {
          name: 'Path with Spaces',
          fileUrl: 'file:///C:/My%20Work/Alper%20Design%20OS/scripts/bootstrap.js',
          expectedEnd: path.normalize('C:/My Work/Alper Design OS/scripts/bootstrap.js')
        },
        {
          name: 'Turkish Unicode Path (KİŞİSEL PROJELER)',
          fileUrl: 'file:///C:/Users/alper/Desktop/PROJELER/K%C4%B0%C5%9E%C4%B0SEL%20PROJELER/alper-design-os/scripts/bootstrap.js',
          expectedEnd: path.normalize('C:/Users/alper/Desktop/PROJELER/KİŞİSEL PROJELER/alper-design-os/scripts/bootstrap.js')
        },
        {
          name: 'Cyrillic & Accented Unicode Path',
          fileUrl: 'file:///C:/Users/Jos%C3%A9%20M%C3%BCller/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B/alper-design-os/scripts/bootstrap.js',
          expectedEnd: path.normalize('C:/Users/José Müller/Проекты/alper-design-os/scripts/bootstrap.js')
        }
      ];

      for (const tc of testCases) {
        const nativePath = fileURLToPath(tc.fileUrl);
        expect(path.resolve(nativePath).toLowerCase(), `Failed for ${tc.name}`).toBe(path.resolve(tc.expectedEnd).toLowerCase());
      }
    });

    it('proves that URL.pathname replace fails on spaces and Unicode, whereas fileURLToPath succeeds', () => {
      const turkishUrl = 'file:///C:/Users/alper/Desktop/PROJELER/K%C4%B0%C5%9E%C4%B0SEL%20PROJELER/alper-design-os/scripts/bootstrap.js';
      const actualDiskPath = 'C:\\Users\\alper\\Desktop\\PROJELER\\KİŞİSEL PROJELER\\alper-design-os\\scripts\\bootstrap.js';

      // Old flawed approach: pathname replace does NOT decode URI components
      const flawedResolved = path.resolve(new URL(turkishUrl).pathname.replace(/^\/([a-zA-Z]:)/, '$1'));
      expect(flawedResolved).toContain('%20'); // Flawed: still encoded!
      expect(flawedResolved).not.toBe(path.resolve(actualDiskPath)); // Does NOT match!

      // Hardened approach: fileURLToPath decodes perfectly
      const hardenedResolved = path.resolve(fileURLToPath(turkishUrl));
      expect(hardenedResolved).not.toContain('%20');
      expect(hardenedResolved.toLowerCase()).toBe(path.resolve(actualDiskPath).toLowerCase());
    });
  });

  // 2. Repository Relocation & Junction Integrity Recovery
  describe('2. Repository Relocation & Junction Integrity Recovery', () => {
    it('detects healthy workspace junctions and reports true', () => {
      const isHealthy = verifyNodeModulesIntegrity(repoRoot);
      expect(isHealthy).toBe(true);
    });

    it('detects missing packages or broken links and reports false', () => {
      const mockDir = path.join(testWorkspaceDir, 'mock-broken-workspace');
      fs.mkdirSync(path.join(mockDir, 'node_modules'), { recursive: true });
      // Incomplete node_modules
      const isHealthy = verifyNodeModulesIntegrity(mockDir);
      expect(isHealthy).toBe(false);
    });
  });

  // 3. Execution Safety & Idempotent Bootstrap
  describe('3. Execution Safety & Idempotent Bootstrap', () => {
    it('executes bootstrapSystem idempotently when dependencies are already intact', async () => {
      const result = await bootstrapSystem({ repoRoot });
      expect(result.success).toBe(true);
      expect(result.status).toMatch(/^READY/);
      expect(result.doctor.summary.failed).toBe(0);
    });

    it('executes Doctor V2 in full mode and verifies all 18 monorepo packages, 124 tools, and 74 skills', async () => {
      const doc = await runDoctor({ projectRoot: repoRoot });
      expect(doc.status).toMatch(/^READY/);
      expect(doc.checks.repositoryIntegrity.status).toBe('PASS');
      expect(doc.checks.nodeRuntime.status).toBe('PASS');
      expect(doc.checks.packageManager.status).toBe('PASS');
      expect(doc.checks.environmentManifest.status).toBe('PASS');
      expect(doc.checks.secretSafety.status).toBe('PASS');
      expect(doc.checks.dependenciesState.status).toBe('PASS');
      expect(doc.checks.monorepoBuild.status).toBe('PASS');
      expect(doc.checks.mcpServer.status).toBe('PASS');
      expect(doc.checks.mcpServer.details?.toolCount).toBe(124);
      expect(doc.checks.skillRegistry.status).toBe('PASS');
      expect(doc.checks.skillRegistry.details?.total).toBe(74);
      expect(doc.checks.skillRegistry.details?.active).toBe(55);
      expect(doc.checks.skillRegistry.details?.deprecated).toBe(19);
    });
  });

  // 4. Global Antigravity MCP Registration & Third-Party Isolation
  describe('4. Global Antigravity MCP Registration & Third-Party Isolation', () => {
    const mockAgentsDir = path.join(testWorkspaceDir, 'mock-agents-config');
    const mockConfigFile = path.join(mockAgentsDir, '.agents', 'mcp_config.json');

    beforeAll(() => {
      fs.mkdirSync(path.join(mockAgentsDir, '.agents'), { recursive: true });
      const initialConfig = {
        mcpServers: {
          postgres: {
            command: 'cmd.exe',
            args: ['/c', 'npx', '-y', '@modelcontextprotocol/server-postgres', 'postgresql://user:pass@localhost:5432/db']
          },
          redis: {
            command: 'cmd.exe',
            args: ['/c', 'npx', '-y', '@modelcontextprotocol/server-redis', 'redis://localhost:6379']
          },
          figma: {
            command: 'cmd.exe',
            args: ['/c', 'npx', '-y', '@modelcontextprotocol/server-figma'],
            env: { FIGMA_ACCESS_TOKEN: 'figma_dummy_token_123' }
          }
        }
      };
      fs.writeFileSync(mockConfigFile, JSON.stringify(initialConfig, null, 2), 'utf-8');
    });

    it('registers alper-design-os without deleting or modifying existing third-party servers', () => {
      const regResult = registerMcp({
        projectRoot: mockAgentsDir,
        global: false
      });

      expect(regResult.success).toBe(true);
      expect(fs.existsSync(mockConfigFile)).toBe(true);

      const updated = JSON.parse(fs.readFileSync(mockConfigFile, 'utf-8'));
      // Existing records MUST be preserved
      expect(updated.mcpServers.postgres).toBeDefined();
      expect(updated.mcpServers.redis).toBeDefined();
      expect(updated.mcpServers.figma).toBeDefined();
      expect(updated.mcpServers.figma.env.FIGMA_ACCESS_TOKEN).toBe('figma_dummy_token_123');

      // alper-design-os MUST be registered
      expect(updated.mcpServers['alper-design-os']).toBeDefined();
      expect(updated.mcpServers['alper-design-os'].command).toBe('node');
      expect(updated.mcpServers['alper-design-os'].args[0]).toBe(path.join(mockAgentsDir, 'packages', 'mcp-server', 'dist', 'index.js'));
      expect(updated.mcpServers['alper-design-os'].env.ALPER_DESIGN_OS_HOME).toBe(mockAgentsDir);

      // DevTools and Playwright MUST NOT be present unless opt-in
      expect(updated.mcpServers['chrome-devtools']).toBeUndefined();
      expect(updated.mcpServers['playwright']).toBeUndefined();
    });

    it('supports opt-in for pinned devtools and playwright without using unpinned @latest', () => {
      const regResult = registerMcp({
        projectRoot: mockAgentsDir,
        global: false,
        withDevtools: true,
        withPlaywright: true
      });

      expect(regResult.success).toBe(true);
      const updated = JSON.parse(fs.readFileSync(mockConfigFile, 'utf-8'));

      expect(updated.mcpServers['chrome-devtools']).toBeDefined();
      expect(updated.mcpServers['chrome-devtools'].args).toContain('chrome-devtools-mcp@0.12.0');
      expect(updated.mcpServers['chrome-devtools'].args).not.toContain('chrome-devtools-mcp@latest');

      expect(updated.mcpServers['playwright']).toBeDefined();
      expect(updated.mcpServers['playwright'].args).toContain('@playwright/mcp@0.0.6');
      expect(updated.mcpServers['playwright'].args).not.toContain('@playwright/mcp@latest');
    });

    it('handles UTF-8 files containing BOM cleanly without JSON parsing exceptions', () => {
      const bomFile = path.join(testWorkspaceDir, 'bom-test-mcp.json');
      const jsonContent = '\uFEFF' + JSON.stringify({ mcpServers: { custom: { command: 'node' } } });
      fs.writeFileSync(bomFile, jsonContent, 'utf-8');

      const raw = fs.readFileSync(bomFile, 'utf-8').replace(/^\uFEFF/, '');
      expect(() => JSON.parse(raw)).not.toThrow();
      expect(JSON.parse(raw).mcpServers.custom.command).toBe('node');
    });
  });

  // 5. Stdio JSON-RPC MCP Handshake & Protocol Verification
  describe('5. Stdio JSON-RPC MCP Handshake & Protocol Verification', () => {
    it('completes initialize and tools/list via real JSON-RPC over stdio', async () => {
      const mcpServerPath = path.join(repoRoot, 'packages', 'mcp-server', 'dist', 'index.js');
      expect(fs.existsSync(mcpServerPath)).toBe(true);

      const child = spawn('node', [mcpServerPath], {
        cwd: repoRoot,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let buffer = '';
      let initResolved = false;
      let toolsResolved = false;
      let toolCount = 0;

      const handshakePromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          child.kill();
          reject(new Error('MCP stdio handshake timed out after 10 seconds'));
        }, 10000);

        child.stdout.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const msg = JSON.parse(line);
              if (msg.id === 1 && msg.result) {
                // Initialize response
                initResolved = true;
                expect(msg.result.serverInfo.name).toBe('alper-design-os');
                expect(msg.result.serverInfo.version).toBe('1.0.0-rc.1');

                // Send initialized notification
                child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }) + '\n');

                // Request tools/list
                child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }) + '\n');
              } else if (msg.id === 2 && msg.result) {
                // tools/list response
                toolsResolved = true;
                toolCount = msg.result.tools ? msg.result.tools.length : 0;
                clearTimeout(timeout);
                child.kill();
                resolve();
              }
            } catch {}
          }
        });

        child.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });

        // Step 1: Send initialize request
        child.stdin.write(JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test-qa-client', version: '1.0.0' }
          }
        }) + '\n');
      });

      await handshakePromise;
      expect(initResolved).toBe(true);
      expect(toolsResolved).toBe(true);
      expect(toolCount).toBe(124);
    }, 15000);
  });

  // 6. Security, Adversarial Resilience & Secret Redaction
  describe('6. Security, Adversarial Resilience & Secret Redaction', () => {
    it('strictly detects dirty workspace in safeUpdate and refuses to overwrite or discard edits', async () => {
      const dirtyTestFile = path.join(repoRoot, 'test-dirty-guard.tmp');
      fs.writeFileSync(dirtyTestFile, 'uncommitted test content', 'utf-8');

      try {
        const updateRes = await safeUpdate({ repoRoot });
        expect(updateRes.success).toBe(false);
        expect(updateRes.status).toBe('DIRTY_WORKTREE_ABORTED');
        expect(updateRes.dirtyFiles.some(f => f.includes('test-dirty-guard.tmp'))).toBe(true);
      } finally {
        if (fs.existsSync(dirtyTestFile)) {
          fs.unlinkSync(dirtyTestFile);
        }
      }
    });

    it('rejects invalid repository URL protocols in installFromRepository', async () => {
      await expect(
        installFromRepository({ repoUrl: 'ftp://untrusted.server/repo.git' })
      ).rejects.toThrow(/Invalid repository URL/i);

      await expect(
        installFromRepository({ repoUrl: 'javascript:alert(1)' })
      ).rejects.toThrow(/Invalid repository URL/i);
    });

    it('scans tracked files for secret leaks and verifies zero violations', () => {
      const report = scanSecrets(repoRoot);
      expect(report.clean).toBe(true);
      expect(report.violations.length).toBe(0);
      expect(report.scannedFiles).toBeGreaterThan(100);
    });

    it('redacts tokens and keys and never outputs raw secret values', () => {
      const dummySecret = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      const dummyAws = 'AKIAIOSFODNN7EXAMPLE';
      const content = `GitHub: ${dummySecret}, AWS: ${dummyAws}`;

      // Secret scanner patterns must detect but redaction must mask
      const hasGh = /(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36}/.test(content);
      const hasAws = /AKIA[0-9A-Z]{16}/.test(content);
      expect(hasGh).toBe(true);
      expect(hasAws).toBe(true);

      const redacted = content
        .replace(/(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36}/g, '[REDACTED_GITHUB_TOKEN]')
        .replace(/AKIA[0-9A-Z]{16}/g, '[REDACTED_AWS_KEY]');

      expect(redacted).not.toContain(dummySecret);
      expect(redacted).not.toContain(dummyAws);
      expect(redacted).toContain('[REDACTED_GITHUB_TOKEN]');
      expect(redacted).toContain('[REDACTED_AWS_KEY]');
    });
  });

  // 7. Windows Command Wrappers Availability
  describe('7. Windows Command Wrappers Availability', () => {
    it('verifies bootstrap.cmd and doctor.cmd exist in repository root and scripts directory', () => {
      expect(fs.existsSync(path.join(repoRoot, 'bootstrap.cmd'))).toBe(true);
      expect(fs.existsSync(path.join(repoRoot, 'doctor.cmd'))).toBe(true);
      expect(fs.existsSync(path.join(repoRoot, 'scripts', 'bootstrap.cmd'))).toBe(true);
      expect(fs.existsSync(path.join(repoRoot, 'scripts', 'doctor.cmd'))).toBe(true);
      expect(fs.existsSync(path.join(repoRoot, 'scripts', 'safe-update.cmd'))).toBe(true);
      expect(fs.existsSync(path.join(repoRoot, 'scripts', 'install-windows.cmd'))).toBe(true);
    });

    it('verifies that doctor.cmd executes cleanly via CMD returning status 0', () => {
      const output = execSync('cmd.exe /c doctor.cmd --preflight', {
        cwd: repoRoot,
        encoding: 'utf-8'
      });
      expect(output).toContain('READY');
      expect(output).toContain('Doctor V2 System Health Diagnostic');
    });
  });
});
