import { z } from 'zod';
import {
  EvidenceKindSchema,
  VerificationStatusSchema,
  AssuranceLevelSchema,
  EvidenceItemSchema,
  GateEvidenceRequirementSchema,
  GateVerificationResultSchema
} from './types.js';

// =========================================================================
// 1. Greenfield Project Profile (Section 2)
// =========================================================================

export const GreenfieldProjectProfileSchema = z.object({
  productName: z.string().min(1),
  productPurpose: z.string().min(1),
  targetUsers: z.array(z.string()).min(1),
  primaryJobs: z.array(z.string()).min(1),
  secondaryJobs: z.array(z.string()).default([]),
  domain: z.string().default('General Enterprise'),
  businessCriticality: z.enum(['LOW', 'MEDIUM', 'HIGH', 'MISSION_CRITICAL']).default('MEDIUM'),
  dataSensitivity: z.enum(['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'HIGHLY_SENSITIVE']).default('INTERNAL'),
  expectedScale: z.enum([
    'PROTOTYPE',
    'SMALL_TEAM',
    'SMALL_INTERNAL',
    'DEPARTMENTAL',
    'ENTERPRISE',
    'ENTERPRISE_INTERNAL',
    'PUBLIC_FACING_COMMERCIAL',
    'INTERNET_SCALE'
  ]).default('SMALL_TEAM'),
  concurrency: z.enum(['LOW', 'MEDIUM', 'MODERATE', 'HIGH', 'VERY_HIGH', 'MASSIVE']).default('LOW'),
  deviceTargets: z.array(z.enum(['DESKTOP', 'TABLET', 'MOBILE', 'RUGGED_TERMINAL', 'KIOSK', 'EMBEDDED'])).default(['DESKTOP', 'MOBILE']),
  offlineNeeds: z.boolean().default(false),
  realtimeNeeds: z.boolean().default(false),
  integrationNeeds: z.array(z.string()).default([]),
  reportingNeeds: z.union([z.boolean(), z.array(z.string())]).default(false),
  localizationNeeds: z.array(z.string()).default(['en']),
  accessibilityNeeds: z.union([z.enum(['WCAG_2_1_AA', 'WCAG_2_1_AAA', 'STANDARD']), z.array(z.string())]).default('WCAG_2_1_AA'),
  deploymentEnvironment: z.enum([
    'DOCKER',
    'ON_PREMISE',
    'STANDALONE_HOST',
    'SERVERLESS',
    'STATIC_HOST',
    'CLOUD_VM',
    'CLOUD_CONTAINER'
  ]).default('DOCKER'),
  operationalConstraints: z.array(z.string()).default([]),
  unknowns: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([])
});
export type GreenfieldProjectProfile = z.infer<typeof GreenfieldProjectProfileSchema>;

// =========================================================================
// 2. Requirements Engineering Models (Section 3)
// =========================================================================

export const FunctionalRequirementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  source: z.string().describe('Mandatory source of requirement (User brief, Domain rule, or Regulatory specification)'),
  priority: z.enum(['MUST_HAVE', 'SHOULD_HAVE', 'COULD_HAVE', 'WONT_HAVE']).default('MUST_HAVE'),
  confidence: z.union([z.number().min(0).max(1), z.enum(['HIGH', 'MEDIUM', 'LOW'])]).default(1.0),
  verificationMethod: z.enum(['UNIT_TEST', 'INTEGRATION_TEST', 'BROWSER_TEST', 'STATIC_ANALYSIS', 'HUMAN_REVIEW']).default('UNIT_TEST'),
  acceptanceCriteria: z.array(z.string()).default([])
});
export type FunctionalRequirement = z.infer<typeof FunctionalRequirementSchema>;

export const NonFunctionalRequirementSchema = z.object({
  id: z.string(),
  category: z.enum(['PERFORMANCE', 'SECURITY', 'RELIABILITY', 'ACCESSIBILITY', 'SCALABILITY', 'USABILITY']),
  description: z.string(),
  targetMetric: z.string(),
  source: z.string(),
  priority: z.enum(['MUST_HAVE', 'SHOULD_HAVE', 'COULD_HAVE']).default('MUST_HAVE'),
  confidence: z.union([z.number().min(0).max(1), z.enum(['HIGH', 'MEDIUM', 'LOW'])]).default(1.0),
  verificationMethod: z.enum(['PERFORMANCE_TEST', 'SECURITY_SCAN', 'A11Y_AUDIT', 'LOAD_TEST', 'STATIC_ANALYSIS']).default('STATIC_ANALYSIS')
});
export type NonFunctionalRequirement = z.infer<typeof NonFunctionalRequirementSchema>;

