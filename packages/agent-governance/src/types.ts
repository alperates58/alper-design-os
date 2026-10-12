import { z } from 'zod';

// ==========================================
// 1. Pipeline Stages
// ==========================================
export const PipelineStageSchema = z.enum([
  'UNDERSTAND',
  'RESEARCH',
  'PROFILE',
  'PLAN',
  'RISK_ASSESS',
  'APPROVE_IF_REQUIRED',
  'CHECKPOINT',
  'APPLY',
  'BUILD',
  'STATIC_VERIFY',
  'CONTENT_TRUTH_VERIFY',
  'RUNTIME_VERIFY',
  'VISUAL_VERIFY',
  'HUMAN_VISUAL_APPROVAL',
  'SECURITY_VERIFY',
  'PERFORMANCE_VERIFY',
  'INDEPENDENT_REVIEW',
  'EVIDENCE',
  'ACCEPT_REPAIR_ROLLBACK'
]);
export type PipelineStage = z.infer<typeof PipelineStageSchema>;

export const PipelineExecutionPlanSchema = z.object({
  pipelineId: z.string(),
  objective: z.string(),
  activeStages: z.array(PipelineStageSchema),
  skippedStages: z.array(
    z.object({
      stage: PipelineStageSchema,
      reason: z.string()
    })
  ),
  estimatedRisk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  requiresApproval: z.boolean(),
  requiresCheckpoint: z.boolean()
});
export type PipelineExecutionPlan = z.infer<typeof PipelineExecutionPlanSchema>;

// ==========================================
// 2. Change Risk & Blast Radius
// ==========================================
export const ChangeRiskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type ChangeRiskLevel = z.infer<typeof ChangeRiskLevelSchema>;

export const RiskFactorsSchema = z.object({
  fileCount: z.number().nonnegative(),
  architectureImpact: z.boolean().default(false),
  databaseImpact: z.boolean().default(false),
  authenticationImpact: z.boolean().default(false),
  authorizationImpact: z.boolean().default(false),
  publicApiImpact: z.boolean().default(false),
  dependencyImpact: z.boolean().default(false),
  configurationImpact: z.boolean().default(false),
  deploymentImpact: z.boolean().default(false),
  dataLossPossibility: z.boolean().default(false)
});
export type RiskFactors = z.infer<typeof RiskFactorsSchema>;

export const RiskAssessmentSchema = z.object({
  overallRisk: ChangeRiskLevelSchema,
  score: z.number().min(0).max(100),
  factors: RiskFactorsSchema,
  reasons: z.array(z.string()),
  mandatoryCheckpoint: z.boolean(),
  requiresApproval: z.boolean(),
  recommendedSafeguards: z.array(z.string())
});
export type RiskAssessment = z.infer<typeof RiskAssessmentSchema>;

// ==========================================
// 3. Scope Guard
// ==========================================
export const ScopeStatusSchema = z.enum([
  'IN_SCOPE',
  'REQUIRED_DEPENDENCY',
  'OUT_OF_SCOPE',
  'FORBIDDEN'
]);
export type ScopeStatus = z.infer<typeof ScopeStatusSchema>;

export const ScopeEvaluationSchema = z.object({
  file: z.string(),
  status: ScopeStatusSchema,
  reason: z.string()
});
export type ScopeEvaluation = z.infer<typeof ScopeEvaluationSchema>;

export const ScopeAuditResultSchema = z.object({
  isClean: z.boolean(),
  allowedFiles: z.array(z.string()),
  violations: z.array(ScopeEvaluationSchema),
  expansions: z.array(ScopeEvaluationSchema),
  rejectedFiles: z.array(z.string()),
  summary: z.string()
});
export type ScopeAuditResult = z.infer<typeof ScopeAuditResultSchema>;

// ==========================================
// 4. Action Plan & Governance
// ==========================================
export const PlannedActionSchema = z.object({
  id: z.string(),
  description: z.string(),
  file: z.string().optional(),
  tool: z.string().optional(),
  riskLevel: ChangeRiskLevelSchema.default('LOW'),
  requiresVerification: z.boolean().default(true)
});
export type PlannedAction = z.infer<typeof PlannedActionSchema>;

export const VerificationPlanStepSchema = z.object({
  type: z.enum([
    'BUILD',
    'UNIT_TEST',
    'E2E_PLAYWRIGHT',
    'DEVTOOLS_RUNTIME',
    'STATIC_LINT',
    'SECURITY_SCAN',
    'A11Y_AUDIT',
    'PERFORMANCE_BUDGET',
    'VISUAL_REGRESSION',
    'REGRESSION_BASELINE_DIFF'
  ]),
  description: z.string(),
  commandOrTool: z.string().optional(),
  viewports: z.array(z.string()).optional()
});
export type VerificationPlanStep = z.infer<typeof VerificationPlanStepSchema>;

export const RollbackPlanSchema = z.object({
  strategy: z.enum(['GIT_CHECKOUT', 'GIT_REVERT', 'RESTORE_BACKUP', 'NONE']),
  checkpointRef: z.string().optional(),
  steps: z.array(z.string()),
  automated: z.boolean().default(true)
});
export type RollbackPlan = z.infer<typeof RollbackPlanSchema>;

export const AgentActionPlanSchema = z.object({
  objective: z.string(),
  requestedScope: z.array(z.string()),
  detectedProject: z.record(z.any()).optional(),
  filesExpectedToChange: z.array(z.string()),
  filesForbiddenToChange: z.array(z.string()).default([]),
  plannedActions: z.array(PlannedActionSchema),
  toolsRequired: z.array(z.string()),
  risks: z.array(z.string()),
  assumptions: z.array(z.string()),
  verificationPlan: z.array(VerificationPlanStepSchema),
  rollbackPlan: RollbackPlanSchema,
  approvalRequired: z.boolean(),
  estimatedBlastRadius: ChangeRiskLevelSchema
});
export type AgentActionPlan = z.infer<typeof AgentActionPlanSchema>;

// ==========================================
// 5. Git Safety
// ==========================================
export const GitWorkingTreeStatusSchema = z.object({
  isClean: z.boolean(),
  branch: z.string(),
  isMainOrMaster: z.boolean(),
  stagedFiles: z.array(z.string()),
  modifiedFiles: z.array(z.string()),
  untrackedFiles: z.array(z.string()),
  diffSnippet: z.string().optional()
});
export type GitWorkingTreeStatus = z.infer<typeof GitWorkingTreeStatusSchema>;

export const CheckpointPlanSchema = z.object({
  checkpointId: z.string(),
  branchName: z.string().optional(),
  commitMessage: z.string(),
  stashRef: z.string().optional(),
  safeToProceed: z.boolean(),
  requiresApproval: z.boolean(),
  warnings: z.array(z.string()),
  rollbackScript: z.array(z.string())
});
export type CheckpointPlan = z.infer<typeof CheckpointPlanSchema>;

export const DestructiveCommandCheckSchema = z.object({
  command: z.string(),
  isDestructive: z.boolean(),
  blockedReason: z.string().optional(),
  requiresExplicitApproval: z.boolean()
});
export type DestructiveCommandCheck = z.infer<typeof DestructiveCommandCheckSchema>;

