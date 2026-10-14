---
name: alper-architecture-planner
description: Recommends pragmatic architecture patterns with strict anti-overengineering guardrails, complexity budgets, and technology selection.
---

# Alper Architecture Planner Skill

Selects appropriate software architecture styles based on evidence, complexity budgets, and operational fitness, strictly preventing unwarranted distributed systems overhead.

## Pipeline Position
`REQUIREMENTS -> ARCHITECTURE RECOMMENDATION -> STACK SELECTION -> FITNESS ASSESSMENT`

## Core Responsibilities
1. **Anti-Overengineering Guardrails**:
   - Small-scale, internal, or departmental apps default to `MONOLITH` or `MODULAR_MONOLITH`.
   - Microservices architecture is strictly NOT the default and requires explicit enterprise scale justification.
   - Prohibit unwarranted technologies (Kafka, Kubernetes, event sourcing, distributed caching) for low-scale projects.
2. **Complexity Budget Enforcement**:
   - Calculate maximum acceptable complexity score (scale 1 to 10).
   - Reject proposals whose architectural complexity exceeds the budget.
3. **Fitness Assessment**:
   - Evaluate trade-offs across operational simplicity, time to deliver, maintainability, and cognitive load.
4. **Stack Recommendation**:
   - Map architecture to supported production stacks: `REACT_TYPESCRIPT`, `LARAVEL_BLADE`, `ASPNET_RAZOR`, `PLAIN_HTML_CSS_JS`.
   - Honor user constraints and operational preferences.

## Associated MCP Tools
- `recommend_architecture`: Emits complexity-budgeted `ArchitectureRecommendation`.
- `recommend_stack`: Selects optimal language, runtime, and framework.
- `generate_adr`: Generates Architecture Decision Records documenting rationale and rejected alternatives.
