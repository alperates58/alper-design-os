import { z } from 'zod';

// ============================================================================
// 1. Source Types (Phase 1D: 23 official types + backward-compatible aliases)
// ============================================================================
export const SourceTypeSchema = z.enum([
  // Core Phase 1D Taxonomy
  'DESIGN_SYSTEM',
  'COMPONENT_LIBRARY',
  'COMPONENT_REGISTRY',
  'HEADLESS_UI',
  'ACCESSIBILITY_LIBRARY',
  'UX_PATTERN_LIBRARY',
  'DESIGN_TOKEN_SYSTEM',
  'ICON_LIBRARY',
  'DATA_GRID',
  'CHART_LIBRARY',
  'FORM_LIBRARY',
  'TABLE_LIBRARY',
  'LAYOUT_LIBRARY',
  'ANIMATION_LIBRARY',
  'VISUALIZATION_LIBRARY',
  'AI_SKILL',
  'PROMPT_LIBRARY',
  'MCP_SERVER',
  'REFERENCE_IMPLEMENTATION',
  'DESIGN_GUIDELINE',
  'FRONTEND_FRAMEWORK',
  'CSS_FRAMEWORK',
  'THEME_SYSTEM',
  // Backward compatibility aliases
  'UX_GUIDELINE',
  'ACCESSIBILITY_STANDARD',
  'PUBLIC_API',
  'TYPOGRAPHY_RESOURCE',
  'SECURITY_STANDARD',
  'ENGINEERING_STANDARD'
]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

// ============================================================================
// 2. Integration & Usage Modes
// ============================================================================
export const IntegrationModeSchema = z.enum([
  'REFERENCE',
  'KNOWLEDGE',
  'DIRECT_CODE',
  'ADAPTER',
  'REGISTRY',
  'MCP',
  'API'
]);
export type IntegrationMode = z.infer<typeof IntegrationModeSchema>;

export const UsageModeSchema = z.enum([
  'REFERENCE_ONLY',
  'KNOWLEDGE',
  'CODE_ALLOWED',
  'ADAPTER_ALLOWED',
  'MCP',
  'API',
  'REGISTRY'
]);
export type UsageMode = z.infer<typeof UsageModeSchema>;

export const AccessibilityLevelSchema = z.enum([
  'WCAG_2_1_AA',
  'WCAG_2_1_AAA',
  'PARTIAL',
  'NOT_SPECIFIED'
]);
export type AccessibilityLevel = z.infer<typeof AccessibilityLevelSchema>;

export const MaturitySchema = z.enum([
  'EXPERIMENTAL',
  'BETA',
  'STABLE',
  'MATURE',
  'DEPRECATED'
]);
export type Maturity = z.infer<typeof MaturitySchema>;

export const MaintenanceStatusSchema = z.enum([
  'ACTIVE',
  'PERIODIC',
  'DORMANT',
  'DEPRECATED'
]);
export type MaintenanceStatus = z.infer<typeof MaintenanceStatusSchema>;

export const DocumentationQualitySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'EXEMPLARY'
]);
export type DocumentationQuality = z.infer<typeof DocumentationQualitySchema>;

export const SourceFreshnessStatusSchema = z.enum([
  'CURRENT',
  'UPDATE_AVAILABLE',
  'STALE',
  'UNREACHABLE',
  'UNKNOWN'
]);
export type SourceFreshnessStatus = z.infer<typeof SourceFreshnessStatusSchema>;

export const LicenseCompatibilitySchema = z.enum([
  'PERMISSIVE',
  'COPYLEFT',
  'RESTRICTED',
  'UNCLEAR'
]);
export type LicenseCompatibility = z.infer<typeof LicenseCompatibilitySchema>;

// ============================================================================
// 3. Dependency Cost Schema
// ============================================================================
export const DependencyCostSchema = z.object({
  dependencyCount: z.number().min(0).default(0),
  bundleImpactKb: z.number().min(0).default(0),
  runtimeCost: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
  cssImpact: z.enum(['MINIMAL', 'MODERATE', 'HEAVY']).default('MINIMAL'),
  maintenanceCost: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW')
});
export type DependencyCost = z.infer<typeof DependencyCostSchema>;

