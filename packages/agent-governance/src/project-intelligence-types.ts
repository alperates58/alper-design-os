import { z } from 'zod';
import { EvidenceKindSchema, VerificationStatusSchema, AssuranceLevelSchema } from './types';

// =========================================================================
// 1. Project Directory & Manifest (Section 1)
// =========================================================================

export const PROJECT_INTELLIGENCE_ROOT = '.alper-design-os/project';

export const ProjectModeSchema = z.enum(['NEW', 'EXISTING', 'REPAIR', 'MODERNIZE']);
export type ProjectMode = z.infer<typeof ProjectModeSchema>;

export const ProjectIdentitySchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  repositoryIdentity: z.string().describe('Stable repo identifier across renames or filesystem movements'),
  projectMode: ProjectModeSchema,
  createdAt: z.string(),
  schemaVersion: z.string().default('1.0.0'),
  designOsVersion: z.string().default('0.1.0'),
  primaryStack: z.string(),
  domains: z.array(z.string()).default([]),
  environments: z.array(z.string()).default(['development', 'production'])
}).passthrough();
export type ProjectIdentity = z.infer<typeof ProjectIdentitySchema>;

export const ProjectManifestSchema = z.object({
  manifestVersion: z.string().default('1.0.0'),
  projectIdentity: ProjectIdentitySchema,
  initializedAt: z.string(),
  lastUpdatedAt: z.string(),
  activeProfileFile: z.string().default('project-profile.json'),
  activeArchitectureFile: z.string().default('architecture.json'),
  subdirectories: z.array(z.string()).default([
    'requirements',
    'decisions',
    'knowledge',
    'snapshots',
    'evidence',
    'lessons',
    'indexes'
  ])
}).passthrough();
export type ProjectManifest = z.infer<typeof ProjectManifestSchema>;

// =========================================================================
// 2. Durable Project Memory (Section 3, 4, 6, 13)
// =========================================================================

export const ProjectMemoryRecordTypeSchema = z.enum([
  'ARCHITECTURE',
  'BUSINESS_RULE',
  'CONSTRAINT',
  'INVARIANT',
  'DOMAIN_TERM',
  'USER_DECISION',
  'TECHNICAL_DECISION',
  'DESIGN_DECISION',
  'INTEGRATION',
  'KNOWN_RISK',
  'KNOWN_LIMITATION',
  'LESSON_LEARNED'
]);
export type ProjectMemoryRecordType = z.infer<typeof ProjectMemoryRecordTypeSchema>;

export const MemoryRecordSourceSchema = z.enum([
  'USER_DECISION',
  'SYSTEM_RECOMMENDATION',
  'RESEARCH_FINDING',
  'IMPLEMENTATION_FACT'
]);
export type MemoryRecordSource = z.infer<typeof MemoryRecordSourceSchema>;

export const FreshnessSchema = z.enum([
  'CURRENT',
  'POSSIBLY_STALE',
  'STALE',
  'SUPERSEDED',
  'UNKNOWN'
]);
export type Freshness = z.infer<typeof FreshnessSchema>;

export const MemoryScopeSchema = z.enum([
  'PROJECT',
  'MODULE',
  'COMPONENT',
  'API',
  'PAGE',
  'DATABASE'
]);
export type MemoryScope = z.infer<typeof MemoryScopeSchema>;

export const MemoryRecordStatusSchema = z.enum([
  'ACTIVE',
  'DEPRECATED',
  'SUPERSEDED',
  'UNVERIFIED'
]);
export type MemoryRecordStatus = z.infer<typeof MemoryRecordStatusSchema>;

export const ProjectMemoryRecordSchema = z.object({
  id: z.string(),
  type: ProjectMemoryRecordTypeSchema,
  title: z.string(),
  summary: z.string(),
  details: z.string(),
  source: MemoryRecordSourceSchema,
  sourceRefs: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: MemoryRecordStatusSchema.default('ACTIVE'),
  confidence: z.number().min(0).max(1).default(1.0),
  freshness: FreshnessSchema.default('CURRENT'),
  scope: MemoryScopeSchema.default('PROJECT'),
  relatedEntities: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
}).passthrough();
export type ProjectMemoryRecord = z.infer<typeof ProjectMemoryRecordSchema>;

// =========================================================================
// 3. Decision Record Model & Rejected Alternatives (Section 5, 25, 26)
// =========================================================================

export const DecisionStatusSchema = z.enum([
  'PROPOSED',
  'ACCEPTED',
  'REJECTED',
  'SUPERSEDED',
  'DEPRECATED'
]);
export type DecisionStatus = z.infer<typeof DecisionStatusSchema>;