export const ProjectConstraintSchema = z.object({
  id: z.string(),
  type: z.enum(['TECHNICAL', 'BUDGET', 'TIME', 'REGULATORY', 'INFRASTRUCTURE']),
  description: z.string(),
  source: z.string(),
  impact: z.string()
});
export type ProjectConstraint = z.infer<typeof ProjectConstraintSchema>;

export const AcceptanceCriterionSchema = z.object({
  id: z.string(),
  requirementId: z.string(),
  scenario: z.string(),
  given: z.string().optional(),
  when: z.string().optional(),
  then: z.string().optional(),
  verified: z.boolean().default(false)
});
export type AcceptanceCriterion = z.infer<typeof AcceptanceCriterionSchema>;

export const GreenfieldUserJourneySchema = z.object({
  journeyId: z.string(),
  role: z.string(),
  goal: z.string(),
  steps: z.array(
    z.object({
      stepNumber: z.number().int().positive(),
      action: z.string(),
      expectedResult: z.string(),
      pageId: z.string().optional()
    })
  )
});
export type GreenfieldUserJourney = z.infer<typeof GreenfieldUserJourneySchema>;

export const BusinessRuleSchema = z.object({
  id: z.string(),
  statement: z.string(),
  source: z.string().describe('Must be verifiable user or domain source; cannot be fabricated!'),
  enforcement: z.enum(['BLOCK', 'WARN', 'VALIDATE']).default('BLOCK'),
  affectedEntities: z.array(z.string()).default([])
});
export type BusinessRule = z.infer<typeof BusinessRuleSchema>;

// Complete Requirements Bundle
export const GreenfieldRequirementsBundleSchema = z.object({
  functional: z.array(FunctionalRequirementSchema),
  nonFunctional: z.array(NonFunctionalRequirementSchema),
  constraints: z.array(ProjectConstraintSchema),
  userJourneys: z.array(GreenfieldUserJourneySchema),
  businessRules: z.array(BusinessRuleSchema),
  acceptanceCriteria: z.array(AcceptanceCriterionSchema).default([])
});
export type GreenfieldRequirementsBundle = z.infer<typeof GreenfieldRequirementsBundleSchema>;

// =========================================================================
// 3. Requirement Traceability Matrix (Section 4)
// =========================================================================

export const TraceabilityItemSchema = z.object({
  requirementId: z.string(),
  architectureDecisionIds: z.array(z.string()).default([]),
  dataEntityIds: z.array(z.string()).default([]),
  apiRouteIds: z.array(z.string()).default([]),
  pageIds: z.array(z.string()).default([]),
  implementationFiles: z.array(z.string()).default([]),
  testIds: z.array(z.string()).default([]),
  status: z.enum(['PLANNED', 'IMPLEMENTED', 'TESTED', 'ORPHAN']).default('PLANNED')
});
export type TraceabilityItem = z.infer<typeof TraceabilityItemSchema>;

export const RequirementTraceabilityMatrixSchema = z.object({
  items: z.array(TraceabilityItemSchema),
  matrix: z.array(TraceabilityItemSchema).optional(),
  orphanRequirements: z.array(z.string()).default([]),
  unexpectedFeatures: z.array(z.string()).default([]),
  coverageRatio: z.number().min(0).max(1),
  coveragePercentage: z.number().optional(),
  untraceableCount: z.number().optional()
}).passthrough();
export type RequirementTraceabilityMatrix = z.infer<typeof RequirementTraceabilityMatrixSchema>;

// =========================================================================
// 4. Architecture Recommendation & Decision Engine (Section 5, 36, 37)
// =========================================================================

export const ArchitectureStyleSchema = z.enum([
  'MONOLITH',
  'MODULAR_MONOLITH',
  'CLIENT_SERVER',
  'SPA_API',
  'SSR',
  'SERVER_RENDERED',
  'EVENT_DRIVEN'
]);
export type ArchitectureStyle = z.infer<typeof ArchitectureStyleSchema>;