// ============================================================================
// 4. Source Metadata V1 (Backward-compatible)
// ============================================================================
export const SourceMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: SourceTypeSchema,
  description: z.string(),
  homepage: z.string().url(),
  repository: z.string().url().optional(),
  license: z.string(),
  licenseUrl: z.string().url().optional(),
  maintainer: z.string(),
  lastUpdated: z.string(),
  frameworks: z.array(z.string()),
  technologies: z.array(z.string()),
  strengths: z.array(z.string()),
  domains: z.array(z.string()),
  accessibilityLevel: AccessibilityLevelSchema,
  maturity: MaturitySchema,
  popularity: z.number().min(0).max(100),
  documentationQuality: DocumentationQualitySchema,
  codeReuseAllowed: z.boolean(),
  modificationAllowed: z.boolean(),
  redistributionAllowed: z.boolean(),
  attributionRequired: z.boolean(),
  usageMode: UsageModeSchema,
  trustScore: z.number().min(0).max(100),
  lastChecked: z.string().optional(),
  version: z.string().optional(),
  latestKnownVersion: z.string().optional(),
  updateStatus: SourceFreshnessStatusSchema.optional(),
  sourceHash: z.string().optional()
});
export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;

// ============================================================================
// 5. Source Metadata V2 (Comprehensive Phase 1D Specification)
// ============================================================================
export const SourceMetadataV2Schema = z.object({
  id: z.string(),
  name: z.string(),
  type: SourceTypeSchema,
  description: z.string(),
  homepage: z.string().url(),
  repository: z.string().url().optional(),
  documentation: z.string().url().optional(),
  maintainer: z.string(),
  license: z.string(),
  licenseUrl: z.string().url().optional(),
  version: z.string().optional(),
  latestKnownVersion: z.string().optional(),
  lastReleaseDate: z.string().optional(),
  lastCommitDate: z.string().optional(),
  lastChecked: z.string(),
  stars: z.number().default(0),
  forks: z.number().default(0),
  openIssues: z.number().default(0),
  archived: z.boolean().default(false),
  maintenanceStatus: MaintenanceStatusSchema.default('ACTIVE'),

  frameworks: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  renderingModels: z.array(z.string()).default(['CSR']),
  stylingModels: z.array(z.string()).default(['CSS_VARIABLES']),

  supportsReact: z.boolean().default(false),
  supportsVue: z.boolean().default(false),
  supportsSvelte: z.boolean().default(false),
  supportsAngular: z.boolean().default(false),
  supportsVanilla: z.boolean().default(false),
  supportsWebComponents: z.boolean().default(false),
  supportsPHP: z.boolean().default(false),
  supportsLaravel: z.boolean().default(false),
  supportsAspNet: z.boolean().default(false),

  accessibilitySupport: z.enum(['EXEMPLARY', 'WCAG_AAA', 'WCAG_AA', 'PARTIAL', 'NOT_SPECIFIED']).default('WCAG_AA'),
  rtlSupport: z.boolean().default(false),
  darkMode: z.boolean().default(true),
  responsiveSupport: z.boolean().default(true),
  designTokens: z.boolean().default(false),
  typescriptSupport: z.boolean().default(true),

  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  bestFor: z.array(z.string()).default([]),
  avoidFor: z.array(z.string()).default([]),

  enterpriseSuitability: z.number().min(0).max(1).default(0.5),
  consumerSuitability: z.number().min(0).max(1).default(0.5),
  dataDenseSuitability: z.number().min(0).max(1).default(0.5),
  mobileSuitability: z.number().min(0).max(1).default(0.5),
  dashboardSuitability: z.number().min(0).max(1).default(0.5),
  marketingSuitability: z.number().min(0).max(1).default(0.5),

  documentationQuality: z.number().min(0).max(1).default(0.8),
  codeQuality: z.number().min(0).max(1).default(0.8),
  designQuality: z.number().min(0).max(1).default(0.8),
  accessibilityQuality: z.number().min(0).max(1).default(0.8),
  maintenanceQuality: z.number().min(0).max(1).default(0.8),
  communityQuality: z.number().min(0).max(1).default(0.8),

  licenseCompatibility: LicenseCompatibilitySchema.default('PERMISSIVE'),
  codeReuseAllowed: z.boolean().default(true),
  modificationAllowed: z.boolean().default(true),
  redistributionAllowed: z.boolean().default(true),
  attributionRequired: z.boolean().default(true),

  integrationModes: z.array(IntegrationModeSchema).default(['REFERENCE', 'KNOWLEDGE']),
  dependencyCost: DependencyCostSchema.default({}),

  trustScore: z.number().min(0).max(100).default(80),
  qualityScore: z.number().min(0).max(100).default(80),
  maintenanceScore: z.number().min(0).max(100).default(80),
  compatibilityScore: z.number().min(0).max(100).default(80),
  overallScore: z.number().min(0).max(100).default(80)
});
export type SourceMetadataV2 = z.infer<typeof SourceMetadataV2Schema>;