export const DecisionRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  context: z.string(),
  decision: z.string(),
  alternatives: z.array(z.string()).default([]),
  consequences: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  evidence: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  affectedComponents: z.array(z.string()).default([]),
  status: DecisionStatusSchema.default('PROPOSED'),
  supersedes: z.string().nullable().default(null),
  supersededBy: z.string().nullable().default(null),
  createdAt: z.string(),
  approvedBy: z.string()
}).passthrough();
export type DecisionRecord = z.infer<typeof DecisionRecordSchema>;

export const RejectedAlternativeSchema = z.object({
  option: z.string(),
  reasonRejected: z.string(),
  evidence: z.string().optional(),
  context: z.string().optional(),
  reconsiderWhen: z.string().optional()
}).passthrough();
export type RejectedAlternative = z.infer<typeof RejectedAlternativeSchema>;

// =========================================================================
// 4. Project Glossary & Domain Terms (Section 7)
// =========================================================================

export const GlossaryTermSchema = z.object({
  term: z.string(),
  definition: z.string(),
  aliases: z.array(z.string()).default([]),
  source: z.string(),
  domain: z.string(),
  status: z.enum(['ACTIVE', 'AMBIGUOUS', 'DEPRECATED']).default('ACTIVE')
}).passthrough();
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;

export const DomainGlossarySchema = z.object({
  domain: z.string(),
  terms: z.array(GlossaryTermSchema),
  ambiguousTerms: z.array(z.string()).default([])
}).passthrough();
export type DomainGlossary = z.infer<typeof DomainGlossarySchema>;

// =========================================================================
// 5. Business Rules & Invariants (Section 8, 9)
// =========================================================================

export const BusinessRuleRecordStatusSchema = z.enum([
  'VERIFIED',
  'UNVERIFIED',
  'DEPRECATED'
]);
export type BusinessRuleRecordStatus = z.infer<typeof BusinessRuleRecordStatusSchema>;

export const BusinessRuleRecordSchema = z.object({
  ruleId: z.string(),
  statement: z.string(),
  source: z.string(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  scope: z.string().default('PROJECT'),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
  exceptions: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  tests: z.array(z.string()).default([]),
  status: BusinessRuleRecordStatusSchema.default('UNVERIFIED')
}).passthrough();
export type BusinessRuleRecord = z.infer<typeof BusinessRuleRecordSchema>;

export const InvariantCategorySchema = z.enum([
  'SECURITY',
  'DATA_INTEGRITY',
  'API_CONTRACT',
  'BUSINESS_LOGIC',
  'UX_ERGONOMICS'
]);
export type InvariantCategory = z.infer<typeof InvariantCategorySchema>;

export const ProjectInvariantSchema = z.object({
  id: z.string(),
  description: z.string(),
  category: InvariantCategorySchema,
  scope: z.string().default('PROJECT'),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM']).default('HIGH'),
  verificationMethod: z.string(),
  relatedTests: z.array(z.string()).default([]),
  source: z.string()
}).passthrough();
export type ProjectInvariant = z.infer<typeof ProjectInvariantSchema>;

// =========================================================================
// 6. Architecture Map (Section 10)
// =========================================================================

export const ArchitectureNodeTypeSchema = z.enum([
  'MODULE',
  'COMPONENT',
  'SERVICE',
  'DATABASE',
  'TABLE_OR_ENTITY',
  'API',
  'PAGE',
  'EXTERNAL_SYSTEM',
  'QUEUE',
  'JOB'
]);
export type ArchitectureNodeType = z.infer<typeof ArchitectureNodeTypeSchema>;

export const ArchitectureEdgeTypeSchema = z.enum([
  'DEPENDS_ON',
  'CALLS',
  'READS',
  'WRITES',
  'IMPLEMENTS',
  'TRIGGERS',
  'ROUTES_TO',
  'INTEGRATES_WITH'
]);
export type ArchitectureEdgeType = z.infer<typeof ArchitectureEdgeTypeSchema>;

export const ArchitectureNodeSchema = z.object({
  id: z.string(),
  type: ArchitectureNodeTypeSchema,
  name: z.string(),
  metadata: z.record(z.any()).default({})
}).passthrough();
export type ArchitectureNode = z.infer<typeof ArchitectureNodeSchema>;

export const ArchitectureEdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  type: ArchitectureEdgeTypeSchema,
  metadata: z.record(z.any()).default({})
}).passthrough();
export type ArchitectureEdge = z.infer<typeof ArchitectureEdgeSchema>;

