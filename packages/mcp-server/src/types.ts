import { z } from 'zod';
import {
  ProductUXProfileSchema,
  UXPatternSpecSchema,
  ProductBriefInput
} from '@alper-design-os/design-core';

// 1. analyze_project
export const AnalyzeProjectInputSchema = z.object({
  projectPath: z.string().describe('Absolute or relative path to the existing project directory to analyze')
});
export type AnalyzeProjectInput = z.infer<typeof AnalyzeProjectInputSchema>;

// 2. detect_stack
export const DetectStackInputSchema = z.object({
  projectPath: z.string().describe('Path to inspect for frameworks, languages, and build tools')
});
export type DetectStackInput = z.infer<typeof DetectStackInputSchema>;

// 3. understand_product
export const UnderstandProductInputSchema = z.object({
  productName: z.string().describe('Name of the product or system'),
  description: z.string().describe('Functional summary of the product and its users'),
  domain: z.string().optional().describe('Industry domain (e.g. Manufacturing, Fintech, ERP)'),
  targetUsers: z.array(z.string()).optional().describe('Primary user personas or roles'),
  keyFeatures: z.array(z.string()).optional().describe('Key modules or workflows needed'),
  operatingEnvironment: z.string().optional().describe('Physical or hardware context (e.g. Control Room, Factory Floor, Desk)')
});
export type UnderstandProductInput = z.infer<typeof UnderstandProductInputSchema>;

// 4. research_domain
export const ResearchDomainInputSchema = z.object({
  domainQuery: z.string().describe('Industry or niche domain to research (e.g., Finite capacity scheduling)')
});
export type ResearchDomainInput = z.infer<typeof ResearchDomainInputSchema>;

// 5. recommend_ux_patterns
export const RecommendUXPatternsInputSchema = z.object({
  profile: ProductUXProfileSchema.optional().describe('ProductUXProfile if already generated'),
  density: z.enum(['EXTREME', 'HIGH', 'MEDIUM', 'SPACIOUS']).optional(),
  interactionStyle: z.enum(['KEYBOARD_FIRST', 'HYBRID_MOUSE_KEYBOARD', 'TOUCH_OPTIMIZED', 'GUIDED_WIZARD']).optional()
});
export type RecommendUXPatternsInput = z.infer<typeof RecommendUXPatternsInputSchema>;

// 6. search_design_patterns
export const SearchDesignPatternsInputSchema = z.object({
  query: z.string().describe('Search keyword for pattern (e.g., gantt, grid, split, filter)')
});
export type SearchDesignPatternsInput = z.infer<typeof SearchDesignPatternsInputSchema>;

// 7. search_components
export const SearchComponentsInputSchema = z.object({
  adapterId: z.string().optional().describe('Target adapter (react, laravel-blade, aspnet-razor, etc.)'),
  patternId: z.string().describe('UX pattern identifier to inspect')
});
export type SearchComponentsInput = z.infer<typeof SearchComponentsInputSchema>;

// 8. get_design_tokens
export const GetDesignTokensInputSchema = z.object({
  format: z.enum(['css', 'scss', 'typescript', 'tailwind-json']).default('css'),
  density: z.enum(['EXTREME', 'HIGH', 'MEDIUM', 'SPACIOUS']).optional()
});
export type GetDesignTokensInput = z.infer<typeof GetDesignTokensInputSchema>;

// 9. create_design_plan
export const CreateDesignPlanInputSchema = z.object({
  mode: z.enum(['NEW', 'REPAIR', 'MODERNIZE']),
  productName: z.string(),
  adapterId: z.string(),
  briefOrProfile: z.union([UnderstandProductInputSchema, ProductUXProfileSchema])
});
export type CreateDesignPlanInput = z.infer<typeof CreateDesignPlanInputSchema>;

// 10. audit_existing_ui
export const AuditExistingUIInputSchema = z.object({
  projectPath: z.string()
});
export type AuditExistingUIInput = z.infer<typeof AuditExistingUIInputSchema>;

// 11. audit_accessibility
export const AuditAccessibilityInputSchema = z.object({
  projectPath: z.string(),
  targetLevel: z.enum(['WCAG_2_1_AA', 'WCAG_2_1_AAA']).default('WCAG_2_1_AA')
});
export type AuditAccessibilityInput = z.infer<typeof AuditAccessibilityInputSchema>;

// 12. audit_responsive
export const AuditResponsiveInputSchema = z.object({
  projectPath: z.string()
});
export type AuditResponsiveInput = z.infer<typeof AuditResponsiveInputSchema>;

// 13. recommend_modernization
export const RecommendModernizationInputSchema = z.object({
  projectPath: z.string(),
  targetAdapter: z.string().optional()
});
export type RecommendModernizationInput = z.infer<typeof RecommendModernizationInputSchema>;

// 14. search_public_apis
export const SearchPublicApisInputSchema = z.object({
  query: z.string().describe('Search query for public APIs catalog'),
  category: z.string().optional()
});
export type SearchPublicApisInput = z.infer<typeof SearchPublicApisInputSchema>;

// 15. search_mcp_servers
export const SearchMcpServersInputSchema = z.object({
  query: z.string().describe('Search query for awesome MCP servers catalog'),
  category: z.string().optional()
});
export type SearchMcpServersInput = z.infer<typeof SearchMcpServersInputSchema>;

