import fs from 'node:fs';
import path from 'node:path';
import { SKILL_MIGRATION_MAP, CAPABILITY_FAMILIES } from './skill-standard.js';

const skillsDir = path.resolve('skills');

// Detailed metadata generator for active skills
function generateActiveSkillContent(name, meta) {
  const capFamily = meta.capabilityFamily;
  const tools = meta.mcpTools || [];
  
  // Find related skills in same family or relevant siblings
  const related = Object.entries(SKILL_MIGRATION_MAP)
    .filter(([k, v]) => k !== name && !v.deprecated && (v.capabilityFamily === capFamily || meta.newOwner === v.newOwner))
    .map(([k]) => k)
    .slice(0, 4);

  // Friendly title
  const title = name
    .replace('alper-', '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Frontmatter description with positive and negative triggers
  const description = `${meta.reason} Use when executing ${capFamily.toLowerCase().replace(/_/g, ' ')} tasks for ${title.toLowerCase()}. Do not use for unrelated capability domains or deprecated Phase 0 workflows.`;

  const yamlFrontmatter = `---
name: ${name}
description: ${description}
status: ACTIVE
capabilityFamily: ${capFamily}
userFacing: true
mcpTools:
${tools.map(t => `  - ${t}`).join('\n')}
relatedSkills:
${related.map(r => `  - ${r}`).join('\n')}
---`;

  // Standard body sections matching ALPER_SKILL_STANDARD_V1
  const body = `# Alper ${title} Skill

## PURPOSE
Provides canonical, deterministic agent capability for **${title}** within the **${capFamily}** capability family.
Primary focus: ${meta.reason}

## USE WHEN
- Initiating or progressing tasks requiring ${title.toLowerCase()} capabilities.
- Operating within mode-specific pipelines requiring ${capFamily} workflows.
- Verifying requirements, technical blueprints, or evidence artifacts specifically owned by this capability.

## DO NOT USE WHEN
- The task strictly belongs to another capability family (e.g. use \`alper-greenfield-generator\` for new full-stack builds, \`alper-modernization-planner\` for migrations, or \`alper-design-repair\` for surgical bug fixes).
- Attempting to bypass verification gates or generate ungrounded code without prerequisite discovery.
- Operating on deprecated Phase 0 workflows.

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, and **CONTINUOUS_GOVERNANCE**.
- Mode Relevance: Enforces capability boundaries whether operating on clean-sheet greenfield or legacy brownfield codebases.

## REQUIRED CONTEXT
- Validated workspace root and project configuration.
- Task brief and structured user intent.
- Up-to-date \`.alper-design-os/project\` intelligence snapshot (when initialized).
- Relevant stack profiles and dependency manifests.

## PROJECT INTELLIGENCE LOADING
- Consults durable project memory in \`.alper-design-os/project\` prior to action execution.
- Reads verified architecture graphs, registered entities, and recorded project decisions (ADRs).
- Strictly rejects hallucinated project memory; missing intelligence triggers truthful intake or initialization.

## DISCOVERY / AMBIGUITY BEHAVIOR
- If task requirements are incomplete, ambiguous, or lack technical grounding:
  1. Halt execution immediately before emitting ungrounded changes.
  2. Emit prioritized clarifying questions to the operator.
  3. Maintain derived acceptance criteria in \`DEFINED\` / \`NOT_VERIFIED\` state until ambiguity is formally resolved.

## WORKFLOW
1. **Intake & Verification**: Ingest task parameters and verify workspace preconditions.
2. **Context Assembly**: Load relevant project invariants, schema contracts, and active policies.
3. **Execution & Tool Invocation**: Dispatch canonical MCP tools (${tools.length > 0 ? tools.map(t => `\`${t}\``).join(', ') : 'standard read/write tools'}).
4. **Evidence Collection**: Gather qualifying verification artifacts (logs, diffs, test evidence).
5. **Quality Gate Evaluation**: Validate deliverables against release and safety gates.
6. **Output Synthesis**: Produce structured deliverables and handoff packages for downstream skills.

## DECISION RULES
- **Invariant Enforcement**: Universal invariant **NO CLAIM WITHOUT EVIDENCE** applies unconditionally.
- **Fail-Safe Principle**: If a tool returns \`NEEDS_CLARIFICATION\` or validation fails, stop execution and report truth state.
- **Scope Guard**: Confine modifications strictly to designated module boundaries. Uninvited modifications to foreign files are blocked.

## MCP TOOL STRATEGY
${tools.length > 0 ? tools.map(t => `- \`${t}\`: Canonical handler for ${t.replace(/_/g, ' ')}. Always supply required schema parameters and handle structured return states.`).join('\n') : '- Dispatches standard file system and governance inspection tools.'}

