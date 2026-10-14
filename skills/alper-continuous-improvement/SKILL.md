---
name: alper-continuous-improvement
description: Captures empirical lessons learned, proposes governance-gated improvement candidates, and enforces strict cross-project knowledge isolation.
---

# Alper Continuous Improvement Skill

Governs continuous learning from project outcomes, error resolutions, and operational drills. Ensures empirical lessons are recorded, improvements require explicit governance sign-off, and local findings are never accidentally propagated into global policies.

## Core Responsibilities

1. **Empirical Lessons Learned**:
   - Records concrete problem, attempt, result, and verified evidence (`LessonLearnedRecord`).
2. **Governance-Gated Improvement Candidates**:
   - Proposes structured improvements with expected benefit, confidence, and risk assessment (`ImprovementCandidate`).
   - Requires explicit human/governance approval before applying any policy change.
3. **Cross-Project Isolation (Anti-Accidental Global Learning)**:
   - Prohibits local project experiences (e.g. "Bootstrap caused overflow in project X") from altering global Design OS policies without formal promotion.
   - Enforces `evaluateReusablePattern` gate: generalizable, non-sensitive, evidence-backed, and governance-approved.

## Associated MCP Tools
- `record_lesson_learned`: Documents practical findings and operational lessons with evidence.
- `propose_improvement_candidate`: Submits improvement proposals requiring governance approval.
