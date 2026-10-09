import { execSync } from 'node:child_process';
import { ToolCapability } from '../types.js';

interface ToolDefinition {
  id: string;
  name: string;
  category: string;
  checkCommands: string[];
  installRecommendation: string;
}

const TOOLS_TO_DETECT: ToolDefinition[] = [
  {
    id: 'chrome',
    name: 'Google Chrome Browser',
    category: 'RUNTIME_BROWSER',
    checkCommands: ['google-chrome --version', 'chrome --version', 'which google-chrome', 'where chrome'],
    installRecommendation: 'Install Google Chrome from https://www.google.com/chrome/'
  },
  {
    id: 'chrome-devtools-mcp',
    name: 'Chrome DevTools MCP Server',
    category: 'MCP_BROWSER',
    checkCommands: ['npx --no-install chrome-devtools-mcp --version'],
    installRecommendation: 'Configure in mcp_config.json: "command": "npx", "args": ["-y", "chrome-devtools-mcp@latest"]'
  },
  {
    id: 'playwright-mcp',
    name: 'Microsoft Playwright MCP Server',
    category: 'MCP_BROWSER',
    checkCommands: ['npx --no-install @playwright/mcp --version'],
    installRecommendation: 'Configure in mcp_config.json: "command": "npx", "args": ["@playwright/mcp@latest"]'
  },
  {
    id: 'playwright-test',
    name: 'Playwright Test Framework',
    category: 'E2E_TESTING',
    checkCommands: ['npx playwright --version'],
    installRecommendation: 'Run: npm install -D @playwright/test && npx playwright install'
  },
  {
    id: 'axe-core',
    name: 'axe-core Accessibility Engine',
    category: 'ACCESSIBILITY',
    checkCommands: ['node -e "require(\'@axe-core/playwright\')"', 'npm list @axe-core/playwright', 'npm list axe-core'],
    installRecommendation: 'Run: npm install -D @axe-core/playwright axe-core'
  },
  {
    id: 'lighthouse',
    name: 'Google Lighthouse CLI',
    category: 'PERFORMANCE',
    checkCommands: ['lighthouse --version', 'npx lighthouse --version'],
    installRecommendation: 'Run: npm install -D lighthouse'
  },
  {
    id: 'lighthouse-ci',
    name: 'Lighthouse CI',
    category: 'PERFORMANCE',
    checkCommands: ['lhci --version', 'npx @lhci/cli --version'],
    installRecommendation: 'Run: npm install -D @lhci/cli'
  },
  {
    id: 'k6',
    name: 'Grafana k6 Load Testing Engine',
    category: 'LOAD_TESTING',
    checkCommands: ['k6 version'],
    installRecommendation: 'Install k6 from https://k6.io/docs/get-started/installation/'
  },
  {
    id: 'storybook',
    name: 'Storybook Component Workshop',
    category: 'COMPONENT_TESTING',
    checkCommands: ['npx storybook --version'],
    installRecommendation: 'Run: npx storybook@latest init'
  },
  {
    id: 'vitest',
    name: 'Vitest Test Runner',
    category: 'UNIT_TESTING',
    checkCommands: ['vitest --version', 'npx vitest --version'],
    installRecommendation: 'Run: npm install -D vitest'
  },
  {
    id: 'pact',
    name: 'Pact Contract Testing Framework',
    category: 'CONTRACT_TESTING',
    checkCommands: ['npx @pact-foundation/pact --version'],
    installRecommendation: 'Run: npm install -D @pact-foundation/pact'
  },
  {
    id: 'owasp-zap',
    name: 'OWASP ZAP Dynamic Application Security Scanner',
    category: 'DAST',
    checkCommands: ['zap.sh -version', 'zap.bat -version'],
    installRecommendation: 'Install OWASP ZAP from https://www.zaproxy.org/download/'
  },
  {
    id: 'semgrep',
    name: 'Semgrep CE Static Analysis Engine',
    category: 'SAST',
    checkCommands: ['semgrep --version'],
    installRecommendation: 'Run: pip install semgrep or brew install semgrep'
  },
  {
    id: 'trivy',
    name: 'Aqua Security Trivy Vulnerability Scanner',
    category: 'SCA',
    checkCommands: ['trivy --version'],
    installRecommendation: 'Install Trivy from https://aquasecurity.github.io/trivy/'
  },
  {
    id: 'osv-scanner',
    name: 'Google OSV-Scanner Open Source Vulnerabilities',
    category: 'SCA',
    checkCommands: ['osv-scanner --version'],
    installRecommendation: 'Install OSV-Scanner: go install github.com/google/osv-scanner/cmd/osv-scanner@v1'
  }
];

export function detectToolCapabilitySync(toolDef: ToolDefinition): ToolCapability {
  for (const cmd of toolDef.checkCommands) {
    try {
      const output = execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], timeout: 2000 })
        .toString()
        .trim();
      if (output) {
        return {
          toolId: toolDef.id,
          name: toolDef.name,
          category: toolDef.category,
          status: 'AVAILABLE',
          version: output.split('\n')[0]?.substring(0, 50)
        };
      }
    } catch {
      // Command failed or timed out, try next check
    }
  }

  return {
    toolId: toolDef.id,
    name: toolDef.name,
    category: toolDef.category,
    status: 'MISSING',
    installRecommendation: toolDef.installRecommendation,
    missingReason: `Executable command not found on PATH or local node_modules.`
  };
}

export function detectAllToolCapabilities(): ToolCapability[] {
  return TOOLS_TO_DETECT.map((toolDef) => detectToolCapabilitySync(toolDef));
}

export function getToolCapability(toolId: string): ToolCapability {
  const found = TOOLS_TO_DETECT.find((t) => t.id === toolId);
  if (!found) {
    return {
      toolId,
      name: toolId,
      category: 'UNKNOWN',
      status: 'UNSUPPORTED',
      missingReason: `Tool ${toolId} is not in the recognized Alper Design OS catalog.`
    };
  }
  return detectToolCapabilitySync(found);
}
