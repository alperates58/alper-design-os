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
  'RUNTIME_VERIFY',
  'VISUAL_VERIFY',
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