// ==========================================
// 6. Independent Reviewer
// ==========================================
export const ReviewerVerdictSchema = z.enum([
  'APPROVE',
  'APPROVE_WITH_WARNINGS',
  'REPAIR_REQUIRED',
  'REJECT'
]);
export type ReviewerVerdict = z.infer<typeof ReviewerVerdictSchema>;

export const ReviewerCheckItemSchema = z.object({
  requirementCoverage: z.boolean(),
  scopeCompliance: z.boolean(),
  regressionRisk: z.boolean(),
  security: z.boolean(),
  architecture: z.boolean(),
  codeQuality: z.boolean(),
  duplication: z.boolean(),
  unnecessaryAbstraction: z.boolean(),
  accessibility: z.boolean(),
  performance: z.boolean(),
  visualConsistency: z.boolean(),
  errorHandling: z.boolean()
});
export type ReviewerCheckItem = z.infer<typeof ReviewerCheckItemSchema>;

export const ReviewerFindingSchema = z.object({
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
  category: z.string(),
  description: z.string(),
  suggestion: z.string().optional()
});
export type ReviewerFinding = z.infer<typeof ReviewerFindingSchema>;

export const IndependentReviewResultSchema = z.object({
  verdict: ReviewerVerdictSchema,
  summary: z.string(),
  checks: ReviewerCheckItemSchema,
  findings: z.array(ReviewerFindingSchema),
  evidenceInspected: z.array(z.string()),
  recommendedAction: z.string()
});
export type IndependentReviewResult = z.infer<typeof IndependentReviewResultSchema>;

// ==========================================
// 7. Evidence-Based Verification
// ==========================================
export const EvidenceTypeSchema = z.enum([
  'BUILD_OUTPUT',
  'TEST_RESULT',
  'SCREENSHOT',
  'VISUAL_DIFF',
  'CONSOLE_LOG',
  'NETWORK_TRACE',
  'PERFORMANCE_TRACE',
  'ACCESSIBILITY_REPORT',
  'SECURITY_REPORT',
  'DATABASE_ANALYSIS',
  'API_CONTRACT_RESULT',
  'STATIC_ANALYSIS',
  'GIT_DIFF'
]);
export type EvidenceType = z.infer<typeof EvidenceTypeSchema>;

export const VerificationEvidenceSchema = z.object({
  id: z.string(),
  type: EvidenceTypeSchema,
  source: z.string(),
  timestamp: z.string(),
  uriOrPath: z.string().optional(),
  summary: z.string(),
  verified: z.boolean(),
  rawData: z.any().optional()
});
export type VerificationEvidence = z.infer<typeof VerificationEvidenceSchema>;

// ==========================================
// 8. Claim Verification Policy
// ==========================================
export const ClaimVerificationStatusSchema = z.enum([
  'VERIFIED',
  'PARTIALLY_VERIFIED',
  'NOT_VERIFIED',
  'NOT_APPLICABLE',
  'FAILED'
]);
export type ClaimVerificationStatus = z.infer<typeof ClaimVerificationStatusSchema>;

export const ClaimVerificationResultSchema = z.object({
  claim: z.string(),
  status: ClaimVerificationStatusSchema,
  evidenceIds: z.array(z.string()),
  missingEvidence: z.array(z.string()),
  notes: z.string()
});
export type ClaimVerificationResult = z.infer<typeof ClaimVerificationResultSchema>;

// ==========================================
// 9. Domain Intelligence V2 & Research Evidence
// ==========================================
export const ResearchEvidenceSchema = z.object({
  claim: z.string(),
  source: z.string(),
  confidence: z.number().min(0).max(1),
  date: z.string(),
  relevance: z.string()
});
export type ResearchEvidence = z.infer<typeof ResearchEvidenceSchema>;

export const DomainResearchResultSchema = z.object({
  classification: z.string(),
  subdomain: z.string().optional(),
  evidence: z.array(ResearchEvidenceSchema),
  confidenceScore: z.number().min(0).max(1),
  isFallback: z.boolean().default(false),
  productModel: z.record(z.any()),
  personas: z.array(z.record(z.any())),
  workflows: z.array(z.record(z.any())),
  uxProfile: z.record(z.any())
});
export type DomainResearchResult = z.infer<typeof DomainResearchResultSchema>;

// ==========================================
// 10. Design Critic
// ==========================================
export const DesignCriticRatingSchema = z.enum(['EXCELLENT', 'ADEQUATE', 'NEEDS_WORK', 'POOR']);
export type DesignCriticRating = z.infer<typeof DesignCriticRatingSchema>;

export const DesignCriticDimensionSchema = z.object({
  category: z.enum([
    'VISUAL_HIERARCHY',
    'INFORMATION_HIERARCHY',
    'TYPOGRAPHY',
    'SPACING_RHYTHM',
    'DENSITY',
    'ALIGNMENT',
    'CONTRAST',
    'DISCOVERABILITY',
    'COGNITIVE_LOAD',
    'CONSISTENCY',
    'EMPTY_STATES',
    'LOADING_STATES',
    'ERROR_STATES',
    'INTERACTION_FEEDBACK',
    'DESKTOP_EFFICIENCY',
    'MOBILE_ERGONOMICS',
    'AI_GENERIC_APPEARANCE'
  ]),
  rating: DesignCriticRatingSchema,
  observation: z.string(),
  recommendations: z.array(z.string()),
  isSubjective: z.boolean().default(true)
});
export type DesignCriticDimension = z.infer<typeof DesignCriticDimensionSchema>;

export const DesignCritiqueResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  passed: z.boolean(),
  aiGenericSmellDetected: z.boolean(),
  dimensions: z.array(DesignCriticDimensionSchema),
  critiqueSummary: z.string(),
  actionableTweaks: z.array(z.string())
});
export type DesignCritiqueResult = z.infer<typeof DesignCritiqueResultSchema>;

// ==========================================
// 11. Behavioral Contract & Preservation
// ==========================================
export const BehavioralContractSchema = z.object({
  routes: z.array(
    z.object({
      path: z.string(),
      method: z.string().default('GET'),
      expectedStatus: z.number().optional()
    })
  ),
  apiContracts: z.array(
    z.object({
      endpoint: z.string(),
      method: z.string().default('GET'),
      payloadSchema: z.any().optional(),
      responseSchema: z.any().optional()
    })
  ),
  databaseBehaviors: z.array(
    z.object({
      table: z.string(),
      invariants: z.array(z.string())
    })
  ),
  permissions: z.array(
    z.object({
      role: z.string(),
      allowed: z.array(z.string())
    })
  ),
  businessRules: z.array(
    z.object({
      ruleId: z.string(),
      description: z.string()
    })
  )
});
export type BehavioralContract = z.infer<typeof BehavioralContractSchema>;

