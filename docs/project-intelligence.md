# Project Intelligence & Durable Memory (FAZ 1H / Remediated in FAZ 1H.1)

## Overview

**Alper Design OS Project Intelligence** maintains a durable, version-controlled repository knowledge base in `.alper-design-os/project-intelligence/` grounded strictly in real repository files and structured provenance.

```text
.alper-design-os/project-intelligence/
├── manifest.json              # Project identity, schema version, active configuration
├── project-profile.json       # Domain classification, scale, criticality, and user profiles
├── architecture.json          # Repository-grounded architecture graph, completeness, and unknown areas
├── constraints.json           # Mandatory operational, compliance, and runtime constraints
├── invariants.json            # Non-negotiable system rules (security, data integrity, contracts)
├── decisions/                 # Architecture Decision Records (ADRs) with superseding history
├── knowledge/                 # Business rules with structured provenance and task learnings
├── snapshots/                 # Truthful structural and contract fingerprint snapshots
├── lessons/                   # Empirical learnings from past changes
└── improvements/              # Governance-gated continuous improvement proposals
```

---

## Core Guarantees (FAZ 1H.1 Remediation)

1. **Repository-Grounded Discovery (Zero Fake Defaults):**
   - `discoverRepositoryArtifacts(baseDir)` inspects real files (`package.json`, `composer.json`, `.csproj`, SQL migrations/models, routes/controllers/OpenAPI specs, UI pages/views, CSS tokens, and test files).
   - `initializeProjectIntelligence` and `createProjectSnapshot` never invent fake default routes (`['/dashboard', '/items', '/health']`), fake API inventories, or fake fingerprints (`'fp-tables-users-items'`, `'fp-pkg-prod'`, `'fp-tokens-v1'`). When artifacts are absent, route/API inventories are `[]` and fingerprints are `'NOT_VERIFIED'`.

2. **Real Architecture Graph & Completeness Metadata:**
   - `buildProjectArchitectureGraph` constructs nodes and edges from discovered repository files and explicit `codeArtifacts` without injecting hardcoded `AppCore`, `DataModule`, `inventory_items`, or `/api/v1/items`.
   - Includes `completeness` (`COMPLETE | PARTIAL | EMPTY`), `unknownAreas`, `evidenceSources`, and `verificationStatus`.
   - `analyzeChangeImpact` traverses real graph edges, ADRs, business rules, and invariants rather than returning hardcoded module names.

3. **Structured Business Rule & Decision Provenance (No Substring Heuristics):**
   - `recordBusinessRule` requires structured `BusinessRuleSourceType` (`EXPLICIT_USER_SPECIFICATION`, `VERIFIED_CODE_FACT`, `APPROVED_REQUIREMENT`, `REGULATORY_SOURCE`, `AUTHORITATIVE_DOCUMENT`, `DOMAIN_RESEARCH`, `SYSTEM_INFERENCE`, `MODEL_INFERENCE`, `UNKNOWN`).
   - Substring checks such as `source.includes("Alper")` are removed. A rule is only marked `VERIFIED` when backed by an authoritative `sourceType` and either `confirmedByUser: true` or non-empty `evidenceRefs` / `tests`.
   - `SYSTEM_INFERENCE`, `MODEL_INFERENCE`, and `DOMAIN_RESEARCH` rules are never marked `VERIFIED` without explicit user confirmation or code/test evidence.

4. **Multi-Class Knowledge Conflict Detection:**
   - `detectKnowledgeConflicts` evaluates 5 conflict classes:
     1. Accepted ADR vs Database / Auth / Code Facts
     2. Project Invariant vs Verification / Config State
     3. Approved Requirement vs Missing Implementation
     4. Verified Business Rule vs Missing Verification Tests
     5. Living Markdown Docs (`PROJECT.md`, `DECISIONS.md`) vs Structured JSON Records

5. **Truthful Knowledge Health Scoring:**
   - `evaluateProjectKnowledgeHealth` removes the hardcoded `coverage = 90` baseline.
   - Returns `NOT_INITIALIZED` (`0%`) when `.alper-design-os/project-intelligence/manifest.json` does not exist, and `INSUFFICIENT_DATA` (`0%`) when no decisions, business rules, code nodes, or verified snapshots exist.

---

## MCP Tools in FAZ 1H (Tools 111–124)

| MCP Tool | Description |
| :--- | :--- |
| `initialize_project_intelligence` | Initializes durable intelligence grounded in real repository artifacts. |
| `load_project_intelligence` | Loads durable project summary, decisions, business rules, invariants, and snapshots. |
| `record_project_decision` | Records an ADR with explicit `authoritySource`, `confirmedByUser`, and bi-directional superseding. |
| `record_business_rule` | Records domain business rules enforcing structured `BusinessRuleSourceType` provenance. |
| `record_project_invariant` | Registers system invariants across security, data integrity, and API contract scopes. |
| `build_project_architecture_graph` | Constructs repository-grounded architecture graph with completeness metadata. |
| `create_project_snapshot` | Captures truthful structural fingerprints (`NOT_VERIFIED` when absent). |
| `detect_project_drift` | Compares snapshots to identify expected, review-required, or breaking changes. |
| `analyze_change_impact` | Computes blast radius by traversing the real architecture graph, ADRs, rules, and invariants. |
| `build_task_context` | Constructs token-efficient task context filtering relevant ADRs, rules, and invariants. |
| `detect_knowledge_conflicts` | Audits 5 conflict classes across ADRs, invariants, requirements, rules, code facts, and living docs. |
| `record_lesson_learned` | Captures operational lessons with verifiable evidence. |
| `propose_improvement_candidate` | Submits improvement proposals requiring governance approval. |
| `evaluate_project_knowledge_health` | Computes truthful knowledge coverage and health status without fake baselines. |
