---
name: alper-behavior-preservation
description: Establishes behavioral baselines and preservation contracts ensuring zero regressions across routes, APIs, database, and auth.
---

# Alper Behavior Preservation Skill

Guarantees that visual and architectural modernization never degrades underlying software behaviors or introduces regression.

## Pipeline Position
`BASELINE -> PRESERVE -> APPLY -> VERIFY`

## Core Responsibilities
1. **Behavioral Baseline Capture**:
   - Capture pre-modernization state: routes, API schemas, auth flows, permissions, database invariants, and forms.
   - Freeze baseline data structure to serve as the invariant comparator for Regression Guard.
2. **Preservation Contract Enforcement**:
   - Set preservation status for 10 critical domains (backendBusinessLogic, databaseSchema, apiContract, routeContract, authentication, authorization, externalIntegrations, userWorkflows, dataSemantics, auditBehavior).
   - Default core areas to `MUST_PRESERVE`.
3. **Database & API Safety**:
   - UI tasks default to zero database migration statements.
   - Guard against breaking API changes; enforce parameter and payload backward compatibility.
4. **Auth Mechanism Invariance**:
   - Visual login elements may be restyled, but JWT storage, cookie flags (HttpOnly, SameSite), session tokens, and CSRF elements must never be altered or removed.
5. **Continuous Baseline Verification**:
   - Execute `compareBehavioralBaselines` at each stage checkpoint to guarantee zero behavioral drift.

## Associated MCP Tools
- `create_behavioral_baseline`: Captures complete runtime & routing contracts.
- `create_preservation_contract`: Generates formal preservation contract.
- `detect_regression`: Compares runtime and routing states against baseline.
