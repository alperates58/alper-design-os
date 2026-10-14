# Continuous Improvement & Cross-Project Knowledge Isolation

## Purpose

Continuous improvement ensures that software engineering failures and optimizations inform future iterations without introducing "accidental global learning"—where a negative finding in one isolated project unfairly biases the AI's behavior across all other projects.

---

## Lessons Learned Registry (`LessonLearnedRecord`)

When an attempt fails or an unexpected performance bottleneck is identified, the agent records an empirical lesson:
- `problem`: Specific operational failure or degradation encountered.
- `attempt`: Initial solution attempted.
- `result`: Measured outcome (e.g. heap spike, timeout).
- `evidence`: Profiler trace, test failure log, or benchmark metric.
- `lesson`: Concrete, actionable remedy.
- `applicability`: Explicit domain or stack boundaries where the lesson applies.

---

## Improvement Proposals & Governance Gate

Proposed changes to shared architectural patterns or templates cannot be executed autonomously:
- An `ImprovementCandidate` is generated with `expectedBenefit`, `risk`, and `confidence`.
- The field `requiresGovernanceApproval: true` is strictly enforced.
- Only upon explicit human sign-off can an improvement be adopted into canonical blueprints.

---

## Cross-Project Isolation Gate (`evaluateReusablePattern`)

Local project findings remain strictly local unless they pass the 4-point promotion gate:

1. **Generalizable**: The pattern solves a recurring cross-domain problem rather than a hardware- or project-specific quirk.
2. **Non-Sensitive**: Zero confidential business logic, internal company names, or sensitive data included.
3. **Evidence-Backed**: Demonstrable benchmark improvement or automated verification evidence.
4. **Governance-Reviewed**: Explicit human review and approval for global Design OS policy promotion.
