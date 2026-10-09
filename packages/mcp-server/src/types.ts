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
