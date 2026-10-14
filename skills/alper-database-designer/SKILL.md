---
name: alper-database-designer
description: Grounded business entity derivation, schema normalization, relationships, and ACID data integrity. Use when designing relational database schemas (tables, columns, types, constraints, relations). Do not use for diagnosing query execution plans or slow query bottlenecks (use alper-sql-performance).
status: ACTIVE
capabilityFamily: DATA_ENGINEERING
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools:
  - analyze_database_schema
  - create_database_blueprint
relatedSkills:
  - alper-migration-safety
  - alper-sql-performance
  - alper-api-designer
---

# Alper Database Designer Skill

## PURPOSE
Derives grounded relational database blueprints, enforcing 3NF normalization, foreign key integrity, indexed lookups, and ACID transactional boundaries without hallucinating dummy entities.

## USE WHEN
- Designing relational database schemas (tables, columns, types, constraints, relations).
- Deriving database blueprints from verified product profiles and business rules.
- Normalizing ungrounded or denormalized data models into third normal form (3NF).

## DO NOT USE WHEN
- Diagnosing query execution plans or slow query bottlenecks (use alper-sql-performance).
- Evaluating DDL migration risk on production databases (use alper-migration-safety).
- Designing frontend UI page layouts (use alper-ui-blueprint).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Target database engine (PostgreSQL, MySQL, SQL Server, SQLite).
- Query text, table schemas, foreign key definitions, and active indexes.
- Execution plan output (EXPLAIN ANALYZE) or DDL migration files.

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: CLARIFY_AMBIGUITY**
If input requirements are incomplete, contradictory, or underspecified, formulate 3-5 prioritized clarifying questions for the operator. Derived criteria must remain in `DEFINED / NOT_VERIFIED` state until clarified.

## WORKFLOW
1. Ingest verified domain entities from product profile.
2. Define table schemas with appropriate scalar types and nullability constraints.
3. Establish explicit 1:1, 1:N, and N:M relationships with foreign keys.
4. Specify onDelete and onUpdate referential actions.
5. Output DatabaseBlueprint.

## DECISION RULES
- Anti-Hallucination Rule: Prohibit generating dummy tables from verb words ("manages", "reviews") or generic items.
- Every foreign key must define explicit referential integrity actions (RESTRICT, CASCADE, SET NULL).

## MCP TOOL STRATEGY
- `analyze_database_schema`: Canonical handler for analyze database schema. Always pass required schema arguments; handle return states deterministically.
- `create_database_blueprint`: Canonical handler for create database blueprint. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Relational database theory (3NF normalization), ACID transaction standards, and PostgreSQL/MySQL docs.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- DBA / operator review of relational schema, primary key types, and foreign key onDelete policies.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` or `BLOCKED_BY_AMBIGUITY`.
- Tool execution reports critical validation or gate failure.
- Unsafe table locks or non-reversible destructive schema migrations detected.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.
- Expected Artifact Evidence: `database-query-plan`, `ddl-schema-ast`, `foreign-key-graph`.

## OUTPUT CONTRACT
- DatabaseBlueprint containing table schemas, relations, and constraint definitions.

## HANDOFF / RELATED SKILLS
- `alper-migration-safety`: Downstream or sibling capability for DATA_ENGINEERING operations.
- `alper-sql-performance`: Downstream or sibling capability for DATA_ENGINEERING operations.
- `alper-api-designer`: Downstream or sibling capability for API_ENGINEERING operations.
