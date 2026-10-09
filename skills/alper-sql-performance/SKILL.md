---
name: alper-sql-performance
description: Diagnoses N+1 query loops, missing foreign key indexes, and enforces keyset pagination over unbounded offsets.
---

# Alper SQL Performance Skill

Optimizes query performance and eliminates database bottlenecks.

## Heuristics
- Flag loop queries fetching single records by ID (N+1 hazard).
- Recommend missing composite indexes on frequent WHERE/ORDER BY clauses.
- Replace `OFFSET 100000` with Keyset pagination (`WHERE id > ?`).