export const ComplexityBudgetSchema = z.object({
  maxAllowedComplexity: z.enum(['MINIMAL', 'LOW', 'MEDIUM', 'HIGH']).optional(),
  maxAcceptableComplexity: z.number().optional(),
  score: z.number().min(1).max(10),
  complexityScore: z.number().optional(),
  justification: z.string(),
  prohibitedTechnologies: z.array(z.string()).default([])
}).passthrough();
export type ComplexityBudget = z.infer<typeof ComplexityBudgetSchema>;

export const ArchitectureFitnessAssessmentSchema = z.object({
  fit: z.enum(['OPTIMAL', 'ACCEPTABLE', 'POOR', 'DISQUALIFIED']),
  complexityCost: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  operationalCost: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  scalabilityFit: z.enum(['SUFFICIENT', 'OVER_ENGINEERED', 'UNDER_ENGINEERED']),
  maintainability: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  securityFit: z.enum(['STRONG', 'ADEQUATE', 'DEFICIENT']),
  deploymentFit: z.enum(['SIMPLE', 'STANDARD', 'COMPLEX']),
  operationalSimplicityScore: z.number().optional(),
  notes: z.array(z.string()).default([])
}).passthrough();
export type ArchitectureFitnessAssessment = z.infer<typeof ArchitectureFitnessAssessmentSchema>;

export const ArchitectureRecommendationSchema = z.object({
  selectedStyle: ArchitectureStyleSchema,
  style: ArchitectureStyleSchema.optional(),
  rationale: z.string(),
  complexityBudget: ComplexityBudgetSchema,
  fitnessAssessment: ArchitectureFitnessAssessmentSchema,
  antiOverengineeringGuard: z.object({
    triggered: z.boolean(),
    reasons: z.array(z.string()).default([])
  }).optional(),
  prohibitedTechnologies: z.array(z.string()).optional(),
  alternativesConsidered: z.array(
    z.object({
      style: ArchitectureStyleSchema,
      whyRejected: z.string()
    })
  ),
  keyDecisions: z.array(
    z.object({
      decision: z.string(),
      why: z.string(),
      tradeoffs: z.string()
    })
  )
}).passthrough();
export type ArchitectureRecommendation = z.infer<typeof ArchitectureRecommendationSchema>;

// =========================================================================
// 5. Stack Selection Engine (Section 6)
// =========================================================================

export const GreenfieldStackTypeSchema = z.enum([
  'REACT_TYPESCRIPT',
  'LARAVEL_BLADE',
  'ASPNET_RAZOR',
  'PLAIN_HTML_CSS_JS'
]);
export type GreenfieldStackType = z.infer<typeof GreenfieldStackTypeSchema>;

export const StackRecommendationSchema = z.object({
  primaryStack: GreenfieldStackTypeSchema,
  runtime: z.string(),
  frontend: z.string(),
  backend: z.string(),
  databaseAdapter: z.string(),
  frontendLanguage: z.string().optional(),
  backendLanguage: z.string().optional(),
  templateEngine: z.string().optional(),
  buildTool: z.string().optional(),
  reasons: z.array(z.string()),
  userConstraintHonored: z.boolean(),
  maturityAssessment: z.string()
}).passthrough();
export type StackRecommendation = z.infer<typeof StackRecommendationSchema>;

// =========================================================================
// 6. Database Blueprint Engine & Data Safety (Section 7, 8)
// =========================================================================

export const DatabaseEngineTypeSchema = z.enum([
  'POSTGRESQL',
  'SQL_SERVER',
  'MYSQL',
  'SQLITE'
]);
export type DatabaseEngineType = z.infer<typeof DatabaseEngineTypeSchema>;

export const DataClassificationSchema = z.enum([
  'PUBLIC',
  'INTERNAL',
  'CONFIDENTIAL',
  'SENSITIVE'
]);
export type DataClassification = z.infer<typeof DataClassificationSchema>;

export const EntityFieldSchema = z.object({
  name: z.string(),
  type: z.string(),
  isPrimary: z.boolean().default(false),
  isNullable: z.boolean().default(false),
  isUnique: z.boolean().default(false),
  defaultValue: z.string().optional(),
  isSensitive: z.boolean().default(false),
  securityHandling: z.enum(['NONE', 'ARGON2_HASH', 'AES_ENCRYPTED', 'REDACTED', 'MASKED']).default('NONE')
}).passthrough();
export type EntityField = z.infer<typeof EntityFieldSchema>;