// ============================================================================
// 6. Pattern Knowledge Graph Schema
// ============================================================================
export const PatternIdSchema = z.enum([
  'APP_SHELL',
  'SIDEBAR',
  'TOP_NAV',
  'COMMAND_PALETTE',
  'DATA_TABLE',
  'DENSE_GRID',
  'MASTER_DETAIL',
  'SPLIT_PANE',
  'FILTER_BAR',
  'SEARCH',
  'FORM',
  'WIZARD',
  'TIMELINE',
  'CALENDAR',
  'KANBAN',
  'TREE',
  'GRAPH',
  'CHART',
  'KPI',
  'NOTIFICATION',
  'MODAL',
  'DRAWER',
  'CONTEXT_MENU',
  'EMPTY_STATE',
  'ERROR_STATE',
  'LOADING_STATE',
  'BULK_ACTION',
  'INLINE_EDIT',
  'AUDIT_TRAIL'
]);
export type PatternId = z.infer<typeof PatternIdSchema>;

export const PatternNodeSchema = z.object({
  id: PatternIdSchema,
  name: z.string(),
  intent: z.string(),
  category: z.enum([
    'NAVIGATION',
    'DATA_DISPLAY',
    'FEEDBACK_STATUS',
    'CONTAINER_SURFACE',
    'COMMAND_INPUT',
    'WORKFLOW_ORCHESTRATION'
  ]),
  appropriateWhen: z.array(z.string()),
  avoidWhen: z.array(z.string()),
  informationDensity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  interactionComplexity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  keyboardNeeds: z.array(z.string()),
  mobileStrategy: z.string(),
  accessibilityNotes: z.array(z.string()),
  relatedPatterns: z.array(PatternIdSchema),
  candidateSources: z.array(z.string())
});
export type PatternNode = z.infer<typeof PatternNodeSchema>;

// ============================================================================
// 7. Shadcn Component Registry Schema
// ============================================================================
export const RegistryTypeSchema = z.enum([
  'OFFICIAL',
  'COMMUNITY',
  'GITHUB_HOSTED',
  'NAMESPACE'
]);
export type RegistryType = z.infer<typeof RegistryTypeSchema>;

export const RegistrySourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: RegistryTypeSchema,
  registryUrl: z.string().url(),
  homepage: z.string().url(),
  description: z.string(),
  registryFormat: z.enum(['SHADCN_V1', 'SHADCN_V2', 'CUSTOM_JSON']),
  componentCount: z.number().default(0),
  blockCount: z.number().default(0),
  templateCount: z.number().default(0),
  requiresAuth: z.boolean().default(false),
  freeTier: z.boolean().default(true),
  license: z.string().default('MIT'),
  lastChecked: z.string()
});
export type RegistrySource = z.infer<typeof RegistrySourceSchema>;

export const RegistryComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  registryId: z.string(),
  type: z.enum(['component', 'block', 'hook', 'ui', 'template']),
  description: z.string(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  files: z.array(z.string()).default([]),
  category: z.string().optional()
});
export type RegistryComponent = z.infer<typeof RegistryComponentSchema>;

// ============================================================================
// 8. Design System Knowledge Record Schema
// ============================================================================
export const KnowledgeCategorySchema = z.enum([
  'navigation',
  'forms',
  'tables',
  'feedback',
  'layout',
  'typography',
  'color',
  'spacing',
  'accessibility',
  'responsive',
  'enterprise',
  'mobile',
  'motion',
  'content-design'
]);
export type KnowledgeCategory = z.infer<typeof KnowledgeCategorySchema>;

export const DesignSystemKnowledgeRecordSchema = z.object({
  id: z.string(),
  principle: z.string(),
  source: z.string(),
  sourceUrl: z.string().url(),
  category: KnowledgeCategorySchema,
  summary: z.string(),
  applicability: z.string(),
  confidence: z.number().min(0).max(1).default(0.9)
});
export type DesignSystemKnowledgeRecord = z.infer<typeof DesignSystemKnowledgeRecordSchema>;

