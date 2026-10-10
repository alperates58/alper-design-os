import {
  ContextRoutingDecision,
  ContextRoutingDecisionSchema
} from './types.js';

export interface TaskContextQuery {
  taskId: string;
  taskBrief: string;
  detectedStack?: string;
  domain?: string;
  mode?: 'NEW' | 'REPAIR' | 'MODERNIZE';
}

const ALL_SKILLS = [
  'alper-accessibility-testing',
  'alper-ai-coding-safety',
  'alper-api-architecture',
  'alper-api-security',
  'alper-api-testing',
  'alper-architecture',
  'alper-architecture-audit',
  'alper-browser-qa',
  'alper-code-quality',
  'alper-contract-testing',
  'alper-cross-browser-testing',
  'alper-data-integrity',
  'alper-database-engineering',
  'alper-dependency-hygiene',
  'alper-dependency-lifecycle',
  'alper-design-modernize',
  'alper-design-new',
  'alper-design-repair',
  'alper-domain-intelligence',
  'alper-load-testing',
  'alper-migration-safety',
  'alper-observability',
  'alper-performance-engineering',
  'alper-performance-testing',
  'alper-playwright-testing',
  'alper-refactoring-strategy',
  'alper-regression-testing',
  'alper-release-safety',
  'alper-reliability',
  'alper-resilience',
  'alper-runtime-debugging',
  'alper-secret-management',
  'alper-secure-coding',
  'alper-security-audit',
  'alper-sql-performance',
  'alper-supply-chain-security',
  'alper-testing-strategy',
  'alper-visual-regression',
  'alper-change-planner',
  'alper-independent-review',
  'alper-scope-guard',
  'alper-regression-guard',
  'alper-evidence-review',
  'alper-safe-refactor',
  'alper-git-safety',
  'alper-design-critic'
];

export function routeContext(query: TaskContextQuery): ContextRoutingDecision {
  const brief = query.taskBrief.toLowerCase();
  const stack = (query.detectedStack || '').toLowerCase();
  const mode = query.mode || 'REPAIR';

  const requiredSkills: string[] = ['alper-ai-coding-safety', 'alper-scope-guard', 'alper-change-planner'];
  const requiredRules: string[] = ['rules/AGENTS.md'];
  const requiredSources: string[] = [];
  const requiredTools: string[] = ['view_file', 'replace_file_content'];

  // Route based on mode
  if (mode === 'NEW') {
    requiredSkills.push('alper-design-new', 'alper-domain-intelligence');
    requiredTools.push('understand_product', 'recommend_ux_patterns', 'get_design_tokens');
  } else if (mode === 'MODERNIZE') {
    requiredSkills.push('alper-design-modernize', 'alper-safe-refactor', 'alper-regression-guard');
    requiredTools.push('recommend_modernization', 'audit_existing_ui');
  } else {
    requiredSkills.push('alper-design-repair', 'alper-regression-guard', 'alper-git-safety');
  }

  // Route based on brief keywords
  if (brief.includes('login') || brief.includes('auth') || brief.includes('security')) {
    requiredSkills.push('alper-secure-coding', 'alper-secret-management', 'alper-api-security');
    requiredTools.push('run_safe_security_scan', 'evaluate_release_gates');
    requiredSources.push('OWASP Top 10', 'NIST Auth Guidelines');
  }

  if (brief.includes('browser') || brief.includes('ui') || brief.includes('screen') || brief.includes('layout')) {
    requiredSkills.push('alper-browser-qa', 'alper-visual-regression', 'alper-design-critic');
    requiredTools.push('generate_playwright_test', 'generate_qa_report');
  }

  if (brief.includes('database') || brief.includes('migration') || brief.includes('sql')) {
    requiredSkills.push('alper-database-engineering', 'alper-migration-safety', 'alper-sql-performance');
    requiredTools.push('analyze_database_schema');
  }

  if (brief.includes('api') || brief.includes('endpoint') || brief.includes('contract')) {
    requiredSkills.push('alper-api-architecture', 'alper-contract-testing');
    requiredTools.push('evaluate_api_compatibility');
  }

  // Stack routing
  if (stack.includes('laravel') || stack.includes('blade') || stack.includes('php')) {
    requiredSources.push('Laravel Pint / Larastan standards', 'Blade Component Conventions');
  } else if (stack.includes('react')) {
    requiredSources.push('React Aria / Radix Accessibility Primitives', 'Tailwind CSS Tokens');
  } else if (stack.includes('aspnet') || stack.includes('razor')) {
    requiredSources.push('Microsoft Fluent UI / ASP.NET Security Directives');
  }

  // Deduplicate
  const uniqueSkills = Array.from(new Set(requiredSkills));
  const excludedSkills = ALL_SKILLS.filter(s => !uniqueSkills.includes(s));
  const uniqueTools = Array.from(new Set(requiredTools));
  const uniqueSources = Array.from(new Set(requiredSources));

  // Calculate token savings
  const tokenBudgetReductionPercent = Math.min(
    85,
    Math.round(((ALL_SKILLS.length - uniqueSkills.length) / ALL_SKILLS.length) * 100)
  );

  const rationale = `Context scoped strictly for [${mode}] task (${query.taskBrief.slice(0, 40)}...). Active skills: ${
    uniqueSkills.length
  }, Excluded skills: ${excludedSkills.length}. Token budget saved ~${tokenBudgetReductionPercent}%.`;

  return ContextRoutingDecisionSchema.parse({
    taskId: query.taskId,
    mode,
    stack: query.detectedStack,
    domain: query.domain,
    requiredSkills: uniqueSkills,
    requiredRules,
    requiredSources: uniqueSources,
    requiredTools: uniqueTools,
    excludedSkills,
    excludedTools: [],
    rationale,
    tokenBudgetReductionPercent
  });
}
