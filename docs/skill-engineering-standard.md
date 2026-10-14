# ALPER DESIGN OS — Skill Engineering Standard & Orchestration Architecture

**Standard Version**: `ALPER_SKILL_STANDARD_V1`  
**Quality Gate**: `SKILL_QUALITY_GATE_V1`  
**Phase Completed**: Phase 1H.2 (Skill Architecture Remediation & Agent Orchestration Standardization)  
**Primary Source of Truth**: Independent READ-ONLY Audit A1 (F-08, F-09) + Phase 1H.1 Remediation  

---

## 1. Executive Summary & Remediation Rationale
During Phase 0 and Phase 1F/1G, the skill layer accumulated 72 skills, many of which were 12-line micro-stubs without frontmatter, clear activation boundaries, or tool awareness. Furthermore, split-brain routing persisted between legacy Phase 0 skills (`alper-design-new`, `alper-design-modernize`) and Phase 1G/1H capabilities.

Phase 1H.2 executes a structural remediation:
- **Consolidation**: Remediated all 72 historical skills into **55 active canonical skills** and **19 permanently deprecated skills** (plus 2 new canonical skills, tracking 74 total skills).
- **17 Bounded Capability Families**: Grouped all capabilities into cohesive domains to eliminate ad-hoc discovery clutter.
- **100% MCP Tool Reachability**: All 124 canonical MCP tools are deterministically mapped to active skill owners. Zero orphan tools exist.
- **Zero Split-Brain Routing**: Deprecated skills are permanently excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
- **Universal Truth Invariant**: Enforces **NO CLAIM WITHOUT EVIDENCE** across all skills, agent personas, and governance routers.

---

## 2. The 17 Capability Families
All skills belong to exactly one capability family:

1. `PRODUCT_DISCOVERY`: Problem decomposition, complexity classification, and domain reality mapping.
2. `GREENFIELD_ENGINEERING`: Clean-sheet requirements engineering, multi-stack scaffolding, and completion contracts.
3. `EXISTING_PROJECT_ANALYSIS`: Brownfield codebase profiling, stack detection, and technical debt audit.
4. `REPAIR`: Surgical, behavior-preserving remediation of UI, accessibility, and visual bugs.
5. `MODERNIZATION`: Phased incremental modernization, element classification, and behavioral contract preservation.
6. `PROJECT_INTELLIGENCE`: Durable version-controlled memory in `.alper-design-os/project/`, ADRs, and knowledge health.
7. `GOVERNANCE`: Action planning, scope guard, checkpoint management, git safety, and independent review.
8. `TRUTHFUL_UI`: Data provenance verification, page intent evaluation, and content truth gate.
9. `OPERATOR_EXECUTION`: Corporate air-gapped execution fallback, manual run bundles (`RUN.ps1`), and runtime doctor.
10. `ARCHITECTURE`: Subsystem decomposition, architectural style classification, and stack recommendations.
11. `DATA_ENGINEERING`: Relational entity modeling, 3NF normalization, DDL migration safety, and SQL performance.
12. `API_ENGINEERING`: OpenAPI 3.1.0 specifications, RFC 9457 Problem Details, and RBAC authorization contracts.
13. `DESIGN_UX`: DTCG design tokens, 6-axis personality vectors, UX patterns, and UI Blueprint DSL.
14. `SOURCE_INTELLIGENCE`: 65+ authoritative design systems, headless primitives, component registries, and licensing.
15. `SECURITY`: OWASP Top 10 2025, ASVS 5.0, API security, secret leak prevention, and software supply chain (SSDF/SBOM).
16. `QA_TESTING`: Testing pyramid, Playwright E2E automation, visual regression, accessibility (WCAG), and contracts.
17. `PERFORMANCE_RELIABILITY`: Core Web Vitals, SLOs/SLIs, circuit breakers, distributed tracing, and release safety.

---

## 3. ALPER_SKILL_STANDARD_V1 Specification

### 3.1 Frontmatter Schema
Every `SKILL.md` must contain strict YAML frontmatter:
```yaml
---
name: alper-<name>
description: <WHAT it does>. Use when <positive trigger>. Do not use for <negative trigger>.
status: ACTIVE | DEPRECATED
capabilityFamily: <ONE_OF_17_FAMILIES>
userFacing: true | false
mcpTools:
  - <canonical_mcp_tool_1>
  - <canonical_mcp_tool_2>
relatedSkills:
  - <related_skill_1>
  - <related_skill_2>
---
```

