---
name: alper-project-intelligence
description: Initializes, loads, and manages durable version-controlled project memory, architecture graphs, snapshots, and knowledge health in .alper-design-os/project.
---

# Alper Project Intelligence Skill

Provides durable, version-controlled project knowledge that persists across tasks, sessions, and agents. Eliminates repetitive codebase rediscovery by maintaining authoritative architecture graphs, invariants, business rules, and snapshot histories directly in the repository without storing secrets.

## Core Responsibilities

1. **Project Directory Management (`.alper-design-os/project/`)**:
   - Manages canonical project root containing `manifest.json`, `project-profile.json`, `architecture.json`, `constraints.json`, and `invariants.json`.
   - Never uses machine-specific absolute paths.
2. **Stable Project Identity**:
   - Maintains immutable `projectId` and `repositoryIdentity` surviving directory renames and branch checkouts.
3. **Secret Redaction**:
   - Strictly scans and redacts credentials, private keys, API secrets, and tokens, replacing them with verifiable environment references.
4. **Architecture & Snapshot Fingerprinting**:
   - Builds real `ProjectArchitectureGraph` from code facts.
   - Creates compact fingerprint snapshots (`ProjectSnapshot`) and detects drift (`detect_project_drift`).
5. **Knowledge Health**:
   - Monitors knowledge coverage, freshness distribution, conflicts, and verification debt.

## Associated MCP Tools
- `initialize_project_intelligence`: Bootstraps project intelligence tree for NEW, EXISTING, REPAIR, or MODERNIZE modes.
- `load_project_intelligence`: Reads durable project intelligence and returns structured brief, architecture, and constraints.
- `build_project_architecture_graph`: Constructs typed dependency graph from real codebase artifacts.
- `create_project_snapshot`: Captures structural and behavioral fingerprints.
- `detect_project_drift`: Compares snapshots to identify expected, review-required, or breaking changes.
- `evaluate_project_knowledge_health`: Audits knowledge coverage, freshness, and orphan records.
