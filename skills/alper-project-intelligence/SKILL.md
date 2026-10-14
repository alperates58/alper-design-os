---
name: alper-project-intelligence
description: Initializes, loads, and manages durable version-controlled project memory, repository-grounded architecture graphs, snapshots, and knowledge health in .alper-design-os/project-intelligence.
---

# Alper Project Intelligence Skill

Provides durable, version-controlled project knowledge grounded in real repository artifacts. Enforces **NO CLAIM WITHOUT EVIDENCE** across architecture graphs, snapshots, business rules, decisions, conflict detection, and knowledge health.

## Core Responsibilities

1. **Repository-Grounded Initialization & Snapshots**:
   - Inspects real repository files (`package.json`, `composer.json`, `.csproj`, migrations, schemas, route definitions, controllers, pages, CSS tokens, and tests).
   - Never invents fake default routes (`['/dashboard', '/items', '/health']`), fake API inventories, or fake fingerprints (`'fp-tables-users-items'`, `'fp-pkg-prod'`, `'fp-tokens-v1'`). Missing artifacts resolve to `[]` and `'NOT_VERIFIED'`.
2. **Real Architecture Graph & Change Impact**:
   - Builds `ProjectArchitectureGraph` from discovered repository files and explicit code artifacts, reporting `completeness` (`COMPLETE | PARTIAL | EMPTY`), `unknownAreas`, `evidenceSources`, and `verificationStatus`.
   - Never injects hardcoded `AppCore`, `DataModule`, `inventory_items`, or `/api/v1/items` into empty or unrelated repositories.
   - Computes change impact by traversing real graph edges, ADRs, business rules, and invariants.
3. **Structured Business Rule & Decision Provenance**:
   - Requires structured `BusinessRuleSourceType` (`EXPLICIT_USER_SPECIFICATION`, `VERIFIED_CODE_FACT`, `APPROVED_REQUIREMENT`, `REGULATORY_SOURCE`, `AUTHORITATIVE_DOCUMENT`, `DOMAIN_RESEARCH`, `SYSTEM_INFERENCE`, `MODEL_INFERENCE`, `UNKNOWN`) and explicit confirmation/evidence references before marking a rule `VERIFIED`.
   - Never uses substring heuristics (e.g., `source.includes("Alper")`) to grant `VERIFIED` authority.
4. **Honest Knowledge Health & Multi-Class Conflict Detection**:
   - Computes knowledge health from actual populated artifacts, returning `NOT_INITIALIZED` (`0%`) when uninitialized or `INSUFFICIENT_DATA` (`0%`) when empty (never a hardcoded `90%` baseline).
   - Detects conflicts across 5 classes: ADR vs DB/Auth/Code, Invariant vs Verification/Config, Requirement vs Implementation, Business Rule vs Missing Tests, and Living Docs vs Structured JSON.

## Associated MCP Tools
- `initialize_project_intelligence`: Bootstraps project intelligence from real repository artifacts.
- `load_project_intelligence`: Reads durable project intelligence state.
- `build_project_architecture_graph`: Constructs repository-grounded dependency graph with completeness metadata.
- `create_project_snapshot`: Captures truthful structural fingerprints (`NOT_VERIFIED` when absent).
- `detect_project_drift`: Compares snapshots to identify breaking or review-required drift.
- `record_project_decision`: Records ADRs with explicit authority source and superseding links.
- `record_business_rule`: Records business rules with structured provenance and evidence verification.
- `detect_knowledge_conflicts`: Audits 5 classes of knowledge vs implementation/doc conflicts.
- `evaluate_project_knowledge_health`: Computes truthful knowledge health without fake baselines.