// 16. discover_sources
export const DiscoverSourcesInputSchema = z.object({
  type: z.enum([
    'DESIGN_SYSTEM',
    'COMPONENT_LIBRARY',
    'UX_GUIDELINE',
    'ACCESSIBILITY_STANDARD',
    'AI_SKILL',
    'PROMPT_LIBRARY',
    'MCP_SERVER',
    'PUBLIC_API',
    'ICON_LIBRARY',
    'TYPOGRAPHY_RESOURCE',
    'DESIGN_TOKEN_SYSTEM',
    'REFERENCE_IMPLEMENTATION'
  ]).optional(),
  framework: z.string().optional(),
  domain: z.string().optional(),
  accessibilityLevel: z.enum(['WCAG_2_1_AA', 'WCAG_2_1_AAA', 'PARTIAL', 'NOT_SPECIFIED']).optional(),
  minTrustScore: z.number().min(0).max(100).optional(),
  searchQuery: z.string().optional()
});
export type DiscoverSourcesInput = z.infer<typeof DiscoverSourcesInputSchema>;

// 17. search_sources
export const SearchSourcesInputSchema = z.object({
  query: z.string().describe('Search query across sources, descriptions, and strengths'),
  framework: z.string().optional(),
  domain: z.string().optional()
});
export type SearchSourcesInput = z.infer<typeof SearchSourcesInputSchema>;

// 18. rank_sources
export const RankSourcesInputSchema = z.object({
  framework: z.string().optional(),
  domain: z.string().optional(),
  requirePermissiveLicense: z.boolean().optional()
});
export type RankSourcesInput = z.infer<typeof RankSourcesInputSchema>;

// 19. inspect_source
export const InspectSourceInputSchema = z.object({
  sourceId: z.string().describe('Unique identifier of the source (e.g. src-carbon-design-system)')
});
export type InspectSourceInput = z.infer<typeof InspectSourceInputSchema>;

// 20. recommend_sources_for_product
export const RecommendSourcesForProductInputSchema = z.object({
  profile: ProductUXProfileSchema.optional(),
  productName: z.string().optional(),
  description: z.string().optional(),
  domain: z.string().optional()
});
export type RecommendSourcesForProductInput = z.infer<typeof RecommendSourcesForProductInputSchema>;

// 21. recommend_sources_for_stack
export const RecommendSourcesForStackInputSchema = z.object({
  framework: z.string().describe('Target technology framework (React, Blade, Razor, HTML/CSS/JS, etc.)'),
  domain: z.string().optional()
});
export type RecommendSourcesForStackInput = z.infer<typeof RecommendSourcesForStackInputSchema>;

// 22. check_source_license
export const CheckSourceLicenseInputSchema = z.object({
  license: z.string().describe('License identifier or string (e.g. MIT, Apache-2.0, GPL-3.0, W3C)')
});
export type CheckSourceLicenseInput = z.infer<typeof CheckSourceLicenseInputSchema>;

// 23. generate_engineering_policy
export const GenerateEngineeringPolicyInputSchema = z.object({
  stack: z.string().describe('Tech stack (typescript, php, laravel, aspnet, generic)'),
  securityLevel: z.enum(['STANDARD', 'HIGH', 'CRITICAL']).optional(),
  targetEnvironment: z.string().optional()
});
export type GenerateEngineeringPolicyInput = z.infer<typeof GenerateEngineeringPolicyInputSchema>;

// 24. evaluate_release_gates
export const EvaluateReleaseGatesInputSchema = z.object({
  profile: z.any().optional(),
  staticIssues: z.array(z.any()).optional(),
  dynamicIssues: z.array(z.any()).optional(),
  vulnerableDependencies: z.array(z.any()).optional(),
  detectedSecrets: z.array(z.any()).optional()
});
export type EvaluateReleaseGatesInput = z.infer<typeof EvaluateReleaseGatesInputSchema>;

// 25. generate_threat_model
export const GenerateThreatModelInputSchema = z.object({
  systemName: z.string().describe('System or subsystem name for STRIDE threat model'),
  architecture: z.string().optional().describe('Architecture style (SPA_API, MONOLITH, etc.)'),
  dataAssets: z.array(z.string()).optional(),
  externalInterfaces: z.array(z.string()).optional()
});
export type GenerateThreatModelInput = z.infer<typeof GenerateThreatModelInputSchema>;

// 26. detect_tool_capabilities
export const DetectToolCapabilitiesInputSchema = z.object({
  targetTools: z.array(z.string()).optional().describe('Specific tools to query, or omit for all tools')
});
export type DetectToolCapabilitiesInput = z.infer<typeof DetectToolCapabilitiesInputSchema>;

// 27. run_safe_security_scan
export const RunSafeSecurityScanInputSchema = z.object({
  targetDir: z.string().describe('Directory path to run passive scan on'),
  activeScanApproved: z.boolean().optional().describe('Requires true to run active DAST or port scans'),
  targetUrl: z.string().optional()
});
export type RunSafeSecurityScanInput = z.infer<typeof RunSafeSecurityScanInputSchema>;

// 28. generate_user_journeys
export const GenerateUserJourneysInputSchema = z.object({
  productName: z.string(),
  description: z.string(),
  domain: z.string().optional()
});
export type GenerateUserJourneysInput = z.infer<typeof GenerateUserJourneysInputSchema>;

// 29. generate_playwright_test
export const GeneratePlaywrightTestInputSchema = z.object({
  journeyTitle: z.string(),
  targetUrl: z.string(),
  steps: z.array(z.object({
    order: z.number(),
    action: z.string(),
    target: z.string(),
    value: z.string().optional()
  }))
});
export type GeneratePlaywrightTestInput = z.infer<typeof GeneratePlaywrightTestInputSchema>;

// 30. generate_qa_report
export const GenerateQAReportInputSchema = z.object({
  targetApplication: z.string(),
  testedFlows: z.array(z.string()).optional(),
  consoleErrors: z.array(z.any()).optional(),
  networkFailures: z.array(z.any()).optional(),
  accessibilityFindings: z.array(z.string()).optional(),
  visualDiffs: z.array(z.any()).optional(),
  unverifiedAreas: z.array(z.string()).optional()
});
export type GenerateQAReportInput = z.infer<typeof GenerateQAReportInputSchema>;