// ==========================================
// 12. Regression Guard
// ==========================================
export const RegressionCheckResultSchema = z.object({
  status: z.enum(['PASSED', 'REGRESSION_SUSPECTED', 'FAILED']),
  regressionsDetected: z.array(
    z.object({
      target: z.string(),
      baselineValue: z.any(),
      currentValue: z.any(),
      severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
      reason: z.string()
    })
  ),
  summary: z.string()
});
export type RegressionCheckResult = z.infer<typeof RegressionCheckResultSchema>;

// ==========================================
// 13. Environment & Reproducibility
// ==========================================
export const EnvironmentProfileSchema = z.object({
  nodeVersion: z.string().optional(),
  phpVersion: z.string().optional(),
  dotnetSdkVersion: z.string().optional(),
  packageManager: z
    .object({
      name: z.string(),
      version: z.string().optional()
    })
    .optional(),
  lockFiles: z.array(z.string()),
  requiredEnvVars: z.array(z.string()),
  externalServices: z.array(z.string()),
  databaseRequirements: z.array(z.string()),
  machineIndependent: z.boolean(),
  portabilityIssues: z.array(z.string())
});
export type EnvironmentProfile = z.infer<typeof EnvironmentProfileSchema>;

// ==========================================
// 14. Configuration & Secret Safety
// ==========================================
export const ConfigurationProfileSchema = z.object({
  configFiles: z.array(z.string()),
  secretPatternsMatched: z.number().nonnegative(),
  redactedKeys: z.array(z.string()),
  safeForInspection: z.boolean()
});
export type ConfigurationProfile = z.infer<typeof ConfigurationProfileSchema>;

// ==========================================
// 15. Context Budget & Routing
// ==========================================
export const ContextRoutingDecisionSchema = z.object({
  taskId: z.string(),
  mode: z.string(),
  stack: z.string().optional(),
  domain: z.string().optional(),
  requiredSkills: z.array(z.string()),
  requiredRules: z.array(z.string()),
  requiredSources: z.array(z.string()),
  requiredTools: z.array(z.string()),
  excludedSkills: z.array(z.string()),
  excludedTools: z.array(z.string()),
  rationale: z.string(),
  tokenBudgetReductionPercent: z.number().min(0).max(100)
});
export type ContextRoutingDecision = z.infer<typeof ContextRoutingDecisionSchema>;

// ==========================================
// 16. Tool Routing & Capabilities
// ==========================================
export const ToolMetadataSchema = z.object({
  name: z.string(),
  capability: z.string(),
  cost: z.enum(['FREE', 'LOW', 'MEDIUM', 'HIGH']),
  latency: z.enum(['FAST', 'MEDIUM', 'SLOW']),
  risk: ChangeRiskLevelSchema,
  requiresInternet: z.boolean(),
  requiresApproval: z.boolean(),
  readOnly: z.boolean(),
  destructive: z.boolean(),
  availability: z.enum(['AVAILABLE', 'MISSING', 'REQUIRES_NETWORK', 'UNSUPPORTED'])
});
export type ToolMetadata = z.infer<typeof ToolMetadataSchema>;

export const ToolRoutingDecisionSchema = z.object({
  taskDescription: z.string(),
  chosenTool: z.string(),
  fallbackTools: z.array(z.string()),
  rationale: z.string(),
  requiresApproval: z.boolean(),
  requiresNetwork: z.boolean()
});
export type ToolRoutingDecision = z.infer<typeof ToolRoutingDecisionSchema>;

// ==========================================
// 17. Policy Engine
// ==========================================
export const PolicyLevelSchema = z.enum([
  'USER_EXPLICIT_REQUIREMENT',
  'SECURITY_DATA_SAFETY',
  'PROJECT_RULES',
  'ALPER_DESIGN_OS_RULES',
  'FRAMEWORK_BEST_PRACTICES',
  'OPTIONAL_RECOMMENDATIONS'
]);
export type PolicyLevel = z.infer<typeof PolicyLevelSchema>;

export const ConflictResultSchema = z.object({
  conflictDetected: z.boolean(),
  higherPolicy: PolicyLevelSchema.optional(),
  lowerPolicy: PolicyLevelSchema.optional(),
  winningPolicy: PolicyLevelSchema.optional(),
  resolution: z.string()
});
export type ConflictResult = z.infer<typeof ConflictResultSchema>;

// ==========================================
// 18. Completion Contract
// ==========================================
export const CompletionContractSchema = z.object({
  requested: z.array(z.string()),
  implemented: z.array(z.string()),
  verified: z.array(z.string()),
  notVerified: z.array(z.string()),
  changedFiles: z.array(z.string()),
  testsRun: z.array(z.string()),
  evidence: z.array(z.string()),
  knownIssues: z.array(z.string()),
  warnings: z.array(z.string()),
  scopeChanges: z.array(z.string()),
  rollbackAvailable: z.boolean(),
  isComplete: z.boolean(),
  blockReason: z.string().optional()
});
export type CompletionContract = z.infer<typeof CompletionContractSchema>;

// ==========================================
// 19. Data Provenance & Source Authority (Phase 1E.7)
// ==========================================
export const DataOriginTypeSchema = z.enum([
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
]);
export type DataOriginType = z.infer<typeof DataOriginTypeSchema>;

export const SourceAuthorityTierSchema = z.enum([
  'AUTHORITATIVE_SYSTEM',
  'VERIFIED_EXTERNAL',
  'DERIVED_ANALYTICS',
  'PROVISIONAL_CACHE',
  'SYNTHETIC_MOCK',
  'UNVERIFIED_USER_INPUT',
  'HALLUCINATED_OR_FABRICATED'
]);
export type SourceAuthorityTier = z.infer<typeof SourceAuthorityTierSchema>;

export const DataFreshnessStatusSchema = z.enum([
  'LIVE',
  'NEAR_REALTIME',
  'CACHED',
  'STALE',
  'EXPIRED',
  'SYNTHETIC'
]);
export type DataFreshnessStatus = z.infer<typeof DataFreshnessStatusSchema>;

export const DataProvenanceRecordSchema = z.object({
  provenanceId: z.string(),
  fieldOrComponentId: z.string(),
  originType: DataOriginTypeSchema,
  authorityTier: SourceAuthorityTierSchema,
  freshness: DataFreshnessStatusSchema,
  endpointOrSource: z.string(),
  timestamp: z.string(),
  latencyMs: z.number().optional(),
  confidenceScore: z.number().min(0).max(1),
  isSimulated: z.boolean().default(false),
  isLabeledMock: z.boolean().default(false),
  verificationHash: z.string().optional()
});
export type DataProvenanceRecord = z.infer<typeof DataProvenanceRecordSchema>;

export const DataProvenanceAuditResultSchema = z.object({
  totalFieldsAudited: z.number().nonnegative(),
  authoritativeCount: z.number().nonnegative(),
  syntheticCount: z.number().nonnegative(),
  fabricatedCount: z.number().nonnegative(),
  isCompliant: z.boolean(),
  violations: z.array(
    z.object({
      target: z.string(),
      reason: z.string(),
      severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
    })
  ),
  summary: z.string()
});
export type DataProvenanceAuditResult = z.infer<typeof DataProvenanceAuditResultSchema>;

