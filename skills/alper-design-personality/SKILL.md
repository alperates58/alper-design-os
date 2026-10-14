---
name: alper-design-personality
description: Synthesizes quantitative 6-axis design personality avoiding generic unbranded AI templates. Use when establishing the visual character, voice, and aesthetic parameters of a new software system. Do not use for designing database tables or foreign keys (use alper-database-designer).
status: ACTIVE
capabilityFamily: DESIGN_UX
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools:
  - select_design_personality
  - create_design_intent
relatedSkills:
  - alper-design-language
  - alper-design-critic
  - alper-pattern-graph
---

# Alper Design Personality Skill

## PURPOSE
Computes a calibrated 6-axis design personality profile tailored to the product domain and user personas, ensuring software avoids bland, generic AI templates and matches operational needs.

## USE WHEN
- Establishing the visual character, voice, and aesthetic parameters of a new software system.
- Aligning design tokens and UI patterns with domain expectations (e.g. utilitarian industrial vs elegant fintech).
- Preventing cookie-cutter, consumerized UI clichés in expert professional tools.

## DO NOT USE WHEN
- Designing database tables or foreign keys (use alper-database-designer).
- Fixing isolated CSS padding glitches (use alper-design-repair).
- Running static code analysis (use alper-code-quality).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**.
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
1. Ingest product domain, target user personas, and brand parameters.
2. Score the 6 personality axes on a 1-100 scale.
3. Formulate DesignPersonalityProfile defining typography weights, border radii, and visual warmth.
4. Pass personality parameters to alper-design-language for token synthesis.

## DECISION RULES
- Industrial Rule: Utility-driven expert domains must prioritize density and speed over decorative animations.
- Anti-Generic Rule: Never emit uncustomized generic SaaS templates without explicit personality scoring.

## MCP TOOL STRATEGY
- `select_design_personality`: Canonical handler for select design personality. Always pass required schema arguments; handle return states deterministically.
- `create_design_intent`: Canonical handler for create design intent. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Quantitative 6-axis aesthetic vectors (Utility vs Elegance, Density vs Whitespace, etc.) and brand guidelines.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of chosen 6-axis personality profile.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `HEURISTIC_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- DesignPersonalityProfile with 6-axis quantitative scores and aesthetic directives.

## HANDOFF / RELATED SKILLS
- `alper-design-language`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-design-critic`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-pattern-graph`: Downstream or sibling capability for DESIGN_UX operations.