// 31. generate_test_pyramid
export const GenerateTestPyramidInputSchema = z.object({
  projectName: z.string(),
  projectType: z.enum(['LANDING_PAGE', 'ENTERPRISE_ERP_CRM', 'MICROSERVICE_API', 'STANDARD_WEB'])
});
export type GenerateTestPyramidInput = z.infer<typeof GenerateTestPyramidInputSchema>;

// 32. analyze_architecture
export const AnalyzeArchitectureInputSchema = z.object({
  projectPath: z.string().describe('Path to inspect architectural style and module boundaries')
});
export type AnalyzeArchitectureInput = z.infer<typeof AnalyzeArchitectureInputSchema>;

// 33. generate_adr
export const GenerateADRInputSchema = z.object({
  number: z.number(),
  title: z.string(),
  context: z.string(),
  decision: z.string(),
  consequences: z.object({
    positive: z.array(z.string()),
    negative: z.array(z.string()),
    neutral: z.array(z.string()).optional()
  })
});
export type GenerateADRInput = z.infer<typeof GenerateADRInputSchema>;

// 34. analyze_database_schema
export const AnalyzeDatabaseSchemaInputSchema = z.object({
  projectPath: z.string().optional(),
  migrationContent: z.string().optional(),
  querySample: z.string().optional()
});
export type AnalyzeDatabaseSchemaInput = z.infer<typeof AnalyzeDatabaseSchemaInputSchema>;

// 35. evaluate_api_compatibility
export const EvaluateAPICompatibilityInputSchema = z.object({
  oldSpec: z.string().describe('Old OpenAPI/AsyncAPI spec as JSON or YAML string'),
  newSpec: z.string().describe('New OpenAPI/AsyncAPI spec as JSON or YAML string'),
  specType: z.enum(['OPENAPI', 'ASYNCAPI']).default('OPENAPI')
});
export type EvaluateAPICompatibilityInput = z.infer<typeof EvaluateAPICompatibilityInputSchema>;

// 36. classify_code_paths
export const ClassifyCodePathsInputSchema = z.object({
  paths: z.array(z.string()).describe('Array of relative file paths to classify')
});
export type ClassifyCodePathsInput = z.infer<typeof ClassifyCodePathsInputSchema>;

// ==========================================
// Phase 1B: Agent Governance & Orchestration Tools
// ==========================================

// 37. create_action_plan
export const CreateActionPlanInputSchema = z.object({
  objective: z.string().describe('Clear description of what the agent aims to achieve'),
  requestedScope: z.array(z.string()).describe('Explicit target files, screens, or features requested by user'),
  filesExpectedToChange: z.array(z.string()).describe('List of files agent plans to modify'),
  filesForbiddenToChange: z.array(z.string()).optional().describe('List of protected files agent must not modify'),
  detectedProject: z.record(z.any()).optional().describe('Project metadata or detected stack profile')
});
export type CreateActionPlanInput = z.infer<typeof CreateActionPlanInputSchema>;

// 38. evaluate_scope
export const EvaluateScopeInputSchema = z.object({
  filesToChange: z.array(z.string()).describe('Files proposed for modification'),
  requestedScope: z.array(z.string()).describe('Allowed file or directory patterns'),
  forbiddenList: z.array(z.string()).optional().describe('Explicitly forbidden paths')
});
export type EvaluateScopeInput = z.infer<typeof EvaluateScopeInputSchema>;

// 39. evaluate_change_risk
export const EvaluateChangeRiskInputSchema = z.object({
  fileCount: z.number().optional().default(1),
  architectureImpact: z.boolean().optional().default(false),
  databaseImpact: z.boolean().optional().default(false),
  authenticationImpact: z.boolean().optional().default(false),
  authorizationImpact: z.boolean().optional().default(false),
  publicApiImpact: z.boolean().optional().default(false),
  dependencyImpact: z.boolean().optional().default(false),
  configurationImpact: z.boolean().optional().default(false),
  deploymentImpact: z.boolean().optional().default(false),
  dataLossPossibility: z.boolean().optional().default(false)
});
export type EvaluateChangeRiskInput = z.infer<typeof EvaluateChangeRiskInputSchema>;

// 40. create_checkpoint_plan
export const CreateCheckpointPlanInputSchema = z.object({
  gitStatusText: z.string().describe('Output of git status command'),
  taskName: z.string().describe('Name or summary of upcoming task'),
  currentBranch: z.string().optional().default('main')
});
export type CreateCheckpointPlanInput = z.infer<typeof CreateCheckpointPlanInputSchema>;

// 41. create_verification_plan
export const CreateVerificationPlanInputSchema = z.object({
  objective: z.string().describe('Task objective'),
  isUI: z.boolean().optional().default(true),
  isSecuritySensitive: z.boolean().optional().default(false),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM')
});
export type CreateVerificationPlanInput = z.infer<typeof CreateVerificationPlanInputSchema>;

// 42. normalize_verification_evidence
export const NormalizeVerificationEvidenceInputSchema = z.object({
  rawItems: z.array(z.any()).describe('Array of raw test results, logs, or execution outputs')
});
export type NormalizeVerificationEvidenceInput = z.infer<typeof NormalizeVerificationEvidenceInputSchema>;

