import type { EvidenceKind } from './types.js';
/**
 * CANONICAL SKILL REGISTRY (Phase 1H.2B)
 * Single Source of Truth for all 74 Skills in ALPER DESIGN OS.
 * Governs active capability boundaries, mode applicability, project intelligence loading,
 * and user-facing vs internal orchestration classification.
 */

export type SkillStatus = 'ACTIVE' | 'DEPRECATED';

export type UserFacingType = 'USER_ENTRYPOINT' | 'INTERNAL_ORCHESTRATION' | 'SUPPORTING_CAPABILITY';

export type ProjectIntelligenceRequirement = 'REQUIRED' | 'CONDITIONAL' | 'NOT_REQUIRED';

export type DiscoveryBehavior = 'CLARIFY_AMBIGUITY' | 'NOT_APPLICABLE' | 'STRICT_BLOCK';

export type OperationalMode = 'GREENFIELD' | 'MODERNIZATION' | 'REPAIR' | 'CONTINUOUS_GOVERNANCE';

export type CapabilityFamily =
  | 'PRODUCT_DISCOVERY'
  | 'GREENFIELD_ENGINEERING'
  | 'EXISTING_PROJECT_ANALYSIS'
  | 'REPAIR'
  | 'MODERNIZATION'
  | 'PROJECT_INTELLIGENCE'
  | 'GOVERNANCE'
  | 'TRUTHFUL_UI'
  | 'OPERATOR_EXECUTION'
  | 'ARCHITECTURE'
  | 'DATA_ENGINEERING'
  | 'API_ENGINEERING'
  | 'DESIGN_UX'
  | 'SOURCE_INTELLIGENCE'
  | 'SECURITY'
  | 'QA_TESTING'
  | 'PERFORMANCE_RELIABILITY';

export interface CanonicalSkillDefinition {
  name: string;
  title: string;
  status: SkillStatus;
  capabilityFamily: CapabilityFamily;
  userFacingType: UserFacingType;
  userFacing: boolean;
  modeApplicability: OperationalMode[];
  projectIntelligenceLoading: ProjectIntelligenceRequirement;
  discoveryBehavior: DiscoveryBehavior;
  humanCheckpoints: string[];
  sourceStrategy: string;
  evidenceRequirements: EvidenceKind[];
  evidenceArtifacts?: string[];
  mcpTools: string[];
  relatedSkills: string[];
  reason: string;
  replacement?: string;
  corePurpose: string;
  positiveUseWhen: string[];
  negativeDoNotUseWhen: string[];
  keyWorkflow: string[];
  decisionRules: string[];
  outputContract: string[];
}