## SOURCE / RESEARCH STRATEGY
- When referencing design systems, frameworks, or security standards, cite authoritative sources verified by \`alper-source-intelligence\`.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with \`rules/AGENTS.md\`.
- Secret leakage prevention: Never log, store, or emit unredacted credentials or API keys.
- Destructive command guard: High-risk operations (e.g., hard reset, clean, force push) require explicit operator confirmation.

## HUMAN CHECKPOINTS
- Ambiguous architectural directions requiring trade-off resolution.
- Destructive state changes or breaking schema migrations.
- Visual approval on high-impact user interface changes.

## STOP CONDITIONS
- Discovery readiness check returns \`NEEDS_CLARIFICATION\`.
- Tool execution reports critical validation or gate failure.
- Scope boundary violation detected by \`alper-scope-guard\`.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit state.
- On test failure: Mark gate as \`FAILED\`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Every asserted completion must supply qualifying evidence (e.g. \`LINT_CLEAN\`, \`UNIT_TESTS_PASS\`, \`BUILD_CLEAN\`, \`HUMAN_REVIEW\`).
- Missing evidence strictly resolves to \`NOT_VERIFIED\`.

## OUTPUT CONTRACT
- Structured execution report detailing actions executed, tools invoked, and evidence captured.
- Verified artifacts and updated project intelligence entries.
- Explicit handoff envelope for next-phase skills.

## HANDOFF / RELATED SKILLS
${related.map(r => `- \`${r}\`: Handoff target for sibling ${SKILL_MIGRATION_MAP[r]?.capabilityFamily || 'workflow'} operations.`).join('\n')}
`;

  return `${yamlFrontmatter}\n\n${body}`;
}

// Deprecated skill generator
function generateDeprecatedSkillContent(name, meta) {
  const replacement = meta.replacement;
  const reason = meta.reason;

  return `---
name: ${name}
description: DEPRECATED - Superseded by ${replacement}. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: ${replacement}
capabilityFamily: ${meta.capabilityFamily}
userFacing: false
mcpTools: []
relatedSkills:
  - ${replacement}
---

# ${name} (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use \`${name}\` in new agent prompts, workflows, or context routing.

## Superseded By
Use **\`${replacement}\`** instead.

## Rationalization & Remediation Context
${reason}

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **\`${replacement}\`**.
- This skill exists purely for historical tracking and is excluded from active context routing in \`packages/agent-governance/src/context-router.ts\`.
`;
}

// Main execution
console.log('--- EXECUTING SKILL REMEDIATION ---');

let activeCount = 0;
let deprecatedCount = 0;

for (const [skillName, meta] of Object.entries(SKILL_MIGRATION_MAP)) {
  const skillDir = path.join(skillsDir, skillName);
  if (!fs.existsSync(skillDir)) {
    fs.mkdirSync(skillDir, { recursive: true });
    console.log(`Created new skill directory: ${skillName}`);
  }

  const skillFile = path.join(skillDir, 'SKILL.md');
  let content = '';

  if (meta.deprecated) {
    content = generateDeprecatedSkillContent(skillName, meta);
    deprecatedCount++;
  } else {
    content = generateActiveSkillContent(skillName, meta);
    activeCount++;
  }

  fs.writeFileSync(skillFile, content, 'utf-8');
}

console.log(`Successfully generated/updated ${activeCount} active skills and ${deprecatedCount} deprecated skills.`);