// 43. review_change
export const ReviewChangeInputSchema = z.object({
  taskObjective: z.string(),
  diffContent: z.string(),
  filesChanged: z.array(z.string()),
  testOutput: z.string().optional(),
  testsPassed: z.boolean().optional(),
  consoleErrors: z.array(z.string()).optional(),
  networkErrors: z.array(z.string()).optional(),
  securityFindings: z.array(z.object({
    severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    title: z.string()
  })).optional()
});
export type ReviewChangeInput = z.infer<typeof ReviewChangeInputSchema>;

// 44. detect_regression
export const DetectRegressionInputSchema = z.object({
  baselines: z.array(z.object({
    id: z.string(),
    type: z.enum(['ROUTE', 'API_ENDPOINT', 'DOM_SELECTOR', 'COMPONENT', 'DATABASE_INVARIANT']),
    expectedValue: z.any()
  })),
  currentStates: z.array(z.object({
    id: z.string(),
    type: z.enum(['ROUTE', 'API_ENDPOINT', 'DOM_SELECTOR', 'COMPONENT', 'DATABASE_INVARIANT']),
    actualValue: z.any()
  }))
});
export type DetectRegressionInput = z.infer<typeof DetectRegressionInputSchema>;

// 45. create_environment_profile
export const CreateEnvironmentProfileInputSchema = z.object({
  projectPath: z.string().describe('Directory path of the project to inspect')
});
export type CreateEnvironmentProfileInput = z.infer<typeof CreateEnvironmentProfileInputSchema>;

// 46. route_context
export const RouteContextInputSchema = z.object({
  taskId: z.string(),
  taskBrief: z.string(),
  detectedStack: z.string().optional(),
  domain: z.string().optional(),
  mode: z.enum(['NEW', 'REPAIR', 'MODERNIZE']).optional().default('REPAIR')
});
export type RouteContextInput = z.infer<typeof RouteContextInputSchema>;

// 47. route_tool
export const RouteToolInputSchema = z.object({
  taskDescription: z.string(),
  isOffline: z.boolean().optional().default(false),
  requireLiveBrowser: z.boolean().optional().default(false)
});
export type RouteToolInput = z.infer<typeof RouteToolInputSchema>;

// 48. create_execution_journal
export const CreateExecutionJournalInputSchema = z.object({
  baseDir: z.string(),
  runId: z.string(),
  plan: z.record(z.any()),
  projectProfile: z.record(z.any()).optional(),
  actions: z.array(z.record(z.any())).optional(),
  verification: z.record(z.any()).optional(),
  evidence: z.array(z.record(z.any())).optional(),
  review: z.record(z.any()).optional(),
  summaryMarkdown: z.string().optional()
});
export type CreateExecutionJournalInput = z.infer<typeof CreateExecutionJournalInputSchema>;

// 49. evaluate_completion_claim
export const EvaluateCompletionClaimInputSchema = z.object({
  claim: z.string().describe('Completion phrase or statement to evaluate against evidence'),
  evidences: z.array(z.any()).optional().default([])
});
export type EvaluateCompletionClaimInput = z.infer<typeof EvaluateCompletionClaimInputSchema>;

// 50. discover_design_sources
export const DiscoverDesignSourcesInputSchema = z.object({
  type: z.string().optional(),
  types: z.array(z.string()).optional(),
  framework: z.string().optional(),
  domain: z.string().optional(),
  accessibilityLevel: z.string().optional(),
  minTrustScore: z.number().optional(),
  maxLicenseRisk: z.enum(['PERMISSIVE_ONLY', 'ANY']).optional(),
  searchQuery: z.string().optional()
});
export type DiscoverDesignSourcesInput = z.infer<typeof DiscoverDesignSourcesInputSchema>;

// 51. search_design_sources
export const SearchDesignSourcesInputSchema = z.object({
  query: z.string().describe('Search query for design sources, component libraries, or design systems'),
  framework: z.string().optional(),
  domain: z.string().optional(),
  limit: z.number().optional()
});
export type SearchDesignSourcesInput = z.infer<typeof SearchDesignSourcesInputSchema>;

// 52. inspect_design_source
export const InspectDesignSourceInputSchema = z.object({
  sourceId: z.string().describe('Source identifier (e.g. src-ibm-carbon, src-shadcn-ui)')
});
export type InspectDesignSourceInput = z.infer<typeof InspectDesignSourceInputSchema>;

// 53. sync_design_sources
export const SyncDesignSourcesInputSchema = z.object({
  sourceIds: z.array(z.string()).optional(),
  force: z.boolean().optional().default(false)
});
export type SyncDesignSourcesInput = z.infer<typeof SyncDesignSourcesInputSchema>;

// 54. recommend_design_sources
export const RecommendDesignSourcesInputSchema = z.object({
  framework: z.string().optional(),
  domain: z.string().optional(),
  density: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EXTREME']).optional(),
  commercialAllowedOnly: z.boolean().optional().default(true),
  componentType: z.string().optional()
});
export type RecommendDesignSourcesInput = z.infer<typeof RecommendDesignSourcesInputSchema>;

// 55. search_patterns
export const SearchPatternsInputSchema = z.object({
  query: z.string().optional().describe('Query text to search across pattern names, aliases, and problem descriptions'),
  category: z.string().optional(),
  applicableDomain: z.string().optional()
});
export type SearchPatternsInput = z.infer<typeof SearchPatternsInputSchema>;

// 56. inspect_pattern
export const InspectPatternInputSchema = z.object({
  patternId: z.string().describe('Pattern identifier (e.g. DATA_TABLE, DENSE_GRID, MASTER_DETAIL)')
});
export type InspectPatternInput = z.infer<typeof InspectPatternInputSchema>;

// 57. search_registries
export const SearchRegistriesInputSchema = z.object({
  query: z.string().optional(),
  framework: z.string().optional(),
  freeTierOnly: z.boolean().optional().default(true)
});
export type SearchRegistriesInput = z.infer<typeof SearchRegistriesInputSchema>;

