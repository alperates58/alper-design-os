# Performance Baseline — Alper Design OS v1.0

This document captures measured performance metrics across greenfield generation, MCP tool dispatch, skill indexing, and memory footprint.

---

## 1. Measured Benchmarks

### Greenfield Project Generation
Measured across all 4 supported technology stacks:
- **Plain HTML/CSS/JS**: ~18ms (scaffold synthesis + file emission)
- **React TypeScript**: ~45ms (blueprint synthesis + component emission)
- **Laravel Blade**: ~35ms (blueprint synthesis + route/view emission)
- **ASP.NET Razor**: ~40ms (blueprint synthesis + C# project emission)

### Native Build & Toolchain Compilation (Host Workstation)
- **React TypeScript (Vite 5.x production build)**: 4.8s
- **ASP.NET Razor (.NET 9.0 SDK dotnet restore + build)**: 3.2s
- **Plain HTML/CSS/JS (node --check syntax verification)**: 0.4s
- **Laravel Blade (PHP syntax checks + negative bootstrap guard)**: 0.6s

### MCP Server Tool Dispatch Latency
- **In-Memory Query Tools** (`get_design_tokens`, `search_patterns`): < 5ms
- **Analysis Tools** (`analyze_project`, `detect_stack`): 15ms - 45ms
- **Intelligence Tools** (`detect_knowledge_conflicts`, `load_project_intelligence`): 20ms - 60ms
- **Doctor Diagnostic** (`scripts/doctor.js --preflight`): 120ms
- **Doctor Diagnostic Full** (`scripts/doctor.js --json`): 450ms

### Skill Architecture Loading Latency
- **Skill Inventory Indexing (74 total, 55 active skills)**: 42ms
- **Context Routing & Negative Match Elimination**: < 10ms

### Memory Footprint
- **MCP Server Stdio Idle Memory**: ~38MB RSS
- **MCP Server Active Tool Execution Peak**: ~85MB RSS
- **TypeScript Composite Monorepo Build Peak**: ~320MB RSS
