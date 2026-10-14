# Alper Design OS — v1.0 MCP Security Audit & Risk Classification

This document provides the security audit and risk tier classification for all **124 canonical MCP tools** in `packages/mcp-server`.

---

## 1. Risk Tier Taxonomy

| Risk Tier | Definition | Permissions Required | Typical Usage |
|---|---|---|---|
| **READ_ONLY** | Strictly read-only; queries schemas, searches registries, inspects patterns, analyzes ASTs. No file system mutations or side effects. | None (Universal) | Code audits, queries, recommendations, discovery |
| **LOCAL_MUTATION** | Creates or mutates ephemeral plans, blueprints, journals, or staging objects in memory or temporary execution contexts. Does not alter tracked project code. | Workspace Read | Planning, blueprinting, evidence collation |
| **REPOSITORY_MUTATION** | Writes project code, creates directories, updates project intelligence stores, or modifies tracked workspace assets. | Explicit Write / Operator Approval | Greenfield scaffold, intelligence store init |
| **EXTERNAL_SIDE_EFFECT** | Triggers outbound network calls (source sync), launches external headless browser sessions, or queries system diagnostics. | Network / Process Launch | Browser validation, source sync, operator doctor |
| **DESTRUCTIVE_OR_HIGH_RISK** | Executes system-level security scans or acts as the authoritative gatekeeper for software release certification. Can halt or certify production builds. | Admin / Elevated Approval | Release gate certification, active vulnerability scanning |

---

## 2. Complete Classification Matrix (124 Canonical Tools)

### A. Core Discovery & Product Understanding (13 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `analyze_project` | READ_ONLY | Project files, path | None | File read | Read |
| `detect_stack` | READ_ONLY | Workspace path, file list | None | File read | Read |
| `understand_product` | READ_ONLY | Prompt, industry, goals | None | In-memory inference | Read |
| `research_domain` | READ_ONLY | Domain keywords, compliance | None | In-memory lookup | Read |
| `recommend_ux_patterns` | READ_ONLY | Product profile, workflow | None | In-memory pattern match | Read |
| `search_design_patterns` | READ_ONLY | Query, category | None | Registry index search | Read |
| `search_components` | READ_ONLY | Category, framework | None | Registry index search | Read |
| `get_design_tokens` | READ_ONLY | Brand name, theme | None | In-memory token compilation | Read |
| `create_design_plan` | LOCAL_MUTATION | Scope, features, stack | Memory design plan object | None | Read |
| `audit_existing_ui` | READ_ONLY | HTML/CSS files, AST | None | AST parsing | Read |
| `audit_accessibility` | READ_ONLY | Markup strings, WCAG target | None | WCAG rule check | Read |
| `audit_responsive` | READ_ONLY | CSS/DOM breakpoints | None | Rule evaluation | Read |
| `recommend_modernization`| READ_ONLY | Legacy codebase scan | None | Migration pattern inference | Read |

### B. Source Intelligence & External Registries (15 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `search_public_apis` | READ_ONLY | Query, domain | None | Static index query | Read |
| `search_mcp_servers` | READ_ONLY | Category, capabilities | None | Static registry lookup | Read |
| `discover_sources` | READ_ONLY | Stack, tags | None | Search engine index | Read |
| `search_sources` | READ_ONLY | Query, limit | None | Index query | Read |
| `rank_sources` | READ_ONLY | Source list, criteria | None | Scoring algorithm | Read |
| `inspect_source` | READ_ONLY | Source ID, package | None | Metadata inspection | Read |
| `recommend_sources_for_product` | READ_ONLY | Product requirements | None | Recommendation engine | Read |
| `recommend_sources_for_stack` | READ_ONLY | Target stack | None | Recommendation engine | Read |
| `check_source_license` | READ_ONLY | SPDX identifier, policy | None | SPDX license audit | Read |
| `discover_design_sources`| READ_ONLY | Domain tags, category | None | Design index query | Read |
| `search_design_sources` | READ_ONLY | Query, filter | None | Index query | Read |
| `inspect_design_source` | READ_ONLY | Source ID | None | Metadata view | Read |
| `sync_design_sources` | EXTERNAL_SIDE_EFFECT | Target source IDs | Local cache write | Outbound HTTPS network call | Network Auth |
| `recommend_design_sources`| READ_ONLY | UX profile | None | Scoring algorithm | Read |
| `explain_source_recommendation` | READ_ONLY | Recommendation ID | None | Explanation synthesis | Read |

