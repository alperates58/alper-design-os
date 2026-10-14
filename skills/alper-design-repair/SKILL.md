---
name: alper-design-repair
description: Surgical UI/UX repair preserving existing architecture and styles with zero uninvited rewrite. Use when fixing a specific ui layout glitch, overflow bug, or broken responsive breakpoint. Do not use for modernizing entire legacy application shells or migrating frameworks (use alper-modernization-planner).
status: ACTIVE
capabilityFamily: REPAIR
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - REPAIR
mcpTools:
  - audit_accessibility
  - audit_responsive
  - evaluate_scope
  - review_change
relatedSkills:
  - alper-browser-qa
  - alper-visual-regression
  - alper-scope-guard
  - alper-git-safety
---

# Alper Design Repair Skill

## PURPOSE
Executes minimal-risk, highly targeted remediations for broken UI components, responsive layout overflow, WCAG 2.2 contrast/focus defects, and visual glitches without touching backend or database files.

## USE WHEN
- Fixing a specific UI layout glitch, overflow bug, or broken responsive breakpoint.
- Remediating an accessibility violation (e.g. missing ARIA label, low contrast ratio).
- Polishing interactive states (hover, focus-visible, active) in existing components.

## DO NOT USE WHEN
- Modernizing entire legacy application shells or migrating frameworks (use alper-modernization-planner).
- Diagnosing backend SQL query latency (use alper-sql-performance).
- Executing high-level security vulnerability audits (use alper-security-audit).

## MODE APPLICABILITY
- Supported Modes: **REPAIR**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Identify target UI component and inspect existing CSS/styling rules.
2. Audit responsive breakpoints (390px, 768px, 1440px) and WCAG compliance.
3. Formulate minimal single-block diff preserving all existing classes and styles.
4. Verify fix with Playwright or Chrome DevTools inspection.
5. Validate zero scope creep outside requested UI element.

## DECISION RULES
- Zero uninvited rewrites: Preserve existing styling technology (Bootstrap, Tailwind, BEM, CSS Modules).
- Never touch backend controllers, database migrations, or server routes during UI repair.

## MCP TOOL STRATEGY
- `audit_accessibility`: Canonical handler for audit accessibility. Always pass required schema arguments; handle return states deterministically.
- `audit_responsive`: Canonical handler for audit responsive. Always pass required schema arguments; handle return states deterministically.
- `evaluate_scope`: Canonical handler for evaluate scope. Always pass required schema arguments; handle return states deterministically.
- `review_change`: Canonical handler for review change. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Existing project CSS/styling framework, WCAG 2.2 AA accessibility rules, and layout specs.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Human visual inspection of repaired component across responsive viewports.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `VISUAL_DIFF`, `BROWSER_TEST`, `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- Surgical code edit, visual verification report, and scope compliance record.

## HANDOFF / RELATED SKILLS
- `alper-browser-qa`: Downstream or sibling capability for QA_TESTING operations.
- `alper-visual-regression`: Downstream or sibling capability for QA_TESTING operations.
- `alper-scope-guard`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-git-safety`: Downstream or sibling capability for GOVERNANCE operations.