// ==========================================
// 20. Page Intent & Information Relevance (Phase 1E.7)
// ==========================================
export const PageIntentTypeSchema = z.enum([
  'OPERATIONAL_MONITORING',
  'EXECUTIVE_DECISION',
  'DATA_ENTRY_TRANSACTION',
  'EXPLORATORY_ANALYTICS',
  'CONFIGURATION_ADMIN',
  'DIAGNOSTIC_INVESTIGATION',
  'DEMO_SHOWCASE'
]);
export type PageIntentType = z.infer<typeof PageIntentTypeSchema>;

export const PageIntentSchema = z.object({
  intentType: PageIntentTypeSchema,
  primaryGoal: z.string(),
  targetAudience: z.string(),
  criticality: z.enum(['MISSION_CRITICAL', 'BUSINESS_CRITICAL', 'OPERATIONAL', 'INFORMATIONAL']),
  dataFreshnessRequirement: z.enum(['REALTIME', 'NEAR_REALTIME', 'BATCH_HOURLY', 'STATIC']),
  acceptableOrigins: z.array(DataOriginTypeSchema),
  requiredActionPaths: z.array(z.string()),
  forbiddenVisualGimmicks: z.array(z.string())
});
export type PageIntent = z.infer<typeof PageIntentSchema>;

export const PageIntentAuditResultSchema = z.object({
  matchesIntent: z.boolean(),
  alignmentScore: z.number().min(0).max(100),
  mismatchedComponents: z.array(
    z.object({
      componentId: z.string(),
      reason: z.string()
    })
  ),
  forbiddenGimmicksFound: z.array(z.string()),
  summary: z.string()
});
export type PageIntentAuditResult = z.infer<typeof PageIntentAuditResultSchema>;

export const InformationRelevanceImportanceSchema = z.enum([
  'PRIMARY',
  'SUPPORTING',
  'CONTEXTUAL',
  'NOISE',
  'DECEPTIVE'
]);
export type InformationRelevanceImportance = z.infer<typeof InformationRelevanceImportanceSchema>;

export const InformationRelevanceItemSchema = z.object({
  elementId: z.string(),
  elementTitle: z.string(),
  importance: InformationRelevanceImportanceSchema,
  relevanceScore: z.number().min(0).max(100),
  signalToNoiseRatio: z.number().min(0).max(1),
  cognitiveLoadImpact: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EXCESSIVE']),
  intentAlignment: z.boolean(),
  redundancy: z.enum(['UNIQUE', 'COMPLEMENTARY', 'DUPLICATE', 'CONTRADICTORY']),
  rationale: z.string()
});
export type InformationRelevanceItem = z.infer<typeof InformationRelevanceItemSchema>;

export const InformationRelevanceAuditResultSchema = z.object({
  overallRelevanceScore: z.number().min(0).max(100),
  noiseCount: z.number().nonnegative(),
  deceptiveCount: z.number().nonnegative(),
  contradictionCount: z.number().nonnegative(),
  passed: z.boolean(),
  items: z.array(InformationRelevanceItemSchema),
  recommendations: z.array(z.string())
});
export type InformationRelevanceAuditResult = z.infer<typeof InformationRelevanceAuditResultSchema>;

// ==========================================
// 21. Source Authority Classification (Phase 1E.7)
// ==========================================
export const SourceAuthorityRecordSchema = z.object({
  sourceId: z.string(),
  authorityTier: SourceAuthorityTierSchema,
  trustScore: z.number().min(0).max(100),
  isAuthoritative: z.boolean(),
  allowedForProduction: z.boolean(),
  rationale: z.string(),
  verificationMethod: z.string()
});
export type SourceAuthorityRecord = z.infer<typeof SourceAuthorityRecordSchema>;

// ==========================================
// 22. Human Visual Approval Gate (Phase 1E.7)
// ==========================================
export const VisualApprovalStatusSchema = z.enum([
  'NOT_REVIEWED',
  'IN_REVIEW',
  'APPROVED',
  'REJECTED',
  'CHANGES_REQUESTED'
]);
export type VisualApprovalStatus = z.infer<typeof VisualApprovalStatusSchema>;

export const HumanVisualApprovalRecordSchema = z.object({
  recordId: z.string(),
  status: VisualApprovalStatusSchema.default('NOT_REVIEWED'),
  reviewedBy: z.string().optional(),
  timestamp: z.string().optional(),
  viewportsReviewed: z.array(z.string()).default([]),
  notes: z.string().optional(),
  criteriaChecked: z
    .object({
      layoutStability: z.boolean().default(false),
      typographyHierarchy: z.boolean().default(false),
      colorContrast: z.boolean().default(false),
      responsiveFidelity: z.boolean().default(false),
      truthfulnessVisualAffordance: z.boolean().default(false)
    })
    .default({
      layoutStability: false,
      typographyHierarchy: false,
      colorContrast: false,
      responsiveFidelity: false,
      truthfulnessVisualAffordance: false
    }),
  canRelease: z.boolean().default(false)
});
export type HumanVisualApprovalRecord = z.infer<typeof HumanVisualApprovalRecordSchema>;

export const ApprovalGateCheckResultSchema = z.object({
  gateStatus: z.enum(['PASSED', 'PENDING', 'BLOCKED']),
  status: VisualApprovalStatusSchema,
  message: z.string(),
  requiresHumanAction: z.boolean()
});
export type ApprovalGateCheckResult = z.infer<typeof ApprovalGateCheckResultSchema>;

// ==========================================
// 23. Truthful UI Policy & Evaluation (Phase 1E.7)
// ==========================================
export const TruthfulUIPolicySchema = z.object({
  requireDeclaredProvenance: z.boolean().default(true),
  blockUngroundedTelemetry: z.boolean().default(true),
  enforceVisualSemanticTruth: z.boolean().default(true),
  requireStateHonesty: z.boolean().default(true),
  disallowUnlabeledMocks: z.boolean().default(true),
  maxPermissibleCognitiveClutterScore: z.number().min(0).max(100).default(40)
});
export type TruthfulUIPolicy = z.infer<typeof TruthfulUIPolicySchema>;

export const TruthfulUIFindingSchema = z.object({
  id: z.string(),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
  category: z.enum([
    'UNGROUNDED_TELEMETRY',
    'PROVENANCE_MISSING',
    'DECEPTIVE_VISUAL',
    'SEMANTIC_MISMATCH',
    'UNLABELED_MOCK',
    'COGNITIVE_CLUTTER',
    'INTENT_MISMATCH'
  ]),
  target: z.string(),
  description: z.string(),
  evidence: z.string(),
  remediation: z.string()
});
export type TruthfulUIFinding = z.infer<typeof TruthfulUIFindingSchema>;

export const ContentTruthVerdictSchema = z.enum([
  'CONTENT_TRUTH_PASS',
  'CONTENT_TRUTH_WARN',
  'CONTENT_TRUTH_FAIL'
]);
export type ContentTruthVerdict = z.infer<typeof ContentTruthVerdictSchema>;

