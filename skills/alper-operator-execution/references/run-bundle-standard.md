# Corporate Operator Execution & Manual Run Bundle Standard

Standard for air-gapped or corporate developer environments where automated execution is restricted:

## RUN.ps1 Standard
- Self-contained PowerShell script emitted into project root or `.alper-design-os/bundles/`.
- Checks prerequisites (Node, dotnet, PHP, Composer, Docker).
- Executes local build, linter, and unit test suites.
- Emits structured `run-evidence.json` containing exit codes, stdout, stderr, and timestamps.

## Evidence Verification
- Use `verify_manual_run_evidence` to parse `run-evidence.json`.
- Normalize evidence into the 13 supported evidence kinds.
