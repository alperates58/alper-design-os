---
name: alper-cross-stack-rendering
description: Renders blueprints into semantic code across HTML/CSS/JS, React, Laravel Blade, and ASP.NET Razor. Use when compiling declarative ui blueprints into concrete code files for a specific target stack. Do not use for designing initial layout blueprints (use alper-ui-blueprint).
status: ACTIVE
capabilityFamily: DESIGN_UX
userFacingType: INTERNAL_ORCHESTRATION
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools:
  - render_blueprint
  - render_component
relatedSkills:
  - alper-ui-blueprint
  - alper-renderer-parity
  - alper-greenfield-generator
---

# Alper Cross-Stack Rendering Skill

## PURPOSE
Compiles technology-neutral PageBlueprints and ComponentBlueprints into clean, idiomatic, semantic source code for React + TypeScript, Laravel Blade, ASP.NET Razor, or Plain HTML5.

## USE WHEN
- Compiling declarative UI blueprints into concrete code files for a specific target stack.
- Rendering individual component blueprints into framework-specific templates.
- Ensuring generated markup uses semantic HTML elements (nav, main, aside, header, footer).

## DO NOT USE WHEN
- Designing initial layout blueprints (use alper-ui-blueprint).
- Fixing isolated CSS bugs in existing brownfield files (use alper-design-repair).
- Diagnosing database performance (use alper-sql-performance).

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
1. Ingest validated PageBlueprint or ComponentBlueprint.
2. Select stack renderer adapter (React, Blade, Razor, Plain).
3. Compile declarative nodes into semantic template code.
4. Inject design token CSS classes or custom properties.
5. Output ready-to-write source code files.

## DECISION RULES
- Semantic Markup: Div soup is prohibited; all layouts must use semantic HTML5 elements.
- Accessibility By Construction: Form inputs must be linked to labels, buttons must have text or aria-labels.

## MCP TOOL STRATEGY
- `render_blueprint`: Canonical handler for render blueprint. Always pass required schema arguments; handle return states deterministically.
- `render_component`: Canonical handler for render component. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Stack compiler targets (React 18+ JSX, Laravel 11 Blade, ASP.NET Razor, HTML5).
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- None required during automated compilation.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- Generated source code files (TSX, Blade, Razor, or HTML/JS).

## HANDOFF / RELATED SKILLS
- `alper-ui-blueprint`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-renderer-parity`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-greenfield-generator`: Downstream or sibling capability for GREENFIELD_ENGINEERING operations.