export const ProjectArchitectureGraphSchema = z.object({
  nodes: z.array(ArchitectureNodeSchema),
  edges: z.array(ArchitectureEdgeSchema),
  graphHash: z.string().optional()
}).passthrough();
export type ProjectArchitectureGraph = z.infer<typeof ProjectArchitectureGraphSchema>;

// =========================================================================
// 7. Knowledge Authority, Synchronization & Conflicts (Section 12, 19, 20)
// =========================================================================

export const KnowledgeAuthorityRankSchema = z.enum([
  'CURRENT_CODE',
  'VERIFIED_RUNTIME_EVIDENCE',
  'APPROVED_USER_DECISION',
  'ACCEPTED_ADR',
  'APPROVED_REQUIREMENT',
  'GENERATED_DOCUMENTATION',
  'HEURISTIC_INFERENCE'
]);
export type KnowledgeAuthorityRank = z.infer<typeof KnowledgeAuthorityRankSchema>;

export const KnowledgeConflictTypeSchema = z.enum([
  'CODE_VS_DOC',
  'DECISION_VS_IMPLEMENTATION',
  'REQUIREMENT_VS_IMPLEMENTATION',
  'DOC_VS_DOC',
  'STALE_REFERENCE'
]);
export type KnowledgeConflictType = z.infer<typeof KnowledgeConflictTypeSchema>;

export const KnowledgeConflictSchema = z.object({
  id: z.string(),
  recordA: z.any(),
  recordB: z.any(),
  conflictType: KnowledgeConflictTypeSchema,
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  recommendedResolution: z.string()
}).passthrough();
export type KnowledgeConflict = z.infer<typeof KnowledgeConflictSchema>;

export const KnowledgeSyncResultSchema = z.object({
  status: z.enum(['IN_SYNC', 'POSSIBLY_STALE', 'CONFLICTED', 'UNKNOWN']),
  conflicts: z.array(KnowledgeConflictSchema).default([]),
  checkedAt: z.string(),
  findings: z.array(z.string()).default([])
}).passthrough();
export type KnowledgeSyncResult = z.infer<typeof KnowledgeSyncResultSchema>;

// =========================================================================
// 8. Project Snapshot & Drift Detection (Section 14, 15)
// =========================================================================

export const ProjectSnapshotSchema = z.object({
  snapshotId: z.string(),
  commitSha: z.string(),
  timestamp: z.string(),
  stack: z.string(),
  architectureHash: z.string(),
  requirementHash: z.string(),
  routeInventory: z.array(z.string()).default([]),
  apiInventory: z.array(z.string()).default([]),
  databaseFingerprint: z.string().default(''),
  dependencyFingerprint: z.string().default(''),
  designSystemFingerprint: z.string().default('')
}).passthrough();
export type ProjectSnapshot = z.infer<typeof ProjectSnapshotSchema>;

export const DriftClassificationSchema = z.enum([
  'EXPECTED',
  'REVIEW_REQUIRED',
  'UNEXPECTED',
  'BREAKING'
]);
export type DriftClassification = z.infer<typeof DriftClassificationSchema>;

export const ProjectDriftItemSchema = z.object({
  type: z.enum(['ARCHITECTURE', 'REQUIREMENT', 'DEPENDENCY', 'API_CONTRACT', 'DATABASE', 'DESIGN_SYSTEM']),
  classification: DriftClassificationSchema,
  description: z.string(),
  diffSummary: z.string()
}).passthrough();
export type ProjectDriftItem = z.infer<typeof ProjectDriftItemSchema>;

export const ProjectDriftReportSchema = z.object({
  baseSnapshotId: z.string(),
  targetSnapshotId: z.string(),
  drifts: z.array(ProjectDriftItemSchema),
  hasBreakingDrift: z.boolean(),
  status: z.enum(['STABLE', 'DRIFTED', 'BREAKING'])
}).passthrough();
export type ProjectDriftReport = z.infer<typeof ProjectDriftReportSchema>;

// =========================================================================
// 9. Change Impact Assessment (Section 16)
// =========================================================================

export const ChangeImpactAssessmentSchema = z.object({
  target: z.string(),
  proposedChange: z.string(),
  affectedRequirements: z.array(z.string()).default([]),
  affectedModules: z.array(z.string()).default([]),
  affectedApis: z.array(z.string()).default([]),
  affectedPages: z.array(z.string()).default([]),
  affectedEntities: z.array(z.string()).default([]),
  affectedTests: z.array(z.string()).default([]),
  affectedDecisions: z.array(z.string()).default([]),
  risk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  recommendedVerification: z.array(z.string()).default([]),
  rationale: z.string()
}).passthrough();
export type ChangeImpactAssessment = z.infer<typeof ChangeImpactAssessmentSchema>;