export const TruthfulUIEvaluationSchema = z.object({
  verdict: ContentTruthVerdictSchema,
  overallScore: z.number().min(0).max(100),
  findings: z.array(TruthfulUIFindingSchema),
  ungroundedTelemetryCount: z.number().nonnegative(),
  deceptiveElementsCount: z.number().nonnegative(),
  unlabeledMockCount: z.number().nonnegative(),
  summary: z.string()
});
export type TruthfulUIEvaluation = z.infer<typeof TruthfulUIEvaluationSchema>;

// ==========================================
// 24. Track Trace Direction B Static Telemetry Audit
// ==========================================
export const TrackTraceTelemetryAuditSchema = z.object({
  auditMode: z.literal('STATIC_AUDIT_ONLY'),
  targetPilot: z.string(),
  liveContainersProbed: z.literal(false),
  endpointsAudited: z.array(
    z.object({
      endpoint: z.string(),
      status: z.enum(['FABRICATED_MISSING', 'UNVERIFIED_MOCK', 'STATIC_STUB', 'AUTHORITATIVE']),
      detectedIssue: z.string(),
      provenanceDeclared: z.boolean()
    })
  ),
  findings: z.array(TruthfulUIFindingSchema),
  deferredItems: z.array(
    z.object({
      item: z.string(),
      category: z.enum(['DOCKER_RUNTIME', 'PLAYWRIGHT_SCREENSHOT', 'DEVTOOLS_NETWORK', 'LIVE_IOT_STREAM']),
      tag: z.literal('DEFERRED_HOME_RUNTIME_VALIDATION'),
      prerequisite: z.string()
    })
  ),
  verdict: ContentTruthVerdictSchema,
  summary: z.string()
});
export type TrackTraceTelemetryAudit = z.infer<typeof TrackTraceTelemetryAuditSchema>;

// ==========================================
// 25. Operator-Assisted Execution & Fallback Models (Phase 1E.7.1)
// ==========================================
export const ExecutionModeSchema = z.enum([
  'DIRECT_AGENT_EXECUTION',
  'HUMAN_OPERATOR_EXECUTION',
  'CI_EXECUTION',
  'UNAVAILABLE'
]);
export type ExecutionMode = z.infer<typeof ExecutionModeSchema>;

export const ExecutionAuthoritySchema = z.enum([
  'AVAILABLE',
  'RESTRICTED',
  'BLOCKED',
  'UNAVAILABLE'
]);
export type ExecutionAuthority = z.infer<typeof ExecutionAuthoritySchema>;

export const BrowserEngineSchema = z.enum([
  'MANAGED_CHROMIUM',
  'SYSTEM_EDGE',
  'SYSTEM_CHROME',
  'UNAVAILABLE'
]);
export type BrowserEngine = z.infer<typeof BrowserEngineSchema>;

export const BrowserResolutionResultSchema = z.object({
  selectedBrowser: BrowserEngineSchema,
  executablePath: z.string().optional(),
  version: z.string().optional(),
  playwrightChannel: z.string().optional(),
  resolutionChain: z.array(
    z.object({
      engine: BrowserEngineSchema,
      status: z.enum(['AVAILABLE', 'BLOCKED_BY_SECURITY_POLICY', 'NOT_FOUND', 'UNAVAILABLE']),
      path: z.string().optional(),
      notes: z.string()
    })
  ),
  isReady: z.boolean()
});
export type BrowserResolutionResult = z.infer<typeof BrowserResolutionResultSchema>;

export const ManualRunResultSchema = z.object({
  executionMode: ExecutionModeSchema,
  plannedBy: z.string(),
  executedBy: z.string(),
  verifiedBy: z.string(),
  status: z.string().optional(),
  build: z.any(),
  tests: z.any(),
  runtimeCheck: z.any().optional(),
  missingEvidence: z.array(z.string()).optional(),
  docker: z.any(),
  mcp: z.any().optional(),
  browser: z.any(),
  playwright: z.any(),
  benchmark: z.any(),
  exitCode: z.number(),
  timestamp: z.string()
});
export type ManualRunResult = z.infer<typeof ManualRunResultSchema>;

export const ManualRunBundleSchema = z.object({
  runId: z.string(),
  bundlePath: z.string(),
  status: z.enum(['MANUAL_EXECUTION_REQUIRED', 'VERIFIED', 'FAILED', 'MISSING_EVIDENCE', 'PARTIALLY_VERIFIED']),
  scriptPath: z.string(),
  readmePath: z.string(),
  expectedEvidence: z.array(z.string()),
  collectedEvidence: z.array(z.string()),
  createdAt: z.string(),
  executedAt: z.string().optional(),
  result: ManualRunResultSchema.optional(),
  summary: z.string()
});
export type ManualRunBundle = z.infer<typeof ManualRunBundleSchema>;

export const OperatorDoctorReportSchema = z.object({
  dockerCapability: z.enum(['AVAILABLE', 'UNAVAILABLE']),
  dockerAgentExecution: z.enum(['AVAILABLE', 'RESTRICTED']),
  dockerHumanExecution: z.enum(['AVAILABLE', 'UNAVAILABLE']),
  browserCapability: z.enum(['AVAILABLE', 'UNAVAILABLE']),
  browserAgentExecution: z.enum(['AVAILABLE', 'RESTRICTED']),
  browserHumanExecution: z.enum(['AVAILABLE', 'UNAVAILABLE']),
  resolvedBrowser: BrowserResolutionResultSchema,
  recommendedMode: ExecutionModeSchema,
  formattedReport: z.string()
});
export type OperatorDoctorReport = z.infer<typeof OperatorDoctorReportSchema>;

// ==========================================
// 26. Existing Project Modernization Engine Foundation (Phase 1F.0)
// ==========================================