// 58. search_registry_components
export const SearchRegistryComponentsInputSchema = z.object({
  query: z.string().describe('Component name or keyword to search (e.g. data-table, dialog, date-picker)'),
  registryId: z.string().optional(),
  type: z.string().optional()
});
export type SearchRegistryComponentsInput = z.infer<typeof SearchRegistryComponentsInputSchema>;

// 59. inspect_registry_component
export const InspectRegistryComponentInputSchema = z.object({
  registryId: z.string().describe('Registry identifier (e.g. reg-shadcn-official)'),
  componentId: z.string().describe('Component identifier (e.g. button, data-table)')
});
export type InspectRegistryComponentInput = z.infer<typeof InspectRegistryComponentInputSchema>;

// 60. discover_ai_skills
export const DiscoverAiSkillsInputSchema = z.object({
  query: z.string().optional(),
  domain: z.string().optional()
});
export type DiscoverAiSkillsInput = z.infer<typeof DiscoverAiSkillsInputSchema>;

// 61. inspect_ai_skill
export const InspectAiSkillInputSchema = z.object({
  skillId: z.string().describe('Skill identifier or name'),
  promptContent: z.string().optional().describe('Instruction prompt or content to audit for prompt injection or malicious commands')
});
export type InspectAiSkillInput = z.infer<typeof InspectAiSkillInputSchema>;

// 62. recommend_icon_system
export const RecommendIconSystemInputSchema = z.object({
  framework: z.string().optional(),
  useTailwind: z.boolean().optional(),
  useShadcn: z.boolean().optional(),
  density: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  existingIconImports: z.array(z.string()).optional()
});
export type RecommendIconSystemInput = z.infer<typeof RecommendIconSystemInputSchema>;

// 63. recommend_chart_library
export const RecommendChartLibraryInputSchema = z.object({
  framework: z.string().optional(),
  dataPoints: z.number().optional(),
  requireGanttOrTimeline: z.boolean().optional(),
  accessibleRequirement: z.boolean().optional()
});
export type RecommendChartLibraryInput = z.infer<typeof RecommendChartLibraryInputSchema>;

// 64. recommend_data_grid
export const RecommendDataGridInputSchema = z.object({
  estimatedRows: z.number().optional(),
  requiresVirtualization: z.boolean().optional(),
  requiresServerSide: z.boolean().optional(),
  requiresGroupingOrPivot: z.boolean().optional(),
  licensePreference: z.enum(['PERMISSIVE_MIT', 'COMMERCIAL_OK']).optional()
});
export type RecommendDataGridInput = z.infer<typeof RecommendDataGridInputSchema>;

// 65. explain_source_recommendation
export const ExplainSourceRecommendationInputSchema = z.object({
  sourceId: z.string().describe('Source identifier to explain recommendation rationale for'),
  targetFramework: z.string().optional(),
  targetDomain: z.string().optional()
});
export type ExplainSourceRecommendationInput = z.infer<typeof ExplainSourceRecommendationInputSchema>;

// 66. create_design_intent
export const CreateDesignIntentInputSchema = z.object({
  productType: z.enum(['ENTERPRISE_INTERNAL', 'B2B_SAAS', 'B2C_CONSUMER', 'ADMIN_OPERATIONAL', 'ANALYTICS_DATA', 'DEVELOPER_TOOL']).optional(),
  userExpertise: z.enum(['NOVICE', 'INTERMEDIATE', 'EXPERT']).optional(),
  usageFrequency: z.enum(['RARE_SPORADIC', 'PERIODIC', 'DAILY_FREQUENT', 'CONTINUOUS_INTENSIVE']).optional(),
  sessionDuration: z.enum(['SHORT_FOCUSED', 'MEDIUM', 'LONG_EXTENDED']).optional(),
  informationDensity: z.enum(['COMPACT', 'COMFORTABLE', 'SPACIOUS']).optional(),
  interactionIntensity: z.enum(['READ_DOMINANT', 'BALANCED', 'INPUT_INTENSIVE', 'KEYBOARD_POWER']).optional(),
  devicePriority: z.enum(['DESKTOP_FIRST', 'MOBILE_FIRST', 'BALANCED_RESPONSIVE']).optional(),
  taskCriticality: z.enum(['LOW', 'MEDIUM', 'HIGH', 'MISSION_CRITICAL']).optional(),
  errorCost: z.enum(['TRIVIAL', 'LOW', 'SIGNIFICANT', 'CATASTROPHIC']).optional(),
  brandCharacter: z.enum(['UTILITY_NEUTRAL', 'AUTHORITATIVE', 'FRIENDLY', 'TECHNICAL']).optional(),
  visualEmphasis: z.enum(['CONTENT_FIRST', 'DATA_FIRST', 'ACTION_FIRST', 'BRAND_FIRST']).optional(),
  motionTolerance: z.enum(['REDUCED', 'SUBTLE', 'EXPRESSIVE']).optional(),
  accessibilityNeeds: z.enum(['STANDARD_AA', 'ENHANCED_AAA', 'HIGH_CONTRAST', 'SCREEN_READER_OPTIMIZED']).optional()
});
export type CreateDesignIntentInput = z.infer<typeof CreateDesignIntentInputSchema>;

// 67. create_page_blueprint
export const CreatePageBlueprintInputSchema = z.object({
  id: z.string().optional().default('data-management-workspace'),
  title: z.string().optional().default('Data Management Workspace'),
  preset: z.enum(['DATA_MANAGEMENT_WORKSPACE', 'LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE']).optional().default('DATA_MANAGEMENT_WORKSPACE')
});
export type CreatePageBlueprintInput = z.infer<typeof CreatePageBlueprintInputSchema>;

