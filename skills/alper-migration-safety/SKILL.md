---
name: alper-migration-safety
description: Classifies DDL migration risk (SAFE/REVIEW/DANGEROUS) and enforces expand/contract schema evolution.
---

# Alper Migration Safety Skill

Prevents catastrophic downtime caused by unsafe database migrations.

## Safety Levels
- **SAFE**: Non-locking changes (e.g. adding nullable column, new table).
- **REVIEW_REQUIRED**: Changes that may acquire locks or require concurrent indexing.
- **DANGEROUS**: Destructive drops (`DROP TABLE`, `DROP COLUMN`) or locking column constraints.
