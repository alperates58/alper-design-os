---
name: alper-existing-project-analysis
description: Analyzes existing software projects, extracting stack profile, architecture, legacy debt heuristics, and critical flows before modernization.
---

# Alper Existing Project Analysis Skill

Guides the deep inspection and holistic profiling of an existing codebase prior to proposing any modernization plan.

## Pipeline Position
`EXISTING PROJECT -> UNDERSTAND -> BASELINE`

## Core Responsibilities
1. **Stack & Tooling Discovery**:
   - Detect primary language, frameworks, package managers, and template engines (e.g., React, Blade, Razor, Express, PHP, ASP.NET).
   - Identify existing styling systems (Tailwind, Bootstrap, SCSS, CSS Custom Properties).
2. **Architecture & Contract Identification**:
   - Classify architectural style (Monolith, Modular Monolith, Layered, SPA/API).
   - Map routing models (file-based vs code-configured), API surfaces, and data access models (ORM vs direct SQL).
3. **Debt Profiling (Heuristic AI Stamped)**:
   - Identify technical, visual, UX, security, and performance debts.
   - All AI evaluations must be stamped explicitly with `isHeuristic: true` and `scoreType: 'HEURISTIC'`.
4. **Critical Flow Identification**:
   - Discover authentication flows, session mechanisms, CSRF protection, and permission gates.
   - Map critical business flows and database invariants that must never be broken.

## Associated MCP Tools
- `profile_existing_project`: Generates typed `ExistingProjectProfile`.
- `detect_stack`: Detects languages, package managers, and frameworks.
- `audit_existing_ui`: Calculates UI health and debt metrics.
