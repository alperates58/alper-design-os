import { z } from 'zod';

// 1. Security Standards & Levels
export const SecurityStandardSchema = z.enum([
  'OWASP_ASVS_5_0',
  'OWASP_TOP_10_2025',
  'NIST_SSDF_1_1',
  'NIST_SSDF_1_2_DRAFT',
  'CWE_TOP_25'
]);
export type SecurityStandard = z.infer<typeof SecurityStandardSchema>;

export const SecurityLevelSchema = z.enum([
  'LEVEL_1', // Baseline standard
  'LEVEL_2', // Enterprise & sensitive data
  'LEVEL_3', // High assurance & critical infrastructure
  'STRICT'
]);
export type SecurityLevel = z.infer<typeof SecurityLevelSchema>;

// 2. Code Quality Rules
export const CodeQualityRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  tool: z.string(),
  severity: z.enum(['ERROR', 'WARNING', 'INFO']),
  description: z.string(),
  autofixable: z.boolean().default(false)
});
export type CodeQualityRule = z.infer<typeof CodeQualityRuleSchema>;

// 3. Performance Budgets (Core Web Vitals default: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1)
export const PerformanceBudgetsSchema = z.object({
  lcpMs: z.number().positive().default(2500),
  inpMs: z.number().positive().default(200),
  cls: z.number().nonnegative().default(0.1),
  maxInitialJsBundleKb: z.number().positive().default(300),
  maxTotalPageWeightKb: z.number().positive().default(1500),
  maxApiLatencyMs: z.number().positive().default(500)
});
export type PerformanceBudgets = z.infer<typeof PerformanceBudgetsSchema>;

// 4. Testing Requirements
export const TestingRequirementsSchema = z.object({
  minUnitCoveragePercent: z.number().min(0).max(100).default(80),
  requireIntegrationTests: z.boolean().default(true),
  requireE2eTests: z.boolean().default(true),
  requireAccessibilityTests: z.boolean().default(true),
  requireContractTests: z.boolean().default(false),
  requireVisualRegressionTests: z.boolean().default(false),
  testPyramidFocus: z.enum(['UNIT_HEAVY', 'BALANCED', 'E2E_HEAVY'])
});
export type TestingRequirements = z.infer<typeof TestingRequirementsSchema>;