// =========================================================================
// 10. Task Context Builder (Section 17, 18)
// =========================================================================

export const TaskContextItemSchema = z.object({
  item: z.any(),
  relevanceScore: z.number().min(0).max(1),
  rationale: z.string()
});
export type TaskContextItem = z.infer<typeof TaskContextItemSchema>;

export const TaskContextSchema = z.object({
  task: z.string(),
  target: z.string(),
  scope: z.string(),
  relevantRequirements: z.array(TaskContextItemSchema).default([]),
  relevantDecisions: z.array(TaskContextItemSchema).default([]),
  relevantConstraints: z.array(TaskContextItemSchema).default([]),
  relevantArchitecture: z.array(TaskContextItemSchema).default([]),
  relevantBusinessRules: z.array(TaskContextItemSchema).default([]),
  relevantRisks: z.array(TaskContextItemSchema).default([]),
  relevantLessons: z.array(TaskContextItemSchema).default([]),
  overallRationale: z.string()
}).passthrough();
export type TaskContext = z.infer<typeof TaskContextSchema>;

// =========================================================================
// 11. Continuous Improvement, Lessons & Isolation (Section 21, 22, 23, 24)
// =========================================================================

export const LessonLearnedRecordSchema = z.object({
  id: z.string(),
  problem: z.string(),
  context: z.string(),
  attempt: z.string(),
  result: z.string(),
  evidence: z.string(),
  lesson: z.string(),
  applicability: z.string(),
  confidence: z.number().min(0).max(1).default(0.8)
}).passthrough();
export type LessonLearnedRecord = z.infer<typeof LessonLearnedRecordSchema>;

export const ImprovementCandidateSchema = z.object({
  id: z.string(),
  observation: z.string(),
  evidence: z.string(),
  proposedImprovement: z.string(),
  scope: z.string(),
  expectedBenefit: z.string(),
  risk: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
  confidence: z.number().min(0).max(1).default(0.8),
  requiresGovernanceApproval: z.literal(true).default(true),
  status: z.enum(['PROPOSED', 'APPROVED', 'REJECTED']).default('PROPOSED')
}).passthrough();
export type ImprovementCandidate = z.infer<typeof ImprovementCandidateSchema>;

export const ReusablePatternCandidateSchema = z.object({
  patternId: z.string(),
  name: z.string(),
  description: z.string(),
  generalizable: z.boolean(),
  nonSensitive: z.boolean(),
  evidenceBacked: z.boolean(),
  domainScope: z.string(),
  governanceReviewed: z.boolean().default(false),
  status: z.enum(['CANDIDATE', 'PROMOTED', 'REJECTED']).default('CANDIDATE')
}).passthrough();
export type ReusablePatternCandidate = z.infer<typeof ReusablePatternCandidateSchema>;

// =========================================================================
// 12. Verification Debt, Project Status & Knowledge Health (Section 27, 28, 29, 34)
// =========================================================================

export const VerificationDebtItemSchema = z.object({
  componentOrFeature: z.string(),
  implementedEvidence: z.string(),
  missingVerification: z.string(),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  recordedAt: z.string()
}).passthrough();
export type VerificationDebtItem = z.infer<typeof VerificationDebtItemSchema>;

export const ProjectStatusSnapshotSchema = z.object({
  currentPhase: z.string(),
  completedMilestones: z.array(z.string()).default([]),
  openTasks: z.array(z.string()).default([]),
  blockedTasks: z.array(z.string()).default([]),
  knownRisks: z.array(z.string()).default([]),
  pendingDecisions: z.array(z.string()).default([]),
  verificationDebt: z.array(VerificationDebtItemSchema).default([])
}).passthrough();
export type ProjectStatusSnapshot = z.infer<typeof ProjectStatusSnapshotSchema>;

export const ProjectKnowledgeHealthSchema = z.object({
  coveragePercentage: z.number().min(0).max(100),
  freshnessDistribution: z.record(z.number()),
  conflictCount: z.number(),
  verificationDebtCount: z.number(),
  orphanRequirements: z.array(z.string()).default([]),
  orphanDecisions: z.array(z.string()).default([]),
  staleDocs: z.array(z.string()).default([]),
  unknownInvariants: z.array(z.string()).default([]),
  healthStatus: z.enum(['EXCELLENT', 'GOOD', 'NEEDS_ATTENTION', 'CRITICAL'])
}).passthrough();
export type ProjectKnowledgeHealth = z.infer<typeof ProjectKnowledgeHealthSchema>;
