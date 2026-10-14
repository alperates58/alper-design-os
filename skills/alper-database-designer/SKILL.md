---
name: alper-database-designer
description: Designs relational schema blueprints, field-level data classifications (PUBLIC to SENSITIVE), indexing strategies, and executable SQL migrations.
---

# Alper Database Designer Skill

Designs relational schema blueprints with data sensitivity classifications, relational integrity constraints, and executable SQL migrations.

## Pipeline Position
`ARCHITECTURE -> DATA MODEL -> DATABASE BLUEPRINT -> MIGRATIONS & SEED DATA`

## Core Responsibilities
1. **Relational Schema Modeling**:
   - Model normalized entities with primary keys, foreign key relationships, and cascade behaviors.
   - Define indexes covering foreign keys, lookup fields, and unique constraints.
2. **Data Sensitivity & Security**:
   - Classify every field: `PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, or `SENSITIVE`.
   - Mandate masking or hash/salt handling on `SENSITIVE` attributes (passwords, tokens, PII).
3. **Database Engine Targeting**:
   - Support PostgreSQL, SQL Server, MySQL, and SQLite dialect specifications.
   - Generate executable standard DDL migrations (`001_initial_schema.sql`).
4. **Seed & Invariant Specifications**:
   - Specify deterministic seed records for initial deployment with truthful dummy labels (`[DEMO_DATA]`).

## Associated MCP Tools
- `create_database_blueprint`: Generates complete `DatabaseBlueprint` with tables, columns, indexes, and migrations.
- `analyze_database_schema`: Checks schema normalization and detects missing foreign keys or indexes.
