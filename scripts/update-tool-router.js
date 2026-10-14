import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_TOOL_DEFINITIONS } from '../packages/mcp-server/src/server.ts';

const toolRouterPath = path.resolve('packages/agent-governance/src/tool-router.ts');

const builtinTools = {
  view_file: {
    name: 'view_file',
    capability: 'Inspect file contents directly from workspace',
    cost: 'FREE',
    latency: 'FAST',
    risk: 'LOW',
    requiresInternet: false,
    requiresApproval: false,
    readOnly: true,
    destructive: false,
    availability: 'AVAILABLE'
  },
  replace_file_content: {
    name: 'replace_file_content',
    capability: 'Targeted single-block code edits',
    cost: 'FREE',
    latency: 'FAST',
    risk: 'MEDIUM',
    requiresInternet: false,
    requiresApproval: false,
    readOnly: false,
    destructive: false,
    availability: 'AVAILABLE'
  },
  run_command: {
    name: 'run_command',
    capability: 'Execute shell commands or test runners in workspace',
    cost: 'LOW',
    latency: 'MEDIUM',
    risk: 'HIGH',
    requiresInternet: false,
    requiresApproval: false,
    readOnly: false,
    destructive: false,
    availability: 'AVAILABLE'
  },
  playwright: {
    name: 'playwright',
    capability: 'End-to-end multi-browser headless automation and flow verification',
    cost: 'LOW',
    latency: 'MEDIUM',
    risk: 'LOW',
    requiresInternet: false,
    requiresApproval: false,
    readOnly: true,
    destructive: false,
    availability: 'AVAILABLE'
  },
  'chrome-devtools': {
    name: 'chrome-devtools',
    capability: 'Live Chrome runtime inspection, heap, network waterfall, console logging',
    cost: 'LOW',
    latency: 'FAST',
    risk: 'LOW',
    requiresInternet: false,
    requiresApproval: false,
    readOnly: true,
    destructive: false,
    availability: 'AVAILABLE'
  },
  search_web: {
    name: 'search_web',
    capability: 'Live public web search for external documentation',
    cost: 'MEDIUM',
    latency: 'SLOW',
    risk: 'LOW',
    requiresInternet: true,
    requiresApproval: false,
    readOnly: true,
    destructive: false,
    availability: 'AVAILABLE'
  },
  destructive_git_reset: {
    name: 'destructive_git_reset',
    capability: 'Hard reset git working tree',
    cost: 'HIGH',
    latency: 'FAST',
    risk: 'CRITICAL',
    requiresInternet: false,
    requiresApproval: true,
    readOnly: false,
    destructive: true,
    availability: 'AVAILABLE'
  }
};

const mcpToolMetadata = {};
for (const tool of CANONICAL_TOOL_DEFINITIONS) {
  const name = tool.name;
  const desc = tool.description || `Canonical MCP Tool: ${name}`;

  let cost = 'FREE';
  let latency = 'FAST';
  let risk = 'LOW';
  let requiresInternet = false;
  let requiresApproval = false;
  let readOnly = true;
  let destructive = false;

  if (name.includes('sync_') || name.includes('search_web') || name.includes('search_public_apis') || name.includes('search_mcp_servers')) {
    requiresInternet = true;
    latency = 'MEDIUM';
    cost = 'LOW';
  }

  if (name.includes('scaffold_') || name.includes('create_manual_run_bundle')) {
    readOnly = false;
    risk = 'MEDIUM';
    cost = 'LOW';
    latency = 'MEDIUM';
  }

  if (name.includes('render_') || name.includes('record_') || name.includes('initialize_')) {
    readOnly = false;
  }

  if (name.includes('run_safe_security_scan') || name.includes('evaluate_release_gates') || name.includes('generate_playwright_test')) {
    latency = 'MEDIUM';
  }

  mcpToolMetadata[name] = {
    name,
    capability: desc,
    cost,
    latency,
    risk,
    requiresInternet,
    requiresApproval,
    readOnly,
    destructive,
    availability: 'AVAILABLE'
  };
}

