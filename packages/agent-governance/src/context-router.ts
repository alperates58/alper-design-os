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

/**
 * All 55 active canonical skills under ALPER_SKILL_STANDARD_V1.
 */
export const ALL_ACTIVE_SKILLS = [
  'alper-greenfield-product-analysis',
  'alper-domain-intelligence',
  'alper-requirements-engineering',
  'alper-greenfield-generator',
  'alper-existing-project-analysis',
  'alper-design-repair',
  'alper-modernization-planner',
  'alper-behavior-preservation',
  'alper-modernization-review',
  'alper-refactoring-strategy',
  'alper-project-intelligence',
  'alper-decision-management',
  'alper-change-impact-analysis',
  'alper-project-continuation',
  'alper-continuous-improvement',
  'alper-change-planner',
  'alper-scope-guard',
  'alper-git-safety',
  'alper-independent-review',
  'alper-evidence-review',
  'alper-architecture',
  'alper-database-designer',
  'alper-migration-safety',
  'alper-sql-performance',
  'alper-api-designer',
  'alper-design-language',
  'alper-design-personality',
  'alper-pattern-graph',
  'alper-design-critic',
  'alper-ui-blueprint',
  'alper-ui-recipe',
  'alper-cross-stack-rendering',
  'alper-renderer-parity',
  'alper-source-intelligence',
  'alper-registry-discovery',
  'alper-secure-coding',
  'alper-security-audit',
  'alper-api-security',
  'alper-secret-management',
  'alper-supply-chain-security',
  'alper-ai-skill-audit',
  'alper-code-quality',
  'alper-browser-qa',
  'alper-visual-regression',
  'alper-accessibility-testing',
  'alper-testing-strategy',
  'alper-contract-testing',
  'alper-regression-testing',
  'alper-performance-engineering',
  'alper-reliability',
  'alper-observability',
  'alper-release-safety',
  'alper-load-testing',
  'alper-truthful-ui',
  'alper-operator-execution'
];

/**
 * 19 permanently deprecated skills superseded in Phase 1H.2.
 * Context router MUST NEVER return these in requiredSkills.
 */
export const DEPRECATED_SKILLS = [
  'alper-design-new',
  'alper-design-modernize',
  'alper-safe-refactor',
  'alper-regression-guard',
  'alper-architecture-planner',
  'alper-architecture-audit',
  'alper-database-engineering',
  'alper-data-integrity',
  'alper-api-architecture',
  'alper-design-source-ranking',
  'alper-ai-coding-safety',
  'alper-dependency-hygiene',
  'alper-dependency-lifecycle',
  'alper-playwright-testing',
  'alper-runtime-debugging',
  'alper-cross-browser-testing',
  'alper-api-testing',
  'alper-performance-testing',
  'alper-resilience'
];

