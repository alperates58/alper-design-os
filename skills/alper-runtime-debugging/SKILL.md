---
name: alper-runtime-debugging
description: Inspects runtime console errors, uncaught exceptions, network failures (4xx/5xx/CORS), and performance traces.
---

# Alper Runtime Debugging Skill

Diagnoses runtime errors and network issues using Chrome DevTools MCP.

## Inspection Checklist
- Capture all console `error` and `exception` events.
- Audit failed HTTP requests (status 400+, 500+, or aborted CORS requests).
- Inspect source-mapped stack traces to pinpoint root cause.