// 26.1 Existing Project Profile
export const ExistingProjectProfileSchema = z.object({
  projectIdentity: z.object({
    name: z.string(),
    rootDir: z.string(),
    repositoryUrl: z.string().optional(),
    owner: z.string().optional()
  }),
  detectedStack: z.object({
    primaryStack: z.string(),
    languages: z.array(z.string()),
    frameworks: z.array(z.string()),
    packageManagers: z.array(z.string()),
    templateEngine: z.string()
  }),
  architectureStyle: z.string(),
  frontendArchitecture: z.object({
    framework: z.string(),
    routing: z.string(),
    stateManagement: z.string(),
    styling: z.string(),
    componentModel: z.string()
  }),
  backendArchitecture: z.object({
    framework: z.string(),
    apiPattern: z.string(),
    runtime: z.string(),
    serverless: z.boolean()
  }),
  databaseArchitecture: z.object({
    engine: z.string(),
    orm: z.string(),
    migrationTool: z.string(),
    entityCount: z.number().nonnegative()
  }),
  authenticationModel: z.object({
    type: z.string(),
    provider: z.string(),
    sessionStrategy: z.string(),
    tokenStorage: z.string(),
    csrfProtection: z.boolean()
  }),
  authorizationModel: z.object({
    type: z.enum(['RBAC', 'ABAC', 'PBAC', 'CUSTOM', 'NONE']),
    roles: z.array(z.string()),
    permissionsEngine: z.string()
  }),
  routingModel: z.object({
    type: z.enum(['FILE_BASED', 'CODE_CONFIGURED', 'SERVER_ROUTED', 'CLIENT_ROUTED']),
    routesCount: z.number().nonnegative()
  }),
  apiSurface: z.object({
    protocols: z.array(z.string()),
    openApiSpecExists: z.boolean(),
    endpointCount: z.number().nonnegative(),
    breakingChangeRisk: z.enum(['SAFE', 'LOW', 'MEDIUM', 'HIGH'])
  }),
  dataAccessModel: z.object({
    pattern: z.enum(['ACTIVE_RECORD', 'REPOSITORY', 'DIRECT_SQL', 'ORM_QUERY_BUILDER']),
    directQueriesUsed: z.boolean()
  }),
  stateManagement: z.object({
    approach: z.enum(['LOCAL', 'CONTEXT', 'REDUX', 'PINIA', 'ZUSTAND', 'REACTIVE', 'SERVER_MANAGED', 'HYBRID'])
  }),
  stylingSystem: z.object({
    primary: z.string(),
    legacyFrameworks: z.array(z.string()),
    usesUtilityClasses: z.boolean(),
    cssVariablesUsed: z.boolean(),
    scssUsed: z.boolean(),
    customCssFiles: z.number().nonnegative()
  }),
  componentSystem: z.object({
    type: z.enum(['ATOMIC', 'MONOLITHIC_PAGES', 'COMPONENT_LIBRARY', 'BLADE_COMPONENTS', 'RAZOR_TAGHELPERS', 'AD_HOC']),
    libraryName: z.string().optional()
  }),
  designTokens: z.object({
    hasTokens: z.boolean(),
    tokenFormat: z.string().optional(),
    tokenSource: z.string().optional()
  }),
  buildSystem: z.object({
    bundler: z.string(),
    scripts: z.array(z.string()),
    outputDir: z.string()
  }),
  testSystem: z.object({
    framework: z.string(),
    hasUnitTests: z.boolean(),
    hasE2ETests: z.boolean(),
    testCoverageReported: z.boolean()
  }),
  deploymentModel: z.object({
    target: z.string(),
    ciPipeline: z.string(),
    dockerized: z.boolean()
  }),
  dockerModel: z.object({
    hasDockerfile: z.boolean(),
    hasCompose: z.boolean(),
    multiStage: z.boolean()
  }),
  legacyCharacteristics: z.array(z.string()),
  technicalDebt: z.array(
    z.object({
      area: z.string(),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      description: z.string(),
      remediationSuggestion: z.string()
    })
  ),
  visualDebt: z.array(
    z.object({
      issue: z.string(),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      location: z.string(),
      heuristicScore: z.number().min(0).max(100)
    })
  ),
  uxDebt: z.array(
    z.object({
      issue: z.string(),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      workflowImpact: z.string(),
      heuristicScore: z.number().min(0).max(100)
    })
  ),
  securityDebt: z.array(
    z.object({
      issue: z.string(),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      cweId: z.string().optional(),
      remediationSuggestion: z.string()
    })
  ),
  performanceDebt: z.array(
    z.object({
      issue: z.string(),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      metricImpact: z.string().optional(),
      remediationSuggestion: z.string()
    })
  ),
  criticalBusinessFlows: z.array(
    z.object({
      flowId: z.string(),
      name: z.string(),
      description: z.string(),
      priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM'])
    })
  ),
  criticalRoutes: z.array(
    z.object({
      method: z.string(),
      path: z.string(),
      purpose: z.string(),
      accessLevel: z.string()
    })
  ),
  criticalApis: z.array(
    z.object({
      method: z.string(),
      path: z.string(),
      contractType: z.string(),
      schemaValidated: z.boolean()
    })
  ),
  criticalDatabaseBehaviors: z.array(
    z.object({
      table: z.string(),
      invariant: z.string(),
      dataIntegrityRule: z.string()
    })
  )
});
export type ExistingProjectProfile = z.infer<typeof ExistingProjectProfileSchema>;

// 26.2 Behavioral Baseline
export const BehavioralBaselineRouteSchema = z.object({
  path: z.string(),
  method: z.string(),
  handler: z.string().optional(),
  authRequired: z.boolean(),
  parameters: z.array(z.string()).optional()
});
export type BehavioralBaselineRoute = z.infer<typeof BehavioralBaselineRouteSchema>;

export const BehavioralBaselineApiContractSchema = z.object({
  endpoint: z.string(),
  method: z.string(),
  requestSchema: z.any().optional(),
  responseSchema: z.any().optional(),
  queryParams: z.array(z.string()).optional(),
  headers: z.array(z.string()).optional()
});
export type BehavioralBaselineApiContract = z.infer<typeof BehavioralBaselineApiContractSchema>;

export const BehavioralBaselineAuthFlowSchema = z.object({
  flowId: z.string(),
  type: z.string(),
  entryPoint: z.string(),
  redirectTarget: z.string(),
  sessionMechanism: z.string(),
  csrfTokenRequired: z.boolean()
});
export type BehavioralBaselineAuthFlow = z.infer<typeof BehavioralBaselineAuthFlowSchema>;

export const BehavioralBaselineAuthzRuleSchema = z.object({
  resource: z.string(),
  action: z.string(),
  allowedRoles: z.array(z.string()),
  condition: z.string().optional()
});
export type BehavioralBaselineAuthzRule = z.infer<typeof BehavioralBaselineAuthzRuleSchema>;

export const BehavioralBaselineDbInvariantSchema = z.object({
  table: z.string(),
  invariant: z.string(),
  foreignKeyConstraints: z.array(z.string()).optional(),
  uniquenessConstraints: z.array(z.string()).optional()
});
export type BehavioralBaselineDbInvariant = z.infer<typeof BehavioralBaselineDbInvariantSchema>;

export const BehavioralBaselineWorkflowSchema = z.object({
  workflowId: z.string(),
  name: z.string(),
  steps: z.array(z.string()),
  expectedOutcome: z.string()
});
export type BehavioralBaselineWorkflow = z.infer<typeof BehavioralBaselineWorkflowSchema>;

export const BehavioralBaselineFormSchema = z.object({
  formId: z.string(),
  routeOrAction: z.string(),
  fields: z.array(z.string()),
  validationRules: z.array(z.string()),
  submissionMethod: z.string()
});
export type BehavioralBaselineForm = z.infer<typeof BehavioralBaselineFormSchema>;

export const BehavioralBaselineNavigationFlowSchema = z.object({
  fromRoute: z.string(),
  trigger: z.string(),
  toRoute: z.string(),
  preservesState: z.boolean()
});
export type BehavioralBaselineNavigationFlow = z.infer<typeof BehavioralBaselineNavigationFlowSchema>;

export const BehavioralBaselineErrorBehaviorSchema = z.object({
  errorType: z.string(),
  statusCode: z.number(),
  expectedUserMessage: z.string(),
  rollbackHandling: z.string()
});
export type BehavioralBaselineErrorBehavior = z.infer<typeof BehavioralBaselineErrorBehaviorSchema>;