export const EntityRelationshipSchema = z.object({
  targetEntity: z.string(),
  cardinality: z.enum(['ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'MANY_TO_MANY']),
  foreignKey: z.string(),
  onDelete: z.enum(['CASCADE', 'SET_NULL', 'RESTRICT']).default('RESTRICT')
}).passthrough();
export type EntityRelationship = z.infer<typeof EntityRelationshipSchema>;

export const DatabaseEntitySchema = z.object({
  name: z.string(),
  tableName: z.string(),
  description: z.string(),
  dataClassification: DataClassificationSchema.default('INTERNAL'),
  fields: z.array(EntityFieldSchema),
  relationships: z.array(EntityRelationshipSchema).default([]),
  indexes: z.array(z.object({ name: z.string(), columns: z.array(z.string()), isUnique: z.boolean().optional() })).default([]),
  softDelete: z.boolean().default(false),
  auditFields: z.boolean().default(true)
}).passthrough();
export type DatabaseEntity = z.infer<typeof DatabaseEntitySchema>;

export const DatabaseBlueprintSchema = z.object({
  databaseEngine: DatabaseEngineTypeSchema,
  engine: DatabaseEngineTypeSchema.optional(),
  entities: z.array(DatabaseEntitySchema),
  tables: z.array(z.any()).optional(),
  normalizationLevel: z.enum(['3NF', 'DENORMALIZED_FOR_READS']).default('3NF'),
  expectedGrowthRate: z.string().default('MODERATE'),
  sqlMigrations: z.array(z.object({ filename: z.string(), sql: z.string() })).default([]),
  migrations: z.array(z.any()).optional()
}).passthrough();
export type DatabaseBlueprint = z.infer<typeof DatabaseBlueprintSchema>;

// =========================================================================
// 7. API Design Engine (Section 9)
// =========================================================================

export const ApiEndpointSchema = z.object({
  id: z.string(),
  resource: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  route: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  requestSchema: z.record(z.any()).optional(),
  responseSchema: z.record(z.any()).optional(),
  errorResponses: z.array(z.object({ code: z.number().int(), description: z.string() })).default([]),
  authorizationRequired: z.boolean().default(true),
  requiredRoles: z.array(z.string()).optional(),
  supportsPagination: z.boolean().default(false),
  supportsFiltering: z.boolean().default(false),
  supportsSorting: z.boolean().default(false),
  idempotent: z.boolean().default(false)
}).passthrough();
export type ApiEndpoint = z.infer<typeof ApiEndpointSchema>;

export const ApiBlueprintSchema = z.object({
  style: z.enum(['REST', 'MESSAGE_CONTRACT', 'INTERNAL_SERVICE']).default('REST'),
  baseUrl: z.string().default('/api/v1'),
  endpoints: z.array(ApiEndpointSchema),
  openApiSpec: z.record(z.any()).describe('OpenAPI 3.1.0 compatible document').optional(),
  openApiDocument: z.record(z.any()).optional(),
  pagination: z.object({
    defaultLimit: z.number(),
    maxLimit: z.number()
  }).optional(),
  errorEnvelope: z.object({
    code: z.string(),
    message: z.string(),
    timestamp: z.string().optional()
  }).optional()
}).passthrough();
export type ApiBlueprint = z.infer<typeof ApiBlueprintSchema>;

// =========================================================================
// 8. AuthN / AuthZ Models (Section 10)
// =========================================================================

export const AuthenticationModelSchema = z.object({
  strategy: z.enum(['SESSION_COOKIE', 'BEARER_TOKEN', 'OIDC_OAUTH2', 'LOCAL_DEV_SIMPLE']),
  mechanism: z.string().optional(),
  sessionCookieName: z.string().optional(),
  sessionDurationHours: z.number().default(24),
  cookieSettings: z.object({
    httpOnly: z.boolean().default(true),
    secure: z.boolean().default(true),
    sameSite: z.enum(['strict', 'lax', 'none']).default('strict')
  }),
  passwordPolicy: z.object({
    minLength: z.number().default(10),
    requireSpecial: z.boolean().default(true),
    hashingAlgorithm: z.string().default('Argon2id')
  }),
  multiFactorSupported: z.boolean().default(false)
}).passthrough();
export type AuthenticationModel = z.infer<typeof AuthenticationModelSchema>;

export const AuthorizationRoleSchema = z.object({
  name: z.string(),
  roleName: z.string().optional(),
  description: z.string(),
  permissions: z.array(z.string())
}).passthrough();
export type AuthorizationRole = z.infer<typeof AuthorizationRoleSchema>;

export const AuthorizationModelSchema = z.object({
  strategy: z.enum(['RBAC', 'ABAC', 'POLICY_BASED']).default('RBAC'),
  roles: z.array(AuthorizationRoleSchema),
  permissions: z.array(z.string()),
  policies: z.array(z.object({ name: z.string(), resource: z.string(), rule: z.string() })).default([])
}).passthrough();
export type AuthorizationModel = z.infer<typeof AuthorizationModelSchema>;

// =========================================================================
// 9. Product UX Model, Page Inventory & States (Section 11, 12, 13)
// =========================================================================

export const PageStateSchema = z.enum([
  'LOADING',
  'EMPTY',
  'SUCCESS',
  'ERROR',
  'PARTIAL',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'OFFLINE'
]);
export type PageState = z.infer<typeof PageStateSchema>;

export const PageInventoryItemSchema = z.object({
  pageId: z.string(),
  title: z.string(),
  route: z.string(),
  purpose: z.string(),
  primaryJob: z.string(),
  targetUsers: z.array(z.string()),
  requiredData: z.array(z.string()),
  actions: z.array(z.string()),
  states: z.union([z.record(z.any()), z.array(PageStateSchema)]).default(['LOADING', 'EMPTY', 'SUCCESS', 'ERROR']),
  permissions: z.array(z.string()).default([]),
  responsiveStrategy: z.string().default('Adaptive Desktop to Mobile Stack'),
  criticality: z.enum(['CORE', 'SECONDARY', 'ADMIN']).default('CORE')
}).passthrough();
export type PageInventoryItem = z.infer<typeof PageInventoryItemSchema>;

export const NavigationNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    route: z.string(),
    icon: z.string().optional(),
    children: z.array(NavigationNodeSchema).optional()
  }).passthrough()
);
export type NavigationNode = {
  id: string;
  label: string;
  route: string;
  icon?: string;
  children?: NavigationNode[];
};

