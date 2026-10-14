# Alper Design OS — MCP Tools Reference

The Alper Design MCP server exposes **124 strongly typed tools** registered in a single canonical tool specification registry (`CANONICAL_TOOL_DEFINITIONS` / `canonicalToolRegistry` in `packages/mcp-server/src/tools/index.ts`).

## Canonical Single-Source Architecture (FAZ 1H.1)
- **Single Source of Truth**: Every tool is defined once as an `McpToolDefinition { name, description, inputSchema, parser, handler }`.
- **Unified Dispatch**: `ListToolsRequestSchema`, `CallToolRequestSchema`, `getToolDefinitions()`, `getRegisteredToolCount()`, and `dispatchCanonicalToolCall()` are driven directly by `canonicalToolRegistry`. There is no manual `switch (name)` statement that can drift.
- **No Silent Argument Loss**: Every declared input schema parameter influences handler behavior.

---

## Tool Catalog Summary (124 Tools)

### Core Analysis, Domain & Design System Tools (1–15)
1. `analyze_project`
2. `detect_stack`
3. `understand_product`
4. `research_domain` (wired to `DomainIntelligenceV2Engine`)
5. `recommend_ux_patterns` (supports `density` and `interactionStyle`)
6. `search_design_patterns`
7. `search_components`
8. `get_design_tokens` (supports `format` and `density`)
9. `create_design_plan`
10. `audit_existing_ui`
11. `audit_accessibility` (supports `targetLevel`)
12. `audit_responsive`
13. `recommend_modernization`
14. `search_public_apis`
15. `search_mcp_servers`

### Source Intelligence, Security, QA & Software Intelligence Tools (16–36)
16. `discover_sources`
17. `search_sources`
18. `rank_sources` (supports `requirePermissiveLicense`)
19. `inspect_source`
20. `recommend_sources_for_product`
21. `recommend_sources_for_stack`
22. `check_source_license`
23. `generate_engineering_policy` (supports `targetEnvironment`)
24. `evaluate_release_gates` (supports `profile` policy overrides and `criticalTestsFailed`)
25. `generate_threat_model`
26. `detect_tool_capabilities`
27. `run_safe_security_scan`
28. `generate_user_journeys`
29. `generate_playwright_test`
30. `generate_qa_report`
31. `generate_test_pyramid`
32. `analyze_architecture`
33. `generate_adr` (supports `number` and `consequences.neutral`)
34. `analyze_database_schema` (scans `projectPath` SQL/migrations when supplied)
35. `evaluate_api_compatibility`
36. `classify_code_paths`

### Agent Governance & Source Intelligence V2 Tools (37–65)
37. `create_action_plan`
38. `evaluate_scope`
39. `evaluate_change_risk`
40. `create_checkpoint_plan`
41. `create_verification_plan` (supports `isUI`, `isSecuritySensitive`, `riskLevel`)
42. `normalize_verification_evidence`
43. `review_change`
44. `detect_regression`
45. `create_environment_profile`
46. `route_context`
47. `route_tool`
48. `create_execution_journal`
49. `evaluate_completion_claim`
50. `discover_design_sources`
51. `search_design_sources`
52. `inspect_design_source`
53. `sync_design_sources` (supports `force`)
54. `recommend_design_sources`
55. `search_patterns` (supports `category` and `applicableDomain`)
56. `inspect_pattern`
57. `search_registries` (supports `framework` and `freeTierOnly`)
58. `search_registry_components`
59. `inspect_registry_component`
60. `discover_ai_skills`
61. `inspect_ai_skill`
62. `recommend_icon_system`
63. `recommend_chart_library`
64. `recommend_data_grid`
65. `explain_source_recommendation`

### Canonical UI Blueprints, Truthful UI & Operator Runtime Tools (66–88)
66. `create_design_intent`
67. `create_page_blueprint` (supports custom `id`, `title`, and `preset`)
68. `create_component_blueprint`
69. `create_app_shell_blueprint`
70. `render_blueprint` (resolves blueprint by `blueprintId`)
71. `render_component`
72. `create_ui_recipe`
73. `select_design_personality`
74. `evaluate_design_antipatterns`
75. `compare_renderer_parity`
76. `inspect_alper_registry`
77. `evaluate_truthful_ui`
78. `audit_data_provenance`
79. `evaluate_page_intent`
80. `audit_information_relevance`
81. `classify_source_authority`
82. `evaluate_content_truth_gate`
83. `manage_human_visual_approval`
84. `audit_track_trace_telemetry`
85. `create_manual_run_bundle`
86. `verify_manual_run_evidence`
87. `resolve_browser_runtime`
88. `run_operator_doctor`

### Legacy Modernization Engine Tools — FAZ 1F (89–97)
89. `profile_existing_project`
90. `create_behavioral_baseline`
91. `create_preservation_contract`
92. `classify_existing_elements`
93. `create_modernization_intent`
94. `create_modernization_plan`
95. `select_modernization_strategy`
96. `create_modernization_stages`
97. `evaluate_modernization_completion`

### Greenfield Project Generation Tools — FAZ 1G (98–110)
98. `create_greenfield_project_profile`
99. `derive_requirements`
100. `create_requirement_traceability`
101. `recommend_architecture`
102. `recommend_stack`
103. `create_database_blueprint`
104. `create_api_blueprint`
105. `create_auth_model`
106. `create_page_inventory`
107. `create_project_blueprint`
108. `create_project_implementation_plan`
109. `scaffold_new_project`
110. `evaluate_new_project_completion`

### Project Intelligence & Durable Memory Tools — FAZ 1H (111–124)
111. `initialize_project_intelligence`
112. `load_project_intelligence`
113. `record_project_decision`
114. `record_business_rule`
115. `record_project_invariant`
116. `build_project_architecture_graph`
117. `create_project_snapshot`
118. `detect_project_drift`
119. `analyze_change_impact`
120. `build_task_context`
121. `detect_knowledge_conflicts`
122. `record_lesson_learned`
123. `propose_improvement_candidate`
124. `evaluate_project_knowledge_health`