### C. Pattern Graph, Specialized Registries & AI Skills (11 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `search_patterns` | READ_ONLY | Query, tags | None | Index lookup | Read |
| `inspect_pattern` | READ_ONLY | Pattern ID | None | Detail view | Read |
| `search_registries` | READ_ONLY | Registry query | None | Registry lookup | Read |
| `search_registry_components` | READ_ONLY | Component name, registry | None | Component lookup | Read |
| `inspect_registry_component` | READ_ONLY | Component ID | None | Component spec view | Read |
| `discover_ai_skills` | READ_ONLY | Skill capabilities | None | Skill index scan | Read |
| `inspect_ai_skill` | READ_ONLY | Skill identifier | None | Skill manifest read | Read |
| `recommend_icon_system` | READ_ONLY | UI requirements | None | Recommendation matrix | Read |
| `recommend_chart_library`| READ_ONLY | Data density, framework | None | Recommendation matrix | Read |
| `recommend_data_grid` | READ_ONLY | Row volume, features | None | Recommendation matrix | Read |
| `inspect_alper_registry` | READ_ONLY | Registry section | None | Registry manifest read | Read |

### D. Engineering Guardrails, Security & Gates (6 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `generate_engineering_policy` | LOCAL_MUTATION | Stack, security tier | Policy AST in memory | None | Read |
| `evaluate_release_gates`| DESTRUCTIVE_OR_HIGH_RISK | Evidence bundle, gate criteria | None (Authoritative certification decision) | Halts or permits distribution | Gatekeeper / User Auth |
| `generate_threat_model` | READ_ONLY | Architecture diagram, inputs | None | Threat matrix synthesis | Read |
| `detect_tool_capabilities`| READ_ONLY | Tool names, environment | None | Tool inspection | Read |
| `run_safe_security_scan`| DESTRUCTIVE_OR_HIGH_RISK | Target files, scan profile | None (Read-only execution) | Subprocess execution of security tools | Elevated Exec Auth |
| `evaluate_content_truth_gate` | LOCAL_MUTATION | Evidence vs claims | Gate decision object | None | Read |

### E. QA, User Journeys & Visual Verification (10 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `generate_user_journeys`| LOCAL_MUTATION | Personas, flows | Journey specification object | None | Read |
| `generate_playwright_test` | LOCAL_MUTATION | Flow, page blueprint | Test code string | None | Read |
| `generate_qa_report` | READ_ONLY | Test run outputs | None | Report aggregation | Read |
| `generate_test_pyramid` | READ_ONLY | Test inventory | None | Pyramid distribution calculation | Read |
| `manage_human_visual_approval` | LOCAL_MUTATION | Visual diff run ID, approval state | Human review token recorded | None | Human Reviewer Auth |
| `audit_track_trace_telemetry` | READ_ONLY | Screenshot / trace telemetry | None | Telemetry validation | Read |
| `create_manual_run_bundle`| LOCAL_MUTATION | Steps, targets | Manual run checklist bundle | None | Read |
| `verify_manual_run_evidence`| LOCAL_MUTATION | Evidence artifacts | Verification verdict object | None | Read |
| `resolve_browser_runtime`| EXTERNAL_SIDE_EFFECT | Browser type, headless | None | Launches browser process | Process Launch Auth |
| `run_operator_doctor` | EXTERNAL_SIDE_EFFECT | Probe list | Diagnostic report | Probes OS binaries and environment | Process Exec Auth |

### F. Software Architecture, Database & Contracts (7 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `analyze_architecture` | READ_ONLY | Codebase AST, modules | None | AST graph traversal | Read |
| `generate_adr` | LOCAL_MUTATION | Decision context, options | Markdown ADR object | None | Read |
| `analyze_database_schema`| READ_ONLY | DDL / connection string | None | Read-only catalog query | Read |
| `evaluate_api_compatibility` | READ_ONLY | OpenAPI v2/v3 schemas | None | Diff calculation | Read |
| `classify_code_paths` | READ_ONLY | File paths, glob | None | Path matching | Read |
| `audit_data_provenance` | READ_ONLY | Data flow specs | None | Trace analysis | Read |
| `audit_information_relevance` | READ_ONLY | Context snippets, goal | None | Relevance scoring | Read |

