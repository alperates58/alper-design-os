# Knowledge Architecture: AI Skills & Prompts Registry

Safety, verification, and governance standards for integrating open-source AI skills into Alper Design OS.

## Skill Auditing Requirements
Before any external AI skill or prompt is activated into a project workspace, it must undergo formal analysis:
1. **Source & License Verification**: Must originate from a verified upstream repository with a compatible open-source license.
2. **Security Risk Assessment**: Scanned for dangerous filesystem commands, unauthorized external network tunneling, obfuscated scripts, or guardrail bypass instructions.
3. **Conflicting Rules Detection**: Must not contradict Alper Design OS core tenets ("Understand before designing", "Analyze -> Plan -> Apply pipeline", "Mandatory WCAG 2.1 AA").
4. **Sandboxing Status**: Any skill with unresolved rule conflicts is quarantined into a sandboxed runbook until manual reconciliation is completed.
