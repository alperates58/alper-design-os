import {
  ToolMetadata,
  ToolRoutingDecision,
  ToolRoutingDecisionSchema
} from './types.js';

export const BUILTIN_TOOL_REGISTRY: Record<string, ToolMetadata> = {
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

  // Default to targeted edit or run_command
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
