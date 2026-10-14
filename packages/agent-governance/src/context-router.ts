import {
  ContextRoutingDecision,
  ContextRoutingDecisionSchema
} from './types.js';
import {
  ALL_ACTIVE_SKILLS,
  DEPRECATED_SKILLS,
  CANONICAL_SKILL_CATALOG
} from './skill-registry.js';

export { ALL_ACTIVE_SKILLS, DEPRECATED_SKILLS };

export interface TaskContextQuery {
  taskId: string;
  taskBrief: string;
  detectedStack?: string;
  domain?: string;
  mode?: 'NEW' | 'REPAIR' | 'MODERNIZE';
}

/**
 * Intelligent semantic context router.
 * Evaluates mode, intent, target type, and capability families together
 * without falling back to naive REPAIR defaults or single-keyword traps.
 */
export function routeContext(query: TaskContextQuery): ContextRoutingDecision {
  const brief = query.taskBrief.trim();
  const lowerBrief = brief.toLowerCase();
  const stack = (query.detectedStack || '').toLowerCase();

  const requiredSkills: string[] = ['alper-scope-guard', 'alper-change-planner', 'alper-evidence-review'];
  const requiredRules: string[] = ['rules/AGENTS.md'];
  const requiredSources: string[] = [];
  const requiredTools: string[] = ['view_file', 'replace_file_content'];
  const rationaleNotes: string[] = [];

  // =========================================================================
  // 1. Mode Determination (No Silent REPAIR Default)
  // =========================================================================
  let mode: 'NEW' | 'REPAIR' | 'MODERNIZE' | undefined = query.mode;

  if (!mode) {
    // Discriminate mode with confidence
    const hasNewCues = /\b(create new|build a|scaffold|from scratch|new project|brand new)\b/i.test(lowerBrief);
    const hasModernizeCues = /\b(moderniz|migrat|legacy|webforms|strangler|phased upgrade)\b/i.test(lowerBrief);
    const hasRepairCues = /\b(fix|broken|overflow|bug|glitch|patch|repair|regression)\b/i.test(lowerBrief);
    const isContinuation = /\b(continue yesterday|resume|where we left off)\b/i.test(lowerBrief);
    const isArchitectureTradeoff = /\b(monolith to microservices|architecture tradeoff|should we move|evaluate architecture)\b/i.test(lowerBrief);

    if (isContinuation) {
      mode = 'REPAIR'; // Operates in maintenance/continuation mode
      requiredSkills.push('alper-project-continuation', 'alper-project-intelligence');
      requiredTools.push('build_task_context', 'load_project_intelligence');
      rationaleNotes.push('Session continuation detected: loaded project memory.');
    } else if (isArchitectureTradeoff) {
      mode = 'MODERNIZE';
      requiredSkills.push('alper-architecture', 'alper-decision-management');
      requiredTools.push('analyze_architecture', 'generate_adr');
      rationaleNotes.push('Architectural inquiry: routed to architecture and ADR management without code mutation.');
    } else if (hasNewCues && !hasRepairCues && !hasModernizeCues) {
      mode = 'NEW';
    } else if (hasModernizeCues && !hasRepairCues) {
      mode = 'MODERNIZE';
    } else if (hasRepairCues) {
      mode = 'REPAIR';
    } else {
      // Ambiguous: DO NOT default to REPAIR! Route to PRODUCT_DISCOVERY
      mode = 'NEW';
      requiredSkills.push('alper-greenfield-product-analysis', 'alper-domain-intelligence');
      requiredTools.push('create_greenfield_project_profile', 'understand_product');
      rationaleNotes.push('Ambiguous task intent without mode: routed to product discovery for clarification before changes.');
    }
  }

  // Check for architectural inquiries or underspecified / broad requests
  const isArchitecturalInquiry =
    /\b(monolith|microservices|architectur|decoupling|service extraction|trade-off|tradeoff)\b/i.test(lowerBrief) &&
    /\b(should|evaluate|compare|tradeoff|inquiry|feasibility|why|how)\b/i.test(lowerBrief);

  const isBroadUnderspecifiedBrief =
    mode === 'NEW' &&
    ((brief.split(/\s+/).length <= 5 &&
      !lowerBrief.includes('dashboard') &&
      !lowerBrief.includes('screen') &&
      !lowerBrief.includes('api')) ||
      isArchitecturalInquiry);

  if (mode === 'NEW') {
    if (isArchitecturalInquiry) {
      requiredSkills.push('alper-architecture', 'alper-decision-management');
      requiredTools.push('generate_adr');
      rationaleNotes.push('Architectural inquiry: evaluate trade-offs without scaffolding.');
    } else if (isBroadUnderspecifiedBrief) {
      requiredSkills.push('alper-greenfield-product-analysis', 'alper-domain-intelligence');
      // Discovery phase ONLY - NO scaffolding tools!
      requiredTools.push('create_greenfield_project_profile', 'understand_product', 'research_domain');
      rationaleNotes.push('High-level brief requires domain discovery; scaffolding is blocked pending requirements clarification.');
    } else {
      requiredSkills.push(
        'alper-greenfield-generator',
        'alper-greenfield-product-analysis',
        'alper-domain-intelligence',
        'alper-requirements-engineering'
      );
      requiredTools.push('create_project_blueprint', 'create_project_implementation_plan', 'scaffold_new_project');
    }
  } else if (mode === 'MODERNIZE') {
    requiredSkills.push(
      'alper-modernization-planner',
      'alper-behavior-preservation',
      'alper-modernization-review',
      'alper-refactoring-strategy'
    );
    requiredTools.push('create_modernization_intent', 'select_modernization_strategy', 'create_modernization_plan');
  } else if (mode === 'REPAIR') {
    requiredSkills.push('alper-design-repair', 'alper-git-safety');
    requiredTools.push('audit_accessibility', 'audit_responsive', 'evaluate_scope');
  }

  // =========================================================================
  // 3. Semantic Intent Disambiguation (Preventing Accidental Keyword Traps)
  // =========================================================================

  // A. Security Intent vs UI Element mentioning "login"
  // "Fix padding of login button" is a UI layout repair, NOT a full security audit!
  const isVisualOrLayoutTask = /\b(padding|margin|color|css|styling|layout|responsive|overflow|button|nav|navbar|header|footer|font|icon)\b/i.test(lowerBrief);
  const isActualSecurityTask = /\b(vulnerability|csrf|xss|sql injection|auth bypass|penetration test|stride|security audit|asvs|cve|secret leak|hardcoded)\b/i.test(lowerBrief);

  if (isActualSecurityTask) {
    requiredSkills.push('alper-security-audit', 'alper-secure-coding', 'alper-api-security');
    requiredTools.push('run_safe_security_scan', 'evaluate_release_gates');
    requiredSources.push('OWASP Top 10 2025', 'OWASP ASVS 5.0');

    if (lowerBrief.includes('penetration test') || lowerBrief.includes('active')) {
      rationaleNotes.push('ACTIVE PENETRATION TESTING REQUIRES EXPLICIT HUMAN OPERATOR AUTHORIZATION.');
    }
  } else if (/\b(login|auth|session)\b/i.test(lowerBrief) && !isVisualOrLayoutTask) {
    // Only route to auth/security if the task is genuinely about authentication functionality
    requiredSkills.push('alper-secure-coding', 'alper-api-security');
    requiredTools.push('evaluate_release_gates');
    requiredSources.push('OWASP ASVS 5.0');
  }

  // B. Database & SQL Performance vs Schema Design
  const isSlowQueryDiagnosis = /\b(slow(\s+sql)?\s+query|query taking|execution plan|explain analyze|diagnose query|sql performance)\b/i.test(lowerBrief);
  const isSchemaDesign = /\b(create table|database schema|3nf|erd|relational design|add column|migration)\b/i.test(lowerBrief);

  if (isSlowQueryDiagnosis) {
    requiredSkills.push('alper-sql-performance');
    rationaleNotes.push('Query performance diagnosis active: read-only query plan analysis without schema changes by default.');
  } else if (isSchemaDesign) {
    requiredSkills.push('alper-database-designer', 'alper-migration-safety');
    requiredTools.push('analyze_database_schema');
  }

  // C. API Engineering vs Documentation CSS
  const isApiEngineeringTask = /\b(rest api|api endpoint|openapi|contract test|grpc|swagger|rfc 9457)\b/i.test(lowerBrief);
  if (isApiEngineeringTask && !isVisualOrLayoutTask) {
    requiredSkills.push('alper-api-designer', 'alper-contract-testing');
    requiredTools.push('evaluate_api_compatibility');
  }

  // D. Browser & UI Testing vs Static
  if (isVisualOrLayoutTask || /\b(browser|screen|ui|responsive|mobile)\b/i.test(lowerBrief)) {
    requiredSkills.push('alper-browser-qa', 'alper-visual-regression');
    if (!requiredSkills.includes('alper-design-critic')) {
      requiredSkills.push('alper-design-critic');
    }
  }

  // E. Accessibility (Canonical: WCAG 2.2 AA)
  if (/\b(wcag|accessibility|a11y|screen reader|focus visible|aria)\b/i.test(lowerBrief)) {
    requiredSkills.push('alper-accessibility-testing', 'alper-browser-qa');
    requiredTools.push('audit_accessibility', 'generate_qa_report');
    requiredSources.push('W3C WCAG 2.2 AA (Canonical Standard)');
  }

  // F. Playwright E2E Testing
  if (/\b(playwright|e2e|funnel test)\b/i.test(lowerBrief)) {
    requiredSkills.push('alper-browser-qa', 'alper-requirements-engineering');
    requiredTools.push('generate_playwright_test');
  }

  // G. ADR & Architecture Decision
  if (/\b(adr|architecture decision|record decision|architectural tradeoff)\b/i.test(lowerBrief)) {
    requiredSkills.push('alper-decision-management', 'alper-project-intelligence', 'alper-architecture');
    requiredTools.push('record_project_decision', 'generate_adr');
  }

  // H. Design Inspiration / External Dribbble
  if (/\b(dribbble|behance|inspiration|visual inspiration)\b/i.test(lowerBrief)) {
    requiredSkills.push('alper-design-language', 'alper-source-intelligence');
    rationaleNotes.push('External visual inspiration is non-authoritative and cannot serve as source-of-truth layout specification.');
  }

  // I. Truthful UI & Data Provenance
  if (/\b(truthful|provenance|metric truth|fake score|hallucinated metric)\b/i.test(lowerBrief)) {
    requiredSkills.push('alper-truthful-ui');
    requiredTools.push('evaluate_truthful_ui', 'audit_data_provenance');
  }

  // J. Operator Execution & Corporate Fallback
  if (/\b(operator|run\.ps1|manual run|corporate environment|air-gapped)\b/i.test(lowerBrief)) {
    requiredSkills.push('alper-operator-execution');
    requiredTools.push('create_manual_run_bundle', 'verify_manual_run_evidence');
  }

  // K. Architectural Inquiry & Trade-offs (e.g. "Should we move from monolith to microservices?")
  if (/\b(monolith|microservices|architectur|decoupling|service extraction)\b/i.test(lowerBrief)) {
    if (!requiredSkills.includes('alper-architecture')) {
      requiredSkills.push('alper-architecture', 'alper-decision-management');
    }
    rationaleNotes.push('Architectural inquiry: evaluate trade-offs and complexity budget without premature code generation.');
  }

  // L. Project Continuation & Session Onboarding (e.g. "Continue yesterday")
  if (/\b(continue yesterday|resume session|pick up where|continuation)\b/i.test(lowerBrief)) {
    requiredSkills.push('alper-project-continuation', 'alper-project-intelligence');
    rationaleNotes.push('Session continuation: load durable project memory and check for drift before accepting further instructions.');
  }

  // Stack routing
  if (stack.includes('laravel') || stack.includes('blade') || stack.includes('php')) {
    requiredSources.push('Laravel Pint / Larastan standards', 'Blade Component Conventions');
  } else if (stack.includes('react')) {
    requiredSources.push('React Aria / Radix Accessibility Primitives', 'Tailwind CSS Tokens');
  } else if (stack.includes('aspnet') || stack.includes('razor')) {
    requiredSources.push('Microsoft Fluent UI / ASP.NET Security Directives');
  }

  // =========================================================================
  // 4. Strict Filtering Against Canonical Active Skills
  // =========================================================================
  const uniqueSkills = Array.from(new Set(requiredSkills)).filter(
    s => ALL_ACTIVE_SKILLS.includes(s) && !DEPRECATED_SKILLS.includes(s)
  );

  const excludedSkills = ALL_ACTIVE_SKILLS.filter(s => !uniqueSkills.includes(s));
  const uniqueTools = Array.from(new Set(requiredTools));
  const uniqueSources = Array.from(new Set(requiredSources));

  const tokenBudgetReductionPercent = Math.min(
    92,
    Math.max(25, Math.round(((ALL_ACTIVE_SKILLS.length - uniqueSkills.length) / ALL_ACTIVE_SKILLS.length) * 100))
  );

  let rationale = `Context scoped for [${mode}] task (${brief.slice(0, 45)}...). Active skills: ${
    uniqueSkills.length
  }, Excluded skills: ${excludedSkills.length}. Token budget saved ~${tokenBudgetReductionPercent}%.`;

  if (rationaleNotes.length > 0) {
    rationale += ` Note: ${rationaleNotes.join(' ')}`;
  }

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
