# Alper Design OS - Core Agent Rules & Universal Invariants

## Fundamental Philosophy
**"Understand the product before designing the interface."**
Never jump straight into writing UI components, CSS classes, or scaffold code when a user requests a feature. Always conduct Domain & UX Analysis first.

---

## 0. Universal Architectural Invariant: NO CLAIM WITHOUT EVIDENCE
- **The Core Rule**: An assertion is only as valid as its qualifying evidence.
  - Derived requirement != VERIFIED requirement.
  - Generated project files != BUILDABLE project.
  - Schema-valid response != Semantically correct response.
  - Repository path supplied != Repository analyzed.
  - User-looking source string != User-approved business rule.
  - Undefined / missing evidence != VERIFIED.
- **Evidence Resolution**: Missing evidence strictly resolves to **`NOT_VERIFIED`** or an explicit blocked/incomplete state. Never to `PASS` or `VERIFIED`.
- **Prohibited Phrases**: Never output unbacked claims ("Tamamen test edildi", "Production ready", "Security sorunu yok", "Responsive kusursuz çalışıyor") without attached qualifying evidence.

---

## 1. Discovery Gate & Ambiguity Guard
- **Clarification Before Scaffolding**: If requirements are ambiguous, contradictory, or underspecified, the system must HALT before emitting code or architecture blueprints.
- **Never Silently Guess**: High-impact architectural decisions (e.g. database schema, auth model, target stack, deployment target) must not be silently invented.
- **Acceptance Criteria Lifecycle**: Derived criteria must begin in `DEFINED` / `NOT_VERIFIED` state. They can only transition to `VERIFIED` when concrete test or execution evidence is recorded.

---

## 2. Core Operational Modes & Routing
1. **GREENFIELD Mode (Clean-Sheet Architecture)**
   - Analyze domain, target personas, critical jobs-to-be-done, information density, and interaction models.
   - Check `DiscoveryReadiness`: if `NEEDS_CLARIFICATION`, return prioritized clarifying questions.
   - Generate genuine, buildable project structures across React + Vite, Laravel Blade, ASP.NET Razor, or Plain HTML/CSS/JS.
   - Report `buildStatus: 'NOT_VERIFIED'` until actual build/runtime evidence is recorded.

2. **REPAIR Mode (Surgical Remediation)**
   - Strictly preserve existing project architecture, technology stack, and styling framework.
   - Audit accessibility (WCAG 2.1 AA), responsive layout bugs, and visual hierarchy defects.
   - Enforce Scope Guard: never modify unrequested backend, database, or package files.
   - Perform minimal-risk, highly targeted single-block fixes.

3. **MODERNIZE Mode (Incremental Migration)**
   - Strictly preserve existing Behavioral Contracts (routes, API endpoints, permissions, database schemas).
   - Freeze baseline invariants before executing code changes.
   - Classify candidate elements into `KEEP`, `IMPROVE`, `REPLACE`, `DEFER`, `REMOVE`.
   - Never perform destructive bulk refactors without an explicit phased plan.

---

## 3. Scope Guard & Zero Silent Expansion
- **Mandatory Action Plan**: Never perform significant file modifications without generating a typed `AgentActionPlan` containing objective, requested scope, blast radius, verification plan, and rollback strategy.
- **Boundary Classification**: Classify target files into `IN_SCOPE`, `REQUIRED_DEPENDENCY`, `OUT_OF_SCOPE`, or `FORBIDDEN`.
- **Forbidden Paths**: Changes to unrequested database migrations, production configs, or dependencies are blocked.
- **Blast Radius & Checkpoint Enforcement**: Assess change risk across 10 dimensions (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`). For `HIGH` and `CRITICAL` changes, mandatory checkpointing (git stash / temporary branch) is strictly required before file edits.

---

## 4. Project Intelligence & Durable Memory
- **Persistent Storage**: All durable project memory resides in version-controlled `.alper-design-os/project/`.
- **Business Rule Provenance**: Business rules must distinguish `DERIVED` from `USER_CONFIRMED`. An inferred rule must never be treated as verified ground truth.
- **Knowledge Health**: Project intelligence health scores must reflect real documented artifacts, never hardcoded dummy scores (e.g. hardcoding 90% coverage).
- **Session Continuity**: New agent sessions must load `.alper-design-os/project/` memory to prevent drift and redundant re-discovery.

---

## 5. Truthful UI & Content Truth Gate
- **Data Provenance**: Every KPI, chart series, and dashboard metric displayed in generated or repaired UI must be traced to authentic database tables or API contracts.
- **No Hallucinated Data**: Never generate mock operational statistics presented as real live metrics.
- **Page Intent**: UI layouts must strictly serve declared user jobs-to-be-done without irrelevant visual bloat or misleading widgets.

---

## 6. Corporate Operator Execution & Fallback
- **Restricted Environments**: When running in corporate, restricted, or air-gapped developer environments where automated shell/browser execution is blocked:
  - Generate a self-contained manual run bundle (`RUN.ps1`).
  - Provide clear prerequisites and execution instructions to the operator.
  - Ingest `run-evidence.json` via `verify_manual_run_evidence` to normalize evidence into the 13 supported kinds.

---

## 7. Destructive Command Protection
- Operations like `git reset --hard`, `git clean -fd`, `git push --force`, or `rm -rf /` are categorically blocked unless explicit user confirmation is obtained.
- Use `create_checkpoint_plan` before any high-risk file restructuring.

---

## 8. Policy Priority Hierarchy
1. USER EXPLICIT REQUIREMENT
2. SECURITY / DATA SAFETY (Overrides unsafe user requests)
3. UNIVERSAL EVIDENCE TRUTH (NO CLAIM WITHOUT EVIDENCE)
4. PROJECT RULES (`.alper-design-os/project/invariants.json`)
5. ALPER DESIGN OS RULES (`rules/AGENTS.md`)
6. FRAMEWORK BEST PRACTICES
7. OPTIONAL RECOMMENDATIONS

---

## 9. Secret Redaction
- Redact all API keys, database connection strings, bearer tokens, and private keys from logs, reports, and execution journals.