For deprecated skills:
```yaml
---
name: alper-<name>
description: DEPRECATED - Superseded by alper-<replacement>. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-<replacement>
capabilityFamily: <FAMILY>
userFacing: false
mcpTools: []
relatedSkills:
  - alper-<replacement>
---
```

### 3.2 Canonical Body Sections
Active skills must contain the 16 standard structural sections:
1. `PURPOSE`: Clear definition of scope and responsibility.
2. `USE WHEN`: Positive activation boundaries and scenarios.
3. `DO NOT USE WHEN`: Explicit negative boundaries disambiguating sibling collisions.
4. `MODE APPLICABILITY`: GREENFIELD, MODERNIZATION, REPAIR, and/or CONTINUOUS_GOVERNANCE.
5. `REQUIRED CONTEXT`: Workspace preconditions, input briefs, and manifests.
6. `PROJECT INTELLIGENCE LOADING`: Durable memory loading from `.alper-design-os/project/`.
7. `DISCOVERY / AMBIGUITY BEHAVIOR`: Clarification before code; never guess high-impact requirements.
8. `WORKFLOW`: Step-by-step canonical execution lifecycle.
9. `DECISION RULES`: Deterministic branching logic and invariant checks.
10. `MCP TOOL STRATEGY`: Explicit tool dispatch, argument handling, and error states.
11. `SOURCE / RESEARCH STRATEGY`: Authoritative source grounding via `alper-source-intelligence`.
12. `POLICY & GOVERNANCE`: Compliance with `rules/AGENTS.md` and safety hooks.
13. `HUMAN CHECKPOINTS`: Explicit conditions requiring operator approval.
14. `STOP CONDITIONS`: Hard stop criteria (ambiguity, validation failure, scope violations).
15. `FAILURE HANDLING`: Non-zero exit states, diagnostic traces, zero simulated PASSes.
16. `EVIDENCE REQUIREMENTS`: Concrete qualifying evidence kinds required for completion.
17. `OUTPUT CONTRACT`: Structured return schemas and deliverables.
18. `HANDOFF / RELATED SKILLS`: Safe transitions to downstream skills.

### 3.3 Progressive Disclosure References
Complex skills store deep operational guides in `skills/<skill>/references/`:
- `alper-greenfield-generator/references/stack-templates.md`
- `alper-modernization-planner/references/preservation-checklist.md`
- `alper-project-intelligence/references/schema-specification.md`
- `alper-truthful-ui/references/provenance-evaluation-guide.md`
- `alper-operator-execution/references/run-bundle-standard.md`
- `alper-source-intelligence/references/source-ranking-weights.md`

---

## 4. Tool Reachability Architecture
All 124 canonical MCP tools exported by `packages/mcp-server` are mapped with deterministic ownership.

- **Total Canonical MCP Tools**: 124
- **Tools Owned by Active Skills**: 124
- **Unreached Canonical MCP Tools**: 0
- **Unknown Mapped Tools**: 0

`packages/agent-governance/src/tool-router.ts` maintains typed routing metadata for all 131 tools (7 built-ins + 124 MCP tools) with cost, latency, risk, approval requirements, and network dependencies.

---

## 5. Context Routing & Scenario Matrix
`packages/agent-governance/src/context-router.ts` enforces modern canonical skill routing and strictly filters out deprecated skills.

### Canonical Scenarios Verification (Section 34):
1. **"Build a React dashboard for warehouse operations"**
   - Mode: `NEW`
   - Active Skills: `alper-greenfield-generator`, `alper-greenfield-product-analysis`, `alper-domain-intelligence`, `alper-requirements-engineering`
2. **"Fix broken responsive layout on mobile navigation"**
   - Mode: `REPAIR`
   - Active Skills: `alper-design-repair`, `alper-browser-qa`, `alper-visual-regression`
3. **"Modernize legacy ASP.NET WebForms to modern Razor pages"**
   - Mode: `MODERNIZE`
   - Active Skills: `alper-modernization-planner`, `alper-behavior-preservation`, `alper-modernization-review`, `alper-refactoring-strategy`
4. **"Review this pull request for SQL injection and auth bypass"**
   - Active Skills: `alper-security-audit`, `alper-secure-coding`, `alper-api-security`, `alper-independent-review`
5. **"Why is this PostgreSQL query taking 4 seconds"**
   - Active Skills: `alper-sql-performance`, `alper-database-designer`
