---
name: alper-design-critic
description: Evaluates layout shifts, AI design smells, visual hierarchy defects, and design antipatterns. Use when critiquing a proposed ui wireframe, blueprint, or rendered screen. Do not use for designing database normalization (use alper-database-designer).
status: ACTIVE
capabilityFamily: DESIGN_UX
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
mcpTools:
  - evaluate_design_antipatterns
relatedSkills:
  - alper-truthful-ui
  - alper-accessibility-testing
  - alper-visual-regression
---

# Alper Design Critic Skill

## PURPOSE
Audits UI designs, screenshots, and component trees for visual hierarchy flaws, Cumulative Layout Shifts (CLS), missing interactive states, and generic AI design smells (e.g. useless cards, decorative clutter).

## USE WHEN
- Critiquing a proposed UI wireframe, blueprint, or rendered screen.
- Detecting AI-generated design anti-patterns and unfunctional decorative noise.
- Ensuring complete state coverage (empty, loading, error, populated, partial).

## DO NOT USE WHEN
- Designing database normalization (use alper-database-designer).
- Writing backend API controllers (use alper-api-designer).
- Running automated security scans (use alper-security-audit).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- UI wireframes, page layouts, component markup, or browser DOM.
- Design token definitions (tokens.json, tokens.css) and theme configurations.
- Stated user personas and target operational density.

## PROJECT INTELLIGENCE LOADING
**Status: NOT_REQUIRED**
Operates as a self-contained, stateless capability. Does not require loading repository project intelligence snapshots to perform its core diagnosis or transformation.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Ingest rendered UI markup or visual layout.
2. Audit visual hierarchy, contrast, touch targets, and scanning readability.
3. Detect design smells: unnecessary cards, decorative neon gradients, missing state handling.
4. Formulate prioritized critique findings (BLOCKER, MAJOR, MINOR, SUGGESTION).

## DECISION RULES
- Objective vs Subjective: Clearly separate hard accessibility violations (BLOCKER) from aesthetic suggestions (SUGGESTION).
- Every interactive view must define loading, empty, and error fallback states.

## MCP TOOL STRATEGY
- `evaluate_design_antipatterns`: Canonical handler for evaluate design antipatterns. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: WCAG 2.2 AA accessibility standards, APCA contrast, and Nielsen Norman Group UX heuristics.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Human designer review of subjective visual polish recommendations.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `HEURISTIC_REVIEW`, `VISUAL_DIFF`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- DesignCritiqueReport with categorized findings and concrete remediation steps.

## HANDOFF / RELATED SKILLS
- `alper-truthful-ui`: Downstream or sibling capability for TRUTHFUL_UI operations.
- `alper-accessibility-testing`: Downstream or sibling capability for QA_TESTING operations.
- `alper-visual-regression`: Downstream or sibling capability for QA_TESTING operations.
