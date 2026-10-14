---
name: alper-greenfield-product-analysis
description: Analyzes raw product briefs, discovers target user archetypes, categorizes primary/secondary jobs-to-be-done, domain constraints, scale, and operational risk.
---

# Alper Greenfield Product Analysis Skill

Transforms vague or concise user briefs into structured, comprehensive `GreenfieldProjectProfile` models without hallucinating unrequested business complexity.

## Pipeline Position
`USER BRIEF -> PRODUCT UNDERSTANDING -> DOMAIN RESEARCH -> GREENFIELD PROFILE`

## Core Responsibilities
1. **Product Purpose & Scope Clarification**:
   - Dissect raw user briefs into product name, core purpose, and operational boundaries.
   - Categorize primary jobs-to-be-done (must-haves) and secondary jobs (supporting tasks).
2. **Domain & Environmental Context**:
   - Assess domain criticality (`LOW`, `MEDIUM`, `HIGH`, `MISSION_CRITICAL`).
   - Classify data sensitivity (`PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, `HIGHLY_SENSITIVE`).
   - Project realistic concurrency and throughput requirements.
3. **Operational & Constraint Profiling**:
   - Map device target priorities (`DESKTOP`, `TABLET`, `MOBILE`, `EMBEDDED`).
   - Identify offline needs, real-time sync needs, localization, and accessibility targets (WCAG 2.1 AA default).
   - Document explicit unknowns, working assumptions, and initial risk registers.

## Associated MCP Tools
- `create_greenfield_project_profile`: Generates validated `GreenfieldProjectProfile`.
- `understand_product`: Extracts product intent, target users, and key features.
- `research_domain`: Surfaces domain-specific ergonomics, regulatory concerns, and standards.