6. **"Audit our design system against WCAG 2.1 AA"**
   - Active Skills: `alper-accessibility-testing`, `alper-browser-qa`
7. **"Generate synthetic Playwright tests for checkout funnel"**
   - Active Skills: `alper-browser-qa`, `alper-requirements-engineering`
8. **"Record ADR for switching from REST to gRPC"**
   - Active Skills: `alper-decision-management`, `alper-project-intelligence`, `alper-architecture`

---

## 6. Full Skill Migration Accounting Table

| # | Original Skill | Action | Capability Family | Canonical Owner / Replacement | Rationalization |
|---|---|---|---|---|---|
| 1 | `alper-greenfield-product-analysis` | REWRITE | PRODUCT_DISCOVERY | `alper-greenfield-product-analysis` | Discovery readiness and request complexity classification. |
| 2 | `alper-domain-intelligence` | REWRITE | PRODUCT_DISCOVERY | `alper-domain-intelligence` | Operational domain intelligence across 15 industries. |
| 3 | `alper-requirements-engineering` | REWRITE | GREENFIELD_ENGINEERING | `alper-requirements-engineering` | RTM derivation and acceptance criteria lifecycle. |
| 4 | `alper-greenfield-generator` | REWRITE | GREENFIELD_ENGINEERING | `alper-greenfield-generator` | Master greenfield orchestrator for 4 production stacks. |
| 5 | `alper-design-new` | DEPRECATE | GREENFIELD_ENGINEERING | `alper-greenfield-generator` | Phase 0 legacy workflow superseded by greenfield-generator. |
| 6 | `alper-existing-project-analysis` | REWRITE | EXISTING_PROJECT_ANALYSIS | `alper-existing-project-analysis` | Analyzes existing codebases, detects stack, profiles debt. |
| 7 | `alper-design-repair` | REWRITE | REPAIR | `alper-design-repair` | Surgical UI/UX remediation with zero uninvited rewrite. |
| 8 | `alper-modernization-planner` | REWRITE | MODERNIZATION | `alper-modernization-planner` | Phased modernization plans and element classification. |
| 9 | `alper-behavior-preservation` | REWRITE | MODERNIZATION | `alper-behavior-preservation` | Freezes baselines, routes, DB invariants, and auth. |
| 10 | `alper-modernization-review` | REWRITE | MODERNIZATION | `alper-modernization-review` | Evaluates modernization PRs and visual approval gates. |
| 11 | `alper-refactoring-strategy` | REWRITE | MODERNIZATION | `alper-refactoring-strategy` | Safe refactoring with Strangler Fig and Branch-by-Abstraction. |
| 12 | `alper-design-modernize` | DEPRECATE | MODERNIZATION | `alper-modernization-planner` | Phase 0 shell rewrite superseded by Modernization Engine. |
| 13 | `alper-safe-refactor` | MERGE | MODERNIZATION | `alper-refactoring-strategy` | Merged into alper-refactoring-strategy. |
| 14 | `alper-regression-guard` | MERGE | MODERNIZATION | `alper-behavior-preservation` | Merged into alper-behavior-preservation. |
| 15 | `alper-project-intelligence` | REWRITE | PROJECT_INTELLIGENCE | `alper-project-intelligence` | Version-controlled project memory and architecture graph. |
| 16 | `alper-decision-management` | REWRITE | PROJECT_INTELLIGENCE | `alper-decision-management` | ADR lifecycle management and superseding. |
| 17 | `alper-change-impact-analysis` | REWRITE | PROJECT_INTELLIGENCE | `alper-change-impact-analysis` | Blast radius, affected modules, DB entities, and APIs. |
| 18 | `alper-project-continuation` | REWRITE | PROJECT_INTELLIGENCE | `alper-project-continuation` | Truthful agent session onboarding and drift detection. |
| 19 | `alper-continuous-improvement` | REWRITE | PROJECT_INTELLIGENCE | `alper-continuous-improvement` | Records lessons learned and governance improvement proposals. |
| 20 | `alper-change-planner` | REWRITE | GOVERNANCE | `alper-change-planner` | 17-step change lifecycle and AgentActionPlan. |
| 21 | `alper-scope-guard` | REWRITE | GOVERNANCE | `alper-scope-guard` | Enforces boundaries and blocks silent creep. |
| 22 | `alper-git-safety` | REWRITE | GOVERNANCE | `alper-git-safety` | Prevents destructive commands and manages checkpoints. |
| 23 | `alper-independent-review` | REWRITE | GOVERNANCE | `alper-independent-review` | 12-point second-pass review without self-assurance. |
| 24 | `alper-evidence-review` | REWRITE | GOVERNANCE | `alper-evidence-review` | NO CLAIM WITHOUT EVIDENCE across 13 evidence kinds. |
| 25 | `alper-architecture` | REWRITE | ARCHITECTURE | `alper-architecture` | Structural discovery, styles, and stack recommendations. |
| 26 | `alper-architecture-planner` | MERGE | ARCHITECTURE | `alper-architecture` | Merged into alper-architecture. |
| 27 | `alper-architecture-audit` | MERGE | ARCHITECTURE | `alper-architecture` | Merged into alper-architecture. |
| 28 | `alper-database-designer` | REWRITE | DATA_ENGINEERING | `alper-database-designer` | Grounded entity derivation, 3NF schema, ACID integrity. |
| 29 | `alper-database-engineering` | MERGE | DATA_ENGINEERING | `alper-database-designer` | Merged into alper-database-designer. |
| 30 | `alper-data-integrity` | MERGE | DATA_ENGINEERING | `alper-database-designer` | Merged into alper-database-designer. |
| 31 | `alper-migration-safety` | REWRITE | DATA_ENGINEERING | `alper-migration-safety` | DDL risk classification and zero-downtime evolution. |
| 32 | `alper-sql-performance` | REWRITE | DATA_ENGINEERING | `alper-sql-performance` | N+1 diagnosis, missing indexes, keyset pagination. |
| 33 | `alper-api-designer` | REWRITE | API_ENGINEERING | `alper-api-designer` | OpenAPI 3.1.0 design, RFC 9457, RBAC auth. |
| 34 | `alper-api-architecture` | MERGE | API_ENGINEERING | `alper-api-designer` | Merged into alper-api-designer. |
| 35 | `alper-design-language` | REWRITE | DESIGN_UX | `alper-design-language` | DTCG tokens, multi-pane workbench layouts. |
| 36 | `alper-design-personality` | REWRITE | DESIGN_UX | `alper-design-personality` | 6-axis quantitative personality matrix. |
| 37 | `alper-pattern-graph` | REWRITE | DESIGN_UX | `alper-pattern-graph` | 28 technology-independent UX patterns. |
| 38 | `alper-design-critic` | REWRITE | DESIGN_UX | `alper-design-critic` | Visual hierarchy, layout shifts, AI design smells. |
| 39 | `alper-ui-blueprint` | REWRITE | DESIGN_UX | `alper-ui-blueprint` | Declarative UI Blueprint DSL for pages/components. |
| 40 | `alper-ui-recipe` | REWRITE | DESIGN_UX | `alper-ui-recipe` | Canonical UI layouts, responsive breakpoints. |
| 41 | `alper-cross-stack-rendering` | REWRITE | DESIGN_UX | `alper-cross-stack-rendering` | Renders blueprints to React, Blade, Razor, HTML. |
| 42 | `alper-renderer-parity` | REWRITE | DESIGN_UX | `alper-renderer-parity` | Cross-stack visual and behavioral parity verification. |
| 43 | `alper-source-intelligence` | REWRITE | SOURCE_INTELLIGENCE | `alper-source-intelligence` | Discovers, ranks, and licenses 65+ design systems. |
| 44 | `alper-design-source-ranking` | MERGE | SOURCE_INTELLIGENCE | `alper-source-intelligence` | Merged into alper-source-intelligence. |
| 45 | `alper-registry-discovery` | REWRITE | SOURCE_INTELLIGENCE | `alper-registry-discovery` | Discovers shadcn/ui and community registries. |
| 46 | `alper-secure-coding` | REWRITE | SECURITY | `alper-secure-coding` | OWASP Top 10 2025, ASVS 5.0, parameterized queries. |
| 47 | `alper-security-audit` | REWRITE | SECURITY | `alper-security-audit` | Passive security audits and STRIDE threat models. |
| 48 | `alper-api-security` | REWRITE | SECURITY | `alper-api-security` | OWASP API Top 10, BOLA/IDOR prevention. |
| 49 | `alper-secret-management` | REWRITE | SECURITY | `alper-secret-management` | Zero-tolerance secret leak prevention. |
| 50 | `alper-supply-chain-security` | REWRITE | SECURITY | `alper-supply-chain-security` | NIST SSDF, SLSA provenance, CycloneDX SBOM. |
| 51 | `alper-ai-skill-audit` | REWRITE | SECURITY | `alper-ai-skill-audit` | Audits third-party AI skills for injection hazards. |
| 52 | `alper-ai-coding-safety` | MERGE | SECURITY | `alper-secure-coding` | Merged into alper-secure-coding. |
| 53 | `alper-dependency-hygiene` | MERGE | SECURITY | `alper-supply-chain-security` | Merged into alper-supply-chain-security. |
| 54 | `alper-dependency-lifecycle` | MERGE | SECURITY | `alper-supply-chain-security` | Merged into alper-supply-chain-security. |
| 55 | `alper-code-quality` | REWRITE | SECURITY | `alper-code-quality` | Static analysis, typed linting, cognitive complexity. |
| 56 | `alper-browser-qa` | REWRITE | QA_TESTING | `alper-browser-qa` | Playwright E2E and Chrome DevTools runtime inspection. |
| 57 | `alper-playwright-testing` | MERGE | QA_TESTING | `alper-browser-qa` | Merged into alper-browser-qa. |
| 58 | `alper-runtime-debugging` | MERGE | QA_TESTING | `alper-browser-qa` | Merged into alper-browser-qa. |
| 59 | `alper-cross-browser-testing` | MERGE | QA_TESTING | `alper-browser-qa` | Merged into alper-browser-qa. |
| 60 | `alper-visual-regression` | REWRITE | QA_TESTING | `alper-visual-regression` | Pixel and DOM diffs across 4 responsive viewports. |
| 61 | `alper-accessibility-testing` | REWRITE | QA_TESTING | `alper-accessibility-testing` | WCAG 2.1 AA/AAA compliance and keyboard navigation. |
| 62 | `alper-testing-strategy` | REWRITE | QA_TESTING | `alper-testing-strategy` | Testing pyramid synthesis across 6 test tiers. |
| 63 | `alper-contract-testing` | REWRITE | QA_TESTING | `alper-contract-testing` | Consumer-driven contracts (Pact) and breaking guards. |
| 64 | `alper-api-testing` | MERGE | QA_TESTING | `alper-contract-testing` | Merged into alper-contract-testing. |
| 65 | `alper-regression-testing` | REWRITE | QA_TESTING | `alper-regression-testing` | Selective smoke and regression test suites. |
| 66 | `alper-performance-engineering` | REWRITE | PERFORMANCE_RELIABILITY | `alper-performance-engineering` | Core Web Vitals, asset budgets, pagination. |
| 67 | `alper-performance-testing` | MERGE | PERFORMANCE_RELIABILITY | `alper-performance-engineering` | Merged into alper-performance-engineering. |
| 68 | `alper-reliability` | REWRITE | PERFORMANCE_RELIABILITY | `alper-reliability` | SLIs/SLOs, circuit breakers, backoff strategies. |
| 69 | `alper-resilience` | MERGE | PERFORMANCE_RELIABILITY | `alper-reliability` | Merged into alper-reliability. |
| 70 | `alper-observability` | REWRITE | PERFORMANCE_RELIABILITY | `alper-observability` | OpenTelemetry tracing, metrics, structured logs. |
| 71 | `alper-release-safety` | REWRITE | PERFORMANCE_RELIABILITY | `alper-release-safety` | Canary rollouts, feature flags, DB backward compatibility. |
| 72 | `alper-load-testing` | REWRITE | PERFORMANCE_RELIABILITY | `alper-load-testing` | Grafana k6 benchmarks with operator approval. |
| 73 | `alper-truthful-ui` | NEW_CANONICAL | TRUTHFUL_UI | `alper-truthful-ui` | Data provenance, page intent, content truth gate. |
| 74 | `alper-operator-execution` | NEW_CANONICAL | OPERATOR_EXECUTION | `alper-operator-execution` | Corporate fallback, RUN.ps1 bundles, doctor. |

---

## 7. Carried Verification Debt Tracking

```
==================================================
CARRIED VERIFICATION DEBT (PHASE 1H.1 -> 1H.2)
==================================================
ITEM: Real Native Builds for Generated Greenfield Projects
STATUS: NOT_VERIFIED
REASON: Scaffolding files are structurally verified and syntactically validated,
        but runtime compilation evidence on native toolchains (node/npm, dotnet, php)
        in genuine production target environments is carried forward as verification debt.
POLICY: The system strictly reports buildStatus: 'NOT_VERIFIED' and buildable: false
        until authentic compiler exit codes and execution logs are captured.
==================================================
```