// Generate progressive disclosure reference documents
const references = [
  {
    skill: 'alper-greenfield-generator',
    file: 'references/stack-templates.md',
    content: `# Greenfield Multi-Stack Scaffolding Templates & Architecture

This reference outlines canonical scaffolding invariants for ALPER DESIGN OS supported stacks:

## 1. REACT_TYPESCRIPT
- Standard: Vite + React 18+ + TypeScript.
- Required Scaffold:
  - \`package.json\`: Includes react, react-dom, @vitejs/plugin-react, typescript, vite.
  - \`vite.config.ts\`: Configured with react plugin and path aliases.
  - \`tsconfig.json\`: Strict mode, jsx: react-jsx, moduleResolution: bundler.
  - \`index.html\`: Mount root \`<div id="root">\`.
  - \`src/main.tsx\`: React root rendering \`App\`.
  - \`src/App.tsx\`: Root application component using design tokens.
  - \`src/styles/tokens.css\`: DTCG-compliant CSS custom properties.

## 2. LARAVEL_BLADE
- Standard: Laravel 11+ Blade web application.
- Required Scaffold:
  - \`composer.json\`: php ^8.2, laravel/framework.
  - \`routes/web.php\`: Explicit web routes for each modeled page.
  - \`resources/views/layouts/app.blade.php\`: App shell with navigation and CSRF tokens.
  - \`app/Http/Controllers/\`: Grounded entity controllers.

## 3. ASPNET_RAZOR
- Standard: .NET 8 / 9 ASP.NET Core Razor Pages / MVC.
- Required Scaffold:
  - \`App.csproj\`: TargetFramework net8.0 or net9.0.
  - \`Program.cs\`: Host builder, routing, static files, anti-forgery middleware.
  - \`Pages/\` or \`Views/\`: Razor components with \`@Html.AntiForgeryToken()\`.

## 4. PLAIN_HTML_CSS_JS
- Standard: Zero-build, vanilla web standard layout.
- Required Scaffold:
  - \`index.html\`: Semantic HTML5 structure.
  - \`styles.css\`: Responsive CSS variables.
  - \`app.js\`: Vanilla DOM interactions with no external dependencies.
`
  },
  {
    skill: 'alper-modernization-planner',
    file: 'references/preservation-checklist.md',
    content: `# Modernization Behavioral Preservation Checklist

Prior to modifying any existing codebase during modernization:

## 1. Baseline Invariant Freezing
- [ ] Record all existing HTTP routes and verb mappings.
- [ ] Record public API response formats and error schemas.
- [ ] Record authentication mechanisms (cookies, session keys, JWT headers).
- [ ] Record database schema, table relations, and foreign keys.

## 2. Element Classification Matrix
Classify every candidate component/module into one of:
- **KEEP**: Unchanged core domain logic or stable UI.
- **IMPROVE**: Restyled or enhanced with design tokens, preserving markup semantics.
- **REPLACE**: Deprecated legacy component replaced with modern design system equivalent.
- **DEFER**: High-risk or low-traffic area postponed to subsequent modernization stages.
- **REMOVE**: Dead code or obsolete features with confirmed zero usage.

## 3. Scope Boundary Enforcement
- Strictly forbid uninvited database migrations or backend framework rewrites.
- Every modernization stage must deliver an incrementally buildable, runnable state.
`
  },
  {
    skill: 'alper-project-intelligence',
    file: 'references/schema-specification.md',
    content: `# Project Intelligence Durable Memory Specification

All persistent project memory is version-controlled inside \`.alper-design-os/project/\`:

## Directory Structure
- \`.alper-design-os/project/snapshot.json\`: Current canonical snapshot of project state.
- \`.alper-design-os/project/architecture-graph.json\`: Subsystem boundaries, module dependencies.
- \`.alper-design-os/project/business-rules.json\`: Derived and operator-confirmed business rules.
- \`.alper-design-os/project/decisions/\`: Markdown/JSON Architecture Decision Records (ADRs).
- \`.alper-design-os/project/invariants.json\`: Non-negotiable technical invariants.

## Integrity Invariant
- Business rules must record provenance (\`DERIVED\` vs \`USER_CONFIRMED\`).
- Unverified inferences must never be treated as verified ground truth.
`
  },
  {
    skill: 'alper-truthful-ui',
    file: 'references/provenance-evaluation-guide.md',
    content: `# Truthful UI & Data Provenance Evaluation Guide

Enforcing the universal invariant: **NO CLAIM WITHOUT EVIDENCE** in user interfaces.

## 1. Data Provenance Verification
- Trace every KPI, chart series, and dashboard metric to an authentic database table or API source.
- Prohibit hardcoded mock statistics presented as real operational data.

## 2. Page Intent & Content Relevance
- Audit page layouts against declared user jobs-to-be-done.
- Eliminate visual bloat, irrelevant decorative metrics, and ungrounded placeholders.

## 3. Content Truth Gate
- If backend data is missing or empty, render an explicit, truthful empty state.
- Never fake high health scores (e.g. hardcoding 90% test coverage) without underlying telemetry evidence.
`
  },
  {
    skill: 'alper-operator-execution',
    file: 'references/run-bundle-standard.md',
    content: `# Corporate Operator Execution & Manual Run Bundle Standard

Standard for air-gapped or corporate developer environments where automated execution is restricted:

## RUN.ps1 Standard
- Self-contained PowerShell script emitted into project root or \`.alper-design-os/bundles/\`.
- Checks prerequisites (Node, dotnet, PHP, Composer, Docker).
- Executes local build, linter, and unit test suites.
- Emits structured \`run-evidence.json\` containing exit codes, stdout, stderr, and timestamps.

## Evidence Verification
- Use \`verify_manual_run_evidence\` to parse \`run-evidence.json\`.
- Normalize evidence into the 13 supported evidence kinds.
`
  },
  {
    skill: 'alper-source-intelligence',
    file: 'references/source-ranking-weights.md',
    content: `# Design Source Intelligence Multi-Criteria Ranking

Authoritative sources (65+ design systems, primitives, and icon libraries) are ranked using:

## Criteria & Weights
- **Ecosystem Adoption & Maintenance** (25%): GitHub stars, commit cadence, issue resolution time.
- **Accessibility & WCAG Compliance** (25%): Keyboard navigation, ARIA pattern conformance.
- **Design Token Compatibility** (20%): DTCG token structure, theming flexibility.
- **TypeScript / Static Typing Quality** (15%): First-class typings, strictness.
- **License Permissiveness** (15%): MIT, Apache 2.0, BSD-3. Non-commercial licenses are flagged.
`
  }
];

for (const ref of references) {
  const targetPath = path.join(skillsDir, ref.skill, ref.file);
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(targetPath, ref.content, 'utf-8');
  console.log(`Created progressive disclosure reference: ${ref.skill}/${ref.file}`);
}

console.log('--- SKILL REMEDIATION COMPLETE ---');
