# Project Intelligence & Durable Memory (FAZ 1H)

## Overview

Traditional AI coding tools suffer from "stateless amnesia": every new task or conversation starts from scratch, re-scanning directories, re-discovering architecture, guessing invariants, and repeatedly asking the user for context already decided weeks earlier.

**Alper Design OS Project Intelligence** introduces a durable, version-controlled repository knowledge base located in:
```text
.alper-design-os/project/
├── manifest.json              # Project identity, schema version, active configuration
├── project-profile.json       # Domain classification, scale, criticality, and user profiles
├── architecture.json          # Architectural style, boundaries, and fitness assessment
├── constraints.json           # Mandatory operational, compliance, and runtime constraints
├── invariants.json            # Non-negotiable system rules (security, data integrity, contracts)
├── requirements/              # Requirement history and traceability linkages
├── decisions/                 # Architecture Decision Records (ADRs) with superseding history
├── knowledge/                 # Business rules, domain glossary, and task learnings
├── snapshots/                 # Lightweight structural and contract fingerprint snapshots
├── evidence/                  # Verification run artifacts and provenance evidence
├── lessons/                   # Concrete empirical learnings from past changes
└── indexes/                   # Fast relevance and token-lookup indexes
```

---

## Core Principles

1. **Repository-Local & Version-Controlled:**
   All project intelligence is stored alongside the codebase in standard, human-readable JSON and Markdown files. It commits to Git, branches, merges, and tracks code changes naturally.
2. **Zero Secret Storage:**
   All passwords, private keys, API secrets, bearer tokens, connection strings, and PII are detected via regex heuristics and replaced with environment references (`[REDACTED: credential supplied via environment configuration]`).
3. **No Machine-Specific Paths:**
   All paths within project intelligence are relative to the repository root. Re-cloning on another computer (or changing working directory paths) does not invalidate any records.
4. **Knowledge Authority Hierarchy:**
   When documents and implementations disagree, the system resolves conflicts according to strict authority ranks:
   1. `CURRENT_CODE`
   2. `VERIFIED_RUNTIME_EVIDENCE`
   3. `APPROVED_USER_DECISION`
   4. `ACCEPTED_ADR`
   5. `APPROVED_REQUIREMENT`
   6. `GENERATED_DOCUMENTATION`
   7. `HEURISTIC_INFERENCE`
   Disagreements trigger a formal `KnowledgeConflict` rather than silent overwriting.

---

## MCP Tools in FAZ 1H

Tools 111 through 124 provide full typed lifecycle access:

| MCP Tool | Description |
| :--- | :--- |
| `initialize_project_intelligence` | Scaffolds directory layout, stable identity, baseline invariants, and initial `T0` snapshot. |
| `load_project_intelligence` | Loads concise executive briefing, active profile, constraints, open risks, and knowledge health. |
| `record_project_decision` | Records an ADR or supersedes an existing ADR with bi-directional linkage. |
| `record_business_rule` | Records domain rules; flags unverified rules if inferred by LLM without authority. |
| `record_project_invariant` | Registers system invariants across security, data integrity, and API contract scopes. |
| `build_project_architecture_graph` | Constructs typed architecture graph from real code artifacts. |
| `create_project_snapshot` | Captures fingerprint hashes of architecture, routes, APIs, and database schemas. |
| `detect_project_drift` | Compares snapshots to identify expected, review-required, or breaking changes. |
| `analyze_change_impact` | Computes blast radius and risk assessment for proposed modifications. |
| `build_task_context` | Constructs token-efficient, highly relevant task context with explicit rationale. |
| `detect_knowledge_conflicts` | Flags divergence between accepted ADRs and actual codebase configuration. |
| `record_lesson_learned` | Captures practical operational lessons with verifiable evidence. |
| `propose_improvement_candidate` | Submits improvement proposals requiring governance approval before policy changes. |
| `evaluate_project_knowledge_health` | Audits knowledge coverage, freshness, conflicts, and verification debt. |