### G. Orchestration, Action Planning & Checkpoints (11 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `create_action_plan` | LOCAL_MUTATION | Goal, steps, risk | Action plan object | None | Read |
| `evaluate_scope` | READ_ONLY | Plan steps, affected files | None | Boundary check | Read |
| `evaluate_change_risk` | READ_ONLY | Git diff, touched paths | None | Risk score calculation | Read |
| `create_checkpoint_plan`| LOCAL_MUTATION | Milestone, rollback strategy | Checkpoint plan object | None | Read |
| `create_verification_plan`| LOCAL_MUTATION | Test specifications | Verification plan object | None | Read |
| `normalize_verification_evidence`| LOCAL_MUTATION | Raw command output | Canonical Evidence object | None | Read |
| `review_change` | LOCAL_MUTATION | Diff, policy | Review verdict object | None | Read |
| `detect_regression` | READ_ONLY | Test comparisons | None | Regression analysis | Read |
| `create_environment_profile`| READ_ONLY | Host environment info | None | Environment snapshot | Read |
| `route_context` | READ_ONLY | User prompt, tokens | None | Routing calculation | Read |
| `route_tool` | READ_ONLY | Subagent task, available tools | None | Tool match calculation | Read |

### H. Blueprinting, Rendering & UI Recipes (10 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `create_execution_journal`| LOCAL_MUTATION | Step log, metrics | Execution journal record | None | Read |
| `evaluate_completion_claim`| LOCAL_MUTATION | Artifact claims vs evidence | Completion assessment object | None | Read |
| `create_design_intent` | LOCAL_MUTATION | Vision, aesthetic style | Design intent object | None | Read |
| `create_page_blueprint` | LOCAL_MUTATION | Layout, components, states | Page blueprint DSL object | None | Read |
| `create_component_blueprint`| LOCAL_MUTATION | Props, slots, variants | Component blueprint DSL object | None | Read |
| `create_app_shell_blueprint`| LOCAL_MUTATION | Nav, header, footer | App shell blueprint DSL object | None | Read |
| `render_blueprint` | LOCAL_MUTATION | Blueprint DSL, adapter | Rendered source code string | None | Read |
| `render_component` | LOCAL_MUTATION | Component DSL, adapter | Rendered component code | None | Read |
| `create_ui_recipe` | LOCAL_MUTATION | Pattern, tokens | UI recipe object | None | Read |
| `select_design_personality`| READ_ONLY | Product category, tone | None | Personality profile lookup | Read |

### I. Parity, Truthful UI & Authority (5 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `evaluate_design_antipatterns`| READ_ONLY | Code/CSS rules | None | AST pattern match | Read |
| `compare_renderer_parity`| READ_ONLY | Multi-adapter renders | None | AST structure comparison | Read |
| `evaluate_truthful_ui` | READ_ONLY | Component hierarchy | None | Rule audit | Read |
| `evaluate_page_intent` | READ_ONLY | Page elements, purpose | None | Semantic evaluation | Read |
| `classify_source_authority`| READ_ONLY | Source citation, link | None | Authority classification | Read |

### J. Modernization Lifecycle (9 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `profile_existing_project`| READ_ONLY | Project root, files | None | File inspection | Read |
| `create_behavioral_baseline`| READ_ONLY | Existing test suite | None | Test trace inspection | Read |
| `create_preservation_contract`| LOCAL_MUTATION | Invariants, behavior | Preservation contract object | None | Read |
| `classify_existing_elements`| READ_ONLY | Components, routes | None | Code categorization | Read |
| `create_modernization_intent`| LOCAL_MUTATION | Target stack, goals | Intent object | None | Read |
| `create_modernization_plan`| LOCAL_MUTATION | Phases, legacy maps | Modernization plan object | None | Read |
| `select_modernization_strategy`| READ_ONLY | Code quality, timeline | None | Strategy recommendation | Read |
| `create_modernization_stages`| LOCAL_MUTATION | Plan, dependencies | Staged roadmap object | None | Read |
| `evaluate_modernization_completion`| LOCAL_MUTATION | Target state vs actual | Completion score object | None | Read |

### K. Greenfield Lifecycle & Scaffolding (13 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `create_greenfield_project_profile`| LOCAL_MUTATION | Idea, target users | Profile object | None | Read |
| `derive_requirements` | READ_ONLY | Profile, prompt | None | NLP/heuristic analysis | Read |
| `create_requirement_traceability`| LOCAL_MUTATION | Requirements, features | Traceability matrix object | None | Read |
| `recommend_architecture`| READ_ONLY | Scale, requirements | None | Decision matrix | Read |
| `recommend_stack` | READ_ONLY | Team, performance, SEO | None | Decision matrix | Read |
| `create_database_blueprint`| LOCAL_MUTATION | Entities, relations | Database schema blueprint | None | Read |
| `create_api_blueprint` | LOCAL_MUTATION | Endpoints, models | OpenAPI / REST blueprint | None | Read |
| `create_auth_model` | LOCAL_MUTATION | Roles, permissions | Auth blueprint object | None | Read |
| `create_page_inventory` | LOCAL_MUTATION | User journeys, sitemap | Page inventory object | None | Read |
| `create_project_blueprint`| LOCAL_MUTATION | Unified blueprints | Master project blueprint | None | Read |
| `create_project_implementation_plan`| LOCAL_MUTATION | Blueprint, milestones | Implementation plan object | None | Read |
| `scaffold_new_project` | REPOSITORY_MUTATION | Blueprint, target dir | Writes directory & files | File system modification | Repository Write Auth |
| `evaluate_new_project_completion`| LOCAL_MUTATION | Generated code vs plan | Completion verdict object | None | Read |