export const BehavioralBaselineExternalIntegrationSchema = z.object({
  integrationId: z.string(),
  serviceName: z.string(),
  endpoint: z.string(),
  authMechanism: z.string(),
  payloadFormat: z.string()
});
export type BehavioralBaselineExternalIntegration = z.infer<typeof BehavioralBaselineExternalIntegrationSchema>;

export const BehavioralBaselineSchema = z.object({
  id: z.string(),
  capturedAt: z.string(),
  routes: z.array(BehavioralBaselineRouteSchema),
  apiContracts: z.array(BehavioralBaselineApiContractSchema),
  authenticationFlows: z.array(BehavioralBaselineAuthFlowSchema),
  authorizationRules: z.array(BehavioralBaselineAuthzRuleSchema),
  databaseInvariants: z.array(BehavioralBaselineDbInvariantSchema),
  criticalWorkflows: z.array(BehavioralBaselineWorkflowSchema),
  forms: z.array(BehavioralBaselineFormSchema),
  navigationFlows: z.array(BehavioralBaselineNavigationFlowSchema),
  errorBehavior: z.array(BehavioralBaselineErrorBehaviorSchema),
  externalIntegrations: z.array(BehavioralBaselineExternalIntegrationSchema)
});
export type BehavioralBaseline = z.infer<typeof BehavioralBaselineSchema>;

// 26.3 Change Classification
export const ChangeDecisionSchema = z.enum(['KEEP', 'IMPROVE', 'REPLACE', 'DEFER', 'REMOVE']);
export type ChangeDecision = z.infer<typeof ChangeDecisionSchema>;

export const ChangeClassificationSchema = z.object({
  targetId: z.string(),
  name: z.string(),
  path: z.string(),
  elementType: z.enum(['COMPONENT', 'STYLE', 'PAGE', 'ROUTE', 'API', 'DATA_ACCESS', 'STATE', 'DEPENDENCY', 'ASSET', 'CONFIG']),
  decision: ChangeDecisionSchema,
  reason: z.string(),
  risk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  expectedBenefit: z.string(),
  migrationCost: z.enum(['TRIVIAL', 'LOW', 'MEDIUM', 'HIGH', 'PROHIBITIVE']),
  dependencies: z.array(z.string()),
  verification: z.string()
});
export type ChangeClassification = z.infer<typeof ChangeClassificationSchema>;

// 26.4 Modernization Strategy
export const ModernizationStrategyTypeSchema = z.enum([
  'ADOPT',
  'ADAPT',
  'BRIDGE',
  'MIGRATE',
  'REBUILD_COMPONENT',
  'REBUILD_PAGE',
  'REBUILD_SHELL'
]);
export type ModernizationStrategyType = z.infer<typeof ModernizationStrategyTypeSchema>;

export const ModernizationStrategyDecisionSchema = z.object({
  strategy: ModernizationStrategyTypeSchema,
  rationale: z.string(),
  riskAssessment: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EXTREME']),
  bridgeRequired: z.boolean(),
  bridgeMechanisms: z.array(z.string()).default([]),
  blocked: z.boolean().default(false),
  blockReason: z.string().optional()
});
export type ModernizationStrategyDecision = z.infer<typeof ModernizationStrategyDecisionSchema>;

// 26.5 Modernization Scope
export const ModernizationScopeLevelSchema = z.enum([
  'COMPONENT',
  'PAGE',
  'FEATURE',
  'SHELL',
  'MODULE',
  'APPLICATION'
]);
export type ModernizationScopeLevel = z.infer<typeof ModernizationScopeLevelSchema>;

export const ModernizationScopeSchema = z.object({
  level: ModernizationScopeLevelSchema,
  targetName: z.string(),
  allowedPaths: z.array(z.string()),
  prohibitedPaths: z.array(z.string()),
  canModifySharedComponents: z.boolean().default(false),
  canModifyGlobalShell: z.boolean().default(false),
  canModifyBackend: z.boolean().default(false),
  canModifyDatabase: z.boolean().default(false)
});
export type ModernizationScope = z.infer<typeof ModernizationScopeSchema>;

// 26.6 Preservation Contract
export const PreservationStatusSchema = z.enum([
  'MUST_PRESERVE',
  'SHOULD_PRESERVE',
  'MAY_CHANGE',
  'EXPLICITLY_ALLOWED_TO_CHANGE'
]);
export type PreservationStatus = z.infer<typeof PreservationStatusSchema>;

export const PreservationContractSchema = z.object({
  contractId: z.string(),
  backendBusinessLogic: PreservationStatusSchema.default('MUST_PRESERVE'),
  databaseSchema: PreservationStatusSchema.default('MUST_PRESERVE'),
  apiContract: PreservationStatusSchema.default('MUST_PRESERVE'),
  routeContract: PreservationStatusSchema.default('MUST_PRESERVE'),
  authentication: PreservationStatusSchema.default('MUST_PRESERVE'),
  authorization: PreservationStatusSchema.default('MUST_PRESERVE'),
  externalIntegrations: PreservationStatusSchema.default('MUST_PRESERVE'),
  userWorkflows: PreservationStatusSchema.default('MUST_PRESERVE'),
  dataSemantics: PreservationStatusSchema.default('MUST_PRESERVE'),
  auditBehavior: PreservationStatusSchema.default('MUST_PRESERVE'),
  specificInvariants: z.record(z.array(z.string())),
  allowedBreakingChanges: z.array(z.string()).default([]),
  verificationMethod: z.record(z.string())
});
export type PreservationContract = z.infer<typeof PreservationContractSchema>;

// 26.7 Modernization Intent
export const ModernizationIntentSchema = z.object({
  why: z.string().min(10, 'Rationale must be specified and non-trivial'),
  targetOutcome: z.string().min(10, 'Target outcome must be clearly articulated'),
  primaryProblems: z.array(z.string()).min(1, 'At least one primary problem must be specified'),
  userPainPoints: z.array(z.string()).min(1, 'At least one user pain point must be specified'),
  visualGoals: z.array(z.string()).min(1, 'At least one visual goal must be specified'),
  uxGoals: z.array(z.string()).min(1, 'At least one UX goal must be specified'),
  technicalGoals: z.array(z.string()).min(1, 'At least one technical goal must be specified'),
  constraints: z.array(z.string()),
  forbiddenChanges: z.array(z.string()),
  successCriteria: z.array(z.string()).min(1, 'At least one measurable success criterion must be specified')
});
export type ModernizationIntent = z.infer<typeof ModernizationIntentSchema>;

// 26.8 Baseline Quality Profile (AI Heuristic Stamped)
export const BaselineQualityDimensionSchema = z.object({
  score: z.number().min(0).max(100),
  isHeuristic: z.literal(true),
  scoreType: z.literal('HEURISTIC'),
  confidence: z.number().min(0).max(1),
  details: z.record(z.any())
});
export type BaselineQualityDimension = z.infer<typeof BaselineQualityDimensionSchema>;