// 68. create_component_blueprint
export const CreateComponentBlueprintInputSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['BUTTON', 'INPUT', 'SELECT', 'CHECKBOX', 'RADIO', 'SWITCH', 'BADGE', 'ALERT', 'CARD', 'MODAL_DIALOG', 'DRAWER', 'TOOLTIP', 'DROPDOWN_MENU', 'DATA_TABLE', 'FILTER_BAR']),
  density: z.enum(['COMPACT', 'COMFORTABLE', 'SPACIOUS']).optional()
});
export type CreateComponentBlueprintInput = z.infer<typeof CreateComponentBlueprintInputSchema>;

// 69. create_app_shell_blueprint
export const CreateAppShellBlueprintInputSchema = z.object({
  id: z.string().optional().default('app-shell'),
  variant: z.enum(['ENTERPRISE_DENSE', 'SAAS_STANDARD', 'CONSUMER_CONTENT']).optional().default('ENTERPRISE_DENSE')
});
export type CreateAppShellBlueprintInput = z.infer<typeof CreateAppShellBlueprintInputSchema>;

// 70. render_blueprint
export const RenderBlueprintInputSchema = z.object({
  blueprintId: z.string().optional().default('data-management-workspace'),
  targetStack: z.enum(['html-css-js', 'react-typescript', 'laravel-blade', 'aspnet-razor']).optional().default('html-css-js'),
  theme: z.enum(['LIGHT', 'DARK', 'HIGH_CONTRAST']).optional().default('LIGHT'),
  density: z.enum(['COMPACT', 'COMFORTABLE', 'SPACIOUS']).optional().default('COMPACT')
});
export type RenderBlueprintInput = z.infer<typeof RenderBlueprintInputSchema>;

// 71. render_component
export const RenderComponentInputSchema = z.object({
  componentType: z.enum(['BUTTON', 'INPUT', 'SELECT', 'CHECKBOX', 'RADIO', 'SWITCH', 'BADGE', 'ALERT', 'CARD', 'MODAL_DIALOG', 'DRAWER', 'TOOLTIP', 'DROPDOWN_MENU', 'DATA_TABLE', 'FILTER_BAR']),
  targetStack: z.enum(['html-css-js', 'react-typescript', 'laravel-blade', 'aspnet-razor']).optional().default('html-css-js'),
  theme: z.enum(['LIGHT', 'DARK', 'HIGH_CONTRAST']).optional().default('LIGHT'),
  density: z.enum(['COMPACT', 'COMFORTABLE', 'SPACIOUS']).optional().default('COMFORTABLE')
});
export type RenderComponentInput = z.infer<typeof RenderComponentInputSchema>;

// 72. create_ui_recipe
export const CreateUiRecipeInputSchema = z.object({
  recipeType: z.enum(['LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DATA_MANAGEMENT_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE'])
});
export type CreateUiRecipeInput = z.infer<typeof CreateUiRecipeInputSchema>;

// 73. select_design_personality
export const SelectDesignPersonalityInputSchema = z.object({
  productType: z.enum(['ENTERPRISE_INTERNAL', 'B2B_SAAS', 'B2C_CONSUMER', 'ADMIN_OPERATIONAL', 'ANALYTICS_DATA', 'DEVELOPER_TOOL']).optional(),
  informationDensity: z.enum(['COMPACT', 'COMFORTABLE', 'SPACIOUS']).optional(),
  brandCharacter: z.enum(['UTILITY_NEUTRAL', 'AUTHORITATIVE', 'FRIENDLY', 'TECHNICAL']).optional(),
  visualEmphasis: z.enum(['CONTENT_FIRST', 'DATA_FIRST', 'ACTION_FIRST', 'BRAND_FIRST']).optional(),
  motionTolerance: z.enum(['REDUCED', 'SUBTLE', 'EXPRESSIVE']).optional()
});
export type SelectDesignPersonalityInput = z.infer<typeof SelectDesignPersonalityInputSchema>;

// 74. evaluate_design_antipatterns
export const EvaluateDesignAntipatternsInputSchema = z.object({
  content: z.string().optional().describe('Markup or CSS content to inspect'),
  blueprintPreset: z.enum(['DATA_MANAGEMENT_WORKSPACE', 'LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE']).optional()
});
export type EvaluateDesignAntipatternsInput = z.infer<typeof EvaluateDesignAntipatternsInputSchema>;

// 75. compare_renderer_parity
export const CompareRendererParityInputSchema = z.object({
  blueprintPreset: z.enum(['DATA_MANAGEMENT_WORKSPACE', 'LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE']).optional().default('DATA_MANAGEMENT_WORKSPACE')
});
export type CompareRendererParityInput = z.infer<typeof CompareRendererParityInputSchema>;

// 76. inspect_alper_registry
export const InspectAlperRegistryInputSchema = z.object({
  section: z.enum(['ALL', 'TOKENS', 'BLUEPRINTS', 'PATTERNS', 'RECIPES']).optional().default('ALL')
});
export type InspectAlperRegistryInput = z.infer<typeof InspectAlperRegistryInputSchema>;

// 77. evaluate_truthful_ui
export const EvaluateTruthfulUiInputSchema = z.object({
  components: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      statusBadge: z.string().optional(),
      trendDirection: z.enum(['UP', 'DOWN', 'FLAT']).optional(),
      semanticColor: z.string().optional(),
      valueText: z.string().optional(),
      isSimulated: z.boolean().optional(),
      isLabeledMock: z.boolean().optional(),
      hasLiveDataSource: z.boolean().optional(),
      dataSourceUri: z.string().optional()
    })
  ),
  pageTitle: z.string().optional(),
  cognitiveClutterScore: z.number().optional()
});
export type EvaluateTruthfulUiInput = z.infer<typeof EvaluateTruthfulUiInputSchema>;