const allTools = { ...builtinTools, ...mcpToolMetadata };

const fileContent = `import {
  ToolMetadata,
  ToolRoutingDecision,
  ToolRoutingDecisionSchema
} from './types.js';

export const BUILTIN_TOOL_REGISTRY: Record<string, ToolMetadata> = ${JSON.stringify(allTools, null, 2)};

export const CANONICAL_MCP_TOOL_NAMES = ${JSON.stringify(CANONICAL_TOOL_DEFINITIONS.map(t => t.name).sort(), null, 2)};

export function getToolRoutingMetadata(name: string): ToolMetadata | undefined {
  return BUILTIN_TOOL_REGISTRY[name];
}

export function routeTool(
  taskDescription: string,
  options?: { isOffline?: boolean; requireLiveBrowser?: boolean }
): ToolRoutingDecision {
  const norm = taskDescription.toLowerCase();

  // If inspection of local files
  if (norm.includes('read') || norm.includes('inspect') || norm.includes('view')) {
    return ToolRoutingDecisionSchema.parse({
      taskDescription,
      chosenTool: 'view_file',
      fallbackTools: ['run_command'],
      rationale: 'Read-only direct file access is the fastest, lowest-cost, zero-risk method.',
      requiresApproval: false,
      requiresNetwork: false
    });
  }

  // If browser testing is needed
  if (norm.includes('browser') || norm.includes('e2e') || norm.includes('click') || options?.requireLiveBrowser) {
    if (norm.includes('console') || norm.includes('runtime error') || norm.includes('network error')) {
      return ToolRoutingDecisionSchema.parse({
        taskDescription,
        chosenTool: 'chrome-devtools',
        fallbackTools: ['playwright'],
        rationale: 'Chrome DevTools provides deepest runtime diagnostics for console exceptions and network waterfalls.',
        requiresApproval: false,
        requiresNetwork: false
      });
    }

    return ToolRoutingDecisionSchema.parse({
      taskDescription,
      chosenTool: 'playwright',
      fallbackTools: ['chrome-devtools'],
      rationale: 'Playwright MCP selected for resilient user flow execution and multi-viewport DOM assertions.',
      requiresApproval: false,
      requiresNetwork: false
    });
  }

  // If external research is needed
  if (norm.includes('search web') || norm.includes('latest docs online')) {
    if (options?.isOffline) {
      return ToolRoutingDecisionSchema.parse({
        taskDescription,
        chosenTool: 'view_file',
        fallbackTools: [],
        rationale: 'Offline mode active: Cannot use search_web. Falling back to local cached sources and knowledge.',
        requiresApproval: false,
        requiresNetwork: true
      });
    }
    return ToolRoutingDecisionSchema.parse({
      taskDescription,
      chosenTool: 'search_web',
      fallbackTools: ['view_file'],
      rationale: 'External documentation search requires live internet connectivity.',
      requiresApproval: false,
      requiresNetwork: true
    });
  }

  // Targeted single-block editing
  if (norm.includes('edit') || norm.includes('fix') || norm.includes('update')) {
    return ToolRoutingDecisionSchema.parse({
      taskDescription,
      chosenTool: 'replace_file_content',
      fallbackTools: ['run_command'],
      rationale: 'Surgical single-block editing has smaller blast radius than wholesale script rewrites.',
      requiresApproval: false,
      requiresNetwork: false
    });
  }

  return ToolRoutingDecisionSchema.parse({
    taskDescription,
    chosenTool: 'run_command',
    fallbackTools: ['view_file'],
    rationale: 'Standard command execution in workspace shell.',
    requiresApproval: false,
    requiresNetwork: false
  });
}
`;

fs.writeFileSync(toolRouterPath, fileContent, 'utf-8');
console.log(`Updated ${toolRouterPath} with ${Object.keys(allTools).length} total tools (${Object.keys(mcpToolMetadata).length} canonical MCP tools).`);