export function routeContext(query: TaskContextQuery): ContextRoutingDecision {
  const brief = query.taskBrief.toLowerCase();
  const stack = (query.detectedStack || '').toLowerCase();
  const mode = query.mode || 'REPAIR';

  // Base core governance skills required across all modes
  const requiredSkills: string[] = ['alper-scope-guard', 'alper-change-planner', 'alper-evidence-review'];
  const requiredRules: string[] = ['rules/AGENTS.md'];
  const requiredSources: string[] = [];
  const requiredTools: string[] = ['view_file', 'replace_file_content'];

  // Route based on mode (using modern active canonical skills)
  if (mode === 'NEW') {
    requiredSkills.push(
      'alper-greenfield-generator',
      'alper-greenfield-product-analysis',
      'alper-domain-intelligence',
      'alper-requirements-engineering'
    );
    requiredTools.push('create_project_blueprint', 'create_project_implementation_plan', 'scaffold_new_project');
  } else if (mode === 'MODERNIZE') {
    requiredSkills.push(
      'alper-modernization-planner',
      'alper-behavior-preservation',
      'alper-modernization-review',
      'alper-refactoring-strategy'
    );
    requiredTools.push('create_modernization_intent', 'select_modernization_strategy', 'create_modernization_plan');
  } else {
    // REPAIR mode
    requiredSkills.push('alper-design-repair', 'alper-git-safety');
    requiredTools.push('audit_accessibility', 'audit_responsive', 'evaluate_scope');
  }

  // Domain & Intent keyword routing
  // 1. Security & Auth
  if (
    brief.includes('login') ||
    brief.includes('auth') ||
    brief.includes('security') ||
    brief.includes('csrf') ||
    brief.includes('secret') ||
    brief.includes('token') ||
    brief.includes('vulnerability')
  ) {
    requiredSkills.push('alper-secure-coding', 'alper-secret-management', 'alper-api-security', 'alper-security-audit');
    requiredTools.push('run_safe_security_scan', 'evaluate_release_gates');
    requiredSources.push('OWASP Top 10 2025', 'OWASP ASVS 5.0');
  }

  // 2. Browser, Responsive & Visual Layout
  if (
    brief.includes('browser') ||
    brief.includes('responsive') ||
    brief.includes('layout') ||
    brief.includes('mobile') ||
    brief.includes('navigation') ||
    brief.includes('screen') ||
    brief.includes('ui')
  ) {
    requiredSkills.push('alper-browser-qa', 'alper-visual-regression', 'alper-design-critic');
    requiredTools.push('generate_playwright_test', 'generate_qa_report');
  }

  // 3. Database, SQL & Migrations
  if (
    brief.includes('database') ||
    brief.includes('migration') ||
    brief.includes('sql') ||
    brief.includes('postgres') ||
    brief.includes('query')
  ) {
    requiredSkills.push('alper-database-designer', 'alper-migration-safety', 'alper-sql-performance');
    requiredTools.push('analyze_database_schema');
  }

  // 4. API Design & Contracts
  if (
    brief.includes('api') ||
    brief.includes('endpoint') ||
    brief.includes('contract') ||
    brief.includes('grpc') ||
    brief.includes('rest')
  ) {
    requiredSkills.push('alper-api-designer', 'alper-contract-testing');
    requiredTools.push('evaluate_api_compatibility');
  }

  // 5. Accessibility & WCAG
  if (brief.includes('wcag') || brief.includes('accessibility') || brief.includes('a11y')) {
    requiredSkills.push('alper-accessibility-testing', 'alper-browser-qa');
    requiredTools.push('audit_accessibility', 'generate_qa_report');
    requiredSources.push('WCAG 2.1 AA Guidelines');
  }

  // 6. Playwright & E2E Testing
  if (brief.includes('playwright') || brief.includes('e2e') || brief.includes('funnel')) {
    requiredSkills.push('alper-browser-qa', 'alper-requirements-engineering');
    requiredTools.push('generate_playwright_test');
  }

  // 7. ADR & Architectural Decisions
  if (brief.includes('adr') || brief.includes('decision') || brief.includes('architecture')) {
    requiredSkills.push('alper-decision-management', 'alper-project-intelligence', 'alper-architecture');
    requiredTools.push('record_project_decision', 'generate_adr');
  }

  // 8. Performance & Latency
  if (brief.includes('performance') || brief.includes('slow') || brief.includes('seconds') || brief.includes('latency')) {
    requiredSkills.push('alper-performance-engineering');
  }

  // 9. Truthful UI & Provenance
  if (brief.includes('truthful') || brief.includes('provenance') || brief.includes('metric')) {
    requiredSkills.push('alper-truthful-ui');
    requiredTools.push('evaluate_truthful_ui', 'audit_data_provenance');
  }

  // 10. Operator Execution & Corporate Fallback
  if (brief.includes('operator') || brief.includes('run.ps1') || brief.includes('manual run') || brief.includes('bundle')) {
    requiredSkills.push('alper-operator-execution');
    requiredTools.push('create_manual_run_bundle', 'verify_manual_run_evidence');
  }

  // Stack routing
  if (stack.includes('laravel') || stack.includes('blade') || stack.includes('php')) {
    requiredSources.push('Laravel Pint / Larastan standards', 'Blade Component Conventions');
  } else if (stack.includes('react')) {
    requiredSources.push('React Aria / Radix Accessibility Primitives', 'Tailwind CSS Tokens');
  } else if (stack.includes('aspnet') || stack.includes('razor')) {
    requiredSources.push('Microsoft Fluent UI / ASP.NET Security Directives');
  }

  // Strictly filter out any deprecated skill
  const uniqueSkills = Array.from(new Set(requiredSkills)).filter(
    s => ALL_ACTIVE_SKILLS.includes(s) && !DEPRECATED_SKILLS.includes(s)
  );

  const excludedSkills = ALL_ACTIVE_SKILLS.filter(s => !uniqueSkills.includes(s));
  const uniqueTools = Array.from(new Set(requiredTools));
  const uniqueSources = Array.from(new Set(requiredSources));

  // Calculate token savings against ALL_ACTIVE_SKILLS
  const tokenBudgetReductionPercent = Math.min(
    90,
    Math.max(20, Math.round(((ALL_ACTIVE_SKILLS.length - uniqueSkills.length) / ALL_ACTIVE_SKILLS.length) * 100))
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
