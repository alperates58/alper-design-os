---
name: alper-design-language
description: Technology-agnostic DTCG tokens, multi-pane workbench layouts, and information density. Use when establishing or refactoring a design token architecture (primitive -> semantic -> component tier). Do not use for designing database entities or tables (use alper-database-designer).
status: ACTIVE
capabilityFamily: DESIGN_UX
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
mcpTools:
  - get_design_tokens
  - create_design_plan
  - create_design_intent
relatedSkills:
  - alper-design-personality
  - alper-ui-blueprint
  - alper-accessibility-testing
---

# Alper Design Language & Tokens Skill

## PURPOSE
Architects and compiles technology-neutral design token hierarchies following DTCG standards, distributing color, typography, spacing, elevation, and density tokens across CSS, SCSS, and Tailwind themes.

## USE WHEN
- Establishing or refactoring a design token architecture (primitive -> semantic -> component tier).
- Configuring theme variables, dark mode switching, or density modes (Compact/Normal/Comfortable).
- Compiling design tokens to CSS custom properties or framework theme files.

## DO NOT USE WHEN
- Designing database entities or tables (use alper-database-designer).
- Diagnosing backend server latency (use alper-sql-performance).
- Running active network security tests (use alper-security-audit).

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
1. Define primitive palette, font scales, and spacing units in DTCG JSON format.
2. Map primitive tokens to semantic intent tokens (primary, danger, surface, border).
3. Verify color contrast ratios against WCAG 2.2 AA standards.
4. Compile to CSS custom properties (tokens.css) and Tailwind theme extensions.

## DECISION RULES
- Strict DTCG Compliance: All tokens must use $value, $type, and $description format.
- Contrast Integrity: Every foreground/surface color token pairing must satisfy WCAG 2.2 AA (4.5:1 text, 3:1 non-text).

## MCP TOOL STRATEGY
- `get_design_tokens`: Canonical handler for get design tokens. Always pass required schema arguments; handle return states deterministically.
- `create_design_plan`: Canonical handler for create design plan. Always pass required schema arguments; handle return states deterministically.
- `create_design_intent`: Canonical handler for create design intent. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Design Tokens Community Group (DTCG) specification, CSS Custom Properties, and APCA contrast models.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Brand / visual approval for primary color palette, typography, and density tier adjustments.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- DTCG tokens.json, compiled tokens.css, and DesignPlanSpecification.

## HANDOFF / RELATED SKILLS
- `alper-design-personality`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-ui-blueprint`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-accessibility-testing`: Downstream or sibling capability for QA_TESTING operations.
