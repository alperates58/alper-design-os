---
name: alper-project-continuation
description: Enables instant project onboarding and continuity for new agent sessions by reading durable intelligence, constraints, active risks, and recent decisions.
---

# Alper Project Continuation Skill

Enables any new AI coding session or agent to instantly understand the project's historical context, current state, active constraints, and architectural invariants without requiring repetitive user explanations or expensive re-indexing.

## Core Responsibilities

1. **Instant Session Briefing**:
   - Synthesizes compact executive briefing: Project Brief, Current Architecture, Current Phase, Active Constraints, Open Risks, and Recent Decisions.
2. **Context Efficiency**:
   - Avoids dumping full memory logs into LLM context; selects only relevant, authoritative knowledge for the task at hand.
3. **Verification Debt Visibility**:
   - Keeps track of unverified runtime or browser requirements so they are not silently forgotten across turns.
4. **Living Document Sync**:
   - Compares living documents (`PROJECT.md`, `ARCHITECTURE.md`, `STATUS.md`) against structured truth to detect and flag document drift.

## Associated MCP Tools
- `load_project_intelligence`: Retrieves concise project summary, active profile, and knowledge health.
- `build_task_context`: Extracts scoped, high-relevance context for specific user instructions.
