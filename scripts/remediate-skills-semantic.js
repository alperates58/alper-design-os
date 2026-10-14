import fs from 'node:fs';
import path from 'node:path';
import {
  CANONICAL_SKILL_CATALOG,
  ALL_ACTIVE_SKILLS,
  DEPRECATED_SKILLS
} from '../packages/agent-governance/src/skill-registry.ts';

const skillsDir = path.resolve('skills');

function buildActiveSkillMarkdown(skill) {
  const toolsList = skill.mcpTools && skill.mcpTools.length > 0
    ? skill.mcpTools.map(t => `  - ${t}`).join('\n')
    : '  []';

  const relatedList = skill.relatedSkills && skill.relatedSkills.length > 0
    ? skill.relatedSkills.map(r => `  - ${r}`).join('\n')
    : '  []';

  const modesList = skill.modeApplicability.map(m => `  - ${m}`).join('\n');

  const frontmatter = `---
name: ${skill.name}
description: ${skill.reason} Use when ${skill.positiveUseWhen[0].toLowerCase().replace(/\.$/, '')}. Do not use for ${skill.negativeDoNotUseWhen[0].toLowerCase().replace(/\.$/, '')}.
status: ACTIVE
capabilityFamily: ${skill.capabilityFamily}
userFacingType: ${skill.userFacingType}
userFacing: ${skill.userFacing}
modeApplicability:
${modesList}
mcpTools:
${toolsList}
relatedSkills:
${relatedList}
---`;

  // Required Context tailored
  let requiredContextText = '';
  if (skill.capabilityFamily === 'DATA_ENGINEERING') {
    requiredContextText = `- Target database engine (PostgreSQL, MySQL, SQL Server, SQLite).\n- Query text, table schemas, foreign key definitions, and active indexes.\n- Execution plan output (EXPLAIN ANALYZE) or DDL migration files.`;
  } else if (skill.capabilityFamily === 'SECURITY') {
    requiredContextText = `- Target source code repository, configuration files, and package manifests.\n- Declared trust boundaries, authentication endpoints, and sensitive data flows.\n- Environment classification (local development, staging, production).`;
  } else if (skill.capabilityFamily === 'DESIGN_UX' || skill.capabilityFamily === 'TRUTHFUL_UI') {
    requiredContextText = `- UI wireframes, page layouts, component markup, or browser DOM.\n- Design token definitions (tokens.json, tokens.css) and theme configurations.\n- Stated user personas and target operational density.`;
  } else if (skill.capabilityFamily === 'QA_TESTING') {
    requiredContextText = `- Target application route or staging URL.\n- User journey flow specifications and acceptance criteria.\n- Configured test runners (Playwright, Vitest) and viewport matrix (390px, 768px, 1440px).`;
  } else if (skill.capabilityFamily === 'GREENFIELD_ENGINEERING' || skill.capabilityFamily === 'PRODUCT_DISCOVERY') {
    requiredContextText = `- Raw product brief, problem statement, or functional specification.\n- Target user roles, operational workflows, and domain constraints.\n- Technology stack preferences or architectural invariants.`;
  } else {
    requiredContextText = `- Workspace root path and active git branch.\n- Current task brief and AgentActionPlan.\n- Relevant project files and configuration manifests.`;
  }

  // Project Intelligence Loading text
  let piLoadingText = '';
  if (skill.projectIntelligenceLoading === 'REQUIRED') {
    piLoadingText = `**Status: REQUIRED**\nThis skill strictly requires reading durable project memory from \`.alper-design-os/project/\` (manifest, architecture graph, ADRs, behavioral contracts) before planning or executing actions. Missing memory triggers explicit initialization or drift detection.`;
  } else if (skill.projectIntelligenceLoading === 'CONDITIONAL') {
    piLoadingText = `**Status: CONDITIONAL**\nConsults \`.alper-design-os/project/\` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.`;
  } else {
    piLoadingText = `**Status: NOT_REQUIRED**\nOperates as a self-contained, stateless capability. Does not require loading repository project intelligence snapshots to perform its core diagnosis or transformation.`;
  }

  // Discovery / Ambiguity Behavior
  let discoveryText = '';
  if (skill.discoveryBehavior === 'STRICT_BLOCK') {
    discoveryText = `**Protocol: STRICT_BLOCK**\nIf upstream discovery readiness check is \`NEEDS_CLARIFICATION\` or requirements are missing technical grounding, this skill MUST HALT immediately. Scaffolding, file generation, or destructive changes are categorically blocked until ambiguity is formally resolved.`;
  } else if (skill.discoveryBehavior === 'CLARIFY_AMBIGUITY') {
    discoveryText = `**Protocol: CLARIFY_AMBIGUITY**\nIf input requirements are incomplete, contradictory, or underspecified, formulate 3-5 prioritized clarifying questions for the operator. Derived criteria must remain in \`DEFINED / NOT_VERIFIED\` state until clarified.`;
  } else {
    discoveryText = `**Protocol: NOT_APPLICABLE**\nOperates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.`;
  }

  // Tool Strategy text
  const toolStrategyText = skill.mcpTools && skill.mcpTools.length > 0
    ? skill.mcpTools.map(t => `- \`${t}\`: Canonical handler for ${t.replace(/_/g, ' ')}. Always pass required schema arguments; handle return states deterministically.`).join('\n')
    : `- Dispatches standard filesystem and workspace tools (\`view_file\`, \`replace_file_content\`, \`run_command\`).`;

  // Human Checkpoints text
  const checkpointsText = skill.humanCheckpoints && skill.humanCheckpoints.length > 0
    ? skill.humanCheckpoints.map(cp => `- ${cp}`).join('\n')
    : `- No human approval checkpoints required for routine execution of this capability.`;

  // Evidence Requirements text
  let evidenceText = skill.evidenceRequirements && skill.evidenceRequirements.length > 0
    ? `- Canonical Evidence Kinds: ${skill.evidenceRequirements.map(e => `\`${e}\``).join(', ')}.\n- Missing evidence strictly resolves to \`VerificationStatus: NOT_VERIFIED\`. Never emit fake PASS assertion.`
    : `- Standard static analysis or inspection log recorded in execution journal.`;
  if (skill.evidenceArtifacts && skill.evidenceArtifacts.length > 0) {
    evidenceText += `\n- Expected Artifact Evidence: ${skill.evidenceArtifacts.map(a => `\`${a}\``).join(', ')}.`;
  }

  // Related skills text
  const handoffText = skill.relatedSkills && skill.relatedSkills.length > 0
    ? skill.relatedSkills.map(r => `- \`${r}\`: Downstream or sibling capability for ${CANONICAL_SKILL_CATALOG[r]?.capabilityFamily || 'workflow'} operations.`).join('\n')
    : `- Self-contained capability; hands off to \`alper-independent-review\` for quality gate evaluation.`;

  // Specific Deep Section Customizations for Special Skills
  let deepSpecialSection = '';
  if (skill.name === 'alper-greenfield-generator') {
    deepSpecialSection = `
## GREENFIELD LIFECYCLE PIPELINE
\`\`\`
DISCOVERY (Product Analysis)
   ↓
DOMAIN RESEARCH (Operational Constraints)
   ↓
REQUIREMENTS & RTM (Acceptance Criteria in NOT_VERIFIED)
   ↓
ARCHITECTURE & STACK (Modular Monolith / Complexity <= 3)
   ↓
DATA / API / AUTH (3NF Blueprint & OpenAPI 3.1)
   ↓
UX BLUEPRINT (Technology-Neutral Page DSL)
   ↓
IMPLEMENTATION PLAN (Dynamic Dependency-Driven Staged Plan)
   ↓
SCAFFOLDING (Buildable Files on Disk)
   ↓
VERIFICATION (Evidence Taxonomy Validation)
\`\`\`

## STACK SCAFFOLDING INVARIANTS
- **REACT_TYPESCRIPT**: Vite 5+, React 18+, TypeScript strict, \`@vitejs/plugin-react\`, DTCG tokens in \`src/styles/tokens.css\`.
- **LARAVEL_BLADE**: Laravel 11+, PHP 8.2+, explicit web routes, Blade templates with \`@csrf\`, CSRF headers.
- **ASPNET_RAZOR**: .NET 8/9 ASP.NET Core, \`App.csproj\`, Program.cs, Antiforgery middleware, Razor pages.
- **PLAIN_HTML_CSS_JS**: Zero-build vanilla HTML5, responsive CSS custom properties, vanilla DOM JS.
- **Docker Policy**: Omit Dockerfile / compose unless deployment target explicitly specifies Docker.
- **Build Status Invariant**: Scaffolding outputs \`buildStatus: 'NOT_VERIFIED'\` and \`buildable: false\` until authentic compiler evidence is captured.`;
  } else if (skill.name === 'alper-security-audit') {
    deepSpecialSection = `
## ASSESSMENT BOUNDARIES: PASSIVE VS ACTIVE
- **PASSIVE AUDITING (Default)**: Static analysis, AST pattern matching, dependency lockfile vulnerability scanning, STRIDE threat modeling, and configuration inspection. Executed automatically without external side-effects.
- **ACTIVE SECURITY TESTING (Restricted)**: DAST, fuzzing, port scanning, or vulnerability exploitation against live environments. Strictly FORBIDDEN without explicit written operator authorization.

## STRIDE THREAT MODELING RUBRIC
- **Spoofing**: Authentication token validation, session fixation guards, signature verification.
- **Tampering**: Parameterized queries, CSRF token validation, integrity hashes.
- **Repudiation**: Immutable audit logging, correlation IDs, non-repudiation of transactions.
- **Information Disclosure**: Secret scanning, exception sanitization, PII redaction, CORS restriction.
- **Denial of Service**: Rate limiting, request payload size limits, resource timeouts.
- **Elevation of Privilege**: Object-level authorization (BOLA/IDOR defense), RBAC checks.`;
  } else if (skill.name === 'alper-sql-performance') {
    deepSpecialSection = `
## DATABASE PERFORMANCE REASONING ENGINE
- **Query Plan Inspection**: Analyze \`EXPLAIN (ANALYZE, BUFFERS)\` output to identify sequential scans, nested loop spills, and high buffer reads.
- **Cardinatity & Selectivity**: Evaluate actual rows vs planner estimated rows. Large discrepancies indicate stale table statistics requiring \`ANALYZE\`.
- **SARGability**: Ensure search arguments are indexable. Prohibit wrapping indexed columns in functions (e.g. \`WHERE UPPER(email) = ...\` prevents B-tree index lookup unless functional index exists).
- **Index Write Cost Consideration**: Never recommend indexes without evaluating table write frequency; every B-tree index adds IO overhead to \`INSERT\` and \`UPDATE\` operations.
- **Pagination Strategy**:
  - **Keyset Pagination**: Optimal for append-only streaming feeds (\`WHERE id > :last_id LIMIT 50\`).
  - **Offset Pagination**: Required when random page jumping is explicitly required by UX.
  - Do NOT claim keyset is universally superior; document workload trade-offs.
- **N+1 ORM Diagnosis**: Identify loops issuing separate SELECT queries per parent record (e.g. Eloquent lazy loading, EF Core unincluded navigation properties); recommend eager loading (\`with()\`, \`Include()\`).`;
  } else if (skill.name === 'alper-accessibility-testing') {
    deepSpecialSection = `
## CANONICAL ACCESSIBILITY STANDARD: WCAG 2.2 AA
- **Primary Target**: ALPER DESIGN OS standardizes on **WCAG 2.2 AA** (published October 2023).
- **Backward Compatibility**: Fully satisfies legacy WCAG 2.1 AA requirements as a strict subset.
- **Key Verification Areas**:
  - **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text and UI components/icons.
  - **Focus Appearance (2.4.11 / 2.4.13)**: Focus indicators must have high contrast and minimum 2px visible area.
  - **Target Size Minimum (2.5.8)**: Interactive targets must be at least 24x24px or have sufficient spacing.
  - **Dragging Movements (2.5.7)**: Single-pointer alternative required for any drag-and-drop workflow.
  - **Accessible Authentication (3.3.8)**: Cognitive tests (e.g. transcription) forbidden without alternative.
  - **Keyboard Navigation**: Complete tab order traversal without keyboard traps; modals must trap and restore focus.`;
  } else if (skill.name === 'alper-modernization-planner') {
    deepSpecialSection = `
## MODERNIZATION REASONING & STRANGLER FIG DISCIPLINE
- **Strangler Fig Migration**: Deconstruct legacy applications incrementally by routing specific traffic slices to modernized services.
- **Anti-Corruption Layer (ACL)**: Define typed boundary adapters between legacy domain objects and modernized clean-architecture models.
- **Dual-Run & Canary Parity**: Run legacy and new components in parallel; compare output parity before retiring legacy execution paths.
- **Scope Isolation**: Restrict refactoring to declared bounded contexts; strictly prohibit opportunistic out-of-scope rewrites.
- **Zero Greenfield Scaffolding**: Modernization plans must never execute clean-sheet greenfield scaffolding over an existing repository.`;
  } else if (skill.name === 'alper-project-intelligence') {
    deepSpecialSection = `
## DURABLE PROJECT MEMORY & GRAPH EXTRACTION
- **Storage Location**: Reads and maintains durable state in \`.alper-design-os/project/\` (manifest.json, architecture-graph.json, adrs/).
- **Authentic Graph Construction**: Scans actual source ASTs, package manifests, and route definitions; never invents imaginary architecture nodes.
- **Zero Hallucinated Health Scores**: Health metrics, test coverage, and documentation scores must derive from genuine static analysis and test runner outputs.
- **Knowledge Drift Detection**: Identifies discrepancies between committed code and documented architecture, surfacing drift warnings to operators.`;
  } else if (skill.name === 'alper-truthful-ui') {
    deepSpecialSection = `
## TRUTHFUL UI ENGINEERING & PROVENANCE
- **Data Provenance Tracing**: Every KPI metric, chart series, and data-grid column must trace to an authentic backend entity or API contract.
- **Prohibition of Hallucinated Data**: Strictly forbid hardcoded placeholder statistics (e.g. fake "98% Quality Score") without telemetry evidence.
- **Truthful Empty States**: In the absence of live backend records, render explicit, helpful empty states rather than mock data.
- **Operational Density**: Align component visual density with user operational roles (high density for desktop operations, readable summary for executive overviews).`;
  } else if (skill.name === 'alper-operator-execution') {
    deepSpecialSection = `
## AIR-GAPPED & ASSISTED EXECUTION PROTOCOL
- **Deterministic Script Generation**: Emits reproducible \`RUN.ps1\` and \`RUN.sh\` run bundles for environments where direct sandbox execution is restricted.
- **Toolchain Diagnostics**: Executes \`run_operator_doctor\` to probe local compiler, runtime, and package manager availability (Node, npm, dotnet, PHP, Composer, Docker).
- **Destructive Command Interception**: Strictly halts and flags commands matching dangerous patterns (e.g. \`rm -rf /\`, \`rmdir /s /q\`, \`git reset --hard\`, \`git push --force\`).
- **Evidence Verification**: Ingests operator execution output and normalizes evidence into structured verification records.`;
  } else if (skill.name === 'alper-browser-qa') {
    deepSpecialSection = `
## DETERMINISTIC BROWSER QA & PLAYWRIGHT SPECIFICATION
- **Accessible Role Locators**: Playwright tests must prioritize user-facing accessible locators (\`getByRole\`, \`getByLabel\`, \`getByText\`) over fragile CSS selectors.
- **Canonical Viewport Matrix**: Verifies responsive behavior across 4 standard viewports: 390x844 (Mobile), 768x1024 (Tablet), 1440x900 (Desktop Dense), 1920x1080 (Wide).
- **Runtime Telemetry Auditing**: Captures and inspects console warnings/errors, unhandled rejections, and 4xx/5xx network failures during test execution.
- **Visual Regression Baseline**: Establishes deterministic visual diff baselines with strict pixel comparison thresholds.`;
  } else if (skill.name === 'alper-architecture') {
    deepSpecialSection = `
## ARCHITECTURAL DECISION DISCIPLINE & COMPLEXITY BUDGET
- **Architecture Decision Records (ADRs)**: Every foundational structural choice must be recorded as an ADR documenting context, options, decision, and consequences.
- **Anti-Overengineering Principle**: System topology must select the least complex pattern that satisfies constraints. Defaults to Monolith or Modular Monolith for small/medium scale.
- **Distributed Architecture Boundary**: Microservices and distributed service meshes are justified ONLY when extreme scale or internet-distributed boundaries require independent operational partitioning.
- **Backward Compatibility**: API and schema changes must maintain backward compatibility; breaking changes require versioned migration paths.`;
  }

  // Tailored stop conditions
  const stopConditions = [
    '- Required context or prerequisite artifacts are missing.'
  ];
  if (skill.discoveryBehavior === 'CLARIFY_AMBIGUITY' || skill.discoveryBehavior === 'STRICT_BLOCK') {
    stopConditions.push('- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` or `BLOCKED_BY_AMBIGUITY`.');
  }
  stopConditions.push('- Tool execution reports critical validation or gate failure.');
  if (skill.capabilityFamily === 'SECURITY') {
    stopConditions.push('- Active penetration or intrusive actions attempted without explicit operator authorization.');
  } else if (skill.capabilityFamily === 'DATA_ENGINEERING') {
    stopConditions.push('- Unsafe table locks or non-reversible destructive schema migrations detected.');
  }
  const stopConditionsText = stopConditions.join('\n');

  const markdown = `${frontmatter}

# Alper ${skill.title} Skill

## PURPOSE
${skill.corePurpose}

## USE WHEN
${skill.positiveUseWhen.map(u => `- ${u}`).join('\n')}

## DO NOT USE WHEN
${skill.negativeDoNotUseWhen.map(d => `- ${d}`).join('\n')}

## MODE APPLICABILITY
- Supported Modes: ${skill.modeApplicability.map(m => `**${m}**`).join(', ')}.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.
${deepSpecialSection}

## REQUIRED CONTEXT
${requiredContextText}

## PROJECT INTELLIGENCE LOADING
${piLoadingText}

## DISCOVERY / AMBIGUITY BEHAVIOR
${discoveryText}

## WORKFLOW
${skill.keyWorkflow.join('\n')}

## DECISION RULES
${skill.decisionRules.map(r => `- ${r}`).join('\n')}

## MCP TOOL STRATEGY
${toolStrategyText}

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: ${skill.sourceStrategy}
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with \`rules/AGENTS.md\`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with \`[REDACTED]\`.

## HUMAN CHECKPOINTS
${checkpointsText}

## STOP CONDITIONS
${stopConditionsText}

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as \`FAILED\`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
${evidenceText}

## OUTPUT CONTRACT
${skill.outputContract.map(o => `- ${o}`).join('\n')}

## HANDOFF / RELATED SKILLS
${handoffText}
`;

  return markdown;
}