// ============================================================================
// 9. AI Skill Intelligence Schema
// ============================================================================
export const SkillQualitySchema = z.enum(['POOR', 'ACCEPTABLE', 'HIGH', 'EXEMPLARY']);
export type SkillQuality = z.infer<typeof SkillQualitySchema>;

export const SecurityRiskLevelSchema = z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type SecurityRiskLevel = z.infer<typeof SecurityRiskLevelSchema>;

export const SkillApprovalStatusSchema = z.enum(['APPROVED', 'REJECTED', 'NEEDS_SANDBOXING']);
export type SkillApprovalStatus = z.infer<typeof SkillApprovalStatusSchema>;

export const SkillAuditReportSchema = z.object({
  skillId: z.string(),
  name: z.string(),
  source: z.string(),
  license: z.string(),
  scope: z.string(),
  quality: SkillQualitySchema,
  conflictingRules: z.array(z.string()),
  securityRisk: SecurityRiskLevelSchema,
  verifiedSafe: z.boolean(),
  suggestedUse: z.string(),
  approvalStatus: SkillApprovalStatusSchema,
  promptInjectionRisk: z.boolean().default(false),
  maliciousCommandRisk: z.boolean().default(false)
});
export type SkillAuditReport = z.infer<typeof SkillAuditReportSchema>;

// ============================================================================
// 10. Prompt Intelligence Schema
// ============================================================================
export const PromptLibraryEntrySchema = z.object({
  id: z.string(),
  intent: z.string(),
  domain: z.string(),
  taskType: z.string(),
  source: z.string(),
  quality: z.enum(['ACCEPTABLE', 'HIGH', 'EXEMPLARY']),
  risk: SecurityRiskLevelSchema,
  variables: z.array(z.string()),
  templateText: z.string(),
  expectedOutput: z.string(),
  evaluationCriteria: z.array(z.string())
});
export type PromptLibraryEntry = z.infer<typeof PromptLibraryEntrySchema>;

// ============================================================================
// 11. Icon System Metadata Schema
// ============================================================================
export const IconSystemMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  license: z.string(),
  iconCount: z.number(),
  styleFamilies: z.array(z.string()),
  treeShaking: z.boolean(),
  frameworkSupport: z.array(z.string()),
  strokeFilledSupport: z.boolean(),
  accessibilityGuidance: z.string(),
  bestFor: z.string()
});
export type IconSystemMetadata = z.infer<typeof IconSystemMetadataSchema>;

// ============================================================================
// 12. Chart Library Metadata Schema
// ============================================================================
export const ChartLibraryMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  renderingEngine: z.enum(['SVG', 'CANVAS', 'WEBGL', 'HYBRID']),
  largeDataSupport: z.boolean(),
  interactionSupport: z.array(z.string()),
  accessibilitySupport: z.string(),
  typescript: z.boolean(),
  license: z.string(),
  bundleSizeKb: z.number(),
  frameworks: z.array(z.string()),
  chartTypes: z.array(z.string()),
  bestFor: z.string()
});
export type ChartLibraryMetadata = z.infer<typeof ChartLibraryMetadataSchema>;

// ============================================================================
// 13. Data Grid Metadata Schema
// ============================================================================
export const DataGridMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  license: z.string(),
  isHeadless: z.boolean(),
  virtualization: z.boolean(),
  grouping: z.boolean(),
  pivot: z.boolean(),
  filtering: z.boolean(),
  sorting: z.boolean(),
  editing: z.boolean(),
  treeData: z.boolean(),
  serverSideData: z.boolean(),
  keyboardNavigation: z.boolean(),
  accessibility: z.string(),
  exportSupport: z.array(z.string()),
  maxRecommendedRows: z.number(),
  paidFeaturesNote: z.string().optional(),
  freeFeatures: z.array(z.string()),
  enterpriseOnlyFeatures: z.array(z.string())
});
export type DataGridMetadata = z.infer<typeof DataGridMetadataSchema>;

// ============================================================================
// 14. Source Conflict & Explanation Schemas
// ============================================================================
export const SourceConflictRecordSchema = z.object({
  id: z.string(),
  sourceA: z.string(),
  sourceB: z.string(),
  topic: z.string(),
  difference: z.string(),
  projectContext: z.string(),
  chosenApproach: z.string(),
  reason: z.string()
});
export type SourceConflictRecord = z.infer<typeof SourceConflictRecordSchema>;

