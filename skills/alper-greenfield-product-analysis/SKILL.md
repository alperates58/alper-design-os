---
name: alper-greenfield-product-analysis
description: Analyzes raw product briefs, classifies request complexity, evaluates DiscoveryReadiness, and identifies grounded domain entities, jobs-to-be-done, and operational constraints.
---

# Alper Greenfield Product Analysis Skill

Transforms user briefs into structured, grounded `GreenfieldProjectProfile` models with explicit `DiscoveryReadiness` and `RequestComplexityClassification`, strictly prohibiting silent invention of business entities or requirements.

## Pipeline Position
`USER BRIEF -> COMPLEXITY CLASSIFICATION -> DISCOVERY READINESS GATE -> GREENFIELD PROFILE`

## Core Responsibilities
1. **Request Complexity & DiscoveryReadiness Gate**:
   - Classify request complexity (`CLEAR_BOUNDED_TASK`, `STANDARD_PRODUCT`, `AMBIGUOUS_PRODUCT`, `HIGH_COMPLEXITY_PRODUCT`, `INSUFFICIENT_CONTEXT`).
   - Evaluate `DiscoveryReadiness` (`READY`, `NEEDS_CLARIFICATION`, `BLOCKED_BY_AMBIGUITY`).
   - When `DiscoveryReadiness !== READY` (e.g., ambiguous one-liners such as `"Build me an APS"`), stop downstream blueprint/database/scaffold generation and surface at most 3–5 prioritized `clarifyingQuestions` ordered by architectural blast radius.
2. **Product Purpose & Grounded Entity Extraction**:
   - Dissect raw user briefs into product name, core purpose, and operational boundaries.
   - Extract grounded domain nouns (`explicitEntities`, `primaryJobs`) and never pluralize verbs (`"Manage orders" != "manages"`) or fall back to generic placeholders (`PrimaryEntity`, `items`, `records`) in production mode.
3. **Domain & Environmental Context**:
   - Assess domain criticality (`LOW`, `MEDIUM`, `HIGH`, `MISSION_CRITICAL`).
   - Classify data sensitivity (`PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, `HIGHLY_SENSITIVE`, `REGULATED_PII_PHI`).
   - Project realistic concurrency, scale, and deployment environment requirements.
4. **Operational & Constraint Profiling**:
   - Map device target priorities (`DESKTOP`, `TABLET`, `MOBILE`, `KIOSK_TERMINAL`, `EMBEDDED`).
   - Document `criticalUnknowns`, `assumptions`, `clarifyingQuestions`, and initial risk registers.

## Associated MCP Tools
- `create_greenfield_project_profile`: Generates validated `GreenfieldProjectProfile` with `discoveryReadiness` and `complexityClassification`.
- `understand_product`: Extracts product intent, target users, and key features.
- `research_domain`: Surfaces domain-specific ergonomics, standards, and `DomainIntelligenceV2` evidence.