export const GreenfieldPageInventorySchema = z.object({
  pages: z.array(PageInventoryItemSchema),
  navigationTree: z.array(NavigationNodeSchema),
  workflowMap: z.array(
    z.object({
      workflowId: z.string(),
      name: z.string(),
      pageSequence: z.array(z.string())
    })
  )
}).passthrough();
export type GreenfieldPageInventory = z.infer<typeof GreenfieldPageInventorySchema>;

// =========================================================================
// 10. Performance Budget & Observability (Section 23, 24)
// =========================================================================

export const ProjectPerformanceBudgetSchema = z.object({
  maxJsBundleKb: z.number().default(180),
  maxBundleSizeKb: z.number().optional(),
  maxCssBundleKb: z.number().default(45),
  maxInitialRequests: z.number().default(12),
  lcpTargetMs: z.number().default(2000),
  maxLcpMs: z.number().optional(),
  inpTargetMs: z.number().default(150),
  clsTarget: z.number().default(0.05),
  apiP95LatencyMs: z.number().default(250)
}).passthrough();
export type ProjectPerformanceBudget = z.infer<typeof ProjectPerformanceBudgetSchema>;

export const ProjectObservabilityProfileSchema = z.object({
  structuredLogging: z.boolean().default(true),
  correlationIdHeader: z.string().default('X-Correlation-ID'),
  healthEndpoint: z.string().default('/api/health'),
  healthCheckEndpoint: z.string().optional(),
  sensitiveFieldRedaction: z.array(z.string()).default([]),
  metricsEnabled: z.boolean().default(false),
  tracingEnabled: z.boolean().default(false)
}).passthrough();
export type ProjectObservabilityProfile = z.infer<typeof ProjectObservabilityProfileSchema>;

// =========================================================================
// 11. New Project Blueprint (Section 16)
// =========================================================================

export const NewProjectBlueprintSchema = z.object({
  blueprintId: z.string(),
  productProfile: GreenfieldProjectProfileSchema,
  profile: GreenfieldProjectProfileSchema.optional(),
  requirements: GreenfieldRequirementsBundleSchema,
  architecture: ArchitectureRecommendationSchema,
  stack: StackRecommendationSchema,
  database: DatabaseBlueprintSchema,
  api: ApiBlueprintSchema,
  authN: AuthenticationModelSchema,
  authZ: AuthorizationModelSchema,
  pageInventory: GreenfieldPageInventorySchema,
  pages: GreenfieldPageInventorySchema.optional(),
  boundaryContract: z.any().optional(),
  performanceBudget: ProjectPerformanceBudgetSchema,
  observability: ProjectObservabilityProfileSchema,
  createdTimestamp: z.string()
}).passthrough();
export type NewProjectBlueprint = z.infer<typeof NewProjectBlueprintSchema>;