export const CAPABILITY_FAMILIES: CapabilityFamily[] = [
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

export const CANONICAL_SKILL_CATALOG: Record<string, CanonicalSkillDefinition> = {
  // =========================================================================
  // 1. PRODUCT_DISCOVERY
  // =========================================================================
  'alper-greenfield-product-analysis': {
    name: 'alper-greenfield-product-analysis',
    title: 'Greenfield Product Analysis',
    status: 'ACTIVE',
    capabilityFamily: 'PRODUCT_DISCOVERY',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'CLARIFY_AMBIGUITY',
    humanCheckpoints: ['Operator review of clarifying questions when DiscoveryReadiness is NEEDS_CLARIFICATION.'],
    sourceStrategy: 'Industry operational domain benchmarks, persona workflows, and business models.',
    evidenceRequirements: ['HEURISTIC_REVIEW', 'STATIC_ANALYSIS'],
    mcpTools: ['create_greenfield_project_profile', 'understand_product', 'research_domain'],
    relatedSkills: ['alper-domain-intelligence', 'alper-requirements-engineering', 'alper-greenfield-generator'],
    reason: 'Evaluates raw product briefs, classifies request complexity, and checks discovery readiness.',
    corePurpose: 'Evaluates raw product briefs, classifies complexity (Low/Medium/High/Extreme), identifies grounded business entities, and gates downstream engineering until discovery requirements are satisfied.',
    positiveUseWhen: [
      'A user provides a new product idea, brief, or request for clean-sheet software creation.',
      'Evaluating whether a prompt has sufficient technical grounding before scaffolding.',
      'Extracting primary business entities, operational roles, and core jobs-to-be-done.'
    ],
    negativeDoNotUseWhen: [
      'Modifying or analyzing an existing codebase (use alper-existing-project-analysis or alper-modernization-planner).',
      'Generating concrete multi-stack code scaffolding (use alper-greenfield-generator).',
      'Fixing an isolated UI or accessibility defect (use alper-design-repair).'
    ],
    keyWorkflow: [
      '1. Ingest raw product brief and domain context.',
      '2. Classify request complexity against architectural scope boudaries.',
      '3. Evaluate DiscoveryReadiness (READY vs NEEDS_CLARIFICATION).',
      '4. If ambiguous, formulate 3-5 prioritized clarifying questions.',
      '5. Output structured GreenfieldProjectProfile.'
    ],
    decisionRules: [
      'If DiscoveryReadiness !== READY, downstream scaffolding is strictly blocked.',
      'Never invent unrequested business entities or database schemas; flag ambiguity as questions.',
      'Derive grounded operational roles rather than assuming generic Admin/User personas.'
    ],
    outputContract: ['GreenfieldProjectProfile with complexity score, entity map, and discovery readiness state.']
  },

  'alper-domain-intelligence': {
    name: 'alper-domain-intelligence',
    title: 'Domain Intelligence',
    status: 'ACTIVE',
    capabilityFamily: 'PRODUCT_DISCOVERY',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'CLARIFY_AMBIGUITY',
    humanCheckpoints: ['Operator validation of specialized industry constraints (e.g. regulatory, SLA compliance).'],
    sourceStrategy: '15 industry operational benchmarks, domain terminology lexicons, and ergonomic studies.',
    evidenceRequirements: ['HEURISTIC_REVIEW'],
    mcpTools: ['research_domain', 'understand_product'],
    relatedSkills: ['alper-greenfield-product-analysis', 'alper-requirements-engineering', 'alper-pattern-graph'],
    reason: 'Provides operational domain intelligence across 15 industries without hardcoding APS terminology.',
    corePurpose: 'Injects authentic domain realities, constraints, information density targets, and user mental models across manufacturing, logistics, healthcare, retail, fintech, and 10 other verticals.',
    positiveUseWhen: [
      'Deconstructing domain-specific workflows (e.g. warehouse picking routes, ICU telemetry, cold-chain monitoring).',
      'Selecting appropriate interaction densities (high-density tables vs spacious cards).',
      'Preventing generic SaaS anti-patterns from being applied to industrial software.'
    ],
    negativeDoNotUseWhen: [
      'Writing CSS, design tokens, or visual styling (use alper-design-language).',
      'Designing database schemas and foreign keys (use alper-database-designer).',
      'Executing static code analysis or security scans (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Match domain brief to target vertical in 15-industry benchmark database.',
      '2. Identify domain operational constraints (e.g. latency budgets, finite capacity, offline resilience).',
      '3. Formulate ProductUXProfile defining information density and ergonomic targets.',
      '4. Recommend domain-appropriate UX patterns.'
    ],
    decisionRules: [
      'Reject generic SaaS tropes for high-throughput enterprise domains.',
      'Ensure domain neutrality: never force APS/manufacturing terms into fintech, healthcare, or retail briefs.'
    ],
    outputContract: ['ProductUXProfile with domain classification, operational constraints, and ergonomic requirements.']
  },

  // =========================================================================
  // 2. GREENFIELD_ENGINEERING
  // =========================================================================
  'alper-requirements-engineering': {
    name: 'alper-requirements-engineering',
    title: 'Requirements Engineering',
    status: 'ACTIVE',
    capabilityFamily: 'GREENFIELD_ENGINEERING',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'CLARIFY_AMBIGUITY',
    humanCheckpoints: ['Operator review and approval of Requirements Traceability Matrix (RTM).'],
    sourceStrategy: 'IEEE 830 / ISO/IEC/IEEE 29148 requirements specifications and user story mapping standards.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'HEURISTIC_REVIEW'],
    mcpTools: ['derive_requirements', 'create_requirement_traceability', 'generate_user_journeys'],
    relatedSkills: ['alper-greenfield-product-analysis', 'alper-greenfield-generator', 'alper-browser-qa'],
    reason: 'Derives functional/non-functional requirements, RTM, and manages acceptance criteria lifecycle.',
    corePurpose: 'Synthesizes functional and non-functional requirements, builds bidirectional RTM matrices, maps user journeys, and enforces the DEFINED -> NOT_VERIFIED acceptance criteria lifecycle.',
    positiveUseWhen: [
      'Transforming a product profile into formal functional and non-functional requirements.',
      'Establishing bidirectional traceability from user stories to database entities and tests.',
      'Creating end-to-end user journey flows with explicit state transitions.'
    ],
    negativeDoNotUseWhen: [
      'Performing high-level domain discovery before understanding the product (use alper-greenfield-product-analysis).',
      'Directly emitting source code files to disk (use alper-greenfield-generator).',
      'Diagnosing database query latency (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Ingest GreenfieldProjectProfile and user intent.',
      '2. Derive functional requirements with unique IDs (FR-01, FR-02, etc.).',
      '3. Formulate non-functional constraints (NFR-PERF, NFR-SEC, etc.).',
      '4. Generate bidirectional RTM connecting requirements to planned modules and tests.',
      '5. Initialize acceptance criteria strictly in DEFINED / NOT_VERIFIED state.'
    ],
    decisionRules: [
      'NO CLAIM WITHOUT EVIDENCE: All newly derived criteria must start in NOT_VERIFIED state.',
      'Every requirement must trace to at least one user journey and acceptance test.'
    ],
    outputContract: ['Structured RequirementsDocument, RTM traceability map, and UserJourneyCollection.']
  },

  'alper-greenfield-generator': {
    name: 'alper-greenfield-generator',
    title: 'Greenfield Project Generator',
    status: 'ACTIVE',
    capabilityFamily: 'GREENFIELD_ENGINEERING',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'STRICT_BLOCK',
    humanCheckpoints: [
      'Operator sign-off on master ProjectBlueprint before scaffolding files to disk.',
      'Stack selection confirmation when unrequested choices are marked as REVERSIBLE_ASSUMPTION.'
    ],
    sourceStrategy: 'Official production stack templates (Vite React-TS strict, Laravel 11 Blade, ASP.NET Core 8/9 Razor, Plain HTML5).',
    evidenceRequirements: ['STATIC_ANALYSIS', 'UNIT_TEST'],
    evidenceArtifacts: ['compiler-stdout', 'build-diagnostics-log', 'scaffold-tree-manifest'],
    mcpTools: ['create_project_blueprint', 'create_project_implementation_plan', 'scaffold_new_project', 'evaluate_new_project_completion', 'recommend_stack'],
    relatedSkills: ['alper-requirements-engineering', 'alper-greenfield-product-analysis', 'alper-database-designer', 'alper-api-designer'],
    reason: 'Master greenfield orchestrator enforcing Discovery Gate, scaffold correctness, and completion contract.',
    corePurpose: 'Orchestrates the entire clean-sheet greenfield lifecycle across 4 production stacks (React+Vite, Laravel Blade, ASP.NET Razor, Plain HTML), enforcing discovery gates, reversible assumptions, and honest build verification.',
    positiveUseWhen: [
      'User requests scaffolding a brand new, clean-sheet project across supported production stacks.',
      'Assembling the master NewProjectBlueprint from requirements, architecture, schema, and UI inventories.',
      'Evaluating greenfield project completion against Gate-Specific Evidence Taxonomy.'
    ],
    negativeDoNotUseWhen: [
      'Modifying or refactoring an existing repository (use alper-modernization-planner or alper-design-repair).',
      'Scaffolding before DiscoveryReadiness is formally evaluated and set to READY (use alper-greenfield-product-analysis).',
      'Diagnosing query bottlenecks in production databases (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Verify DiscoveryReadiness === READY; if not, halt and return clarifying questions.',
      '2. Assemble master ProjectBlueprint integrating stack, architecture, entities, APIs, and pages.',
      '3. Formulate dynamic dependency-driven ImplementationPlan.',
      '4. Scaffold genuine, buildable project directory structure.',
      '5. Report files generated with buildStatus: NOT_VERIFIED until authentic build evidence is captured.'
    ],
    decisionRules: [
      'Greenfield ONLY: Brownfield or partial rewrite requests must be routed to alper-modernization-planner.',
      'Build Truth Invariant: Generated files != BUILDABLE project. Never report buildable: true without compiler exit code 0 evidence.',
      'Omit Dockerfile/Compose when deploymentEnvironment is LOCAL_ONLY or STANDALONE.'
    ],
    outputContract: ['Scaffolded project directory, Master ProjectBlueprint, and CompletionEvaluationReport.']
  },

  // =========================================================================
  // 3. EXISTING_PROJECT_ANALYSIS & REPAIR
  // =========================================================================
  'alper-existing-project-analysis': {
    name: 'alper-existing-project-analysis',
    title: 'Existing Project Analysis',
    status: 'ACTIVE',
    capabilityFamily: 'EXISTING_PROJECT_ANALYSIS',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['MODERNIZATION', 'REPAIR'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'CLARIFY_AMBIGUITY',
    humanCheckpoints: ['Operator review of discovered tech debt hotspots and legacy architectural risks.'],
    sourceStrategy: 'Target project source code, package manifests (package.json, composer.json, csproj), and lockfiles.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'HEURISTIC_REVIEW'],
    mcpTools: ['profile_existing_project', 'analyze_project', 'detect_stack', 'audit_existing_ui'],
    relatedSkills: ['alper-modernization-planner', 'alper-design-repair', 'alper-behavior-preservation'],
    reason: 'Analyzes existing codebases, detects stack, profiles debt, and maps critical workflows.',
    corePurpose: 'Performs passive static inspection of brownfield codebases, identifying framework stacks, styling systems, circular dependencies, technical debt, and missing test baselines.',
    positiveUseWhen: [
      'Onboarding an existing codebase into ALPER DESIGN OS.',
      'Detecting framework versions, styling paradigms, and architectural layers.',
      'Auditing existing UI markup for accessibility flaws, layout bugs, and deprecated dependencies.'
    ],
    negativeDoNotUseWhen: [
      'Scaffolding a new clean-sheet repository (use alper-greenfield-generator).',
      'Making destructive code changes without an approved action plan (use alper-change-planner).',
      'Running active network security penetration tests (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Read workspace file manifest and detect technology stack.',
      '2. Profile code health, modular boundaries, and external dependencies.',
      '3. Audit existing UI components and styling architecture.',
      '4. Generate ExistingProjectProfile and initialize project architecture graph.'
    ],
    decisionRules: [
      'Strictly read-only: Never mutate workspace files during analysis.',
      'Empty repositories must truthfully report INSUFFICIENT_DATA rather than hallucinating health scores.'
    ],
    outputContract: ['ExistingProjectProfile containing detected stack, health scores, and debt inventory.']
  },

  'alper-design-repair': {
    name: 'alper-design-repair',
    title: 'Design Repair',
    status: 'ACTIVE',
    capabilityFamily: 'REPAIR',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['REPAIR'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Human visual inspection of repaired component across responsive viewports.'],
    sourceStrategy: 'Existing project CSS/styling framework, WCAG 2.2 AA accessibility rules, and layout specs.',
    evidenceRequirements: ['VISUAL_DIFF', 'BROWSER_TEST', 'STATIC_ANALYSIS'],
    mcpTools: ['audit_accessibility', 'audit_responsive', 'evaluate_scope', 'review_change'],
    relatedSkills: ['alper-browser-qa', 'alper-visual-regression', 'alper-scope-guard', 'alper-git-safety'],
    reason: 'Surgical UI/UX repair preserving existing architecture and styles with zero uninvited rewrite.',
    corePurpose: 'Executes minimal-risk, highly targeted remediations for broken UI components, responsive layout overflow, WCAG 2.2 contrast/focus defects, and visual glitches without touching backend or database files.',
    positiveUseWhen: [
      'Fixing a specific UI layout glitch, overflow bug, or broken responsive breakpoint.',
      'Remediating an accessibility violation (e.g. missing ARIA label, low contrast ratio).',
      'Polishing interactive states (hover, focus-visible, active) in existing components.'
    ],
    negativeDoNotUseWhen: [
      'Modernizing entire legacy application shells or migrating frameworks (use alper-modernization-planner).',
      'Diagnosing backend SQL query latency (use alper-sql-performance).',
      'Executing high-level security vulnerability audits (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Identify target UI component and inspect existing CSS/styling rules.',
      '2. Audit responsive breakpoints (390px, 768px, 1440px) and WCAG compliance.',
      '3. Formulate minimal single-block diff preserving all existing classes and styles.',
      '4. Verify fix with Playwright or Chrome DevTools inspection.',
      '5. Validate zero scope creep outside requested UI element.'
    ],
    decisionRules: [
      'Zero uninvited rewrites: Preserve existing styling technology (Bootstrap, Tailwind, BEM, CSS Modules).',
      'Never touch backend controllers, database migrations, or server routes during UI repair.'
    ],
    outputContract: ['Surgical code edit, visual verification report, and scope compliance record.']
  },

  // =========================================================================
  // 4. MODERNIZATION
  // =========================================================================
  'alper-modernization-planner': {
    name: 'alper-modernization-planner',
    title: 'Modernization Planner',
    status: 'ACTIVE',
    capabilityFamily: 'MODERNIZATION',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['MODERNIZATION'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'CLARIFY_AMBIGUITY',
    humanCheckpoints: [
      'Operator sign-off on Element Classification Matrix (KEEP/IMPROVE/REPLACE/DEFER/REMOVE).',
      'Approval of ModernizationStages roadmap before stage execution.'
    ],
    sourceStrategy: 'Target modern framework standards, Design Token Community Group (DTCG) specs, and Strangler Fig patterns.',
    evidenceRequirements: ['HEURISTIC_REVIEW', 'STATIC_ANALYSIS'],
    mcpTools: ['create_modernization_intent', 'select_modernization_strategy', 'create_modernization_plan', 'create_modernization_stages', 'classify_existing_elements', 'recommend_modernization'],
    relatedSkills: ['alper-behavior-preservation', 'alper-modernization-review', 'alper-refactoring-strategy'],
    reason: 'Formulates staged modernization plans, change classification, and candidate design directions.',
    corePurpose: 'Engineers phased, non-destructive migration roadmaps for legacy codebases (e.g. PHP/Blade, ASP.NET WebForms/Razor), breaking migrations into incremental, continuously buildable stages.',
    positiveUseWhen: [
      'Migrating a legacy application to modern styling, design tokens, or framework components.',
      'Classifying hundreds of legacy elements into KEEP, IMPROVE, REPLACE, DEFER, or REMOVE.',
      'Formulating a multi-stage modernization roadmap with rollback safety checkpoints.'
    ],
    negativeDoNotUseWhen: [
      'Building a clean-sheet greenfield app from scratch (use alper-greenfield-generator).',
      'Fixing a single isolated UI padding or button bug (use alper-design-repair).',
      'Executing uncoordinated bulk rewrites without behavioral baseline freezing.'
    ],
    keyWorkflow: [
      '1. Ingest ExistingProjectProfile and operator modernization intent.',
      '2. Classify candidate components and files across the 5 element classes.',
      '3. Select modernization strategy (Design Tokens -> Shell -> Core Components -> Full Parity).',
      '4. Generate multi-stage ModernizationPlan with explicit entry/exit criteria for each stage.',
      '5. Hand off to alper-behavior-preservation to freeze baseline contracts.'
    ],
    decisionRules: [
      'Never propose wholesale rewrites when incremental strangler modernization is feasible.',
      'Every modernization stage must leave the codebase in a compilable, testable state.'
    ],
    outputContract: ['ModernizationPlan, ElementClassificationMatrix, and ModernizationStage definitions.']
  },

  'alper-behavior-preservation': {
    name: 'alper-behavior-preservation',
    title: 'Behavioral Preservation',
    status: 'ACTIVE',
    capabilityFamily: 'MODERNIZATION',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['MODERNIZATION'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator confirmation if legacy quirk must be deliberately broken or preserved.'],
    sourceStrategy: 'Existing project route tables, OpenAPI/HTTP contracts, session models, and database schemas.',
    evidenceRequirements: ['INTEGRATION_TEST', 'UNIT_TEST', 'STATIC_ANALYSIS'],
    mcpTools: ['create_preservation_contract', 'create_behavioral_baseline', 'detect_regression'],
    relatedSkills: ['alper-modernization-planner', 'alper-modernization-review', 'alper-contract-testing'],
    reason: 'Enforces preservation contract, freezes behavioral baselines, routes, DB invariants, and auth.',
    corePurpose: 'Extracts and freezes behavioral contracts (HTTP routes, status codes, payload shapes, database constraints, auth sessions) before modernization edits begin, detecting any regression.',
    positiveUseWhen: [
      'Establishing automated regression guardrails prior to modifying legacy code.',
      'Freezing existing API endpoints, request/response formats, and database invariants.',
      'Verifying that modernization edits have zero impact on backend business logic.'
    ],
    negativeDoNotUseWhen: [
      'Creating new greenfield requirements (use alper-requirements-engineering).',
      'Executing single-line CSS visual tweaks (use alper-design-repair).',
      'Running external penetration testing (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Scan legacy codebase for HTTP endpoints, route parameters, and auth guards.',
      '2. Record behavioral baseline snapshots into .alper-design-os/project/.',
      '3. Formulate BehavioralPreservationContract specifying frozen invariants.',
      '4. Execute comparison checks after modernization stages to verify 100% behavioral parity.'
    ],
    decisionRules: [
      'Zero tolerated behavioral breakage: Any alteration to route parameters or response schemas flags a regression.',
      'Legacy quirks that clients depend on must be preserved unless an explicit ADR supersedes them.'
    ],
    outputContract: ['BehavioralPreservationContract, BaselineSnapshot, and RegressionAuditReport.']
  },

  'alper-modernization-review': {
    name: 'alper-modernization-review',
    title: 'Modernization Review',
    status: 'ACTIVE',
    capabilityFamily: 'MODERNIZATION',
    userFacingType: 'INTERNAL_ORCHESTRATION',
    userFacing: false,
    modeApplicability: ['MODERNIZATION'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Human visual sign-off on modernized UI screens and theme changes.'],
    sourceStrategy: 'ModernizationStage exit criteria, BehavioralContract invariants, and git diff artifacts.',
    evidenceRequirements: ['VISUAL_DIFF', 'BROWSER_TEST', 'INTEGRATION_TEST'],
    mcpTools: ['evaluate_modernization_completion', 'manage_human_visual_approval'],
    relatedSkills: ['alper-modernization-planner', 'alper-behavior-preservation', 'alper-independent-review'],
    reason: 'Evaluates modernization PRs, enforces scope guard, truthful UI, and human visual approval.',
    corePurpose: 'Internal gatekeeper that validates staged modernization deliverables against stage exit criteria, behavioral preservation baselines, and human visual approvals before stage completion.',
    positiveUseWhen: [
      'Concluding a modernization stage and evaluating whether exit criteria are satisfied.',
      'Verifying that visual modernizations did not introduce functional regressions.',
      'Managing human visual sign-off packages for modernized user interfaces.'
    ],
    negativeDoNotUseWhen: [
      'Initial task intake and planning (use alper-modernization-planner).',
      'Standalone security vulnerability auditing (use alper-security-audit).',
      'Reviewing non-modernization general bugfix PRs (use alper-independent-review).'
    ],
    keyWorkflow: [
      '1. Collect staged code diffs and verification evidence.',
      '2. Validate stage deliverables against declared ModernizationStage exit criteria.',
      '3. Verify behavioral preservation contract via automated comparison.',
      '4. Request human visual approval for UI changes.',
      '5. Emit stage completion verdict.'
    ],
    decisionRules: [
      'A modernization stage cannot be marked complete if any behavioral contract baseline fails.',
      'Human visual approval is mandatory for stages modifying core application shell or design tokens.'
    ],
    outputContract: ['ModernizationStageCompletionReport and VisualApprovalArtifact.']
  },

  'alper-refactoring-strategy': {
    name: 'alper-refactoring-strategy',
    title: 'Refactoring Strategy',
    status: 'ACTIVE',
    capabilityFamily: 'MODERNIZATION',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['MODERNIZATION', 'REPAIR'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Architectural sign-off on major structural refactorings or pattern changes.'],
    sourceStrategy: 'Martin Fowler Refactoring catalog, Strangler Fig pattern, and Branch-by-Abstraction architectures.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'UNIT_TEST'],
    mcpTools: ['generate_adr', 'create_action_plan', 'evaluate_change_risk'],
    relatedSkills: ['alper-modernization-planner', 'alper-behavior-preservation', 'alper-architecture'],
    reason: 'Safe refactoring roadmaps using Strangler Fig, Branch-by-Abstraction, and ADR documentation.',
    corePurpose: 'Designs surgical, behavior-preserving refactoring roadmaps for technical debt remediation, modular decoupling, and pattern alignment using Strangler Fig and Branch-by-Abstraction.',
    positiveUseWhen: [
      'Decoupling tightly coupled monolithic modules or eliminating circular dependencies.',
      'Introducing abstractions or interfaces between legacy components and new implementations.',
      'Drafting Architecture Decision Records (ADRs) for significant code reorganizations.'
    ],
    negativeDoNotUseWhen: [
      'Adding new product features or business requirements (use alper-requirements-engineering).',
      'Fixing an isolated CSS visual bug (use alper-design-repair).',
      'Running penetration tests (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Identify refactoring target and map existing call graph.',
      '2. Select refactoring technique (Branch-by-Abstraction, Extract Module, Parameterize).',
      '3. Formulate risk-assessed ActionPlan with atomic, reversible steps.',
      '4. Document rationale and tradeoffs in an Architecture Decision Record (ADR).'
    ],
    decisionRules: [
      'Refactoring must never change observable runtime behavior.',
      'Always maintain green test suites before, during, and after each atomic refactoring step.'
    ],
    outputContract: ['RefactoringRoadmap, AgentActionPlan, and ArchitectureDecisionRecord.']
  },

  // =========================================================================
  // 5. PROJECT_INTELLIGENCE & GOVERNANCE
  // =========================================================================
  'alper-project-intelligence': {
    name: 'alper-project-intelligence',
    title: 'Project Intelligence',
    status: 'ACTIVE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review and confirmation when resolving conflicting business rules.'],
    sourceStrategy: 'Version-controlled repository metadata in .alper-design-os/project/, AST analysis, and ADRs.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: [
      'initialize_project_intelligence',
      'load_project_intelligence',
      'record_business_rule',
      'build_project_architecture_graph',
      'create_project_snapshot',
      'detect_knowledge_conflicts',
      'evaluate_project_knowledge_health',
      'record_project_invariant'
    ],
    relatedSkills: ['alper-decision-management', 'alper-project-continuation', 'alper-change-impact-analysis'],
    reason: 'Version-controlled project memory in .alper-design-os/project, architecture graph, and knowledge health.',
    corePurpose: 'Initializes, maintains, and audits durable project memory in .alper-design-os/project/, building code-grounded architecture graphs, recording provenanced business rules, and preventing agent amnesia.',
    positiveUseWhen: [
      'Initializing persistent project memory for a repository.',
      'Recording confirmed business rules, technical invariants, or architectural constraints.',
      'Auditing project knowledge health and resolving conflicting assumptions.'
    ],
    negativeDoNotUseWhen: [
      'Styling UI components or tokens (use alper-design-language).',
      'Running browser integration test suites (use alper-browser-qa).',
      'Executing single-line CSS fixes (use alper-design-repair).'
    ],
    keyWorkflow: [
      '1. Inspect .alper-design-os/project/ directory structure.',
      '2. Parse codebase AST to build or update ProjectArchitectureGraph.',
      '3. Record business rules with explicit provenance (DERIVED vs USER_CONFIRMED).',
      '4. Detect contradictory knowledge claims or stale invariants.',
      '5. Evaluate truthful project knowledge health score.'
    ],
    decisionRules: [
      'Provenance Rule: An inferred business rule must NEVER be recorded as USER_CONFIRMED without operator consent.',
      'Zero Secret Storage: All tokens, passwords, and connection strings must be redacted before saving.'
    ],
    outputContract: ['Updated ProjectSnapshot, ArchitectureGraph, and KnowledgeHealthReport.']
  },

  'alper-decision-management': {
    name: 'alper-decision-management',
    title: 'Decision Management',
    status: 'ACTIVE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Human approval before superseding or deprecating established architectural decisions.'],
    sourceStrategy: 'ADR standards (Michael Nygard format), Git commit history, and architectural invariants.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['record_project_decision', 'generate_adr'],
    relatedSkills: ['alper-project-intelligence', 'alper-architecture', 'alper-change-planner'],
    reason: 'Durable ADR lifecycle management and bidirectional superseding with provenance checks.',
    corePurpose: 'Formulates, records, and manages Architecture Decision Records (ADRs) with bidirectional superseding, ensuring architectural choices are never silently rewritten.',
    positiveUseWhen: [
      'Documenting a key architectural decision (e.g. database choice, framework migration, auth strategy).',
      'Superseding an existing ADR with a new architectural direction.',
      'Reviewing historical design decisions and rejected alternatives.'
    ],
    negativeDoNotUseWhen: [
      'Diagnosing query execution plans (use alper-sql-performance).',
      'Scaffolding raw boilerplate files (use alper-greenfield-generator).',
      'Running accessibility audits (use alper-accessibility-testing).'
    ],
    keyWorkflow: [
      '1. Formulate problem context, decision drivers, and considered alternatives.',
      '2. Generate structured ADR following canonical format (Context, Decision, Consequences).',
      '3. If replacing an existing decision, establish bidirectional link (supersedes / superseded_by).',
      '4. Commit ADR markdown to .alper-design-os/project/decisions/.'
    ],
    decisionRules: [
      'Never silently overwrite an existing ADR: Must mark previous decision as SUPERSEDED with clear rationale.',
      'Record consequences transparently: Both positive benefits and negative trade-offs must be stated.'
    ],
    outputContract: ['ArchitectureDecisionRecord (ADR) file and updated decision catalog.']
  },

  'alper-change-impact-analysis': {
    name: 'alper-change-impact-analysis',
    title: 'Change Impact Analysis',
    status: 'ACTIVE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review when change blast radius extends to CRITICAL infrastructure.'],
    sourceStrategy: 'ProjectArchitectureGraph, import/export dependency trees, and database schema mappings.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['analyze_change_impact'],
    relatedSkills: ['alper-change-planner', 'alper-project-intelligence', 'alper-scope-guard'],
    reason: 'Calculates blast radius, affected modules, database entities, APIs, and tests.',
    corePurpose: 'Analyzes proposed code modifications against the codebase dependency graph to calculate the exact blast radius, identifying affected modules, dependent APIs, database models, and required test suites.',
    positiveUseWhen: [
      'Assessing the risk and scope of modifying a shared utility, database schema, or core service.',
      'Determining which unit and integration test suites must run to validate a proposed change.',
      'Preventing unintended cascading breaks across subsystem boundaries.'
    ],
    negativeDoNotUseWhen: [
      'Creating clean-sheet requirements on a non-existent repo (use alper-requirements-engineering).',
      'Fixing an isolated button hover CSS state (use alper-design-repair).',
      'Searching external design system libraries (use alper-source-intelligence).'
    ],
    keyWorkflow: [
      '1. Identify candidate files or symbols targeted for modification.',
      '2. Traverse ProjectArchitectureGraph to find upstream and downstream dependents.',
      '3. Map impact to database entities, public API contracts, and user-facing screens.',
      '4. Calculate blast radius risk score (LOW, MEDIUM, HIGH, CRITICAL).',
      '5. Output list of required verification suites.'
    ],
    decisionRules: [
      'If blast radius touches authentication, authorization, or payments, mark change as HIGH/CRITICAL.',
      'All directly and transitively affected modules must be included in the impact report.'
    ],
    outputContract: ['ChangeImpactReport detailing affected files, risk score, and required test coverage.']
  },

  'alper-project-continuation': {
    name: 'alper-project-continuation',
    title: 'Project Continuation',
    status: 'ACTIVE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator acknowledgment if severe repository drift occurred between sessions.'],
    sourceStrategy: 'Snapshot history in .alper-design-os/project/, git log, and verification debt registry.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['build_task_context', 'detect_project_drift', 'load_project_intelligence'],
    relatedSkills: ['alper-project-intelligence', 'alper-change-planner', 'alper-evidence-review'],
    reason: 'Truthful project onboarding for agent sessions via durable intelligence snapshots and drift detection.',
    corePurpose: 'Eliminates agent session amnesia by loading durable project snapshots, detecting codebase drift since the last session, and presenting active risks, incomplete tasks, and carried verification debt.',
    positiveUseWhen: [
      'A new agent conversation begins on an ongoing project.',
      'User asks "Continue where we left off yesterday" or resumes a multi-phase roadmap.',
      'Verifying if external git changes occurred while the agent was idle.'
    ],
    negativeDoNotUseWhen: [
      'Starting a completely brand-new project with no prior history (use alper-greenfield-product-analysis).',
      'Executing single-block CSS repairs (use alper-design-repair).',
      'Conducting an isolated web search (use alper-source-intelligence).'
    ],
    keyWorkflow: [
      '1. Load canonical ProjectSnapshot from .alper-design-os/project/snapshot.json.',
      '2. Compute current workspace hash and compare to snapshot to detect drift.',
      '3. Assemble task context including active ADRs, incomplete plan steps, and verification debt.',
      '4. Output truthful continuation brief.'
    ],
    decisionRules: [
      'Drift Rule: If repository drift is detected, flag modified files before executing subsequent actions.',
      'Debt Truth: Never hide carried verification debt; report active NOT_VERIFIED items prominently.'
    ],
    outputContract: ['ProjectContinuationBrief with drift status, active phase, and verification debt.']
  },

  'alper-continuous-improvement': {
    name: 'alper-continuous-improvement',
    title: 'Continuous Improvement',
    status: 'ACTIVE',
    capabilityFamily: 'PROJECT_INTELLIGENCE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator approval before promoting a project lesson to global engineering rules.'],
    sourceStrategy: 'Execution journals, review findings, test failure logs, and post-mortem artifacts.',
    evidenceRequirements: ['HEURISTIC_REVIEW'],
    mcpTools: ['record_lesson_learned', 'propose_improvement_candidate'],
    relatedSkills: ['alper-project-intelligence', 'alper-decision-management', 'alper-independent-review'],
    reason: 'Records lessons learned and produces governance improvement proposals with human approval gates.',
    corePurpose: 'Captures empirical engineering lessons from build failures, review rejections, and test breakdowns, drafting governance improvement proposals with strict project isolation.',
    positiveUseWhen: [
      'Capturing a concrete lesson learned following a debugging session or deployment failure.',
      'Proposing improvements to project invariants, lint rules, or verification checklists.',
      'Conducting post-implementation retrospectives.'
    ],
    negativeDoNotUseWhen: [
      'Directly writing application code or UI components (use stack-specific skills).',
      'Scaffolding clean-sheet applications (use alper-greenfield-generator).',
      'Running automated security scans (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Ingest incident details, root cause, and remediation steps.',
      '2. Record LessonLearnedRecord scoped strictly to current project.',
      '3. Formulate GovernanceImprovementProposal if systemic rule change is warranted.',
      '4. Submit proposal to human operator for review.'
    ],
    decisionRules: [
      'Cross-Project Isolation: Project-specific lessons must NEVER be globally promoted without human authorization.',
      'Proposals must include verifiable evidence demonstrating the flaw in existing rules.'
    ],
    outputContract: ['LessonLearnedRecord and GovernanceImprovementProposal.']
  },

  'alper-change-planner': {
    name: 'alper-change-planner',
    title: 'Change Planner',
    status: 'ACTIVE',
    capabilityFamily: 'GOVERNANCE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator approval of AgentActionPlan for HIGH and CRITICAL risk changes.'],
    sourceStrategy: '17-step change lifecycle, git status, and risk evaluation matrix.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['create_action_plan', 'evaluate_change_risk', 'classify_code_paths', 'create_execution_journal', 'route_context', 'route_tool'],
    relatedSkills: ['alper-scope-guard', 'alper-git-safety', 'alper-independent-review', 'alper-evidence-review'],
    reason: '17-step change lifecycle, AgentActionPlan generation, and blast radius assessment.',
    corePurpose: 'Governs significant codebase mutations by producing typed AgentActionPlans with explicit scope bounds, 10-dimension risk evaluations, verification criteria, and rollback strategies.',
    positiveUseWhen: [
      'Planning file modifications that touch multiple components, database schemas, or APIs.',
      'Evaluating change risk across architecture, security, and dependency dimensions.',
      'Establishing an execution journal and rollback plan before modifying files.'
    ],
    negativeDoNotUseWhen: [
      'Pure read-only codebase exploration or research (use alper-existing-project-analysis).',
      'Scaffolding a brand new greenfield project (use alper-greenfield-generator).',
      'Executing single-line CSS edits where ScopeGuard alone suffices (use alper-design-repair).'
    ],
    keyWorkflow: [
      '1. Define objective and identify target files.',
      '2. Classify code paths (IN_SCOPE, REQUIRED_DEPENDENCY, OUT_OF_SCOPE, FORBIDDEN).',
      '3. Evaluate change risk across 10 dimensions.',
      '4. Formulate AgentActionPlan with verification plan and rollback commands.',
      '5. Initialize execution journal.'
    ],
    decisionRules: [
      'Mandatory Plan Rule: Never execute multi-file changes without an approved AgentActionPlan.',
      'High/Critical Risk Rule: Changes rated HIGH or CRITICAL require mandatory git checkpointing.'
    ],
    outputContract: ['AgentActionPlan with risk evaluation, verification criteria, and rollback strategy.']
  },

  'alper-scope-guard': {
    name: 'alper-scope-guard',
    title: 'Scope Guard',
    status: 'ACTIVE',
    capabilityFamily: 'GOVERNANCE',
    userFacingType: 'INTERNAL_ORCHESTRATION',
    userFacing: false,
    modeApplicability: ['MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator permission if an out-of-scope dependency must genuinely be modified.'],
    sourceStrategy: 'Current task brief, approved AgentActionPlan, and repository directory structure.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['evaluate_scope'],
    relatedSkills: ['alper-change-planner', 'alper-git-safety', 'alper-independent-review'],
    reason: 'Enforces scope boundaries, prevents silent creep, and blocks uninvited modifications.',
    corePurpose: 'Internal guardrail that intercepts and evaluates candidate file modifications, categorizing them into IN_SCOPE, REQUIRED_DEPENDENCY, OUT_OF_SCOPE, or FORBIDDEN to eliminate uninvited scope creep.',
    positiveUseWhen: [
      'Validating that a candidate file edit stays strictly within user-requested boundaries.',
      'Detecting uninvited changes to database migrations, package configs, or infrastructure files.',
      'Auditing working tree diffs prior to independent review.'
    ],
    negativeDoNotUseWhen: [
      'Generating high-level product profiles (use alper-greenfield-product-analysis).',
      'Designing UI wireframes or blueprints (use alper-ui-blueprint).',
      'Running external security penetration tests (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Ingest candidate file path and active task scope.',
      '2. Classify path against forbidden patterns (migrations, lockfiles, production configs).',
      '3. Check if path is requested or a legitimate sub-dependency.',
      '4. Emit scope verdict (ALLOW vs BLOCK).'
    ],
    decisionRules: [
      'Forbidden Path Rule: Unrequested edits to database migrations or package lockfiles are unconditionally BLOCKED.',
      'Zero Silent Expansion: Any file touched outside approved scope triggers an immediate alert.'
    ],
    outputContract: ['ScopeEvaluationResult (IN_SCOPE, REQUIRED_DEPENDENCY, OUT_OF_SCOPE, FORBIDDEN).']
  },

  'alper-git-safety': {
    name: 'alper-git-safety',
    title: 'Git Safety',
    status: 'ACTIVE',
    capabilityFamily: 'GOVERNANCE',
    userFacingType: 'INTERNAL_ORCHESTRATION',
    userFacing: false,
    modeApplicability: ['MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Explicit operator authorization for destructive git actions (hard reset, force push, clean -fd).'],
    sourceStrategy: 'Git status, reflog, stash list, and working tree index.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['create_checkpoint_plan'],
    relatedSkills: ['alper-change-planner', 'alper-scope-guard', 'alper-independent-review'],
    reason: 'Prevents destructive Git commands (reset --hard, force push) and manages checkpoint plans.',
    corePurpose: 'Protects the repository against accidental data loss by blocking destructive Git commands, creating pre-modification stash checkpoints, and preparing rollback scripts.',
    positiveUseWhen: [
      'Creating a git stash or branch checkpoint before executing high-risk code changes.',
      'Intercepting destructive commands (git reset --hard, git push --force, git clean -fd).',
      'Preparing automated rollback scripts for multi-step refactoring operations.'
    ],
    negativeDoNotUseWhen: [
      'Designing UI components or stylesheets (use alper-design-language).',
      'Deriving functional product requirements (use alper-requirements-engineering).',
      'Executing browser E2E tests (use alper-browser-qa).'
    ],
    keyWorkflow: [
      '1. Check git status to ensure working tree cleanliness or active stash availability.',
      '2. Create temporary safety checkpoint (stash or checkpoint branch).',
      '3. Formulate rollback script with inverse operations.',
      '4. Intercept and block prohibited commands via hooks.json guard.'
    ],
    decisionRules: [
      'Hard Reset Block: Commands matching git reset --hard or git clean -fd are blocked by default.',
      'Checkpoint Prerequisite: High-risk changes must have an active checkpoint before execution.'
    ],
    outputContract: ['CheckpointPlan with checkpoint identifier and rollback shell instructions.']
  },

  'alper-independent-review': {
    name: 'alper-independent-review',
    title: 'Independent Review',
    status: 'ACTIVE',
    capabilityFamily: 'GOVERNANCE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review of REJECT or REPAIR_REQUIRED review verdicts.'],
    sourceStrategy: 'Git diffs, linter outputs, test runner outputs, and 12-point objective review rubric.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'UNIT_TEST', 'BROWSER_TEST', 'HEURISTIC_REVIEW'],
    mcpTools: ['review_change'],
    relatedSkills: ['alper-evidence-review', 'alper-scope-guard', 'alper-security-audit'],
    reason: 'Unbiased second-pass code and diff review across 12 objective quality dimensions.',
    corePurpose: 'Acts as an autonomous, unbiased second-pass reviewer that inspects git diffs and test results without relying on implementer self-assurances, issuing binding verdicts across 12 quality dimensions.',
    positiveUseWhen: [
      'Conducting an objective pull request or working tree diff review.',
      'Validating that changes meet quality, security, and scope invariants before merging.',
      'Issuing decisive verdicts (APPROVE, APPROVE_WITH_WARNINGS, REPAIR_REQUIRED, REJECT).'
    ],
    negativeDoNotUseWhen: [
      'Writing code or implementing requested features (use implementer skills).',
      'Scaffolding initial project structures (use alper-greenfield-generator).',
      'Searching external UI libraries (use alper-source-intelligence).'
    ],
    keyWorkflow: [
      '1. Extract unified git diff against base branch.',
      '2. Evaluate diff across 12 dimensions (correctness, security, performance, accessibility, scope).',
      '3. Inspect test execution evidence and static analysis reports.',
      '4. Issue binding ReviewVerdict with prioritized deficiency list.'
    ],
    decisionRules: [
      'Anti-Bias Invariant: Never trust implementer verbal assurances; evaluate strictly on artifacts.',
      'Critical Flaw Rule: Any critical security defect or data loss risk results in immediate REJECT.'
    ],
    outputContract: ['IndependentReviewVerdict with 12-dimension score and blocking defect checklist.']
  },

  'alper-evidence-review': {
    name: 'alper-evidence-review',
    title: 'Evidence Review',
    status: 'ACTIVE',
    capabilityFamily: 'GOVERNANCE',
    userFacingType: 'INTERNAL_ORCHESTRATION',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Human review validation when required by gate-specific assurance policy.'],
    sourceStrategy: '13 concrete EvidenceTypes, EvidenceKind taxonomy, and verification logs.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'UNIT_TEST', 'INTEGRATION_TEST', 'RUNTIME_CHECK', 'BROWSER_TEST', 'VISUAL_DIFF', 'HUMAN_REVIEW'],
    mcpTools: ['create_verification_plan', 'normalize_verification_evidence', 'evaluate_completion_claim'],
    relatedSkills: ['alper-independent-review', 'alper-change-planner'],
    reason: 'Universal invariant: NO CLAIM WITHOUT EVIDENCE across 13 concrete evidence kinds.',
    corePurpose: 'Enforces the core architectural invariant: NO CLAIM WITHOUT EVIDENCE. Normalizes evidence artifacts into the canonical EvidenceKind taxonomy and verifies that completion claims are backed by authentic proof.',
    positiveUseWhen: [
      'Validating completion claims ("Production Ready", "100% Tested", "Responsive Fixed").',
      'Normalizing raw command stdout, test reports, or screenshots into EvidenceItems.',
      'Creating a gate-specific verification plan.'
    ],
    negativeDoNotUseWhen: [
      'Synthesizing product requirements (use alper-requirements-engineering).',
      'Editing CSS or design tokens (use alper-design-language).',
      'Diagnosing slow database queries (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Define required EvidenceKinds for target quality gate.',
      '2. Ingest raw execution artifacts (test logs, build output, screenshots).',
      '3. Normalize into typed EvidenceItems with timestamps and confidence scores.',
      '4. Evaluate completion claims: missing evidence strictly resolves to NOT_VERIFIED.'
    ],
    decisionRules: [
      'NO CLAIM WITHOUT EVIDENCE: Missing evidence resolves to NOT_VERIFIED, never to PASS.',
      'Heuristic or static analysis cannot satisfy gates requiring RUNTIME_CHECK or BROWSER_TEST.'
    ],
    outputContract: ['Normalized EvidenceBatch and GateVerificationResult.']
  },

  // =========================================================================
  // 6. ARCHITECTURE, DATA & API
  // =========================================================================
  'alper-architecture': {
    name: 'alper-architecture',
    title: 'Architecture',
    status: 'ACTIVE',
    capabilityFamily: 'ARCHITECTURE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'CLARIFY_AMBIGUITY',
    humanCheckpoints: ['Operator authorization for major irreversible architectural trade-offs (e.g. distributed vs monolith).'],
    sourceStrategy: 'Martin Fowler Architecture catalog, modular monolith principles, and complexity budget models.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'HEURISTIC_REVIEW'],
    mcpTools: ['analyze_architecture', 'generate_adr', 'recommend_architecture', 'recommend_stack'],
    relatedSkills: ['alper-decision-management', 'alper-greenfield-generator', 'alper-refactoring-strategy'],
    reason: 'Structural architecture discovery, style classification, subsystem boundaries, and stack recommendations.',
    corePurpose: 'Discovers existing architecture, classifies architectural styles (Monolith, Modular Monolith, Client-Server), defines subsystem boundaries, and enforces anti-overengineering complexity budgets.',
    positiveUseWhen: [
      'Selecting an architectural pattern for a greenfield system (defaulting to Modular Monolith).',
      'Analyzing subsystem boundaries and modular coupling in an existing repository.',
      'Recommending a technology stack grounded in team constraints and complexity budgets.'
    ],
    negativeDoNotUseWhen: [
      'Executing single-line CSS or UI styling changes (use alper-design-repair).',
      'Writing raw SQL migrations or indexing (use alper-database-designer or alper-sql-performance).',
      'Running automated security vulnerability scans (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Analyze project scale, domain complexity, and team capabilities.',
      '2. Evaluate complexity budget (score <= 3 mandates Monolith or Modular Monolith).',
      '3. Formulate subsystem boundaries and dependency directions.',
      '4. Recommend grounded architecture style and stack.',
      '5. Record decisions in an Architecture Decision Record.'
    ],
    decisionRules: [
      'Anti-Overengineering Rule: Favor Monolith or Modular Monolith for small/medium scale or standard products; avoid premature distributed decomposition.',
      'Distributed architecture (e.g. Microservices) is justified only when high-scale or internet-distributed boundaries require independent operational partitioning.',
      'All architectural choices without explicit user constraints must be tagged as REVERSIBLE_ASSUMPTION.'
    ],
    outputContract: ['ArchitectureRecommendationReport, SubsystemBoundaryMap, and initial ADR.']
  },

  'alper-database-designer': {
    name: 'alper-database-designer',
    title: 'Database Designer',
    status: 'ACTIVE',
    capabilityFamily: 'DATA_ENGINEERING',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'CLARIFY_AMBIGUITY',
    humanCheckpoints: ['DBA / operator review of relational schema, primary key types, and foreign key onDelete policies.'],
    sourceStrategy: 'Relational database theory (3NF normalization), ACID transaction standards, and PostgreSQL/MySQL docs.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    evidenceArtifacts: ['database-query-plan', 'ddl-schema-ast', 'foreign-key-graph'],
    mcpTools: ['analyze_database_schema', 'create_database_blueprint'],
    relatedSkills: ['alper-migration-safety', 'alper-sql-performance', 'alper-api-designer'],
    reason: 'Grounded business entity derivation, schema normalization, relationships, and ACID data integrity.',
    corePurpose: 'Derives grounded relational database blueprints, enforcing 3NF normalization, foreign key integrity, indexed lookups, and ACID transactional boundaries without hallucinating dummy entities.',
    positiveUseWhen: [
      'Designing relational database schemas (tables, columns, types, constraints, relations).',
      'Deriving database blueprints from verified product profiles and business rules.',
      'Normalizing ungrounded or denormalized data models into third normal form (3NF).'
    ],
    negativeDoNotUseWhen: [
      'Diagnosing query execution plans or slow query bottlenecks (use alper-sql-performance).',
      'Evaluating DDL migration risk on production databases (use alper-migration-safety).',
      'Designing frontend UI page layouts (use alper-ui-blueprint).'
    ],
    keyWorkflow: [
      '1. Ingest verified domain entities from product profile.',
      '2. Define table schemas with appropriate scalar types and nullability constraints.',
      '3. Establish explicit 1:1, 1:N, and N:M relationships with foreign keys.',
      '4. Specify onDelete and onUpdate referential actions.',
      '5. Output DatabaseBlueprint.'
    ],
    decisionRules: [
      'Anti-Hallucination Rule: Prohibit generating dummy tables from verb words ("manages", "reviews") or generic items.',
      'Every foreign key must define explicit referential integrity actions (RESTRICT, CASCADE, SET NULL).'
    ],
    outputContract: ['DatabaseBlueprint containing table schemas, relations, and constraint definitions.']
  },

  'alper-migration-safety': {
    name: 'alper-migration-safety',
    title: 'Migration Safety',
    status: 'ACTIVE',
    capabilityFamily: 'DATA_ENGINEERING',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Mandatory operator / DBA authorization before running DANGEROUS or irreversible DDL migrations.'],
    sourceStrategy: 'Zero-downtime database deployment patterns (Expand/Contract pattern) and engine-specific DDL locks.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    evidenceArtifacts: ['ddl-lock-analysis', 'migration-rollback-plan', 'expand-contract-spec'],
    mcpTools: ['analyze_database_schema'],
    relatedSkills: ['alper-database-designer', 'alper-sql-performance', 'alper-git-safety'],
    reason: 'Classifies DDL migration risk (SAFE/REVIEW/DANGEROUS) and enforces expand/contract zero-downtime evolution.',
    corePurpose: 'Inspects proposed database migration scripts (SQL, Flyway, Liquibase, Phinx, EF Core), classifying DDL operations into SAFE, REVIEW, or DANGEROUS, and enforcing zero-downtime expand/contract schema evolution.',
    positiveUseWhen: [
      'Reviewing database migration scripts before staging or production execution.',
      'Detecting table-locking operations (e.g. adding NOT NULL column without default in large tables).',
      'Designing expand/contract zero-downtime migration sequences for high-traffic databases.'
    ],
    negativeDoNotUseWhen: [
      'Designing new greenfield schemas from scratch (use alper-database-designer).',
      'Tuning slow SELECT queries (use alper-sql-performance).',
      'Styling frontend UI components (use alper-design-language).'
    ],
    keyWorkflow: [
      '1. Parse migration DDL statements.',
      '2. Classify statements: SAFE (additive, non-blocking), REVIEW (index creation), DANGEROUS (table rewrite, column drop).',
      '3. Verify backwards compatibility with running application code.',
      '4. Formulate rollback migration script.',
      '5. Emit MigrationRiskAssessment.'
    ],
    decisionRules: [
      'Zero Data Loss Rule: Dropping columns or tables without prior deprecation phase is strictly DANGEROUS.',
      'Adding columns to large tables must specify defaults or remain NULL to prevent exclusive lockouts.'
    ],
    outputContract: ['MigrationRiskAssessment (SAFE, REVIEW, DANGEROUS) and RollbackMigrationPlan.']
  },

  'alper-sql-performance': {
    name: 'alper-sql-performance',
    title: 'SQL Performance',
    status: 'ACTIVE',
    capabilityFamily: 'DATA_ENGINEERING',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review before adding indexes to write-heavy tables (balancing read vs write overhead).'],
    sourceStrategy: 'Database execution plans (EXPLAIN ANALYZE), index cardinality statistics, and engine documentation (PostgreSQL, MySQL, SQL Server).',
    evidenceRequirements: ['STATIC_ANALYSIS', 'RUNTIME_CHECK'],
    evidenceArtifacts: ['explain-analyze-buffers-json', 'query-execution-plan', 'index-hit-ratio-log'],
    mcpTools: ['analyze_database_schema'],
    relatedSkills: ['alper-database-designer', 'alper-migration-safety'],
    reason: 'Diagnoses N+1 query loops, missing foreign key indexes, and enforces keyset pagination over offset.',
    corePurpose: 'Diagnoses slow database queries through execution plan analysis, evaluating actual vs estimated rows, index selectivity, SARGability, join strategies, buffer cache hits, and ORM N+1 query loops.',
    positiveUseWhen: [
      'Diagnosing a slow SQL query or investigating high database CPU / disk IO utilization.',
      'Evaluating query plans (EXPLAIN ANALYZE) for sequential scans, nested loops, or hash spills.',
      'Choosing between offset pagination and keyset pagination based on workload characteristics.'
    ],
    negativeDoNotUseWhen: [
      'Designing new tables from scratch for a greenfield app (use alper-database-designer).',
      'Conducting accessibility audits on frontend forms (use alper-accessibility-testing).',
      'Running external penetration testing (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Inspect slow query text and execution plan (EXPLAIN ANALYZE BUFFERS).',
      '2. Identify bottlenecks: Seq Scans on large tables, non-SARGable WHERE predicates, N+1 ORM patterns.',
      '3. Evaluate index recommendations considering write overhead on table.',
      '4. Assess pagination trade-offs (keyset for streaming vs offset for random access).',
      '5. Require measured execution timing evidence before claiming improvement.'
    ],
    decisionRules: [
      'No Assumption Rule: Keyset pagination is NOT universally superior; offset is required when random page jumps are requested.',
      'Write Overhead Rule: Never recommend indexes without considering INSERT/UPDATE write amplification.',
      'Measured Evidence Invariant: Never claim query optimization without before/after execution timing.'
    ],
    outputContract: ['QueryPerformanceDiagnosis, IndexRecommendationReport, and OptimizedQueryPlan.']
  },

  'alper-api-designer': {
    name: 'alper-api-designer',
    title: 'API Designer',
    status: 'ACTIVE',
    capabilityFamily: 'API_ENGINEERING',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'CLARIFY_AMBIGUITY',
    humanCheckpoints: ['Operator review of breaking API contract changes or auth model revisions.'],
    sourceStrategy: 'OpenAPI 3.1.0 specifications, RFC 9457 Problem Details, and RFC 6749 OAuth 2.0 / JWT standards.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    evidenceArtifacts: ['openapi-3-1-spec-diff', 'api-contract-validation-report'],
    mcpTools: ['create_api_blueprint', 'create_auth_model', 'evaluate_api_compatibility', 'search_public_apis'],
    relatedSkills: ['alper-api-security', 'alper-contract-testing', 'alper-database-designer'],
    reason: 'OpenAPI 3.1.0 REST API design, RFC 9457 Problem Details, pagination, and RBAC auth model.',
    corePurpose: 'Designs clean, consistent, technology-neutral REST APIs following OpenAPI 3.1.0 specifications, standardizing RFC 9457 Problem Details, envelope formats, cursor/page pagination, and RBAC authorization models.',
    positiveUseWhen: [
      'Designing REST API endpoints, schemas, parameters, and responses for greenfield or brownfield systems.',
      'Specifying authentication mechanisms (JWT, session cookies, API keys) and role-based access control (RBAC).',
      'Evaluating API backwards compatibility and versioning strategies (v1, v2).'
    ],
    negativeDoNotUseWhen: [
      'Designing UI page layouts or CSS stylesheets (use alper-ui-blueprint or alper-design-language).',
      'Tuning database indexing or query plans (use alper-sql-performance).',
      'Running Playwright browser UI automation (use alper-browser-qa).'
    ],
    keyWorkflow: [
      '1. Ingest domain entities and functional requirements.',
      '2. Define resource endpoints following REST conventions (plural nouns, appropriate HTTP verbs).',
      '3. Formulate strict request and response schemas using JSON Schema / OpenAPI 3.1.0.',
      '4. Standardize error responses using RFC 9457 Problem Details.',
      '5. Specify authentication and RBAC permission requirements per endpoint.'
    ],
    decisionRules: [
      'Standard Errors: All non-2xx responses must comply with RFC 9457 Problem Details specification.',
      'Breaking Change Guard: Removing fields or altering types on existing endpoints is strictly prohibited without versioning.'
    ],
    outputContract: ['OpenAPI 3.1.0 Specification (ApiBlueprint) and AuthModelSpecification.']
  },

  // =========================================================================
  // 7. DESIGN_UX & SOURCE_INTELLIGENCE
  // =========================================================================
  'alper-design-language': {
    name: 'alper-design-language',
    title: 'Design Language & Tokens',
    status: 'ACTIVE',
    capabilityFamily: 'DESIGN_UX',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Brand / visual approval for primary color palette, typography, and density tier adjustments.'],
    sourceStrategy: 'Design Tokens Community Group (DTCG) specification, CSS Custom Properties, and APCA contrast models.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['get_design_tokens', 'create_design_plan', 'create_design_intent'],
    relatedSkills: ['alper-design-personality', 'alper-ui-blueprint', 'alper-accessibility-testing'],
    reason: 'Technology-agnostic DTCG tokens, multi-pane workbench layouts, and information density.',
    corePurpose: 'Architects and compiles technology-neutral design token hierarchies following DTCG standards, distributing color, typography, spacing, elevation, and density tokens across CSS, SCSS, and Tailwind themes.',
    positiveUseWhen: [
      'Establishing or refactoring a design token architecture (primitive -> semantic -> component tier).',
      'Configuring theme variables, dark mode switching, or density modes (Compact/Normal/Comfortable).',
      'Compiling design tokens to CSS custom properties or framework theme files.'
    ],
    negativeDoNotUseWhen: [
      'Designing database entities or tables (use alper-database-designer).',
      'Diagnosing backend server latency (use alper-sql-performance).',
      'Running active network security tests (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Define primitive palette, font scales, and spacing units in DTCG JSON format.',
      '2. Map primitive tokens to semantic intent tokens (primary, danger, surface, border).',
      '3. Verify color contrast ratios against WCAG 2.2 AA standards.',
      '4. Compile to CSS custom properties (tokens.css) and Tailwind theme extensions.'
    ],
    decisionRules: [
      'Strict DTCG Compliance: All tokens must use $value, $type, and $description format.',
      'Contrast Integrity: Every foreground/surface color token pairing must satisfy WCAG 2.2 AA (4.5:1 text, 3:1 non-text).'
    ],
    outputContract: ['DTCG tokens.json, compiled tokens.css, and DesignPlanSpecification.']
  },

  'alper-design-personality': {
    name: 'alper-design-personality',
    title: 'Design Personality',
    status: 'ACTIVE',
    capabilityFamily: 'DESIGN_UX',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review of chosen 6-axis personality profile.'],
    sourceStrategy: 'Quantitative 6-axis aesthetic vectors (Utility vs Elegance, Density vs Whitespace, etc.) and brand guidelines.',
    evidenceRequirements: ['HEURISTIC_REVIEW'],
    mcpTools: ['select_design_personality', 'create_design_intent'],
    relatedSkills: ['alper-design-language', 'alper-design-critic', 'alper-pattern-graph'],
    reason: 'Synthesizes quantitative 6-axis design personality avoiding generic unbranded AI templates.',
    corePurpose: 'Computes a calibrated 6-axis design personality profile tailored to the product domain and user personas, ensuring software avoids bland, generic AI templates and matches operational needs.',
    positiveUseWhen: [
      'Establishing the visual character, voice, and aesthetic parameters of a new software system.',
      'Aligning design tokens and UI patterns with domain expectations (e.g. utilitarian industrial vs elegant fintech).',
      'Preventing cookie-cutter, consumerized UI clichés in expert professional tools.'
    ],
    negativeDoNotUseWhen: [
      'Designing database tables or foreign keys (use alper-database-designer).',
      'Fixing isolated CSS padding glitches (use alper-design-repair).',
      'Running static code analysis (use alper-code-quality).'
    ],
    keyWorkflow: [
      '1. Ingest product domain, target user personas, and brand parameters.',
      '2. Score the 6 personality axes on a 1-100 scale.',
      '3. Formulate DesignPersonalityProfile defining typography weights, border radii, and visual warmth.',
      '4. Pass personality parameters to alper-design-language for token synthesis.'
    ],
    decisionRules: [
      'Industrial Rule: Utility-driven expert domains must prioritize density and speed over decorative animations.',
      'Anti-Generic Rule: Never emit uncustomized generic SaaS templates without explicit personality scoring.'
    ],
    outputContract: ['DesignPersonalityProfile with 6-axis quantitative scores and aesthetic directives.']
  },

  'alper-pattern-graph': {
    name: 'alper-pattern-graph',
    title: 'UX Pattern Graph',
    status: 'ACTIVE',
    capabilityFamily: 'DESIGN_UX',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review of non-standard interaction models or complex multi-pane layouts.'],
    sourceStrategy: '28 technology-independent canonical UX patterns, ergonomics standards, and interaction guidelines.',
    evidenceRequirements: ['HEURISTIC_REVIEW'],
    mcpTools: ['recommend_ux_patterns', 'search_design_patterns', 'search_patterns', 'inspect_pattern'],
    relatedSkills: ['alper-ui-blueprint', 'alper-domain-intelligence', 'alper-design-language'],
    reason: 'Navigates and applies the 28 technology-independent UX patterns (Gantt, Dense Grid, Command Palette, etc.).',
    corePurpose: 'Navigates the knowledge graph of 28 canonical technology-independent UX patterns (Split-Pane, Gantt, Dense DataGrid, Command Palette, Master-Detail, etc.), recommending optimal interaction patterns based on data density.',
    positiveUseWhen: [
      'Selecting optimal layout and interaction patterns for complex workflows.',
      'Designing expert user interfaces requiring fast keyboard navigation and dense information displays.',
      'Looking up interaction rules and state contracts for standard enterprise UI patterns.'
    ],
    negativeDoNotUseWhen: [
      'Compiling blueprints into concrete React or Blade syntax (use alper-cross-stack-rendering).',
      'Tuning SQL queries (use alper-sql-performance).',
      'Conducting security threat modeling (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Match user workflow requirements against UX pattern graph.',
      '2. Retrieve pattern specifications (regions, states, keyboard triggers, accessibility constraints).',
      '3. Recommend complementary pattern combinations (e.g. Master-Detail + Command Palette).',
      '4. Supply pattern contracts to alper-ui-blueprint.'
    ],
    decisionRules: [
      'Ergonomic Rule: High-density operational domains require keyboard shortcut support on all core patterns.',
      'Never recommend mobile-first drawer patterns for multi-monitor desktop operator workflows.'
    ],
    outputContract: ['UXPatternRecommendationList with pattern contracts and ergonomic requirements.']
  },

  'alper-design-critic': {
    name: 'alper-design-critic',
    title: 'Design Critic',
    status: 'ACTIVE',
    capabilityFamily: 'DESIGN_UX',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Human designer review of subjective visual polish recommendations.'],
    sourceStrategy: 'WCAG 2.2 AA accessibility standards, APCA contrast, and Nielsen Norman Group UX heuristics.',
    evidenceRequirements: ['HEURISTIC_REVIEW', 'VISUAL_DIFF'],
    mcpTools: ['evaluate_design_antipatterns'],
    relatedSkills: ['alper-truthful-ui', 'alper-accessibility-testing', 'alper-visual-regression'],
    reason: 'Evaluates layout shifts, AI design smells, visual hierarchy defects, and design antipatterns.',
    corePurpose: 'Audits UI designs, screenshots, and component trees for visual hierarchy flaws, Cumulative Layout Shifts (CLS), missing interactive states, and generic AI design smells (e.g. useless cards, decorative clutter).',
    positiveUseWhen: [
      'Critiquing a proposed UI wireframe, blueprint, or rendered screen.',
      'Detecting AI-generated design anti-patterns and unfunctional decorative noise.',
      'Ensuring complete state coverage (empty, loading, error, populated, partial).'
    ],
    negativeDoNotUseWhen: [
      'Designing database normalization (use alper-database-designer).',
      'Writing backend API controllers (use alper-api-designer).',
      'Running automated security scans (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Ingest rendered UI markup or visual layout.',
      '2. Audit visual hierarchy, contrast, touch targets, and scanning readability.',
      '3. Detect design smells: unnecessary cards, decorative neon gradients, missing state handling.',
      '4. Formulate prioritized critique findings (BLOCKER, MAJOR, MINOR, SUGGESTION).'
    ],
    decisionRules: [
      'Objective vs Subjective: Clearly separate hard accessibility violations (BLOCKER) from aesthetic suggestions (SUGGESTION).',
      'Every interactive view must define loading, empty, and error fallback states.'
    ],
    outputContract: ['DesignCritiqueReport with categorized findings and concrete remediation steps.']
  },

  'alper-ui-blueprint': {
    name: 'alper-ui-blueprint',
    title: 'UI Blueprint DSL',
    status: 'ACTIVE',
    capabilityFamily: 'DESIGN_UX',
    userFacingType: 'INTERNAL_ORCHESTRATION',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Designer / architect review of master PageBlueprint before stack rendering.'],
    sourceStrategy: 'Declarative UI Blueprint DSL specification, component state machines, and ARIA contracts.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['create_page_blueprint', 'create_component_blueprint', 'create_app_shell_blueprint', 'create_page_inventory'],
    relatedSkills: ['alper-pattern-graph', 'alper-cross-stack-rendering', 'alper-design-language'],
    reason: 'Declarative UI Blueprint DSL for pages, components, and app shells with state contracts.',
    corePurpose: 'Internal DSL engine that models page layouts, responsive regions, navigation hierarchies, and component state machines in a technology-neutral declarative format prior to stack compilation.',
    positiveUseWhen: [
      'Creating declarative PageBlueprints and ComponentBlueprints for application pages.',
      'Defining app shell structures with responsive navigation, headers, and status bars.',
      'Establishing component state contracts (empty, loading, populated, error).'
    ],
    negativeDoNotUseWhen: [
      'Directly editing CSS classes or concrete HTML (use alper-cross-stack-rendering or alper-design-repair).',
      'Designing backend database tables (use alper-database-designer).',
      'Diagnosing slow SQL queries (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Ingest page requirements and selected UX patterns.',
      '2. Assemble declarative PageBlueprint defining layout regions and component hierarchy.',
      '3. Specify state machines and accessibility roles for each component.',
      '4. Output validated blueprint to downstream renderers.'
    ],
    decisionRules: [
      'Technology Neutrality: Blueprints must never contain stack-specific JSX or Blade directives.',
      'Every blueprint must define responsive behaviors across Mobile, Tablet, and Desktop.'
    ],
    outputContract: ['PageBlueprint, ComponentBlueprint, and AppShellBlueprint specifications.']
  },

  'alper-ui-recipe': {
    name: 'alper-ui-recipe',
    title: 'UI Recipes',
    status: 'ACTIVE',
    capabilityFamily: 'DESIGN_UX',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['None required for standard recipe retrieval.'],
    sourceStrategy: 'Canonical UI recipe library, responsive grid standards, and multi-pane workbench layouts.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['create_ui_recipe'],
    relatedSkills: ['alper-ui-blueprint', 'alper-pattern-graph', 'alper-design-language'],
    reason: 'Canonical UI recipes defining standard layouts, responsive regions, and component interactions.',
    corePurpose: 'Provides battle-tested, canonical UI recipe templates (e.g. Master-Detail Workbench, Analytics Dashboard, Form Wizard, Data Grid Table) ensuring standard layouts are constructed with ergonomic consistency.',
    positiveUseWhen: [
      'Bootstrapping standard page structures using proven enterprise layout recipes.',
      'Ensuring responsive multi-region layouts follow standardized breakpoint behaviors.',
      'Referencing component composition recipes.'
    ],
    negativeDoNotUseWhen: [
      'Creating database schemas (use alper-database-designer).',
      'Running security vulnerability scans (use alper-security-audit).',
      'Fixing backend API endpoints (use alper-api-designer).'
    ],
    keyWorkflow: [
      '1. Identify target layout recipe from task brief.',
      '2. Configure recipe parameters (column counts, collapsible sidebar, toolbar actions).',
      '3. Emit declarative recipe structure to alper-ui-blueprint.'
    ],
    decisionRules: [
      'Recipes must remain framework-neutral until rendered.',
      'Responsive folding rules must be specified for all grid regions.'
    ],
    outputContract: ['UIRecipeSpecification with region layouts and component slots.']
  },

  'alper-cross-stack-rendering': {
    name: 'alper-cross-stack-rendering',
    title: 'Cross-Stack Rendering',
    status: 'ACTIVE',
    capabilityFamily: 'DESIGN_UX',
    userFacingType: 'INTERNAL_ORCHESTRATION',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['None required during automated compilation.'],
    sourceStrategy: 'Stack compiler targets (React 18+ JSX, Laravel 11 Blade, ASP.NET Razor, HTML5).',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['render_blueprint', 'render_component'],
    relatedSkills: ['alper-ui-blueprint', 'alper-renderer-parity', 'alper-greenfield-generator'],
    reason: 'Renders blueprints into semantic code across HTML/CSS/JS, React, Laravel Blade, and ASP.NET Razor.',
    corePurpose: 'Compiles technology-neutral PageBlueprints and ComponentBlueprints into clean, idiomatic, semantic source code for React + TypeScript, Laravel Blade, ASP.NET Razor, or Plain HTML5.',
    positiveUseWhen: [
      'Compiling declarative UI blueprints into concrete code files for a specific target stack.',
      'Rendering individual component blueprints into framework-specific templates.',
      'Ensuring generated markup uses semantic HTML elements (nav, main, aside, header, footer).'
    ],
    negativeDoNotUseWhen: [
      'Designing initial layout blueprints (use alper-ui-blueprint).',
      'Fixing isolated CSS bugs in existing brownfield files (use alper-design-repair).',
      'Diagnosing database performance (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Ingest validated PageBlueprint or ComponentBlueprint.',
      '2. Select stack renderer adapter (React, Blade, Razor, Plain).',
      '3. Compile declarative nodes into semantic template code.',
      '4. Inject design token CSS classes or custom properties.',
      '5. Output ready-to-write source code files.'
    ],
    decisionRules: [
      'Semantic Markup: Div soup is prohibited; all layouts must use semantic HTML5 elements.',
      'Accessibility By Construction: Form inputs must be linked to labels, buttons must have text or aria-labels.'
    ],
    outputContract: ['Generated source code files (TSX, Blade, Razor, or HTML/JS).']
  },

  'alper-renderer-parity': {
    name: 'alper-renderer-parity',
    title: 'Renderer Parity',
    status: 'ACTIVE',
    capabilityFamily: 'DESIGN_UX',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['None required during automated parity checking.'],
    sourceStrategy: 'W3C DOM specifications, accessibility tree diffing, and cross-stack parity matrices.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'HEURISTIC_REVIEW'],
    mcpTools: ['compare_renderer_parity'],
    relatedSkills: ['alper-cross-stack-rendering', 'alper-ui-blueprint'],
    reason: 'Verifies visual and behavioral parity across different technology stack renderers.',
    corePurpose: 'Validates that different stack renderers (React vs Blade vs Razor) produce equivalent DOM structures, accessibility trees, and visual hierarchy from the same underlying blueprint.',
    positiveUseWhen: [
      'Verifying renderer consistency across supported technology stacks.',
      'Testing adapter compliance for new framework targets.',
      'Ensuring multi-stack component parity in cross-platform design systems.'
    ],
    negativeDoNotUseWhen: [
      'Executing single-project application development (use alper-greenfield-generator).',
      'Fixing user-reported bugs (use alper-design-repair).',
      'Running security penetration testing (use alper-security-audit).'
    ],
    keyWorkflow: [
      '1. Render identical PageBlueprint using two different stack renderers.',
      '2. Compare DOM element hierarchy, ARIA attributes, and token bindings.',
      '3. Detect discrepancies or adapter-specific rendering defects.',
      '4. Emit ParityReport.'
    ],
    decisionRules: [
      'Accessibility Parity: All renderers must generate identical accessibility trees and roles.',
      'Parity score below 95% indicates an adapter defect requiring remediation.'
    ],
    outputContract: ['RendererParityReport with element diff and parity score.']
  },

  'alper-source-intelligence': {
    name: 'alper-source-intelligence',
    title: 'Source Intelligence',
    status: 'ACTIVE',
    capabilityFamily: 'SOURCE_INTELLIGENCE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator approval when selecting dependencies with copyleft or restrictive licenses.'],
    sourceStrategy: '65+ curated design systems (Radix, Shadcn, Tailwind, MUI, Ant, Fluent), package registries, and SPDX license databases.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: [
      'discover_sources',
      'search_sources',
      'rank_sources',
      'inspect_source',
      'recommend_sources_for_product',
      'recommend_sources_for_stack',
      'check_source_license',
      'discover_design_sources',
      'search_design_sources',
      'inspect_design_source',
      'sync_design_sources',
      'recommend_design_sources',
      'recommend_icon_system',
      'recommend_chart_library',
      'recommend_data_grid',
      'explain_source_recommendation',
      'search_components',
      'search_mcp_servers'
    ],
    relatedSkills: ['alper-registry-discovery', 'alper-design-language', 'alper-supply-chain-security'],
    reason: 'Discovers, inspects, ranks, and licenses 65+ authoritative design systems, primitives, and icon/chart libraries.',
    corePurpose: 'Searches, ranks, and inspects authoritative design systems, headless UI primitives, icon libraries, charts, and data grids using weighted multi-criteria ranking and license compliance checking.',
    positiveUseWhen: [
      'Finding the best component library, icon system, or chart library for a project.',
      'Evaluating design system licenses (MIT, Apache 2.0 vs copyleft GPL) and maintenance health.',
      'Inspecting technical metadata (bundle size, accessibility support, TypeScript quality) for candidate dependencies.'
    ],
    negativeDoNotUseWhen: [
      'Designing database tables or SQL migrations (use alper-database-designer).',
      'Scaffolding raw project files (use alper-greenfield-generator).',
      'Fixing local CSS overflow bugs (use alper-design-repair).'
    ],
    keyWorkflow: [
      '1. Ingest product requirements, target framework, and license constraints.',
      '2. Search catalog of 65+ authoritative design sources.',
      '3. Rank candidates using 5-criteria weighted model (Adoption, A11y, Tokens, TS, License).',
      '4. Check SPDX license compatibility and flag restrictions.',
      '5. Output recommendation with explainability breakdown.'
    ],
    decisionRules: [
      'License Guard: Non-permissive licenses (GPL, AGPL) must be prominently flagged and require operator approval.',
      'Never recommend unmaintained or deprecated libraries when robust modern alternatives exist.'
    ],
    outputContract: ['SourceRecommendationList with ranking scores and license verification.']
  },

  'alper-registry-discovery': {
    name: 'alper-registry-discovery',
    title: 'Registry Discovery',
    status: 'ACTIVE',
    capabilityFamily: 'SOURCE_INTELLIGENCE',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review before installing third-party community registry blocks.'],
    sourceStrategy: 'Shadcn UI registry index, community block registries, and npm metadata.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['search_registries', 'search_registry_components', 'inspect_registry_component', 'inspect_alper_registry'],
    relatedSkills: ['alper-source-intelligence', 'alper-design-language'],
    reason: 'Discovers and inspects community blocks and component registries (shadcn/ui, Aceternity, Kokonut).',
    corePurpose: 'Discovers, searches, and inspects modular UI blocks and components from the shadcn registry ecosystem and curated community registries, verifying component dependencies and styling compatibility.',
    positiveUseWhen: [
      'Searching for ready-made shadcn/ui or community registry components (e.g. date-range picker, multi-select).',
      'Inspecting component code and required sub-dependencies before installation.',
      'Finding specialized UI blocks for dashboard, auth, or settings pages.'
    ],
    negativeDoNotUseWhen: [
      'Designing relational database schemas (use alper-database-designer).',
      'Analyzing legacy backend PHP/ASP code (use alper-existing-project-analysis).',
      'Running SQL performance diagnoses (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Query registry index with target component name.',
      '2. Inspect component schema, props, and dependency requirements.',
      '3. Verify compatibility with existing design tokens and Tailwind config.',
      '4. Output installation command and component code.'
    ],
    decisionRules: [
      'Audit dependencies: Flag any component requiring heavy unrequested external npm packages.',
      'Verify Tailwind / CSS custom property compatibility before recommending installation.'
    ],
    outputContract: ['RegistryComponentInspectionReport and installation instructions.']
  },

  // =========================================================================
  // 8. SECURITY & ENGINEERING GUARDRAILS
  // =========================================================================
  'alper-secure-coding': {
    name: 'alper-secure-coding',
    title: 'Secure Coding',
    status: 'ACTIVE',
    capabilityFamily: 'SECURITY',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator approval for security policy modifications or rule exemptions.'],
    sourceStrategy: 'OWASP Top 10 2025, OWASP ASVS 5.0, OWASP Cheat Sheet Series, and CWE Top 25.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['generate_engineering_policy', 'create_auth_model'],
    relatedSkills: ['alper-security-audit', 'alper-api-security', 'alper-secret-management'],
    reason: 'Enforces proactive secure coding practices based on OWASP Top 10 2025, ASVS 5.0, and engineering policies.',
    corePurpose: 'Enforces proactive secure coding standards based on OWASP ASVS 5.0, OWASP Top 10 2025, and CWE Top 25, generating stack-aware security policies covering input validation, parameterized queries, and auth token lifetimes.',
    positiveUseWhen: [
      'Establishing secure coding standards and engineering policies for a project.',
      'Writing or reviewing authentication, authorization, or session handling code.',
      'Enforcing parameterized database queries, CSRF protections, and secure cookie directives.'
    ],
    negativeDoNotUseWhen: [
      'Fixing visual button padding or responsive CSS layouts (use alper-design-repair).',
      'Searching for design tokens and icon libraries (use alper-source-intelligence).',
      'Tuning database indexing (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Ingest target stack and security level requirements (ASVS L1, L2, L3).',
      '2. Generate stack-aware EngineeringPolicy covering injection, auth, cryptography, and headers.',
      '3. Formulate secure coding directives for developers and CI/CD pipelines.',
      '4. Output EngineeringPolicyDocument.'
    ],
    decisionRules: [
      'SQL Injection Zero Tolerance: Parameterized queries or type-safe ORM query builders are mandatory.',
      'Secure Cookie Directives: All session cookies must enforce HttpOnly, Secure, and SameSite=Strict/Lax.'
    ],
    outputContract: ['EngineeringPolicyDocument and SecurityComplianceChecklist.']
  },

  'alper-security-audit': {
    name: 'alper-security-audit',
    title: 'Security Audit',
    status: 'ACTIVE',
    capabilityFamily: 'SECURITY',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['MANDATORY written operator authorization before executing active penetration scans or live probing.'],
    sourceStrategy: 'OWASP Top 10 2025, STRIDE threat modeling methodology, CVE/NVD databases, and ASVS 5.0 verification rules.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    evidenceArtifacts: ['security-sast-report', 'stride-threat-model', 'dependency-audit-json'],
    mcpTools: ['run_safe_security_scan', 'generate_threat_model', 'evaluate_release_gates', 'detect_tool_capabilities'],
    relatedSkills: ['alper-secure-coding', 'alper-api-security', 'alper-supply-chain-security', 'alper-secret-management'],
    reason: 'Passive security audits, STRIDE threat models, and release gate evaluation.',
    corePurpose: 'Performs passive, read-only static security audits, generates STRIDE threat models, scans for hardcoded credentials, and evaluates vulnerability findings against release gates without active network intrusion.',
    positiveUseWhen: [
      'Auditing a repository for security vulnerabilities, misconfigurations, and OWASP Top 10 risks.',
      'Generating a STRIDE threat model (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation).',
      'Evaluating security findings against release gate policies before deployment.'
    ],
    negativeDoNotUseWhen: [
      'Styling UI components or tokens (use alper-design-language).',
      'Running active network attacks or penetration testing without explicit written authorization.',
      'Diagnosing database query latency (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Enforce PASSIVE / READ-ONLY mode: scan source files, configs, and dependencies statically.',
      '2. Generate STRIDE threat model identifying system trust boundaries and attack surfaces.',
      '3. Execute safe static security scan (checking for secrets, injection, insecure dependencies).',
      '4. Evaluate findings against release gates (CRITICAL and HIGH block release).',
      '5. Output SecurityAuditReport with remediations.'
    ],
    decisionRules: [
      'Passive Safety Rule: All automated audits are strictly PASSIVE and read-only. Active testing requires explicit operator authorization.',
      'Release Blocker: Any unmitigated CRITICAL or HIGH severity finding blocks release gate PASS.',
      'Never include UI visual approval checkpoints in security auditing.'
    ],
    outputContract: ['SecurityAuditReport, STRIDEThreatModel, and ReleaseGateEvaluationResult.']
  },

  'alper-api-security': {
    name: 'alper-api-security',
    title: 'API Security',
    status: 'ACTIVE',
    capabilityFamily: 'SECURITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Security review on rate limiting exceptions or tenant boundary logic changes.'],
    sourceStrategy: 'OWASP API Security Top 10 2023 (BOLA, Broken Auth, BOPLA, Resource Exhaustion) and RFC 6750.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    evidenceArtifacts: ['api-security-audit-report', 'bola-idor-matrix', 'cors-jwt-spec'],
    mcpTools: ['evaluate_release_gates'],
    relatedSkills: ['alper-api-designer', 'alper-secure-coding', 'alper-security-audit'],
    reason: 'OWASP API Top 10 defense, BOLA/IDOR prevention, rate limiting, and payload schema hardening.',
    corePurpose: 'Hardens API endpoints against OWASP API Security Top 10 vulnerabilities, focusing on Broken Object Level Authorization (BOLA/IDOR), tenant isolation, strict request body validation, and rate limiting.',
    positiveUseWhen: [
      'Auditing or implementing authorization checks on object-level resource identifiers (e.g. /api/orders/{id}).',
      'Configuring rate limiting, payload size restrictions, and CORS policies.',
      'Preventing Broken Object Property Level Authorization (mass assignment vulnerabilities).'
    ],
    negativeDoNotUseWhen: [
      'Designing frontend page layouts or buttons (use alper-ui-blueprint).',
      'Tuning database indexing (use alper-sql-performance).',
      'Searching icon libraries (use alper-source-intelligence).'
    ],
    keyWorkflow: [
      '1. Review API endpoint definitions and controller handlers.',
      '2. Verify tenant boundary checks: assert user owns requested resource ID on every query.',
      '3. Verify request payload schema validation (prohibiting mass-assignment of sensitive fields).',
      '4. Verify rate-limiting and security headers (CORS, CSP, HSTS).',
      '5. Output APISecurityAudit.'
    ],
    decisionRules: [
      'BOLA Zero Tolerance: Never fetch resources solely by route ID without scoping query by authenticated tenant/user ID.',
      'Strict Schemas: Endpoints must explicitly whitelist allowed input properties (no open object binds).'
    ],
    outputContract: ['APISecurityAuditReport and EndpointHardeningChecklist.']
  },

  'alper-secret-management': {
    name: 'alper-secret-management',
    title: 'Secret Management',
    status: 'ACTIVE',
    capabilityFamily: 'SECURITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator notification and key rotation protocol upon detecting committed secrets.'],
    sourceStrategy: 'Secret detection regex patterns, Shannon entropy analysis, and .env governance best practices.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    evidenceArtifacts: ['trufflehog-gitleaks-log', 'entropy-scan-report', 'env-redaction-map'],
    mcpTools: ['run_safe_security_scan'],
    relatedSkills: ['alper-security-audit', 'alper-secure-coding', 'alper-git-safety'],
    reason: 'Zero-tolerance secret leak prevention, token/key scanning, and .env governance.',
    corePurpose: 'Enforces zero-tolerance credential leak prevention, scanning source code, git history, and configs for hardcoded API keys, private certificates, database passwords, and improper .env exposure.',
    positiveUseWhen: [
      'Pre-commit and CI/CD secret scanning before code is pushed to remote repositories.',
      'Auditing .gitignore files to ensure credential files (.env, id_rsa, *.pem) are excluded.',
      'Redacting credentials from logs, execution journals, and diagnostic traces.'
    ],
    negativeDoNotUseWhen: [
      'Diagnosing slow database queries (use alper-sql-performance).',
      'Designing UI page layouts (use alper-ui-blueprint).',
      'Writing Playwright browser tests (use alper-browser-qa).'
    ],
    keyWorkflow: [
      '1. Scan workspace files with secret detection patterns and entropy analysis.',
      '2. Verify that .env and credential files are listed in .gitignore.',
      '3. If secrets are detected, immediately flag file and line number.',
      '4. Enforce [REDACTED] masking on all output artifacts.'
    ],
    decisionRules: [
      'Zero Tolerance: Any committed private key, JWT secret, or API token blocks release immediately.',
      'Never echo or display detected secret values in audit reports or console logs.'
    ],
    outputContract: ['SecretScanReport with redacted findings and remediation instructions.']
  },

  'alper-supply-chain-security': {
    name: 'alper-supply-chain-security',
    title: 'Supply Chain Security',
    status: 'ACTIVE',
    capabilityFamily: 'SECURITY',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator approval for major dependency upgrades with breaking changes or known CVE trade-offs.'],
    sourceStrategy: 'NIST SSDF (SP 800-218), SLSA Framework, CycloneDX SBOM standard, and OSV / GitHub Advisory Database.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    evidenceArtifacts: ['npm-audit-json', 'cyclonedx-spdx-sbom', 'permissive-license-audit'],
    mcpTools: ['evaluate_release_gates', 'run_safe_security_scan'],
    relatedSkills: ['alper-security-audit', 'alper-source-intelligence'],
    reason: 'NIST SSDF, SLSA provenance, CycloneDX SBOM generation, dependency CVE hygiene, and SemVer lifecycle.',
    corePurpose: 'Audits software supply chains, generating CycloneDX Software Bill of Materials (SBOM), scanning package lockfiles for known CVEs, and enforcing NIST SSDF / SLSA provenance standards.',
    positiveUseWhen: [
      'Generating a CycloneDX SBOM for release compliance.',
      'Scanning npm, composer, or NuGet dependencies for known CVE vulnerabilities.',
      'Reviewing SemVer dependency upgrade policies and lockfile integrity.'
    ],
    negativeDoNotUseWhen: [
      'Fixing CSS visual bugs (use alper-design-repair).',
      'Designing relational database schemas (use alper-database-designer).',
      'Writing E2E browser tests (use alper-browser-qa).'
    ],
    keyWorkflow: [
      '1. Parse package manifests (package-lock.json, composer.lock, packages.lock.json).',
      '2. Query vulnerability databases for known CVEs affecting declared versions.',
      '3. Generate CycloneDX SBOM detailing component licenses and hashes.',
      '4. Evaluate supply chain findings against release gate policies.'
    ],
    decisionRules: [
      'CRITICAL CVE Block: Dependencies with unmitigated CRITICAL severity CVEs block release.',
      'Lockfile Integrity: Direct edits to lockfiles without package manager resolution are forbidden.'
    ],
    outputContract: ['CycloneDX SBOM artifact and DependencyVulnerabilityReport.']
  },

  'alper-ai-skill-audit': {
    name: 'alper-ai-skill-audit',
    title: 'AI Skill Audit',
    status: 'ACTIVE',
    capabilityFamily: 'SECURITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review before approving third-party AI skills with destructive tool permissions.'],
    sourceStrategy: 'OWASP Top 10 for LLM Applications (Prompt Injection, Insecure Tool Use) and skill metadata schemas.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    evidenceArtifacts: ['prompt-injection-sast-report', 'skill-manifest-security-audit'],
    mcpTools: ['discover_ai_skills', 'inspect_ai_skill'],
    relatedSkills: ['alper-security-audit', 'alper-source-intelligence'],
    reason: 'Audits third-party AI design skills for prompt injection hazards and unauthorized tool invocations.',
    corePurpose: 'Inspects third-party AI skills and agent prompts for prompt injection vulnerabilities, unauthorized tool capability escalations, and unsanitized context exfiltration risks.',
    positiveUseWhen: [
      'Auditing a third-party AI skill or prompt template before importing into the workspace.',
      'Checking skill instructions for prompt injection or system prompt override vectors.',
      'Verifying that an AI skill requests only the minimum required tool permissions.'
    ],
    negativeDoNotUseWhen: [
      'Designing database tables (use alper-database-designer).',
      'Styling UI buttons and tokens (use alper-design-language).',
      'Diagnosing database latency (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Parse target SKILL.md and metadata manifest.',
      '2. Analyze prompt text for indirect prompt injection or jailbreak patterns.',
      '3. Audit requested tool list against principle of least privilege.',
      '4. Emit AISkillSecurityReport.'
    ],
    decisionRules: [
      'Least Privilege: Skills with broad filesystem or shell access must have explicit justification.',
      'Prompt Injection: Skills containing unescaped user input injection points are rejected.'
    ],
    outputContract: ['AISkillSecurityAuditReport with risk assessment and permission verdict.']
  },

  'alper-code-quality': {
    name: 'alper-code-quality',
    title: 'Code Quality',
    status: 'ACTIVE',
    capabilityFamily: 'SECURITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['None required for standard static analysis runs.'],
    sourceStrategy: 'Language-specific static analyzers (ESLint, PHPStan, Roslyn, Ruff) and cognitive complexity metrics.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['detect_tool_capabilities', 'evaluate_release_gates'],
    relatedSkills: ['alper-independent-review', 'alper-secure-coding'],
    reason: 'Enforces static analysis, typed linting (ESLint, PHPStan, Roslyn), and cognitive complexity limits.',
    corePurpose: 'Enforces code quality, typed linting, and cognitive complexity limits across supported languages, ensuring strict type-safety, zero linter errors, and low cognitive overhead.',
    positiveUseWhen: [
      'Running static analysis, TypeScript strict checking, or language linter passes.',
      'Auditing functions exceeding cognitive complexity limits (max complexity 15).',
      'Verifying clean static analysis evidence before release gate evaluation.'
    ],
    negativeDoNotUseWhen: [
      'Executing browser UI tests (use alper-browser-qa).',
      'Designing relational schemas (use alper-database-designer).',
      'Planning product features (use alper-requirements-engineering).'
    ],
    keyWorkflow: [
      '1. Detect installed linter tools (ESLint, PHPStan, Roslyn).',
      '2. Execute typed static analysis in workspace.',
      '3. Parse and categorize linter errors and warnings.',
      '4. Evaluate cognitive complexity metrics on modified methods.',
      '5. Output CodeQualityReport.'
    ],
    decisionRules: [
      'Zero Lint Errors: Code with blocking lint errors cannot pass release gates.',
      'Cognitive Complexity: Functions with complexity > 15 must be refactored into smaller helpers.'
    ],
    outputContract: ['CodeQualityAuditReport with linter output and complexity breakdown.']
  },

  // =========================================================================
  // 9. QA_TESTING
  // =========================================================================
  'alper-browser-qa': {
    name: 'alper-browser-qa',
    title: 'Browser QA & E2E',
    status: 'ACTIVE',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Human review of visual discrepancy reports or E2E failure video recordings.'],
    sourceStrategy: 'Playwright automation APIs, Chrome DevTools Protocol, and W3C accessible locator practices.',
    evidenceRequirements: ['BROWSER_TEST', 'VISUAL_DIFF', 'RUNTIME_CHECK'],
    evidenceArtifacts: ['browser-console-log', 'network-har-trace', 'playwright-test-trace'],
    mcpTools: ['generate_playwright_test', 'generate_qa_report'],
    relatedSkills: ['alper-visual-regression', 'alper-accessibility-testing', 'alper-testing-strategy'],
    reason: 'Orchestrates Playwright E2E and Chrome DevTools runtime inspection, console errors, and cross-browser testing.',
    corePurpose: 'Orchestrates end-to-end browser testing and runtime inspection using Playwright and Chrome DevTools, generating resilient accessible role-based tests, capturing network waterfalls, and auditing console exceptions across 4 viewports.',
    positiveUseWhen: [
      'Generating or running Playwright E2E tests for user journeys.',
      'Inspecting live browser runtime for console errors, unhandled promise rejections, or 4xx/5xx network failures.',
      'Validating responsive layouts across 4 standard viewports (390px, 768px, 1440px, 1920px).'
    ],
    negativeDoNotUseWhen: [
      'Designing database tables or SQL migrations (use alper-database-designer).',
      'Analyzing server-side SQL query execution plans (use alper-sql-performance).',
      'Creating product discovery profiles (use alper-greenfield-product-analysis).'
    ],
    keyWorkflow: [
      '1. Ingest user journey specification or target URL/route.',
      '2. Generate deterministic Playwright test code using accessible role locators (getByRole, getByLabel).',
      '3. Execute test suite headlessly across configured viewport matrix.',
      '4. Capture console error logs, network traces, and failure screenshots.',
      '5. Output structured QAReport.'
    ],
    decisionRules: [
      'Accessible Locators Rule: Tests must use getByRole, getByLabel, or getByText; fragile CSS/XPath locators are prohibited.',
      'Zero Console Errors: Uncaught runtime exceptions in browser console fail the QA gate.'
    ],
    outputContract: ['PlaywrightTestScript, BrowserExecutionLog, and ComprehensiveQAReport.']
  },

  'alper-visual-regression': {
    name: 'alper-visual-regression',
    title: 'Visual Regression',
    status: 'ACTIVE',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['MANDATORY human visual approval on any detected pixel diff exceeding tolerance threshold.'],
    sourceStrategy: 'Pixelmatch / Playwright visual snapshot comparison, DOM tree diffing, and CSS media query matrices.',
    evidenceRequirements: ['VISUAL_DIFF'],
    evidenceArtifacts: ['viewport-screenshot-png', 'pixel-difference-map', 'percy-playwright-diff'],
    mcpTools: ['generate_qa_report'],
    relatedSkills: ['alper-browser-qa', 'alper-design-critic', 'alper-design-repair'],
    reason: 'Evaluates pixel and DOM visual diffs across 4 responsive viewports and light/dark themes.',
    corePurpose: 'Compares visual rendering snapshots against approved baselines across mobile, tablet, and desktop viewports in light and dark modes, flagging unintended layout shifts and pixel regressions for human visual review.',
    positiveUseWhen: [
      'Verifying that styling or token refactorings did not alter visual appearance.',
      'Capturing multi-viewport visual baselines before executing modernization stages.',
      'Generating visual diff packages for human visual sign-off.'
    ],
    negativeDoNotUseWhen: [
      'Tuning SQL queries (use alper-sql-performance).',
      'Testing API contract endpoints (use alper-contract-testing).',
      'Generating database blueprints (use alper-database-designer).'
    ],
    keyWorkflow: [
      '1. Capture baseline screenshot across viewport matrix (390, 768, 1440, 1920px).',
      '2. Apply candidate code modifications.',
      '3. Capture current rendering screenshot under identical conditions.',
      '4. Compute pixel difference and highlighted diff image.',
      '5. Submit diffs exceeding threshold for human visual approval.'
    ],
    decisionRules: [
      'Human Visual Sign-off: Automated tests cannot self-approve visual diffs exceeding 0.1% change; human approval is required.',
      'Multi-Viewport Requirement: Visual assertions must be validated across at least mobile and desktop viewports.'
    ],
    outputContract: ['VisualDiffArtifactCollection and VisualRegressionAuditReport.']
  },

  'alper-accessibility-testing': {
    name: 'alper-accessibility-testing',
    title: 'Accessibility Testing',
    status: 'ACTIVE',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review of manual keyboard navigation verification and screen reader announcements.'],
    sourceStrategy: 'W3C Web Content Accessibility Guidelines (WCAG 2.2 AA canonical standard, WCAG 2.1 AA compatibility), WAI-ARIA 1.2, and axe-core rule set.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'BROWSER_TEST'],
    evidenceArtifacts: ['axe-core-violations-json', 'wcag-2-2-aa-audit-report', 'aria-tree-snapshot'],
    mcpTools: ['audit_accessibility', 'generate_qa_report'],
    relatedSkills: ['alper-browser-qa', 'alper-design-language', 'alper-design-repair'],
    reason: 'Audits WCAG 2.2 AA compliance, keyboard navigation, contrast ratios, and aria attributes.',
    corePurpose: 'Audits web user interfaces against the canonical WCAG 2.2 AA standard (supporting WCAG 2.1 AA compatibility), evaluating color contrast, focus-visible indicators, keyboard navigation, target sizes, and ARIA attributes.',
    positiveUseWhen: [
      'Auditing a web application for WCAG 2.2 AA / Section 508 accessibility compliance.',
      'Verifying keyboard tab order, focus traps in modals, and skip-to-content links.',
      'Checking touch target sizes (min 24x24px in WCAG 2.2) and accessible color contrast (4.5:1 / 3:1).'
    ],
    negativeDoNotUseWhen: [
      'Tuning SQL performance (use alper-sql-performance).',
      'Designing backend API contracts (use alper-api-designer).',
      'Writing database migrations (use alper-migration-safety).'
    ],
    keyWorkflow: [
      '1. Execute axe-core automated audit on rendered DOM.',
      '2. Audit contrast ratios across light and dark modes against WCAG 2.2 AA thresholds.',
      '3. Verify keyboard navigation flow (logical tab order, no keyboard traps, visible focus rings).',
      '4. Verify target sizes meet WCAG 2.2 minimum spacing requirements.',
      '5. Output AccessibilityReport with prioritized violations.'
    ],
    decisionRules: [
      'Canonical Target: The primary accessibility baseline for ALPER DESIGN OS is WCAG 2.2 AA.',
      'Critical A11y Violations (missing alt on images, low contrast text, broken focus trap) block release gate.'
    ],
    outputContract: ['AccessibilityAuditReport (WCAG 2.2 AA) with violation locations and code remedies.']
  },

  'alper-testing-strategy': {
    name: 'alper-testing-strategy',
    title: 'Testing Strategy',
    status: 'ACTIVE',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review of testing pyramid budget and target coverage allocations.'],
    sourceStrategy: 'Test Pyramid principles (Martin Fowler), shift-left testing models, and coverage heuristics.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['generate_test_pyramid', 'generate_qa_report'],
    relatedSkills: ['alper-browser-qa', 'alper-contract-testing', 'alper-regression-testing'],
    reason: 'Synthesizes project-appropriate test pyramids across Static, Unit, Integration, API, E2E, and Performance.',
    corePurpose: 'Synthesizes balanced, cost-effective test pyramids (Static -> Unit -> Integration -> API -> E2E -> Performance) tailored to project risk, avoiding inverted ice-cream cone anti-patterns.',
    positiveUseWhen: [
      'Formulating a comprehensive testing strategy for a greenfield or modernization project.',
      'Allocating testing budgets across unit, integration, and end-to-end tiers.',
      'Auditing existing test distributions to eliminate redundant or slow test suites.'
    ],
    negativeDoNotUseWhen: [
      'Writing individual Playwright test scripts (use alper-browser-qa).',
      'Designing database schemas (use alper-database-designer).',
      'Fixing CSS visual bugs (use alper-design-repair).'
    ],
    keyWorkflow: [
      '1. Analyze project criticality, change frequency, and deployment cadence.',
      '2. Allocate test distribution percentages across 6 pyramid tiers.',
      '3. Formulate TestPyramidSpecification defining toolchains for each tier.',
      '4. Establish coverage targets and CI/CD execution pipeline order.'
    ],
    decisionRules: [
      'Pyramid Balance: Heavy reliance on slow E2E tests over fast unit/integration tests is rejected.',
      'Every critical user conversion funnel must have at least one integration or E2E smoke test.'
    ],
    outputContract: ['TestPyramidSpecification with tier distributions and tool recommendations.']
  },

  'alper-contract-testing': {
    name: 'alper-contract-testing',
    title: 'Contract Testing',
    status: 'ACTIVE',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator / API provider review when breaking contract changes are detected.'],
    sourceStrategy: 'Pact consumer-driven contracts standard, OpenAPI schema validation, and JSON Schema draft 2020-12.',
    evidenceRequirements: ['INTEGRATION_TEST', 'STATIC_ANALYSIS'],
    evidenceArtifacts: ['pact-contract-diff', 'api-schema-validation-result'],
    mcpTools: ['evaluate_api_compatibility'],
    relatedSkills: ['alper-api-designer', 'alper-behavior-preservation'],
    reason: 'Pact consumer-driven contracts, API contract validation, and breaking change prevention.',
    corePurpose: 'Enforces consumer-driven contract testing (Pact) and OpenAPI schema conformance, validating that frontend consumers and backend API providers remain mutually compatible without breaking payload contracts.',
    positiveUseWhen: [
      'Verifying API request/response compatibility between frontend and backend services.',
      'Detecting breaking schema changes in microservices or decoupled client-server architectures.',
      'Validating mock API providers against live OpenAPI specifications.'
    ],
    negativeDoNotUseWhen: [
      'Running visual UI layout checks (use alper-visual-regression).',
      'Designing database tables (use alper-database-designer).',
      'Diagnosing slow SQL query plans (use alper-sql-performance).'
    ],
    keyWorkflow: [
      '1. Ingest consumer expectations and provider OpenAPI specification.',
      '2. Execute contract verification checking status codes, headers, and payload schemas.',
      '3. Detect broken expectations (missing fields, type mutations, unhandled error responses).',
      '4. Output ContractVerificationReport.'
    ],
    decisionRules: [
      'Breaking Change Rejection: Any change that removes a field or changes a type without versioning fails contract verification.',
      'Consumer expectations must be validated against both success and error responses.'
    ],
    outputContract: ['ContractVerificationReport with compatibility verdict and schema diffs.']
  },

  'alper-regression-testing': {
    name: 'alper-regression-testing',
    title: 'Regression Testing',
    status: 'ACTIVE',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator sign-off if known non-critical regressions are temporarily waived.'],
    sourceStrategy: 'Regression test selection algorithms (RTS), affected module graphs, and smoke suite definitions.',
    evidenceRequirements: ['UNIT_TEST', 'INTEGRATION_TEST'],
    evidenceArtifacts: ['vitest-junit-xml', 'test-coverage-summary-json'],
    mcpTools: ['generate_qa_report', 'detect_regression'],
    relatedSkills: ['alper-change-impact-analysis', 'alper-browser-qa', 'alper-behavior-preservation'],
    reason: 'Orchestrates selective smoke and regression test suites safeguarding critical business funnels.',
    corePurpose: 'Selects and executes targeted smoke and regression test suites based on change impact analysis, ensuring high-risk business funnels remain operational without running exhaustive full-suite test cycles.',
    positiveUseWhen: [
      'Executing targeted regression testing after a code repair or modernization stage.',
      'Selecting optimal test subsets matching modified files to minimize CI execution time.',
      'Validating critical checkout, login, or scheduling funnels after updates.'
    ],
    negativeDoNotUseWhen: [
      'Conducting product discovery briefs (use alper-greenfield-product-analysis).',
      'Designing design tokens (use alper-design-language).',
      'Auditing software supply chains (use alper-supply-chain-security).'
    ],
    keyWorkflow: [
      '1. Ingest list of modified files from git diff.',
      '2. Query change impact graph to select affected test suites.',
      '3. Run selected regression and smoke tests.',
      '4. Evaluate results and emit regression verdict.'
    ],
    decisionRules: [
      'Zero Regression Tolerated: Any failure in a previously passing test fails the regression gate.',
      'Critical business funnels must be included in regression validation whenever upstream services change.'
    ],
    outputContract: ['RegressionTestReport with executed test list and pass/fail summary.']
  },

  // =========================================================================
  // 10. PERFORMANCE_RELIABILITY, TRUTHFUL_UI & OPERATOR_EXECUTION
  // =========================================================================
  'alper-performance-engineering': {
    name: 'alper-performance-engineering',
    title: 'Performance Engineering',
    status: 'ACTIVE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review of bundle budget exemptions or performance optimization trade-offs.'],
    sourceStrategy: 'Google Core Web Vitals (LCP, INP, CLS), Lighthouse performance audits, and Chrome DevTools traces.',
    evidenceRequirements: ['RUNTIME_CHECK', 'BROWSER_TEST'],
    evidenceArtifacts: ['core-web-vitals-metrics', 'lighthouse-performance-json', 'profiler-flamegraph'],
    mcpTools: ['generate_qa_report'],
    relatedSkills: ['alper-browser-qa', 'alper-sql-performance'],
    reason: 'Enforces Core Web Vitals (LCP, INP, CLS), asset budgets, pagination, and DevTools trace analysis.',
    corePurpose: 'Audits and optimizes frontend web performance against Google Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1), enforcing bundle size budgets, font loading strategies, and sub-second interaction responsiveness.',
    positiveUseWhen: [
      'Auditing page speed, bundle sizes, and Core Web Vitals.',
      'Investigating layout shifts (CLS), long tasks causing high input delay (INP), or slow rendering (LCP).',
      'Enforcing JavaScript asset budgets in build pipelines.'
    ],
    negativeDoNotUseWhen: [
      'Diagnosing database query plans (use alper-sql-performance).',
      'Designing database schemas (use alper-database-designer).',
      'Writing backend API controllers (use alper-api-designer).'
    ],
    keyWorkflow: [
      '1. Capture Lighthouse performance audit and DevTools performance trace.',
      '2. Analyze Core Web Vitals (LCP, INP, CLS) and long-task waterfalls.',
      '3. Audit bundle sizes and identify unoptimized third-party scripts.',
      '4. Formulate prioritized performance remediations (code splitting, lazy loading, font preloading).'
    ],
    decisionRules: [
      'Core Web Vitals Thresholds: LCP must be under 2.5s, INP under 200ms, and CLS under 0.1 for production release.',
      'Performance claims require measured before/after trace evidence.'
    ],
    outputContract: ['PerformanceAuditReport with Core Web Vitals breakdown and optimization recommendations.']
  },

  'alper-reliability': {
    name: 'alper-reliability',
    title: 'Reliability & Resilience',
    status: 'ACTIVE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator / SRE approval of SLI/SLO target definitions and error budget policies.'],
    sourceStrategy: 'Google SRE Book (SLIs, SLOs, Error Budgets), Release It! design patterns (Circuit Breaker, Bulkhead, Fallback).',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['evaluate_release_gates'],
    relatedSkills: ['alper-observability', 'alper-release-safety'],
    reason: 'Defines SLIs/SLOs, circuit breakers, backoff strategies, bulkheads, and graceful degradation.',
    corePurpose: 'Architects system resilience patterns including circuit breakers, exponential backoff retries, bulkheads, fallback caches, and SLI/SLO error budget governance for distributed and client-server architectures.',
    positiveUseWhen: [
      'Designing fault-tolerant client-server communication with graceful degradation.',
      'Defining SLIs, SLOs, and availability targets for services.',
      'Configuring retry policies with exponential backoff and jitter.'
    ],
    negativeDoNotUseWhen: [
      'Fixing CSS visual styling (use alper-design-repair).',
      'Designing database schemas (use alper-database-designer).',
      'Writing Playwright browser tests (use alper-browser-qa).'
    ],
    keyWorkflow: [
      '1. Define service SLIs (latency, availability, error rate) and target SLOs.',
      '2. Configure circuit breaker thresholds on external service integrations.',
      '3. Implement retry policies with exponential backoff and jitter.',
      '4. Output ReliabilityArchitectureSpecification.'
    ],
    decisionRules: [
      'Circuit Breaker Rule: External HTTP/API dependencies must have circuit breaker protections to prevent thread pool exhaustion.',
      'Retries must always include exponential backoff and randomized jitter to prevent thundering herd problems.'
    ],
    outputContract: ['ReliabilityArchitectureDocument and SLOSpecification.']
  },

  'alper-observability': {
    name: 'alper-observability',
    title: 'Observability & Telemetry',
    status: 'ACTIVE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Privacy / security officer review of log redaction rules for PII compliance.'],
    sourceStrategy: 'OpenTelemetry specification, W3C Trace Context, structured JSON logging, and track-trace telemetry standards.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['audit_track_trace_telemetry'],
    relatedSkills: ['alper-reliability', 'alper-release-safety'],
    reason: 'OpenTelemetry tracing, metrics, structured logging, correlation IDs, PII redaction, and track-trace telemetry.',
    corePurpose: 'Architects OpenTelemetry distributed tracing, Prometheus-compatible metrics, structured JSON logging, correlation ID propagation, automated PII redaction, and operational track-trace telemetry.',
    positiveUseWhen: [
      'Instrumenting applications with OpenTelemetry tracing and structured logging.',
      'Configuring correlation ID propagation across HTTP headers and async workers.',
      'Auditing operational track-trace telemetry for industrial or logistics workflows.'
    ],
    negativeDoNotUseWhen: [
      'Styling UI components (use alper-design-language).',
      'Designing database normalization (use alper-database-designer).',
      'Running accessibility audits (use alper-accessibility-testing).'
    ],
    keyWorkflow: [
      '1. Configure OpenTelemetry SDK with tracer and meter providers.',
      '2. Establish structured JSON logging format with correlation IDs (trace_id, span_id).',
      '3. Enforce automated regex redaction on passwords, tokens, and PII fields.',
      '4. Output ObservabilitySpecification.'
    ],
    decisionRules: [
      'PII Redaction Rule: Passwords, authorization tokens, credit cards, and PII must never be emitted into log streams.',
      'Correlation IDs must propagate across all inbound and outbound service requests.'
    ],
    outputContract: ['ObservabilityArchitectureDocument and TelemetryConfiguration.']
  },

  'alper-release-safety': {
    name: 'alper-release-safety',
    title: 'Release Safety',
    status: 'ACTIVE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator sign-off before initiating production canary rollout or altering feature flag state.'],
    sourceStrategy: 'Continuous Delivery principles (Dave Farley), OpenFeature standard, canary deployment patterns, and automated release gates.',
    evidenceRequirements: ['STATIC_ANALYSIS'],
    mcpTools: ['evaluate_release_gates'],
    relatedSkills: ['alper-independent-review', 'alper-evidence-review'],
    reason: 'Canary rollouts, feature flags, DB backwards compatibility, and automated release gates.',
    corePurpose: 'Evaluates automated release gates, configures OpenFeature feature flags, coordinates canary rollouts, and ensures zero-downtime database and API backwards compatibility before production deployment.',
    positiveUseWhen: [
      'Evaluating release gates prior to deployment.',
      'Configuring feature flags for dark launching and progressive rollouts.',
      'Designing rollback automation and canary traffic shifting schedules.'
    ],
    negativeDoNotUseWhen: [
      'Writing frontend HTML/CSS (use alper-design-repair).',
      'Designing database tables (use alper-database-designer).',
      'Conducting raw product briefs (use alper-greenfield-product-analysis).'
    ],
    keyWorkflow: [
      '1. Ingest test results, security scan findings, and visual verification evidence.',
      '2. Evaluate against configured ReleaseGatePolicy (Zero Critical/High issues).',
      '3. Verify database migration backwards compatibility.',
      '4. Output ReleaseGateEvaluation verdict.'
    ],
    decisionRules: [
      'Gating Invariant: Any failing security gate or unverified critical test blocks release.',
      'Feature flags must specify default fallback behavior in the event of flag provider outage.'
    ],
    outputContract: ['ReleaseGateEvaluationVerdict and DeploymentReadinessReport.']
  },

  'alper-load-testing': {
    name: 'alper-load-testing',
    title: 'Load Testing',
    status: 'ACTIVE',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['MANDATORY written operator authorization before executing stress or load tests against any environment.'],
    sourceStrategy: 'Grafana k6 load test scripting, stress/spike testing models, and throughput latency curves.',
    evidenceRequirements: ['RUNTIME_CHECK', 'INTEGRATION_TEST'],
    evidenceArtifacts: ['k6-autocannon-summary-json', 'latency-histogram-p99', 'rps-throughput-log'],
    mcpTools: ['generate_qa_report'],
    relatedSkills: ['alper-performance-engineering', 'alper-reliability'],
    reason: 'Benchmarks throughput and latency under stress with Grafana k6 under explicit operator approval.',
    corePurpose: 'Generates and runs Grafana k6 performance benchmarks, stress tests, and spike tests under strict operator authorization, evaluating p95/p99 latency curves and breaking point throughput.',
    positiveUseWhen: [
      'Benchmarking system throughput (req/s) and latency under anticipated operational load.',
      'Testing auto-scaling thresholds and database connection pool saturation.',
      'Identifying performance bottlenecks under concurrency.'
    ],
    negativeDoNotUseWhen: [
      'Executing unauthorized load tests against production environments.',
      'Writing single-unit UI tests (use alper-browser-qa).',
      'Styling CSS components (use alper-design-repair).'
    ],
    keyWorkflow: [
      '1. Obtain explicit written operator authorization for target environment and load parameters.',
      '2. Generate Grafana k6 test script defining virtual users (VUs) and ramp-up stages.',
      '3. Execute test run while monitoring server health.',
      '4. Output LoadTestReport with throughput, error rates, and p95/p99 response times.'
    ],
    decisionRules: [
      'Authorization Mandatory: Running load tests without operator authorization is strictly forbidden.',
      'Auto-Abort: The load script must define auto-abort thresholds if error rate exceeds 5%.'
    ],
    outputContract: ['LoadBenchmarkReport with concurrency curves and latency percentiles.']
  },

  'alper-truthful-ui': {
    name: 'alper-truthful-ui',
    title: 'Truthful UI & Data Provenance',
    status: 'ACTIVE',
    capabilityFamily: 'TRUTHFUL_UI',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'CONDITIONAL',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review when ungrounded metrics or placeholder numbers are flagged on production screens.'],
    sourceStrategy: 'Data provenance graph, database entity contracts, API schemas, and page intent definitions.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'HEURISTIC_REVIEW'],
    mcpTools: [
      'evaluate_truthful_ui',
      'audit_data_provenance',
      'evaluate_page_intent',
      'audit_information_relevance',
      'classify_source_authority',
      'evaluate_content_truth_gate'
    ],
    relatedSkills: ['alper-design-critic', 'alper-database-designer', 'alper-evidence-review'],
    reason: 'First-class truthful UI governance: data provenance, page intent, source authority, and content truth gate.',
    corePurpose: 'Enforces the universal invariant: NO CLAIM WITHOUT EVIDENCE in user interfaces. Audits visual dashboards, charts, and metrics to ensure all displayed statistics trace to authentic database or API sources rather than hallucinated dummy values.',
    positiveUseWhen: [
      'Auditing dashboard screens to ensure KPIs, charts, and progress bars have authentic data provenance.',
      'Eliminating misleading UI health scores (e.g. hardcoded 90% test coverage) or fake metric cards.',
      'Evaluating page intent to ensure every visual widget directly serves declared user jobs-to-be-done.'
    ],
    negativeDoNotUseWhen: [
      'Tuning SQL query execution plans (use alper-sql-performance).',
      'Running penetration tests (use alper-security-audit).',
      'Scaffolding raw project files (use alper-greenfield-generator).'
    ],
    keyWorkflow: [
      '1. Trace every KPI, table column, and chart metric to backend entity or API contract.',
      '2. Flag any hardcoded dummy statistic presented as authentic operational data.',
      '3. Audit page intent: verify layout aligns with declared user jobs-to-be-done without decorative bloat.',
      '4. Evaluate Content Truth Gate: missing data must render as truthful empty state rather than simulated numbers.',
      '5. Output TruthfulUIAuditReport.'
    ],
    decisionRules: [
      'Zero Hallucinated Metrics: Never hardcode simulated health scores or statistics without telemetry evidence.',
      'Truthful Empty States: When backend data is missing or empty, render an explicit, clear empty state.'
    ],
    outputContract: ['TruthfulUIAuditReport, DataProvenanceMap, and ContentTruthGateEvaluation.']
  },

  'alper-operator-execution': {
    name: 'alper-operator-execution',
    title: 'Operator Assisted Execution',
    status: 'ACTIVE',
    capabilityFamily: 'OPERATOR_EXECUTION',
    userFacingType: 'USER_ENTRYPOINT',
    userFacing: true,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: ['Operator review of generated RUN.ps1 script before local execution in air-gapped environment.'],
    sourceStrategy: 'Local toolchain discovery (Node, dotnet, PHP, Composer, Docker), PowerShell standards, and offline run contracts.',
    evidenceRequirements: ['STATIC_ANALYSIS', 'RUNTIME_CHECK'],
    mcpTools: [
      'create_manual_run_bundle',
      'verify_manual_run_evidence',
      'resolve_browser_runtime',
      'run_operator_doctor',
      'create_environment_profile',
      'detect_tool_capabilities'
    ],
    relatedSkills: ['alper-evidence-review', 'alper-greenfield-generator'],
    reason: 'Deterministic corporate execution fallback: manual run bundle generation (RUN.ps1), evidence verification, and browser runtime resolution.',
    corePurpose: 'Provides deterministic corporate execution fallbacks for restricted or air-gapped developer environments, generating self-contained manual run bundles (RUN.ps1), verifying run evidence, and running environment diagnostics.',
    positiveUseWhen: [
      'Running in restricted corporate or offline developer environments where automated shell/browser execution is blocked.',
      'Generating standalone RUN.ps1 scripts for operators to build, test, and package applications locally.',
      'Verifying and normalizing run-evidence.json artifacts produced by operator execution.'
    ],
    negativeDoNotUseWhen: [
      'Designing UI page layouts (use alper-ui-blueprint).',
      'Normalizing database schemas (use alper-database-designer).',
      'Writing application product requirements (use alper-requirements-engineering).'
    ],
    keyWorkflow: [
      '1. Diagnose local environment profile and detect installed toolchains (Node, dotnet, PHP, Docker).',
      '2. Generate self-contained RUN.ps1 script with prerequisite checks and test runner commands.',
      '3. Package run bundle into project root or .alper-design-os/bundles/.',
      '4. Provide clear execution instructions to the operator.',
      '5. Ingest and verify generated run-evidence.json upon completion.'
    ],
    decisionRules: [
      'Air-Gap Resilience: Generated run bundles must be completely self-contained and require no external internet access.',
      'Evidence Integrity: Ingested run evidence must report authentic process exit codes and execution logs.'
    ],
    outputContract: ['ManualRunBundle (RUN.ps1), EnvironmentProfile, and VerifiedRunEvidenceReport.']
  },

  // =========================================================================
  // 11. DEPRECATED SKILLS (19 Skills Permanently Superseded in Phase 1H.2)
  // =========================================================================
  'alper-design-new': {
    name: 'alper-design-new',
    title: 'Design New (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'GREENFIELD_ENGINEERING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-greenfield-generator'],
    reason: 'Phase 0 legacy workflow superseded by Phase 1G greenfield-generator and requirements-engineering.',
    replacement: 'alper-greenfield-generator',
    corePurpose: 'DEPRECATED: Superseded by alper-greenfield-generator.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-greenfield-generator.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-greenfield-generator.'],
    outputContract: []
  },
  'alper-design-modernize': {
    name: 'alper-design-modernize',
    title: 'Design Modernize (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'MODERNIZATION',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-modernization-planner'],
    reason: 'Phase 0 fixed 4-phase shell rewrite path superseded by Phase 1F Modernization Engine.',
    replacement: 'alper-modernization-planner',
    corePurpose: 'DEPRECATED: Superseded by alper-modernization-planner.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-modernization-planner.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-modernization-planner.'],
    outputContract: []
  },
  'alper-safe-refactor': {
    name: 'alper-safe-refactor',
    title: 'Safe Refactor (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'MODERNIZATION',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-refactoring-strategy'],
    reason: 'Merged into alper-refactoring-strategy to eliminate split-brain refactoring guidance.',
    replacement: 'alper-refactoring-strategy',
    corePurpose: 'DEPRECATED: Merged into alper-refactoring-strategy.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-refactoring-strategy.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-refactoring-strategy.'],
    outputContract: []
  },
  'alper-regression-guard': {
    name: 'alper-regression-guard',
    title: 'Regression Guard (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'MODERNIZATION',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-behavior-preservation'],
    reason: 'Merged into alper-behavior-preservation which provides the canonical behavioral baseline contract.',
    replacement: 'alper-behavior-preservation',
    corePurpose: 'DEPRECATED: Merged into alper-behavior-preservation.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-behavior-preservation.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-behavior-preservation.'],
    outputContract: []
  },
  'alper-architecture-planner': {
    name: 'alper-architecture-planner',
    title: 'Architecture Planner (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'ARCHITECTURE',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-architecture'],
    reason: 'Merged into alper-architecture to eliminate duplicate architecture planning workflows.',
    replacement: 'alper-architecture',
    corePurpose: 'DEPRECATED: Merged into alper-architecture.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-architecture.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-architecture.'],
    outputContract: []
  },
  'alper-architecture-audit': {
    name: 'alper-architecture-audit',
    title: 'Architecture Audit (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'ARCHITECTURE',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-architecture'],
    reason: 'Merged into alper-architecture which provides comprehensive architectural analysis and boundary audits.',
    replacement: 'alper-architecture',
    corePurpose: 'DEPRECATED: Merged into alper-architecture.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-architecture.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-architecture.'],
    outputContract: []
  },
  'alper-database-engineering': {
    name: 'alper-database-engineering',
    title: 'Database Engineering (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'DATA_ENGINEERING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-database-designer'],
    reason: 'Merged into alper-database-designer to consolidate schema and relational database modeling.',
    replacement: 'alper-database-designer',
    corePurpose: 'DEPRECATED: Merged into alper-database-designer.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-database-designer.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-database-designer.'],
    outputContract: []
  },
  'alper-data-integrity': {
    name: 'alper-data-integrity',
    title: 'Data Integrity (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'DATA_ENGINEERING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-database-designer'],
    reason: 'Merged into alper-database-designer to enforce ACID transactions and data consistency at schema level.',
    replacement: 'alper-database-designer',
    corePurpose: 'DEPRECATED: Merged into alper-database-designer.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-database-designer.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-database-designer.'],
    outputContract: []
  },
  'alper-api-architecture': {
    name: 'alper-api-architecture',
    title: 'API Architecture (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'API_ENGINEERING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-api-designer'],
    reason: 'Merged into alper-api-designer to prevent conflicting API specification and lifecycle guidance.',
    replacement: 'alper-api-designer',
    corePurpose: 'DEPRECATED: Merged into alper-api-designer.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-api-designer.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-api-designer.'],
    outputContract: []
  },
  'alper-design-source-ranking': {
    name: 'alper-design-source-ranking',
    title: 'Design Source Ranking (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'SOURCE_INTELLIGENCE',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-source-intelligence'],
    reason: 'Merged into alper-source-intelligence which houses the weighted multi-criteria ranking engine.',
    replacement: 'alper-source-intelligence',
    corePurpose: 'DEPRECATED: Merged into alper-source-intelligence.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-source-intelligence.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-source-intelligence.'],
    outputContract: []
  },
  'alper-ai-coding-safety': {
    name: 'alper-ai-coding-safety',
    title: 'AI Coding Safety (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'SECURITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['GREENFIELD', 'MODERNIZATION', 'REPAIR'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-secure-coding'],
    reason: 'Merged into alper-secure-coding and AGENTS.md durable rules to eliminate fragmented AI safety advice.',
    replacement: 'alper-secure-coding',
    corePurpose: 'DEPRECATED: Merged into alper-secure-coding.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-secure-coding.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-secure-coding.'],
    outputContract: []
  },
  'alper-dependency-hygiene': {
    name: 'alper-dependency-hygiene',
    title: 'Dependency Hygiene (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'SECURITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['CONTINUOUS_GOVERNANCE', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-supply-chain-security'],
    reason: 'Merged into alper-supply-chain-security to unify dependency vulnerability and lockfile management.',
    replacement: 'alper-supply-chain-security',
    corePurpose: 'DEPRECATED: Merged into alper-supply-chain-security.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-supply-chain-security.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-supply-chain-security.'],
    outputContract: []
  },
  'alper-dependency-lifecycle': {
    name: 'alper-dependency-lifecycle',
    title: 'Dependency Lifecycle (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'SECURITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['CONTINUOUS_GOVERNANCE', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-supply-chain-security'],
    reason: 'Merged into alper-supply-chain-security to unify SemVer upgrade policies and SBOM tracking.',
    replacement: 'alper-supply-chain-security',
    corePurpose: 'DEPRECATED: Merged into alper-supply-chain-security.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-supply-chain-security.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-supply-chain-security.'],
    outputContract: []
  },
  'alper-playwright-testing': {
    name: 'alper-playwright-testing',
    title: 'Playwright Testing (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['REPAIR', 'MODERNIZATION'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-browser-qa'],
    reason: 'Merged into alper-browser-qa which serves as the canonical Playwright testing orchestrator.',
    replacement: 'alper-browser-qa',
    corePurpose: 'DEPRECATED: Merged into alper-browser-qa.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-browser-qa.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-browser-qa.'],
    outputContract: []
  },
  'alper-runtime-debugging': {
    name: 'alper-runtime-debugging',
    title: 'Runtime Debugging (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['REPAIR'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-browser-qa'],
    reason: 'Merged into alper-browser-qa which inspects live runtime console errors, exceptions, and network waterfalls.',
    replacement: 'alper-browser-qa',
    corePurpose: 'DEPRECATED: Merged into alper-browser-qa.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-browser-qa.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-browser-qa.'],
    outputContract: []
  },
  'alper-cross-browser-testing': {
    name: 'alper-cross-browser-testing',
    title: 'Cross-Browser Testing (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-browser-qa'],
    reason: 'Merged into alper-browser-qa to eliminate fragmented browser compatibility guidance.',
    replacement: 'alper-browser-qa',
    corePurpose: 'DEPRECATED: Merged into alper-browser-qa.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-browser-qa.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-browser-qa.'],
    outputContract: []
  },
  'alper-api-testing': {
    name: 'alper-api-testing',
    title: 'API Testing (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'QA_TESTING',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-contract-testing'],
    reason: 'Merged into alper-contract-testing to unify API contract and functional validation.',
    replacement: 'alper-contract-testing',
    corePurpose: 'DEPRECATED: Merged into alper-contract-testing.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-contract-testing.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-contract-testing.'],
    outputContract: []
  },
  'alper-performance-testing': {
    name: 'alper-performance-testing',
    title: 'Performance Testing (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['REPAIR', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-performance-engineering'],
    reason: 'Merged into alper-performance-engineering to unite performance auditing and testing budgets.',
    replacement: 'alper-performance-engineering',
    corePurpose: 'DEPRECATED: Merged into alper-performance-engineering.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-performance-engineering.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-performance-engineering.'],
    outputContract: []
  },
  'alper-resilience': {
    name: 'alper-resilience',
    title: 'Resilience (Deprecated)',
    status: 'DEPRECATED',
    capabilityFamily: 'PERFORMANCE_RELIABILITY',
    userFacingType: 'SUPPORTING_CAPABILITY',
    userFacing: false,
    modeApplicability: ['MODERNIZATION', 'CONTINUOUS_GOVERNANCE'],
    projectIntelligenceLoading: 'NOT_REQUIRED',
    discoveryBehavior: 'NOT_APPLICABLE',
    humanCheckpoints: [],
    sourceStrategy: '',
    evidenceRequirements: [],
    mcpTools: [],
    relatedSkills: ['alper-reliability'],
    reason: 'Merged into alper-reliability to unify system resilience, fault tolerance, and SLO governance.',
    replacement: 'alper-reliability',
    corePurpose: 'DEPRECATED: Merged into alper-reliability.',
    positiveUseWhen: [],
    negativeDoNotUseWhen: ['Do not use. Permanently superseded by alper-reliability.'],
    keyWorkflow: [],
    decisionRules: ['Redirect all tasks to alper-reliability.'],
    outputContract: []
  }
};

/**
 * Dynamically derived skill lists guaranteeing zero parallel maintenance drift.
 */
export const ALL_ACTIVE_SKILLS: string[] = Object.values(CANONICAL_SKILL_CATALOG)
  .filter(s => s.status === 'ACTIVE')
  .map(s => s.name);

export const DEPRECATED_SKILLS: string[] = Object.values(CANONICAL_SKILL_CATALOG)
  .filter(s => s.status === 'DEPRECATED')
  .map(s => s.name);

export const USER_ENTRYPOINT_SKILLS: string[] = Object.values(CANONICAL_SKILL_CATALOG)
  .filter(s => s.status === 'ACTIVE' && s.userFacingType === 'USER_ENTRYPOINT')
  .map(s => s.name);

export const INTERNAL_ORCHESTRATION_SKILLS: string[] = Object.values(CANONICAL_SKILL_CATALOG)
  .filter(s => s.status === 'ACTIVE' && s.userFacingType !== 'USER_ENTRYPOINT')
  .map(s => s.name);