export const BaselineQualityProfileSchema = z.object({
  technicalQuality: BaselineQualityDimensionSchema,
  visualQuality: BaselineQualityDimensionSchema,
  uxQuality: BaselineQualityDimensionSchema,
  accessibilityQuality: BaselineQualityDimensionSchema,
  performanceQuality: BaselineQualityDimensionSchema,
  securityQuality: BaselineQualityDimensionSchema,
  compositeHeuristicScore: z.number().min(0).max(100),
  summary: z.string()
});
export type BaselineQualityProfile = z.infer<typeof BaselineQualityProfileSchema>;

// 26.9 Modernization Stage
export const ModernizationStageSchema = z.object({
  stageId: z.string(),
  order: z.number().int().positive(),
  name: z.string(),
  objective: z.string(),
  scope: z.object({
    allowedFiles: z.array(z.string()),
    prohibitedFiles: z.array(z.string())
  }),
  entryCriteria: z.array(z.string()),
  exitCriteria: z.array(z.string()),
  checkpoint: z.string(),
  verification: z.object({
    testsToRun: z.array(z.string()),
    baselineChecks: z.array(z.string()),
    reviewerCriteria: z.array(z.string())
  }),
  rollbackSteps: z.array(z.string())
});
export type ModernizationStage = z.infer<typeof ModernizationStageSchema>;

// 26.10 Modernization Plan
export const ModernizationPlanSchema = z.object({
  planId: z.string(),
  projectProfile: ExistingProjectProfileSchema,
  intent: ModernizationIntentSchema,
  baseline: BehavioralBaselineSchema,
  preservationContract: PreservationContractSchema,
  scope: ModernizationScopeSchema,
  strategy: ModernizationStrategyDecisionSchema,
  keep: z.array(ChangeClassificationSchema),
  improve: z.array(ChangeClassificationSchema),
  replace: z.array(ChangeClassificationSchema),
  defer: z.array(ChangeClassificationSchema),
  remove: z.array(ChangeClassificationSchema),
  risks: z.array(
    z.object({
      riskId: z.string(),
      category: z.string(),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      mitigation: z.string()
    })
  ),
  checkpointPlan: CheckpointPlanSchema,
  implementationStages: z.array(ModernizationStageSchema),
  verificationPlan: z.object({
    stages: z.array(z.string()),
    automatedChecks: z.array(z.string()),
    humanVerificationPoints: z.array(z.string())
  }),
  rollbackPlan: z.object({
    strategy: z.string(),
    backupLocation: z.string().optional(),
    rollbackSteps: z.array(z.string()),
    automatedScript: z.string().optional()
  }),
  humanDecisionsRequired: z.array(
    z.object({
      decisionId: z.string(),
      question: z.string(),
      options: z.array(z.string()),
      recommendation: z.string(),
      context: z.string()
    })
  )
});
export type ModernizationPlan = z.infer<typeof ModernizationPlanSchema>;

// 26.11 Design Direction Workflow
export const DesignDirectionCandidateSchema = z.object({
  candidateId: z.string(),
  title: z.string(),
  composition: z.string(),
  hierarchy: z.string(),
  density: z.string(),
  navigation: z.string(),
  interaction: z.string(),
  brandTreatment: z.string(),
  tradeoffs: z.array(z.string()),
  previewArtifacts: z.array(z.string()).default([])
});
export type DesignDirectionCandidate = z.infer<typeof DesignDirectionCandidateSchema>;

export const DesignDirectionWorkflowSchema = z.object({
  workflowId: z.string(),
  baselineDescription: z.string(),
  candidates: z.array(DesignDirectionCandidateSchema),
  selectedCandidateId: z.string().optional(),
  humanVisualApprovalRequired: z.literal(true),
  humanVisualApprovalStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NOT_APPLICABLE_SYNTHETIC_FIXTURE'])
});
export type DesignDirectionWorkflow = z.infer<typeof DesignDirectionWorkflowSchema>;

// 26.12 Dependency Governance
export const DependencyProposalSchema = z.object({
  packageName: z.string(),
  version: z.string(),
  targetRole: z.enum(['PRODUCTION', 'DEVELOPMENT']),
  need: z.string(),
  alternativeConsidered: z.string(),
  bundleImpactKb: z.number().nonnegative(),
  securityScore: z.number().min(0).max(100),
  maintenanceRating: z.enum(['ACTIVE', 'SLOW', 'ABANDONED']),
  license: z.string(),
  existingEquivalent: z.string().optional()
});
export type DependencyProposal = z.infer<typeof DependencyProposalSchema>;

export const DependencyGovernanceResultSchema = z.object({
  packageName: z.string(),
  approved: z.boolean(),
  reasons: z.array(z.string()),
  risk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  mitigation: z.string().optional()
});
export type DependencyGovernanceResult = z.infer<typeof DependencyGovernanceResultSchema>;

// 26.13 Legacy Code Protection
export const LegacyFileCategorySchema = z.enum([
  'GENERATED',
  'VENDOR',
  'THIRD_PARTY',
  'MIGRATION_HISTORY',
  'BUILD_OUTPUT',
  'SOURCE'
]);
export type LegacyFileCategory = z.infer<typeof LegacyFileCategorySchema>;

export const LegacyProtectionResultSchema = z.object({
  filePath: z.string(),
  category: LegacyFileCategorySchema,
  protectedFromDirectEdit: z.boolean(),
  protectionReason: z.string()
});
export type LegacyProtectionResult = z.infer<typeof LegacyProtectionResultSchema>;

// 26.14 Modernization Completion Contract
export const ModernizationCompletionContractSchema = z.object({
  technical: z.enum(['PASS', 'FAIL', 'BLOCKED']),
  visualAI: z.enum(['PASS', 'FAIL', 'HEURISTIC_ACCEPTABLE']),
  ux: z.enum(['PASS', 'FAIL']),
  accessibility: z.enum(['PASS', 'FAIL']),
  security: z.enum(['PASS', 'FAIL']),
  regression: z.enum(['PASS', 'FAIL']),
  contentTruth: z.enum(['PASS', 'FAIL']),
  humanVisualApproval: z.enum(['APPROVED', 'PENDING', 'REJECTED', 'NOT_APPLICABLE_SYNTHETIC_FIXTURE']),
  isComplete: z.boolean(),
  verdict: z.enum(['COMPLETE', 'INCOMPLETE', 'REJECTED']),
  blockReasons: z.array(z.string())
});
export type ModernizationCompletionContract = z.infer<typeof ModernizationCompletionContractSchema>;

// 26.15 Project Modes & Mode Transition Guard
export const ProjectModeSchema = z.enum(['NEW', 'REPAIR', 'MODERNIZE']);
export type ProjectMode = z.infer<typeof ProjectModeSchema>;

export const ProjectModeTransitionSchema = z.object({
  currentMode: ProjectModeSchema,
  requestedMode: ProjectModeSchema,
  allowed: z.boolean(),
  reason: z.string()
});
export type ProjectModeTransition = z.infer<typeof ProjectModeTransitionSchema>;