// =========================================================================
// 12. Project Implementation Plan (Section 17, 18)
// =========================================================================

export const GreenfieldStageTypeSchema = z.enum([
  'FOUNDATION',
  'DATA',
  'API',
  'AUTH',
  'SHELL',
  'CORE_WORKFLOW',
  'SECONDARY_WORKFLOW',
  'QA',
  'HARDENING'
]);
export type GreenfieldStageType = z.infer<typeof GreenfieldStageTypeSchema>;

export const ProjectImplementationStageSchema = z.object({
  stageId: z.string(),
  order: z.number().int().positive(),
  type: GreenfieldStageTypeSchema,
  name: z.string(),
  objective: z.string(),
  filesToCreate: z.array(z.string()),
  dependencies: z.array(z.string()).default([]),
  requirementsSatisfied: z.array(z.string()),
  testsToRun: z.array(z.string()),
  verificationKind: EvidenceKindSchema.default('STATIC_ANALYSIS'),
  rollbackSteps: z.array(z.string())
}).passthrough();
export type ProjectImplementationStage = z.infer<typeof ProjectImplementationStageSchema>;

export const ProjectImplementationPlanSchema = z.object({
  planId: z.string(),
  blueprintId: z.string(),
  stages: z.array(ProjectImplementationStageSchema),
  estimatedStages: z.number(),
  estimatedDays: z.number().optional()
}).passthrough();
export type ProjectImplementationPlan = z.infer<typeof ProjectImplementationPlanSchema>;

// =========================================================================
// 13. Scope Boundary & Definition of Done (Section 27, 28, 38)
// =========================================================================

export const RequirementBoundaryContractSchema = z.object({
  contractId: z.string(),
  allowedRequirementIds: z.array(z.string()),
  allowedFeatureIds: z.array(z.string()).optional(),
  allowedScopeFeatures: z.array(z.string()),
  prohibitedFeatures: z.array(z.string()).default([]),
  forbiddenTechnologies: z.array(z.string()).default([]),
  strictNoOutofScopeCreep: z.boolean().default(true)
}).passthrough();
export type RequirementBoundaryContract = z.infer<typeof RequirementBoundaryContractSchema>;

export const NewProjectCompletionContractSchema = z.object({
  blueprintId: z.string().optional(),
  requirementsCoverage: z.object({
    requested: z.number(),
    implemented: z.number(),
    tested: z.number(),
    orphanCount: z.number(),
    unexpectedFeatureCount: z.number(),
    coverageRatio: z.number().min(0).max(1)
  }).optional(),
  gates: z.record(GateVerificationResultSchema).optional(),
  gateResults: z.record(z.any()).optional(),
  overallAssurance: AssuranceLevelSchema,
  isComplete: z.boolean(),
  verdict: z.enum(['COMPLETE', 'INCOMPLETE', 'REJECTED']),
  blockReasons: z.array(z.string())
}).passthrough();
export type NewProjectCompletionContract = z.infer<typeof NewProjectCompletionContractSchema>;

// =========================================================================
// 14. Scaffolding Output Model (Section 19, 20, 25, 26)
// =========================================================================

export const GeneratedProjectFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  isExecutable: z.boolean().default(false),
  stage: GreenfieldStageTypeSchema.optional()
}).passthrough();
export type GeneratedProjectFile = z.infer<typeof GeneratedProjectFileSchema>;

export const ScaffoldResultSchema = z.object({
  success: z.boolean(),
  workspaceDir: z.string(),
  stack: GreenfieldStackTypeSchema,
  filesCreated: z.array(z.string()),
  filesGenerated: z.array(z.string()).optional(),
  hasDockerConfig: z.boolean(),
  hasEnvExample: z.boolean(),
  truthfulDataVerified: z.boolean(),
  buildEvidence: z.object({
    buildable: z.boolean(),
    syntaxValid: z.boolean(),
    details: z.string()
  })
}).passthrough();
export type ScaffoldResult = z.infer<typeof ScaffoldResultSchema>;
