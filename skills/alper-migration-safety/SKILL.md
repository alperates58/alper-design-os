---
name: alper-migration-safety
description: Classifies DDL migration risk (SAFE/REVIEW/DANGEROUS) and enforces expand/contract zero-downtime evolution. Use when reviewing database migration scripts before staging or production execution. Do not use for designing new greenfield schemas from scratch (use alper-database-designer).
status: ACTIVE
capabilityFamily: DATA_ENGINEERING
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - analyze_database_schema
relatedSkills:
  - alper-database-designer
  - alper-sql-performance
  - alper-git-safety
---

# Alper Migration Safety Skill

## PURPOSE
Inspects proposed database migration scripts (SQL, Flyway, Liquibase, Phinx, EF Core), classifying DDL operations into SAFE, REVIEW, or DANGEROUS, and enforcing zero-downtime expand/contract schema evolution.

## USE WHEN
- Reviewing database migration scripts before staging or production execution.
- Detecting table-locking operations (e.g. adding NOT NULL column without default in large tables).
- Designing expand/contract zero-downtime migration sequences for high-traffic databases.

## DO NOT USE WHEN
- Designing new greenfield schemas from scratch (use alper-database-designer).
- Tuning slow SELECT queries (use alper-sql-performance).
- Styling frontend UI components (use alper-design-language).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Target database engine (PostgreSQL, MySQL, SQL Server, SQLite).
- Query text, table schemas, foreign key definitions, and active indexes.
- Execution plan output (EXPLAIN ANALYZE) or DDL migration files.

## PROJECT INTELLIGENCE LOADING
**Status: REQUIRED**
This skill strictly requires reading durable project memory from `.alper-design-os/project/` (manifest, architecture graph, ADRs, behavioral contracts) before planning or executing actions. Missing memory triggers explicit initialization or drift detection.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Parse migration DDL statements.
2. Classify statements: SAFE (additive, non-blocking), REVIEW (index creation), DANGEROUS (table rewrite, column drop).
3. Verify backwards compatibility with running application code.
4. Formulate rollback migration script.
5. Emit MigrationRiskAssessment.

## DECISION RULES
- Zero Data Loss Rule: Dropping columns or tables without prior deprecation phase is strictly DANGEROUS.
- Adding columns to large tables must specify defaults or remain NULL to prevent exclusive lockouts.

## MCP TOOL STRATEGY
- `analyze_database_schema`: Canonical handler for analyze database schema. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Zero-downtime database deployment patterns (Expand/Contract pattern) and engine-specific DDL locks.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Mandatory operator / DBA authorization before running DANGEROUS or irreversible DDL migrations.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `DATABASE_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- MigrationRiskAssessment (SAFE, REVIEW, DANGEROUS) and RollbackMigrationPlan.

## HANDOFF / RELATED SKILLS
- `alper-database-designer`: Downstream or sibling capability for DATA_ENGINEERING operations.
- `alper-sql-performance`: Downstream or sibling capability for DATA_ENGINEERING operations.
- `alper-git-safety`: Downstream or sibling capability for GOVERNANCE operations.
