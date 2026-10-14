import fs from 'node:fs';
import path from 'node:path';

/**
 * ALPER_SKILL_STANDARD_V1
 * Canonical authoring standard for ALPER DESIGN OS skills.
 */
export const CAPABILITY_FAMILIES = [
  'PRODUCT_DISCOVERY',
  'GREENFIELD_ENGINEERING',
  'EXISTING_PROJECT_ANALYSIS',
  'REPAIR',
  'MODERNIZATION',
  'PROJECT_INTELLIGENCE',
  'GOVERNANCE',
  'TRUTHFUL_UI',
  'OPERATOR_EXECUTION',
  'ARCHITECTURE',
  'DATA_ENGINEERING',
  'API_ENGINEERING',
  'DESIGN_UX',
  'SOURCE_INTELLIGENCE',
  'SECURITY',
  'QA_TESTING',
  'PERFORMANCE_RELIABILITY'
];

/**
 * Complete Migration Map for all 72 original skills
 */
export const SKILL_MIGRATION_MAP = {
  // 1. Greenfield & Discovery
  'alper-greenfield-product-analysis': {
    action: 'REWRITE',
    capabilityFamily: 'PRODUCT_DISCOVERY',
    newOwner: 'alper-greenfield-product-analysis',
    reason: 'Consolidates DiscoveryReadiness and RequestComplexityClassification for truthful requirements intake.',
    deprecated: false,
    mcpTools: ['create_greenfield_project_profile', 'understand_product', 'research_domain']
  },
  'alper-domain-intelligence': {
    action: 'REWRITE',
    capabilityFamily: 'PRODUCT_DISCOVERY',
    newOwner: 'alper-domain-intelligence',
    reason: 'Operational domain intelligence and 15-industry UX benchmarks without APS hardcoding.',
    deprecated: false,
    mcpTools: ['research_domain', 'understand_product']
  },
  'alper-requirements-engineering': {
    action: 'REWRITE',
    capabilityFamily: 'GREENFIELD_ENGINEERING',
    newOwner: 'alper-requirements-engineering',
    reason: 'Requirements derivation, RTM traceability, acceptance criteria lifecycle (DEFINED -> NOT_VERIFIED).',
    deprecated: false,
    mcpTools: ['derive_requirements', 'create_requirement_traceability', 'generate_user_journeys']
  },
  'alper-greenfield-generator': {
    action: 'REWRITE',
    capabilityFamily: 'GREENFIELD_ENGINEERING',
    newOwner: 'alper-greenfield-generator',
    reason: 'Master Greenfield Orchestrator enforcing Discovery Gate, scaffold correctness, and completion contract.',
    deprecated: false,
    mcpTools: ['create_project_blueprint', 'create_project_implementation_plan', 'scaffold_new_project', 'evaluate_new_project_completion', 'recommend_stack']
  },
  'alper-design-new': {
    action: 'DEPRECATE',
    capabilityFamily: 'GREENFIELD_ENGINEERING',
    newOwner: 'alper-greenfield-generator',
    reason: 'Phase 0 legacy workflow superseded by Phase 1G greenfield-generator and requirements-engineering.',
    deprecated: true,
    replacement: 'alper-greenfield-generator',
    mcpTools: []
  },

  // 2. Existing Project Analysis & Repair
  'alper-existing-project-analysis': {
    action: 'REWRITE',
    capabilityFamily: 'EXISTING_PROJECT_ANALYSIS',
    newOwner: 'alper-existing-project-analysis',
    reason: 'Analyzes existing codebases, detects stack, profiles debt, and maps critical workflows.',
    deprecated: false,
    mcpTools: ['profile_existing_project', 'analyze_project', 'detect_stack', 'audit_existing_ui']
  },
  'alper-design-repair': {
    action: 'REWRITE',
    capabilityFamily: 'REPAIR',
    newOwner: 'alper-design-repair',
    reason: 'Surgical UI/UX repair preserving existing architecture and styles with zero uninvited rewrite.',
    deprecated: false,
    mcpTools: ['audit_accessibility', 'audit_responsive', 'evaluate_scope', 'review_change']
  },

  // 3. Modernization
  'alper-modernization-planner': {
    action: 'REWRITE',
    capabilityFamily: 'MODERNIZATION',
    newOwner: 'alper-modernization-planner',
    reason: 'Formulates staged modernization plans, change classification, and candidate design directions.',
    deprecated: false,
    mcpTools: ['create_modernization_intent', 'select_modernization_strategy', 'create_modernization_plan', 'create_modernization_stages', 'classify_existing_elements', 'recommend_modernization']
  },
  'alper-behavior-preservation': {
    action: 'REWRITE',
    capabilityFamily: 'MODERNIZATION',
    newOwner: 'alper-behavior-preservation',
    reason: 'Enforces preservation contract, freezes behavioral baselines, routes, DB invariants, and auth.',
    deprecated: false,
    mcpTools: ['create_preservation_contract', 'create_behavioral_baseline', 'detect_regression']
  },
  'alper-modernization-review': {
    action: 'REWRITE',
    capabilityFamily: 'MODERNIZATION',
    newOwner: 'alper-modernization-review',
    reason: 'Evaluates modernization PRs, enforces scope guard, truthful UI, and human visual approval.',
    deprecated: false,
    mcpTools: ['evaluate_modernization_completion', 'manage_human_visual_approval']
  },
  'alper-refactoring-strategy': {
    action: 'REWRITE',
    capabilityFamily: 'MODERNIZATION',
    newOwner: 'alper-refactoring-strategy',
    reason: 'Safe refactoring roadmaps using Strangler Fig, Branch-by-Abstraction, and ADR documentation.',
    deprecated: false,
    mcpTools: ['generate_adr', 'create_action_plan', 'evaluate_change_risk']
  },
  'alper-design-modernize': {
    action: 'DEPRECATE',
    capabilityFamily: 'MODERNIZATION',
    newOwner: 'alper-modernization-planner',
    reason: 'Phase 0 fixed 4-phase shell rewrite path superseded by Phase 1F Modernization Engine.',
    deprecated: true,
    replacement: 'alper-modernization-planner',
    mcpTools: []
  },
  'alper-safe-refactor': {
    action: 'MERGE',
    capabilityFamily: 'MODERNIZATION',
    newOwner: 'alper-refactoring-strategy',
    reason: 'Merged into alper-refactoring-strategy to eliminate split-brain refactoring guidance.',
    deprecated: true,
    replacement: 'alper-refactoring-strategy',
    mcpTools: []
  },
  'alper-regression-guard': {
    action: 'MERGE',
    capabilityFamily: 'MODERNIZATION',
    newOwner: 'alper-behavior-preservation',
    reason: 'Merged into alper-behavior-preservation which provides the canonical behavioral baseline contract.',
    deprecated: true,
    replacement: 'alper-behavior-preservation',
    mcpTools: []
  },

  // 4. Project Intelligence, Memory & Governance
  'alper-project-intelligence': {
    action: 'REWRITE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    newOwner: 'alper-project-intelligence',
    reason: 'Version-controlled project memory in .alper-design-os/project, architecture graph, and knowledge health.',
    deprecated: false,
    mcpTools: ['initialize_project_intelligence', 'load_project_intelligence', 'record_business_rule', 'build_project_architecture_graph', 'create_project_snapshot', 'detect_knowledge_conflicts', 'evaluate_project_knowledge_health', 'record_project_invariant']
  },
  'alper-decision-management': {
    action: 'REWRITE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    newOwner: 'alper-decision-management',
    reason: 'Durable ADR lifecycle management and bidirectional superseding with provenance checks.',
    deprecated: false,
    mcpTools: ['record_project_decision', 'generate_adr']
  },
  'alper-change-impact-analysis': {
    action: 'REWRITE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    newOwner: 'alper-change-impact-analysis',
    reason: 'Calculates blast radius, affected modules, database entities, APIs, and tests.',
    deprecated: false,
    mcpTools: ['analyze_change_impact']
  },
  'alper-project-continuation': {
    action: 'REWRITE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    newOwner: 'alper-project-continuation',
    reason: 'Truthful project onboarding for agent sessions via durable intelligence snapshots and drift detection.',
    deprecated: false,
    mcpTools: ['build_task_context', 'detect_project_drift', 'load_project_intelligence']
  },
  'alper-continuous-improvement': {
    action: 'REWRITE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    newOwner: 'alper-continuous-improvement',
    reason: 'Records lessons learned and produces governance improvement proposals with human approval gates.',
    deprecated: false,
    mcpTools: ['record_lesson_learned', 'propose_improvement_candidate']
  },
  'alper-change-planner': {
    action: 'REWRITE',
    capabilityFamily: 'GOVERNANCE',
    newOwner: 'alper-change-planner',
    reason: '17-step change lifecycle, AgentActionPlan generation, and blast radius assessment.',
    deprecated: false,
    mcpTools: ['create_action_plan', 'evaluate_change_risk', 'classify_code_paths', 'create_execution_journal', 'route_context', 'route_tool']
  },
  'alper-scope-guard': {
    action: 'REWRITE',
    capabilityFamily: 'GOVERNANCE',
    newOwner: 'alper-scope-guard',
    reason: 'Enforces scope boundaries, prevents silent creep, and blocks uninvited modifications.',
    deprecated: false,
    mcpTools: ['evaluate_scope']
  },
  'alper-git-safety': {
    action: 'REWRITE',
    capabilityFamily: 'GOVERNANCE',
    newOwner: 'alper-git-safety',
    reason: 'Prevents destructive Git commands (reset --hard, force push) and manages checkpoint plans.',
    deprecated: false,
    mcpTools: ['create_checkpoint_plan']
  },
  'alper-independent-review': {
    action: 'REWRITE',
    capabilityFamily: 'GOVERNANCE',
    newOwner: 'alper-independent-review',
    reason: 'Unbiased second-pass code and diff review across 12 objective quality dimensions.',
    deprecated: false,
    mcpTools: ['review_change']
  },
  'alper-evidence-review': {
    action: 'REWRITE',
    capabilityFamily: 'GOVERNANCE',
    newOwner: 'alper-evidence-review',
    reason: 'Universal invariant: NO CLAIM WITHOUT EVIDENCE across 13 concrete evidence kinds.',
    deprecated: false,
    mcpTools: ['create_verification_plan', 'normalize_verification_evidence', 'evaluate_completion_claim']
  },

  // 5. Software & Database Architecture
  'alper-architecture': {
    action: 'REWRITE',
    capabilityFamily: 'ARCHITECTURE',
    newOwner: 'alper-architecture',
    reason: 'Structural architecture discovery, style classification, subsystem boundaries, and stack recommendations.',
    deprecated: false,
    mcpTools: ['analyze_architecture', 'generate_adr', 'recommend_architecture', 'recommend_stack']
  },
  'alper-architecture-planner': {
    action: 'MERGE',
    capabilityFamily: 'ARCHITECTURE',
    newOwner: 'alper-architecture',
    reason: 'Merged into alper-architecture to eliminate duplicate architecture planning workflows.',
    deprecated: true,
    replacement: 'alper-architecture',
    mcpTools: []
  },
  'alper-architecture-audit': {
    action: 'MERGE',
    capabilityFamily: 'ARCHITECTURE',
    newOwner: 'alper-architecture',
    reason: 'Merged into alper-architecture which provides comprehensive architectural analysis and boundary audits.',
    deprecated: true,
    replacement: 'alper-architecture',
    mcpTools: []
  },
  'alper-database-designer': {
    action: 'REWRITE',
    capabilityFamily: 'DATA_ENGINEERING',
    newOwner: 'alper-database-designer',
    reason: 'Grounded business entity derivation, schema normalization, relationships, and ACID data integrity.',
    deprecated: false,
    mcpTools: ['analyze_database_schema', 'create_database_blueprint']
  },
  'alper-database-engineering': {
    action: 'MERGE',
    capabilityFamily: 'DATA_ENGINEERING',
    newOwner: 'alper-database-designer',
    reason: 'Merged into alper-database-designer to consolidate schema and relational database modeling.',
    deprecated: true,
    replacement: 'alper-database-designer',
    mcpTools: []
  },
  'alper-data-integrity': {
    action: 'MERGE',
    capabilityFamily: 'DATA_ENGINEERING',
    newOwner: 'alper-database-designer',
    reason: 'Merged into alper-database-designer to enforce ACID transactions and data consistency at schema level.',
    deprecated: true,
    replacement: 'alper-database-designer',
    mcpTools: []
  },
  'alper-migration-safety': {
    action: 'REWRITE',
    capabilityFamily: 'DATA_ENGINEERING',
    newOwner: 'alper-migration-safety',
    reason: 'Classifies DDL migration risk (SAFE/REVIEW/DANGEROUS) and enforces expand/contract zero-downtime evolution.',
    deprecated: false,
    mcpTools: ['analyze_database_schema']
  },
  'alper-sql-performance': {
    action: 'REWRITE',
    capabilityFamily: 'DATA_ENGINEERING',
    newOwner: 'alper-sql-performance',
    reason: 'Diagnoses N+1 query loops, missing foreign key indexes, and enforces keyset pagination over offset.',
    deprecated: false,
    mcpTools: ['analyze_database_schema']
  },
  'alper-api-designer': {
    action: 'REWRITE',
    capabilityFamily: 'API_ENGINEERING',
    newOwner: 'alper-api-designer',
    reason: 'OpenAPI 3.1.0 REST API design, RFC 9457 Problem Details, pagination, and RBAC auth model.',
    deprecated: false,
    mcpTools: ['create_api_blueprint', 'create_auth_model', 'evaluate_api_compatibility', 'search_public_apis']
  },
  'alper-api-architecture': {
    action: 'MERGE',
    capabilityFamily: 'API_ENGINEERING',
    newOwner: 'alper-api-designer',
    reason: 'Merged into alper-api-designer to prevent conflicting API specification and lifecycle guidance.',
    deprecated: true,
    replacement: 'alper-api-designer',
    mcpTools: []
  },

  // 6. Design Language, Patterns & Sources
  'alper-design-language': {
    action: 'REWRITE',
    capabilityFamily: 'DESIGN_UX',
    newOwner: 'alper-design-language',
    reason: 'Technology-agnostic DTCG tokens, multi-pane workbench layouts, and information density.',
    deprecated: false,
    mcpTools: ['get_design_tokens', 'create_design_plan', 'create_design_intent']
  },
  'alper-design-personality': {
    action: 'REWRITE',
    capabilityFamily: 'DESIGN_UX',
    newOwner: 'alper-design-personality',
    reason: 'Synthesizes quantitative 6-axis design personality avoiding generic unbranded AI templates.',
    deprecated: false,
    mcpTools: ['select_design_personality', 'create_design_intent']
  },
  'alper-pattern-graph': {
    action: 'REWRITE',
    capabilityFamily: 'DESIGN_UX',
    newOwner: 'alper-pattern-graph',
    reason: 'Navigates and applies the 28 technology-independent UX patterns (Gantt, Dense Grid, Command Palette, etc.).',
    deprecated: false,
    mcpTools: ['recommend_ux_patterns', 'search_design_patterns', 'search_patterns', 'inspect_pattern']
  },
  'alper-design-critic': {
    action: 'REWRITE',
    capabilityFamily: 'DESIGN_UX',
    newOwner: 'alper-design-critic',
    reason: 'Evaluates layout shifts, AI design smells, visual hierarchy defects, and design antipatterns.',
    deprecated: false,
    mcpTools: ['evaluate_design_antipatterns']
  },
  'alper-ui-blueprint': {
    action: 'REWRITE',
    capabilityFamily: 'DESIGN_UX',
    newOwner: 'alper-ui-blueprint',
    reason: 'Declarative UI Blueprint DSL for pages, components, and app shells with state contracts.',
    deprecated: false,
    mcpTools: ['create_page_blueprint', 'create_component_blueprint', 'create_app_shell_blueprint', 'create_page_inventory']
  },
  'alper-ui-recipe': {
    action: 'REWRITE',
    capabilityFamily: 'DESIGN_UX',
    newOwner: 'alper-ui-recipe',
    reason: 'Canonical UI recipes defining standard layouts, responsive regions, and component interactions.',
    deprecated: false,
    mcpTools: ['create_ui_recipe']
  },
  'alper-cross-stack-rendering': {
    action: 'REWRITE',
    capabilityFamily: 'DESIGN_UX',
    newOwner: 'alper-cross-stack-rendering',
    reason: 'Renders blueprints into semantic code across HTML/CSS/JS, React, Laravel Blade, and ASP.NET Razor.',
    deprecated: false,
    mcpTools: ['render_blueprint', 'render_component']
  },
  'alper-renderer-parity': {
    action: 'REWRITE',
    capabilityFamily: 'DESIGN_UX',
    newOwner: 'alper-renderer-parity',
    reason: 'Verifies visual and behavioral parity across different technology stack renderers.',
    deprecated: false,
    mcpTools: ['compare_renderer_parity']
  },
  'alper-source-intelligence': {
    action: 'REWRITE',
    capabilityFamily: 'SOURCE_INTELLIGENCE',
    newOwner: 'alper-source-intelligence',
    reason: 'Discovers, inspects, ranks, and licenses 65+ authoritative design systems, primitives, and icon/chart libraries.',
    deprecated: false,
    mcpTools: ['discover_sources', 'search_sources', 'rank_sources', 'inspect_source', 'recommend_sources_for_product', 'recommend_sources_for_stack', 'check_source_license', 'discover_design_sources', 'search_design_sources', 'inspect_design_source', 'sync_design_sources', 'recommend_design_sources', 'recommend_icon_system', 'recommend_chart_library', 'recommend_data_grid', 'explain_source_recommendation', 'search_components', 'search_mcp_servers']
  },
  'alper-design-source-ranking': {
    action: 'MERGE',
    capabilityFamily: 'SOURCE_INTELLIGENCE',
    newOwner: 'alper-source-intelligence',
    reason: 'Merged into alper-source-intelligence which houses the weighted multi-criteria ranking engine.',
    deprecated: true,
    replacement: 'alper-source-intelligence',
    mcpTools: []
  },
  'alper-registry-discovery': {
    action: 'REWRITE',
    capabilityFamily: 'SOURCE_INTELLIGENCE',
    newOwner: 'alper-registry-discovery',
    reason: 'Discovers and inspects community blocks and component registries (shadcn/ui, Aceternity, Kokonut).',
    deprecated: false,
    mcpTools: ['search_registries', 'search_registry_components', 'inspect_registry_component', 'inspect_alper_registry']
  },

  // 7. Security & Engineering Guardrails
  'alper-secure-coding': {
    action: 'REWRITE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-secure-coding',
    reason: 'Enforces proactive secure coding practices based on OWASP Top 10 2025, ASVS 5.0, and engineering policies.',
    deprecated: false,
    mcpTools: ['generate_engineering_policy', 'create_auth_model']
  },
  'alper-security-audit': {
    action: 'REWRITE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-security-audit',
    reason: 'Passive security audits, STRIDE threat models, and release gate evaluation.',
    deprecated: false,
    mcpTools: ['run_safe_security_scan', 'generate_threat_model', 'evaluate_release_gates', 'detect_tool_capabilities']
  },
  'alper-api-security': {
    action: 'REWRITE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-api-security',
    reason: 'OWASP API Top 10 defense, BOLA/IDOR prevention, rate limiting, and payload schema hardening.',
    deprecated: false,
    mcpTools: ['evaluate_release_gates']
  },
  'alper-secret-management': {
    action: 'REWRITE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-secret-management',
    reason: 'Zero-tolerance secret leak prevention, token/key scanning, and .env governance.',
    deprecated: false,
    mcpTools: ['run_safe_security_scan']
  },
  'alper-supply-chain-security': {
    action: 'REWRITE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-supply-chain-security',
    reason: 'NIST SSDF, SLSA provenance, CycloneDX SBOM generation, dependency CVE hygiene, and SemVer lifecycle.',
    deprecated: false,
    mcpTools: ['evaluate_release_gates', 'run_safe_security_scan']
  },
  'alper-ai-skill-audit': {
    action: 'REWRITE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-ai-skill-audit',
    reason: 'Audits third-party AI design skills for prompt injection hazards and unauthorized tool invocations.',
    deprecated: false,
    mcpTools: ['discover_ai_skills', 'inspect_ai_skill']
  },
  'alper-ai-coding-safety': {
    action: 'MERGE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-secure-coding',
    reason: 'Merged into alper-secure-coding and AGENTS.md durable rules to eliminate fragmented AI safety advice.',
    deprecated: true,
    replacement: 'alper-secure-coding',
    mcpTools: []
  },
  'alper-dependency-hygiene': {
    action: 'MERGE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-supply-chain-security',
    reason: 'Merged into alper-supply-chain-security to unify dependency vulnerability and lockfile management.',
    deprecated: true,
    replacement: 'alper-supply-chain-security',
    mcpTools: []
  },
  'alper-dependency-lifecycle': {
    action: 'MERGE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-supply-chain-security',
    reason: 'Merged into alper-supply-chain-security to unify SemVer upgrade policies and SBOM tracking.',
    deprecated: true,
    replacement: 'alper-supply-chain-security',
    mcpTools: []
  },
  'alper-code-quality': {
    action: 'REWRITE',
    capabilityFamily: 'SECURITY',
    newOwner: 'alper-code-quality',
    reason: 'Enforces static analysis, typed linting (ESLint, PHPStan, Roslyn), and cognitive complexity limits.',
    deprecated: false,
    mcpTools: ['detect_tool_capabilities', 'evaluate_release_gates']
  },

  // 8. QA, Testing & Reliability
  'alper-browser-qa': {
    action: 'REWRITE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-browser-qa',
    reason: 'Orchestrates Playwright E2E and Chrome DevTools runtime inspection, console errors, and cross-browser testing.',
    deprecated: false,
    mcpTools: ['generate_playwright_test', 'generate_qa_report']
  },
  'alper-playwright-testing': {
    action: 'MERGE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-browser-qa',
    reason: 'Merged into alper-browser-qa which serves as the canonical Playwright testing orchestrator.',
    deprecated: true,
    replacement: 'alper-browser-qa',
    mcpTools: []
  },
  'alper-runtime-debugging': {
    action: 'MERGE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-browser-qa',
    reason: 'Merged into alper-browser-qa which inspects live runtime console errors, exceptions, and network waterfalls.',
    deprecated: true,
    replacement: 'alper-browser-qa',
    mcpTools: []
  },
  'alper-cross-browser-testing': {
    action: 'MERGE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-browser-qa',
    reason: 'Merged into alper-browser-qa to eliminate fragmented browser compatibility guidance.',
    deprecated: true,
    replacement: 'alper-browser-qa',
    mcpTools: []
  },
  'alper-visual-regression': {
    action: 'REWRITE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-visual-regression',
    reason: 'Evaluates pixel and DOM visual diffs across 4 responsive viewports and light/dark themes.',
    deprecated: false,
    mcpTools: ['generate_qa_report']
  },
  'alper-accessibility-testing': {
    action: 'REWRITE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-accessibility-testing',
    reason: 'Audits WCAG 2.1 AA/AAA compliance, keyboard navigation, contrast ratios, and aria attributes.',
    deprecated: false,
    mcpTools: ['audit_accessibility', 'generate_qa_report']
  },
  'alper-testing-strategy': {
    action: 'REWRITE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-testing-strategy',
    reason: 'Synthesizes project-appropriate test pyramids across Static, Unit, Integration, API, E2E, and Performance.',
    deprecated: false,
    mcpTools: ['generate_test_pyramid', 'generate_qa_report']
  },
  'alper-contract-testing': {
    action: 'REWRITE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-contract-testing',
    reason: 'Pact consumer-driven contracts, API contract validation, and breaking change prevention.',
    deprecated: false,
    mcpTools: ['evaluate_api_compatibility']
  },
  'alper-api-testing': {
    action: 'MERGE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-contract-testing',
    reason: 'Merged into alper-contract-testing to unify API contract and functional validation.',
    deprecated: true,
    replacement: 'alper-contract-testing',
    mcpTools: []
  },
  'alper-regression-testing': {
    action: 'REWRITE',
    capabilityFamily: 'QA_TESTING',
    newOwner: 'alper-regression-testing',
    reason: 'Orchestrates selective smoke and regression test suites safeguarding critical business funnels.',
    deprecated: false,
    mcpTools: ['generate_qa_report', 'detect_regression']
  },
  'alper-performance-engineering': {
    action: 'REWRITE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    newOwner: 'alper-performance-engineering',
    reason: 'Enforces Core Web Vitals (LCP, INP, CLS), asset budgets, pagination, and DevTools trace analysis.',
    deprecated: false,
    mcpTools: ['generate_qa_report']
  },
  'alper-performance-testing': {
    action: 'MERGE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    newOwner: 'alper-performance-engineering',
    reason: 'Merged into alper-performance-engineering to unite performance auditing and testing budgets.',
    deprecated: true,
    replacement: 'alper-performance-engineering',
    mcpTools: []
  },
  'alper-reliability': {
    action: 'REWRITE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    newOwner: 'alper-reliability',
    reason: 'Defines SLIs/SLOs, circuit breakers, backoff strategies, bulkheads, and graceful degradation.',
    deprecated: false,
    mcpTools: ['evaluate_release_gates']
  },
  'alper-resilience': {
    action: 'MERGE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    newOwner: 'alper-reliability',
    reason: 'Merged into alper-reliability to unify system resilience, fault tolerance, and SLO governance.',
    deprecated: true,
    replacement: 'alper-reliability',
    mcpTools: []
  },
  'alper-observability': {
    action: 'REWRITE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    newOwner: 'alper-observability',
    reason: 'OpenTelemetry tracing, metrics, structured logging, correlation IDs, PII redaction, and track-trace telemetry.',
    deprecated: false,
    mcpTools: ['audit_track_trace_telemetry']
  },
  'alper-release-safety': {
    action: 'REWRITE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    newOwner: 'alper-release-safety',
    reason: 'Canary rollouts, feature flags, DB backwards compatibility, and automated release gates.',
    deprecated: false,
    mcpTools: ['evaluate_release_gates']
  },
  'alper-load-testing': {
    action: 'REWRITE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    newOwner: 'alper-load-testing',
    reason: 'Benchmarks throughput and latency under stress with Grafana k6 under explicit operator approval.',
    deprecated: false,
    mcpTools: ['generate_qa_report']
  },

  // 9. New Core Capabilities (Closing F-10 & Operator Execution Gap)
  'alper-truthful-ui': {
    action: 'NEW_CANONICAL',
    capabilityFamily: 'TRUTHFUL_UI',
    newOwner: 'alper-truthful-ui',
    reason: 'First-class truthful UI governance: data provenance, page intent, source authority, and content truth gate.',
    deprecated: false,
    mcpTools: ['evaluate_truthful_ui', 'audit_data_provenance', 'evaluate_page_intent', 'audit_information_relevance', 'classify_source_authority', 'evaluate_content_truth_gate']
  },
  'alper-operator-execution': {
    action: 'NEW_CANONICAL',
    capabilityFamily: 'OPERATOR_EXECUTION',
    newOwner: 'alper-operator-execution',
    reason: 'Deterministic corporate execution fallback: manual run bundle generation (RUN.ps1), evidence verification, and browser runtime resolution.',
    deprecated: false,
    mcpTools: ['create_manual_run_bundle', 'verify_manual_run_evidence', 'resolve_browser_runtime', 'run_operator_doctor', 'create_environment_profile', 'detect_tool_capabilities']
  }
};