// 78. audit_data_provenance
export const AuditDataProvenanceInputSchema = z.object({
  records: z.array(
    z.object({
      fieldOrComponentId: z.string(),
      originType: z.enum([
        'AUTHORITATIVE_API',
        'TELEMETRY_STREAM',
        'DATABASE_RECORD',
        'DERIVED_COMPUTATION',
        'CACHE_SNAPSHOT',
        'SYNTHETIC_MOCK',
        'STATIC_FIXTURE',
        'USER_INPUT',
        'UNVERIFIED_ESTIMATE',
        'FABRICATED_UNGROUNDED'
      ]),
      endpointOrSource: z.string(),
      isSimulated: z.boolean().optional(),
      isLabeledMock: z.boolean().optional()
    })
  )
});
export type AuditDataProvenanceInput = z.infer<typeof AuditDataProvenanceInputSchema>;

// 79. evaluate_page_intent
export const EvaluatePageIntentInputSchema = z.object({
  intentType: z.enum([
    'OPERATIONAL_MONITORING',
    'EXECUTIVE_DECISION',
    'DATA_ENTRY_TRANSACTION',
    'EXPLORATORY_ANALYTICS',
    'CONFIGURATION_ADMIN',
    'DIAGNOSTIC_INVESTIGATION',
    'DEMO_SHOWCASE'
  ]),
  primaryGoal: z.string(),
  targetAudience: z.string(),
  components: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      role: z.string(),
      originType: z.string().optional(),
      isSimulated: z.boolean().optional(),
      title: z.string().optional(),
      visualGimmicks: z.array(z.string()).optional()
    })
  )
});
export type EvaluatePageIntentInput = z.infer<typeof EvaluatePageIntentInputSchema>;

// 80. audit_information_relevance
export const AuditInformationRelevanceInputSchema = z.object({
  intentType: z.enum([
    'OPERATIONAL_MONITORING',
    'EXECUTIVE_DECISION',
    'DATA_ENTRY_TRANSACTION',
    'EXPLORATORY_ANALYTICS',
    'CONFIGURATION_ADMIN',
    'DIAGNOSTIC_INVESTIGATION',
    'DEMO_SHOWCASE'
  ]),
  primaryGoal: z.string(),
  elements: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      role: z.string(),
      isDeceptive: z.boolean().optional(),
      isContradictory: z.boolean().optional(),
      isFiller: z.boolean().optional()
    })
  )
});
export type AuditInformationRelevanceInput = z.infer<typeof AuditInformationRelevanceInputSchema>;

// 81. classify_source_authority
export const ClassifySourceAuthorityInputSchema = z.object({
  sourceId: z.string(),
  urlOrPath: z.string().optional(),
  type: z.string().optional(),
  isProductionEndpoint: z.boolean().optional(),
  hasAuthHeaders: z.boolean().optional(),
  isMock: z.boolean().optional()
});
export type ClassifySourceAuthorityInput = z.infer<typeof ClassifySourceAuthorityInputSchema>;

// 82. evaluate_content_truth_gate
export const EvaluateContentTruthGateInputSchema = z.object({
  components: z.array(z.any()).optional(),
  requireVisualApproval: z.boolean().optional()
});
export type EvaluateContentTruthGateInput = z.infer<typeof EvaluateContentTruthGateInputSchema>;

// 83. manage_human_visual_approval
export const ManageHumanVisualApprovalInputSchema = z.object({
  action: z.enum(['GET_STATUS', 'RECORD_REVIEW']),
  reviewedBy: z.string().optional(),
  status: z.enum(['NOT_REVIEWED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED']).optional(),
  notes: z.string().optional(),
  viewports: z.array(z.string()).optional(),
  criteriaChecked: z
    .object({
      layoutStability: z.boolean().optional(),
      typographyHierarchy: z.boolean().optional(),
      colorContrast: z.boolean().optional(),
      responsiveFidelity: z.boolean().optional(),
      truthfulnessVisualAffordance: z.boolean().optional()
    })
    .optional()
});
export type ManageHumanVisualApprovalInput = z.infer<typeof ManageHumanVisualApprovalInputSchema>;

// 84. audit_track_trace_telemetry
export const AuditTrackTraceTelemetryInputSchema = z.object({
  sampleEndpoints: z.array(z.string()).optional()
});
export type AuditTrackTraceTelemetryInput = z.infer<typeof AuditTrackTraceTelemetryInputSchema>;

// 85. create_manual_run_bundle
export const CreateManualRunBundleInputSchema = z.object({
  runId: z.string().optional(),
  plannedObjective: z.string().optional()
});
export type CreateManualRunBundleInput = z.infer<typeof CreateManualRunBundleInputSchema>;

// 86. verify_manual_run_evidence
export const VerifyManualRunEvidenceInputSchema = z.object({
  runIdOrPath: z.string()
});
export type VerifyManualRunEvidenceInput = z.infer<typeof VerifyManualRunEvidenceInputSchema>;

// 87. resolve_browser_runtime
export const ResolveBrowserRuntimeInputSchema = z.object({
  forceChromiumBlocked: z.boolean().optional()
});
export type ResolveBrowserRuntimeInput = z.infer<typeof ResolveBrowserRuntimeInputSchema>;

// 88. run_operator_doctor
export const RunOperatorDoctorInputSchema = z.object({
  overrideDockerCapability: z.enum(['AVAILABLE', 'UNAVAILABLE']).optional(),
  overrideBrowserCapability: z.enum(['AVAILABLE', 'UNAVAILABLE']).optional()
});
export type RunOperatorDoctorInput = z.infer<typeof RunOperatorDoctorInputSchema>;

