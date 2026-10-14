---
name: alper-sql-performance
description: Diagnoses N+1 query loops, missing foreign key indexes, and enforces keyset pagination over offset. Use when diagnosing a slow sql query or investigating high database cpu / disk io utilization. Do not use for designing new tables from scratch for a greenfield app (use alper-database-designer).
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
  - alper-migration-safety
---

# Alper SQL Performance Skill

## PURPOSE
Diagnoses slow database queries through execution plan analysis, evaluating actual vs estimated rows, index selectivity, SARGability, join strategies, buffer cache hits, and ORM N+1 query loops.

## USE WHEN
- Diagnosing a slow SQL query or investigating high database CPU / disk IO utilization.
- Evaluating query plans (EXPLAIN ANALYZE) for sequential scans, nested loops, or hash spills.
- Choosing between offset pagination and keyset pagination based on workload characteristics.

## DO NOT USE WHEN
- Designing new tables from scratch for a greenfield app (use alper-database-designer).
- Conducting accessibility audits on frontend forms (use alper-accessibility-testing).
- Running external penetration testing (use alper-security-audit).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## DATABASE PERFORMANCE REASONING ENGINE
- **Query Plan Inspection**: Analyze `EXPLAIN (ANALYZE, BUFFERS)` output to identify sequential scans, nested loop spills, and high buffer reads.
- **Cardinatity & Selectivity**: Evaluate actual rows vs planner estimated rows. Large discrepancies indicate stale table statistics requiring `ANALYZE`.
- **SARGability**: Ensure search arguments are indexable. Prohibit wrapping indexed columns in functions (e.g. `WHERE UPPER(email) = ...` prevents B-tree index lookup unless functional index exists).
- **Index Write Cost Consideration**: Never recommend indexes without evaluating table write frequency; every B-tree index adds IO overhead to `INSERT` and `UPDATE` operations.
- **Pagination Strategy**:
  - **Keyset Pagination**: Optimal for append-only streaming feeds (`WHERE id > :last_id LIMIT 50`).
  - **Offset Pagination**: Required when random page jumping is explicitly required by UX.
  - Do NOT claim keyset is universally superior; document workload trade-offs.
- **N+1 ORM Diagnosis**: Identify loops issuing separate SELECT queries per parent record (e.g. Eloquent lazy loading, EF Core unincluded navigation properties); recommend eager loading (`with()`, `Include()`).

## REQUIRED CONTEXT
- Target database engine (PostgreSQL, MySQL, SQL Server, SQLite).
- Query text, table schemas, foreign key definitions, and active indexes.
- Execution plan output (EXPLAIN ANALYZE) or DDL migration files.

## PROJECT INTELLIGENCE LOADING
**Status: NOT_REQUIRED**
Operates as a self-contained, stateless capability. Does not require loading repository project intelligence snapshots to perform its core diagnosis or transformation.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Inspect slow query text and execution plan (EXPLAIN ANALYZE BUFFERS).
2. Identify bottlenecks: Seq Scans on large tables, non-SARGable WHERE predicates, N+1 ORM patterns.
3. Evaluate index recommendations considering write overhead on table.
4. Assess pagination trade-offs (keyset for streaming vs offset for random access).
5. Require measured execution timing evidence before claiming improvement.

## DECISION RULES
- No Assumption Rule: Keyset pagination is NOT universally superior; offset is required when random page jumps are requested.
- Write Overhead Rule: Never recommend indexes without considering INSERT/UPDATE write amplification.
- Measured Evidence Invariant: Never claim query optimization without before/after execution timing.

## MCP TOOL STRATEGY
- `analyze_database_schema`: Canonical handler for analyze database schema. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Database execution plans (EXPLAIN ANALYZE), index cardinality statistics, and engine documentation (PostgreSQL, MySQL, SQL Server).
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review before adding indexes to write-heavy tables (balancing read vs write overhead).

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.
- Unsafe table locks or non-reversible destructive schema migrations detected.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `RUNTIME_CHECK`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.
- Expected Artifact Evidence: `explain-analyze-buffers-json`, `query-execution-plan`, `index-hit-ratio-log`.

## OUTPUT CONTRACT
- QueryPerformanceDiagnosis, IndexRecommendationReport, and OptimizedQueryPlan.

## HANDOFF / RELATED SKILLS
- `alper-database-designer`: Downstream or sibling capability for DATA_ENGINEERING operations.
- `alper-migration-safety`: Downstream or sibling capability for DATA_ENGINEERING operations.