// 5. Dependency & Supply Chain Policy
export const DependencyPolicySchema = z.object({
  blockKnownVulnerabilities: z.enum(['CRITICAL_ONLY', 'HIGH_AND_CRITICAL', 'ALL_CVE']),
  allowedLicenses: z.array(z.string()).default(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC']),
  disallowGplInProprietary: z.boolean().default(true),
  maxDependencyAgeDays: z.number().positive().default(365),
  requireLockfileVerification: z.boolean().default(true),
  enforceAuditInCi: z.boolean().default(true)
});
export type DependencyPolicy = z.infer<typeof DependencyPolicySchema>;

// 6. Secret Management Policy
export const SecretPolicySchema = z.object({
  zeroToleranceSecrets: z.boolean().default(true),
  scanPatterns: z.array(z.string()).default([
    'AWS_KEY',
    'OPENAI_API_KEY',
    'JWT_SECRET',
    'DATABASE_URL',
    'PRIVATE_KEY',
    'GENERIC_SECRET'
  ]),
  requireEnvExample: z.boolean().default(true),
  enforcePreCommitHook: z.boolean().default(true)
});
export type SecretPolicy = z.infer<typeof SecretPolicySchema>;

// 7. Static Analysis (SAST) Configuration
export const StaticAnalysisConfigSchema = z.object({
  enabledLinters: z.array(z.string()),
  semgrepEnabled: z.boolean().default(true),
  strictTypeChecking: z.boolean().default(true),
  securityRuleset: z.string().default('p/security-audit'),
  failOnWarning: z.boolean().default(false)
});
export type StaticAnalysisConfig = z.infer<typeof StaticAnalysisConfigSchema>;

// 8. Dynamic Analysis (DAST) Configuration
export const DynamicAnalysisConfigSchema = z.object({
  mode: z.enum(['PASSIVE_ONLY', 'ACTIVE_RESTRICTED']),
  allowedEnvironments: z.array(z.enum(['LOCALHOST', 'DEVELOPMENT', 'STAGING', 'PRODUCTION'])),
  zapScanEnabled: z.boolean().default(false),
  requireExplicitApprovalForActive: z.boolean().default(true)
});
export type DynamicAnalysisConfig = z.infer<typeof DynamicAnalysisConfigSchema>;

// 9. Accessibility Targets
export const AccessibilityTargetSchema = z.object({
  standard: z.enum(['WCAG_2_1_AA', 'WCAG_2_1_AAA', 'WCAG_2_2_AA']),
  axeRuleset: z.enum(['wcag2aa', 'wcag21aa', 'wcag22aa']),
  zeroViolationsAllowed: z.boolean().default(true),
  enforceKeyboardNavigationCheck: z.boolean().default(true)
});
export type AccessibilityTarget = z.infer<typeof AccessibilityTargetSchema>;

// 10. Release Gates Policy
export const ReleaseGatePolicySchema = z.object({
  blockOnCriticalSecurity: z.boolean().default(true),
  blockOnHighSecurity: z.boolean().default(true),
  blockOnSecretDetected: z.boolean().default(true),
  blockOnExploitableDependency: z.boolean().default(true),
  blockOnFailedCriticalTests: z.boolean().default(true),
  mediumSecurityAction: z.enum(['BLOCK', 'WARN']).default('WARN'),
  lowSecurityAction: z.enum(['BLOCK', 'WARN', 'IGNORE']).default('WARN')
});
export type ReleaseGatePolicy = z.infer<typeof ReleaseGatePolicySchema>;

// Master Engineering Quality Profile Schema
export const EngineeringQualityProfileSchema = z.object({
  profileId: z.string(),
  stackId: z.string(),
  securityStandard: SecurityStandardSchema,
  securityLevel: SecurityLevelSchema,
  codeQualityRules: z.array(CodeQualityRuleSchema),
  performanceBudgets: PerformanceBudgetsSchema,
  testingRequirements: TestingRequirementsSchema,
  dependencyPolicy: DependencyPolicySchema,
  secretPolicy: SecretPolicySchema,
  staticAnalysis: StaticAnalysisConfigSchema,
  dynamicAnalysis: DynamicAnalysisConfigSchema,
  accessibilityTargets: AccessibilityTargetSchema,
  releaseGates: ReleaseGatePolicySchema
});
export type EngineeringQualityProfile = z.infer<typeof EngineeringQualityProfileSchema>;

// Finding & Audit Structures
export const FindingSeveritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']);
export type FindingSeverity = z.infer<typeof FindingSeveritySchema>;

export const FindingCategorySchema = z.enum([
  'SECURITY',
  'CODE_QUALITY',
  'PERFORMANCE',
  'RELIABILITY',
  'TESTING',
  'SUPPLY_CHAIN',
  'SECRET',
  'API_SECURITY',
  'AI_SAFETY'
]);
export type FindingCategory = z.infer<typeof FindingCategorySchema>;

export const AuditFindingSchema = z.object({
  id: z.string(),
  category: FindingCategorySchema,
  severity: FindingSeveritySchema,
  title: z.string(),
  description: z.string(),
  location: z.object({
    file: z.string(),
    line: z.number().optional(),
    column: z.number().optional()
  }).optional(),
  tool: z.string(),
  ruleId: z.string().optional(),
  remediation: z.string()
});
export type AuditFinding = z.infer<typeof AuditFindingSchema>;

// Release Gate Evaluation Result
export const ReleaseGateEvaluationSchema = z.object({
  passed: z.boolean(),
  decision: z.enum(['PASS', 'BLOCK', 'WARN']),
  summary: z.string(),
  blockers: z.array(AuditFindingSchema),
  warnings: z.array(AuditFindingSchema),
  passedGates: z.array(z.string()),
  failedGates: z.array(z.string())
});
export type ReleaseGateEvaluation = z.infer<typeof ReleaseGateEvaluationSchema>;

// Threat Model Schema
export const ThreatEntrySchema = z.object({
  id: z.string(),
  category: z.enum(['SPOOFING', 'TAMPERING', 'REPUDIATION', 'INFO_DISCLOSURE', 'DENIAL_OF_SERVICE', 'ELEVATION_OF_PRIVILEGE']),
  description: z.string(),
  impact: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  mitigation: z.string(),
  status: z.enum(['MITIGATED', 'UNMITIGATED', 'ACCEPTED_RISK'])
});
export type ThreatEntry = z.infer<typeof ThreatEntrySchema>;

export const ThreatModelSchema = z.object({
  productName: z.string(),
  domain: z.string(),
  assessedAt: z.string(),
  assets: z.array(z.string()),
  entryPoints: z.array(z.string()),
  threats: z.array(ThreatEntrySchema),
  recommendations: z.array(z.string())
});
export type ThreatModel = z.infer<typeof ThreatModelSchema>;

// Tool Capability Status
export const CapabilityStatusSchema = z.enum(['AVAILABLE', 'OPTIONAL', 'MISSING', 'UNSUPPORTED']);
export type CapabilityStatus = z.infer<typeof CapabilityStatusSchema>;

export const ToolCapabilitySchema = z.object({
  toolId: z.string(),
  name: z.string(),
  category: z.string(),
  status: CapabilityStatusSchema,
  version: z.string().optional(),
  installRecommendation: z.string().optional(),
  missingReason: z.string().optional()
});
export type ToolCapability = z.infer<typeof ToolCapabilitySchema>;
