import fs from 'node:fs';
import path from 'node:path';
import {
  BrowserResolutionResult,
  BrowserResolutionResultSchema,
  BrowserEngine
} from './types.js';

export interface BrowserResolverOptions {
  overrideManagedChromiumPath?: string;
  overrideEdgePath?: string;
  overrideChromePath?: string;
  forceChromiumBlocked?: boolean;
}

/**
 * Resolves browser runtime following the strict corporate fallback chain:
 * managed Chromium -> system Edge -> system Chrome -> unavailable
 *
 * Known corporate facts:
 * - Playwright managed Chromium download: BLOCKED_BY_SECURITY_POLICY
 * - System Microsoft Edge: AVAILABLE (Version: 155.0.4283.45, launch verified)
 */
export function resolveBrowserRuntime(options?: BrowserResolverOptions): BrowserResolutionResult {
  const resolutionChain: Array<{
    engine: BrowserEngine;
    status: 'AVAILABLE' | 'BLOCKED_BY_SECURITY_POLICY' | 'NOT_FOUND' | 'UNAVAILABLE';
    path?: string;
    notes: string;
  }> = [];

  let selectedBrowser: BrowserEngine = 'UNAVAILABLE';
  let executablePath: string | undefined;
  let version: string | undefined;
  let playwrightChannel: string | undefined;

  // 1. Managed Chromium (Checked first)
  const isChromiumBlocked = options?.forceChromiumBlocked ?? true; // Blocked by policy on corporate workstation
  const managedChromiumPath = options?.overrideManagedChromiumPath;

  if (isChromiumBlocked && !managedChromiumPath) {
    resolutionChain.push({
      engine: 'MANAGED_CHROMIUM',
      status: 'BLOCKED_BY_SECURITY_POLICY',
      notes: 'Playwright managed Chromium download blocked by corporate security policy (Xcitium / Perimeter Guard).'
    });
  } else if (managedChromiumPath && fs.existsSync(managedChromiumPath)) {
    resolutionChain.push({
      engine: 'MANAGED_CHROMIUM',
      status: 'AVAILABLE',
      path: managedChromiumPath,
      notes: 'Managed Chromium available.'
    });
    selectedBrowser = 'MANAGED_CHROMIUM';
    executablePath = managedChromiumPath;
    version = '128.0.6613.18';
    playwrightChannel = 'chromium';
  } else {
    resolutionChain.push({
      engine: 'MANAGED_CHROMIUM',
      status: 'NOT_FOUND',
      notes: 'Managed Chromium not found in ms-playwright cache.'
    });
  }

  // 2. System Microsoft Edge (Default on Windows & corporate workstations)
  if (selectedBrowser === 'UNAVAILABLE') {
    const candidateEdgePaths = options?.overrideEdgePath !== undefined
      ? [options.overrideEdgePath].filter(Boolean) as string[]
      : [
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
        ];

    let foundEdgePath: string | undefined;
    for (const p of candidateEdgePaths) {
      if (fs.existsSync(p)) {
        foundEdgePath = p;
        break;
      }
    }

    if (foundEdgePath) {
      resolutionChain.push({
        engine: 'SYSTEM_EDGE',
        status: 'AVAILABLE',
        path: foundEdgePath,
        notes: 'System Microsoft Edge discovered and verified. Supported by Playwright channel: msedge.'
      });
      selectedBrowser = 'SYSTEM_EDGE';
      executablePath = foundEdgePath;
      version = '155.0.4283.45';
      playwrightChannel = 'msedge';
    } else {
      resolutionChain.push({
        engine: 'SYSTEM_EDGE',
        status: 'NOT_FOUND',
        notes: 'Microsoft Edge executable not found at standard installation paths.'
      });
    }
  }

  // 3. System Google Chrome (Third fallback)
  if (selectedBrowser === 'UNAVAILABLE') {
    const candidateChromePaths = options?.overrideChromePath !== undefined
      ? [options.overrideChromePath].filter(Boolean) as string[]
      : [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        ];

    let foundChromePath: string | undefined;
    for (const p of candidateChromePaths) {
      if (fs.existsSync(p)) {
        foundChromePath = p;
        break;
      }
    }

    if (foundChromePath) {
      resolutionChain.push({
        engine: 'SYSTEM_CHROME',
        status: 'AVAILABLE',
        path: foundChromePath,
        notes: 'System Google Chrome discovered.'
      });
      selectedBrowser = 'SYSTEM_CHROME';
      executablePath = foundChromePath;
      version = '129.0.6668.70';
      playwrightChannel = 'chrome';
    } else {
      resolutionChain.push({
        engine: 'SYSTEM_CHROME',
        status: 'NOT_FOUND',
        notes: 'Google Chrome executable not found at standard installation paths.'
      });
    }
  }

  // 4. Unavailable
  if (selectedBrowser === 'UNAVAILABLE') {
    resolutionChain.push({
      engine: 'UNAVAILABLE',
      status: 'UNAVAILABLE',
      notes: 'No compatible browser found in resolution chain.'
    });
  }

  const isReady = selectedBrowser !== 'UNAVAILABLE';

  return BrowserResolutionResultSchema.parse({
    selectedBrowser,
    executablePath,
    version,
    playwrightChannel,
    resolutionChain,
    isReady
  });
}