### L. Project Intelligence & Durable Knowledge (12 Tools)
| Tool Name | Risk Tier | Input Summary | Mutations Performed | Side Effects | Authorization |
|---|---|---|---|---|---|
| `initialize_project_intelligence`| REPOSITORY_MUTATION | Project root | Creates `.agents/` store | File system write | Repository Write Auth |
| `load_project_intelligence`| READ_ONLY | Project root | None | Reads `.agents/` facts | Read |
| `record_project_decision`| LOCAL_MUTATION | Decision, rationale | Decision fact object | None | Read |
| `record_business_rule` | LOCAL_MUTATION | Rule, provenance | Business rule fact object | None | Read |
| `record_project_invariant`| LOCAL_MUTATION | Invariant statement | Invariant fact object | None | Read |
| `build_project_architecture_graph`| READ_ONLY | Project files | None | Dependency graph traversal | Read |
| `create_project_snapshot`| LOCAL_MUTATION | Current state | Snapshot record object | None | Read |
| `detect_project_drift` | READ_ONLY | Snapshot vs actual code | None | Drift report generation | Read |
| `analyze_change_impact` | READ_ONLY | Modified files, symbol | None | Impact graph calculation | Read |
| `build_task_context` | READ_ONLY | Goal, target files | None | Assembles context bundle | Read |
| `detect_knowledge_conflicts`| READ_ONLY | Fact store | None | Logic conflict audit | Read |
| `record_lesson_learned` | LOCAL_MUTATION | Experience, insight | Lesson fact object | None | Read |
| `propose_improvement_candidate`| LOCAL_MUTATION | Improvement proposal | Improvement proposal object | None | Read |
| `evaluate_project_knowledge_health`| READ_ONLY | Knowledge store | None | Health score calculation | Read |

---

## 3. Principle of Least Privilege & Restricted Modes

### Read-Only / Review Mode Configuration
When an agent or CI reviewer operates in **Read-Only / Review Mode**:
1. **Forbidden Tools**:
   - `scaffold_new_project` (Repository Write)
   - `initialize_project_intelligence` (Repository Write)
   - `sync_design_sources` (Outbound Network Call)
   - `resolve_browser_runtime` (Process Launch)
   - `run_safe_security_scan` (Subprocess Execution)
2. **Restricted Gatekeeper Tools**:
   - `evaluate_release_gates` can only report evaluation status; it cannot issue cryptographic bypass tokens without human interactive confirmation.

---

## 4. Dangerous Combination Chains & Mitigations

### Attack Chain 1: Malicious Code Injection via Greenfield Scaffold
- **Chain**:
  1. `create_greenfield_project_profile` (Inject malicious npm dependency in description)
  2. `recommend_stack`
  3. `scaffold_new_project` (Attempts to write `package.json` with arbitrary untrusted dependency)
  4. Execution of install script via doctor
- **Prevention**:
  - `truthful-ui-policy.ts` and `greenfield-engine.ts` reject unvetted package names. Greenfield generators only emit package names from the immutable whitelist (`packages/source-intelligence`).

### Attack Chain 2: False Gate Certification via Mocked Evidence
- **Chain**:
  1. Hostile workspace creates `tests/fake-results.json` containing `{"passed": true, "failures": 0}`.
  2. Agent calls `normalize_verification_evidence` pointing to fake file.
  3. Agent calls `evaluate_release_gates` claiming all test suites passed.
- **Prevention**:
  - `contract-engine.ts` requires evidence to originate from tracked command execution sessions with verified toolchain exit codes.
  - Textual claims or unverified JSON files cannot satisfy `UNIT_TEST` or `INTEGRATION_TEST` gates.
  - `NO_CLAIM_WITHOUT_EVIDENCE` policy causes `evaluate_release_gates` to reject ungrounded evidence.

### Attack Chain 3: Path Traversal Arbitrary File Overwrite
- **Chain**:
  1. Agent passes `targetDirectory = "../../../etc"` to `scaffold_new_project`.
- **Prevention**:
  - `greenfield-engine.ts` enforces `validateRelativePath` and path confinement within the project root directory. Paths resolving outside throw fatal exceptions before any I/O occurs.