function buildDeprecatedSkillMarkdown(skill) {
  return `---
name: ${skill.name}
description: DEPRECATED - Superseded by ${skill.replacement}. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: ${skill.replacement}
capabilityFamily: ${skill.capabilityFamily}
userFacingType: ${skill.userFacingType}
userFacing: false
modeApplicability:
${skill.modeApplicability.map(m => `  - ${m}`).join('\n')}
mcpTools: []
relatedSkills:
  - ${skill.replacement}
---

# ${skill.name} (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use \`${skill.name}\` in new agent prompts, workflows, or context routing.

## Superseded By
Use **\`${skill.replacement}\`** instead.

## Rationalization & Remediation Context
${skill.reason}

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **\`${skill.replacement}\`**.
- This skill exists purely for historical tracking and is excluded from active context routing in \`packages/agent-governance/src/context-router.ts\`.
`;
}

console.log('--- RE-GENERATING SKILLS WITH CAPABILITY-SPECIFIC SEMANTICS ---');

let activeCount = 0;
let deprecatedCount = 0;

for (const skill of Object.values(CANONICAL_SKILL_CATALOG)) {
  const dirPath = path.join(skillsDir, skill.name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, 'SKILL.md');
  let content = '';

  if (skill.status === 'DEPRECATED') {
    content = buildDeprecatedSkillMarkdown(skill);
    deprecatedCount++;
  } else {
    content = buildActiveSkillMarkdown(skill);
    activeCount++;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

console.log(`Successfully written ${activeCount} active skills and ${deprecatedCount} deprecated skills.`);