// ==========================================
// FAZ 1F.0: Modernization Engine MCP Schemas
// ==========================================

// 89. profile_existing_project
export const ProfileExistingProjectInputSchema = z.object({
  projectPath: z.string().describe('Absolute or relative path to the existing project directory to profile'),
  projectName: z.string().optional().describe('Optional human-readable project identity name')
});
export type ProfileExistingProjectInput = z.infer<typeof ProfileExistingProjectInputSchema>;

// 90. create_behavioral_baseline
export const CreateBehavioralBaselineInputSchema = z.object({
  projectPath: z.string().describe('Directory path of existing project to scan and capture behavioral baseline'),
  includeOpenApi: z.boolean().optional().describe('Whether to load OpenAPI spec file if detected')
});
export type CreateBehavioralBaselineInput = z.infer<typeof CreateBehavioralBaselineInputSchema>;

// 91. create_preservation_contract
export const CreatePreservationContractInputSchema = z.object({
  contractId: z.string().optional(),
  customInvariants: z.record(z.array(z.string())).optional()
});
export type CreatePreservationContractInput = z.infer<typeof CreatePreservationContractInputSchema>;

// 92. classify_existing_elements
export const ClassifyExistingElementsInputSchema = z.object({
  elements: z.array(
    z.object({
      targetId: z.string(),
      name: z.string(),
      path: z.string(),
      elementType: z.enum(['COMPONENT', 'STYLE', 'PAGE', 'ROUTE', 'API', 'DATA_ACCESS', 'STATE', 'DEPENDENCY', 'ASSET', 'CONFIG']),
      proposedDecision: z.enum(['KEEP', 'IMPROVE', 'REPLACE', 'DEFER', 'REMOVE']).optional(),
      reason: z.string().optional(),
      migrationCost: z.enum(['TRIVIAL', 'LOW', 'MEDIUM', 'HIGH', 'PROHIBITIVE']).optional()
    })
  )
});
export type ClassifyExistingElementsInput = z.infer<typeof ClassifyExistingElementsInputSchema>;

// 93. create_modernization_intent
export const CreateModernizationIntentInputSchema = z.object({
  why: z.string(),
  targetOutcome: z.string().optional(),
  primaryProblems: z.array(z.string()).optional(),
  userPainPoints: z.array(z.string()).optional(),
  visualGoals: z.array(z.string()).optional(),
  uxGoals: z.array(z.string()).optional(),
  technicalGoals: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  forbiddenChanges: z.array(z.string()).optional(),
  successCriteria: z.array(z.string()).optional(),
  autoSupplementFromProjectPath: z.string().optional()
});
export type CreateModernizationIntentInput = z.infer<typeof CreateModernizationIntentInputSchema>;

// 94. create_modernization_plan
export const CreateModernizationPlanInputSchema = z.object({
  projectPath: z.string(),
  why: z.string().optional(),
  strategy: z.enum(['ADOPT', 'ADAPT', 'BRIDGE', 'MIGRATE', 'REBUILD_COMPONENT', 'REBUILD_PAGE', 'REBUILD_SHELL']).optional(),
  scopeTarget: z.string().default('DashboardView'),
  scopeLevel: z.enum(['COMPONENT', 'PAGE', 'FEATURE', 'SHELL', 'MODULE', 'APPLICATION']).default('PAGE')
});
export type CreateModernizationPlanInput = z.infer<typeof CreateModernizationPlanInputSchema>;

// 95. select_modernization_strategy
export const SelectModernizationStrategyInputSchema = z.object({
  requestedStrategy: z.string(),
  projectPath: z.string().optional(),
  explicitUserApproval: z.boolean().optional(),
  explicitUserRequest: z.boolean().optional(),
  hasCheckpointPlan: z.boolean().optional(),
  hasRollbackPlan: z.boolean().optional(),
  preservationImpactReviewed: z.boolean().optional(),
  justification: z.string().optional()
});
export type SelectModernizationStrategyInput = z.infer<typeof SelectModernizationStrategyInputSchema>;

// 96. create_modernization_stages
export const CreateModernizationStagesInputSchema = z.object({
  scopeLevel: z.enum(['COMPONENT', 'PAGE', 'FEATURE', 'SHELL', 'MODULE', 'APPLICATION']).default('PAGE'),
  targetName: z.string().default('TargetComponent'),
  strategy: z.enum(['ADOPT', 'ADAPT', 'BRIDGE', 'MIGRATE', 'REBUILD_COMPONENT', 'REBUILD_PAGE', 'REBUILD_SHELL']).default('BRIDGE')
});
export type CreateModernizationStagesInput = z.infer<typeof CreateModernizationStagesInputSchema>;

// 97. evaluate_modernization_completion
export const EvaluateModernizationCompletionInputSchema = z.object({
  technical: z.enum(['PASS', 'FAIL', 'BLOCKED']),
  visualAI: z.enum(['PASS', 'FAIL', 'HEURISTIC_ACCEPTABLE']),
  ux: z.enum(['PASS', 'FAIL']),
  accessibility: z.enum(['PASS', 'FAIL']),
  security: z.enum(['PASS', 'FAIL']),
  regression: z.enum(['PASS', 'FAIL']),
  contentTruth: z.enum(['PASS', 'FAIL']),
  humanVisualApproval: z.enum(['APPROVED', 'PENDING', 'REJECTED', 'NOT_APPLICABLE_SYNTHETIC_FIXTURE'])
});
export type EvaluateModernizationCompletionInput = z.infer<typeof EvaluateModernizationCompletionInputSchema>;





