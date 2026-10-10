import { z } from 'zod';

// 1. Source Types (12 types)
export const SourceTypeSchema = z.enum([
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
  'REFERENCE_IMPLEMENTATION',
  'SECURITY_STANDARD',
  'ENGINEERING_STANDARD'
]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

// 2. Usage Modes (7 modes)
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

// 3. Normalized Source Metadata Schema
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
  // Phase 1B: Source Freshness tracking
  lastChecked: z.string().optional(),
  version: z.string().optional(),
  latestKnownVersion: z.string().optional(),
  updateStatus: SourceFreshnessStatusSchema.optional(),
  sourceHash: z.string().optional()
});
export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;

// 4. Skill Intelligence Schema
export const SkillQualitySchema = z.enum(['POOR', 'ACCEPTABLE', 'HIGH', 'EXEMPLARY']);
export type SkillQuality = z.infer<typeof SkillQualitySchema>;

export const SecurityRiskLevelSchema = z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type SecurityRiskLevel = z.infer<typeof SecurityRiskLevelSchema>;

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
  approvalStatus: z.enum(['APPROVED', 'REJECTED', 'NEEDS_SANDBOXING'])
});
export type SkillAuditReport = z.infer<typeof SkillAuditReportSchema>;

// 5. MCP Discovery & Selection Criteria
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

// 6. Public API Discovery Metadata
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

// 7. Source Ranking
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