export const RecommendationExplanationSchema = z.object({
  sourceId: z.string(),
  sourceName: z.string(),
  compositeScore: z.number(),
  primaryRecommendationReason: z.string(),
  scoreBreakdown: z.object({
    domainSuitability: z.number(),
    stackCompatibility: z.number(),
    accessibilityScore: z.number(),
    maintenanceScore: z.number(),
    trustScore: z.number()
  }),
  highlights: z.array(z.string()),
  caveats: z.array(z.string())
});
export type RecommendationExplanation = z.infer<typeof RecommendationExplanationSchema>;

// ============================================================================
// 15. Source Discovery & Ranking Schemas
// ============================================================================
export const McpSecurityProfileSchema = z.enum([
  'SANDBOXED',
  'LOCAL_SYSTEM',
  'NETWORK_OUTBOUND',
  'ELEVATED'
]);
export type McpSecurityProfile = z.infer<typeof McpSecurityProfileSchema>;

export const McpSelectionResultSchema = z.object({
  mcpId: z.string(),
  name: z.string(),
  needJustification: z.string(),
  relevanceScore: z.number().min(0).max(100),
  trustScore: z.number().min(0).max(100),
  license: z.string(),
  maintenance: z.enum(['ACTIVE', 'PERIODIC', 'DORMANT']),
  security: McpSecurityProfileSchema,
  recommended: z.boolean()
});
export type McpSelectionResult = z.infer<typeof McpSelectionResultSchema>;

export const ApiAuthTypeSchema = z.enum(['NONE', 'API_KEY', 'OAUTH2', 'BEARER', 'CUSTOM']);
export type ApiAuthType = z.infer<typeof ApiAuthTypeSchema>;

export const ApiMetadataSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  authentication: z.union([ApiAuthTypeSchema, z.string()]),
  https: z.boolean(),
  cors: z.union([z.enum(['YES', 'NO', 'UNKNOWN']), z.string()]),
  rateLimit: z.string(),
  freeTier: z.boolean(),
  documentation: z.string(),
  lastVerified: z.string()
});
export type ApiMetadata = z.infer<typeof ApiMetadataSchema>;

export interface RankingWeights {
  trust: number;
  documentation: number;
  accessibility: number;
  maintenance: number;
  stackCompatibility: number;
  domainCompatibility: number;
  licenseCompatibility: number;
}

export const defaultRankingWeights: RankingWeights = {
  trust: 0.20,
  documentation: 0.15,
  accessibility: 0.20,
  maintenance: 0.15,
  stackCompatibility: 0.15,
  domainCompatibility: 0.10,
  licenseCompatibility: 0.05
};

export interface RankingScoreBreakdown {
  trustScore: number;
  documentationScore: number;
  accessibilityScore: number;
  maintenanceScore: number;
  stackCompatibilityScore: number;
  domainCompatibilityScore: number;
  licenseCompatibilityScore: number;
  finalWeightedScore: number;
}

export interface RankedSource {
  source: SourceMetadata;
  sourceV2?: SourceMetadataV2;
  scoreBreakdown: RankingScoreBreakdown;
  compositeScore: number;
  breakdown: {
    trust: number;
    documentation: number;
    accessibility: number;
    maintenance: number;
    stackCompatibility: number;
    domainCompatibility: number;
    licenseCompatibility: number;
  };
  matchReasons: string[];
  explanation?: RecommendationExplanation;
}

export interface SourceDiscoveryFilter {
  type?: SourceType;
  types?: SourceType[];
  framework?: string;
  domain?: string;
  accessibilityLevel?: AccessibilityLevel;
  usageMode?: UsageMode;
  maxLicenseRisk?: 'PERMISSIVE_ONLY' | 'ANY_OPEN_SOURCE' | 'ALL';
  minTrustScore?: number;
  searchQuery?: string;
  minStars?: number;
  integrationMode?: IntegrationMode;
}

export interface LicenseCheckResult {
  license: string;
  isPermissive: boolean;
  isCopyleft: boolean;
  codeReuseAllowed: boolean;
  allowsCodeReuse: boolean;
  commercialUseAllowed: boolean;
  allowsCommercialUse: boolean;
  attributionRequired: boolean;
  compatibleWithCommercialEnterprise: boolean;
  notes: string;
}
