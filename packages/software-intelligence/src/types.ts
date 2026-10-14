import { z } from 'zod';

// 1. Architecture Intelligence Schemas
export const ArchitectureStyleSchema = z.enum([
  'MONOLITH',
  'MODULAR_MONOLITH',
  'LAYERED',
  'CLEAN_ARCHITECTURE',
  'HEXAGONAL',
  'MICROSERVICES',
  'EVENT_DRIVEN',
  'SERVERLESS',
  'SPA_API',
  'SSR',
  'LEGACY_MIXED'
]);
export type ArchitectureStyle = z.infer<typeof ArchitectureStyleSchema>;

export const ArchitectureProfileSchema = z.object({
  id: z.string(),
  architectureStyle: ArchitectureStyleSchema,
  modules: z.array(z.string()),
  boundaries: z.array(z.object({
    name: z.string(),
    description: z.string(),
    exportedInterfaces: z.array(z.string())
  })),
  dependencies: z.array(z.object({
    from: z.string(),
    to: z.string(),
    isCircular: z.boolean().default(false)
  })),
  dependencyDirection: z.enum(['UNIDIRECTIONAL_SAFE', 'CIRCULAR_DEFICIT', 'TIGHTLY_COUPLED']),
  dataOwnership: z.record(z.string()), // module -> owned database entities
  integrationPoints: z.array(z.string()),
  sharedState: z.array(z.string()),
  backgroundJobs: z.array(z.string()),
  externalServices: z.array(z.string()),
  deploymentUnits: z.array(z.string()),
  scalabilityRequirements: z.string(),
  availabilityRequirements: z.string(),
  technicalDebt: z.array(z.object({
    category: z.string(),
    description: z.string(),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  }))
});
export type ArchitectureProfile = z.infer<typeof ArchitectureProfileSchema>;

// Architecture Decision Record (ADR)
export const ADRStatusSchema = z.enum(['PROPOSED', 'ACCEPTED', 'REJECTED', 'SUPERSEDED', 'DEPRECATED']);
export type ADRStatus = z.infer<typeof ADRStatusSchema>;

export const ADRDocumentSchema = z.object({
  id: z.string(),
  number: z.number().int().positive().optional(),
  title: z.string(),
  status: ADRStatusSchema,
  date: z.string(),
  context: z.string(),
  decision: z.string(),
  consequences: z.object({
    positive: z.array(z.string()),
    negative: z.array(z.string()),
    neutral: z.array(z.string()).default([]),
    risks: z.array(z.string())
  })
});
export type ADRDocument = z.infer<typeof ADRDocumentSchema>;

// 2. Database Engineering Schemas
export const DatabaseEngineSchema = z.enum([
  'SQL_SERVER',
  'POSTGRESQL',
  'MYSQL',
  'MARIADB',
  'SQLITE'
]);
export type DatabaseEngine = z.infer<typeof DatabaseEngineSchema>;

export const MigrationRiskSchema = z.enum(['SAFE', 'REVIEW_REQUIRED', 'DANGEROUS']);
export type MigrationRisk = z.infer<typeof MigrationRiskSchema>;

export const DatabaseProfileSchema = z.object({
  engine: DatabaseEngineSchema,
  entitiesCount: z.number().int().nonnegative(),
  indexesCount: z.number().int().nonnegative(),
  missingIndexes: z.array(z.string()),
  unusedIndexes: z.array(z.string()),
  nPlusOneSuspects: z.array(z.string()),
  paginationStrategy: z.enum(['KEYSET', 'OFFSET_SAFE', 'UNBOUNDED_RISK']),
  transactionIsolation: z.enum(['READ_COMMITTED', 'REPEATABLE_READ', 'SERIALIZABLE', 'UNSPECIFIED']),
  connectionPoolingConfigured: z.boolean(),
  migrationSafety: MigrationRiskSchema,
  recommendations: z.array(z.string())
});
export type DatabaseProfile = z.infer<typeof DatabaseProfileSchema>;

// 3. Observability Schemas (OpenTelemetry aligned)
export const ObservabilitySignalSchema = z.enum(['TRACES', 'METRICS', 'LOGS']);
export type ObservabilitySignal = z.infer<typeof ObservabilitySignalSchema>;

export const ObservabilityProfileSchema = z.object({
  supportedSignals: z.array(ObservabilitySignalSchema),
  structuredLoggingEnabled: z.boolean(),
  correlationIdPropagated: z.boolean(),
  distributedTracingEnabled: z.boolean(),
  piiRedactionEnforced: z.boolean(),
  redactedPatterns: z.array(z.string()).default([
    'password',
    'token',
    'cookie',
    'authorization',
    'secret',
    'ssn',
    'credit_card'
  ]),
  healthEndpoints: z.object({
    liveness: z.boolean().default(true),
    readiness: z.boolean().default(true),
    dependencies: z.boolean().default(false)
  }),
  exporterType: z.enum(['OTLP_GRPC', 'OTLP_HTTP', 'CONSOLE', 'PROMETHEUS'])
});
export type ObservabilityProfile = z.infer<typeof ObservabilityProfileSchema>;

// 4. Reliability & SLO Schemas
export const SliTypeSchema = z.enum([
  'AVAILABILITY',
  'REQUEST_LATENCY',
  'ERROR_RATE',
  'JOB_COMPLETION',
  'QUEUE_DELAY',
  'DATABASE_LATENCY'
]);
export type SliType = z.infer<typeof SliTypeSchema>;

export const ReliabilityProfileSchema = z.object({
  slis: z.array(z.object({
    type: SliTypeSchema,
    targetPercentage: z.number().min(0).max(100),
    measurementWindowDays: z.number().positive().default(30)
  })),
  errorBudgetPolicy: z.string(),
  isMissionCritical: z.boolean()
});
export type ReliabilityProfile = z.infer<typeof ReliabilityProfileSchema>;

// 5. API Governance Schemas (OpenAPI / AsyncAPI)
export const ApiProtocolSchema = z.enum(['REST_OPENAPI', 'EVENT_ASYNCAPI', 'GRAPHQL', 'GRPC']);
export type ApiProtocol = z.infer<typeof ApiProtocolSchema>;

export const APIProfileSchema = z.object({
  protocol: ApiProtocolSchema,
  specificationFile: z.string().optional(),
  endpointsCount: z.number().int().nonnegative(),
  hasBreakingChanges: z.boolean(),
  breakingChangesSummary: z.array(z.string()),
  rateLimitingEnforced: z.boolean(),
  idempotencyKeysSupported: z.boolean(),
  validationSchemaEnforced: z.boolean()
});
export type APIProfile = z.infer<typeof APIProfileSchema>;

// 6. Release & Feature Flag Schemas (OpenFeature aligned)
export const ReleaseProfileSchema = z.object({
  featureFlagProvider: z.string().default('OpenFeature'),
  deploymentStrategy: z.enum(['ROLLING', 'BLUE_GREEN', 'CANARY', 'DIRECT']),
  canaryRolloutSupported: z.boolean(),
  killSwitchSupported: z.boolean(),
  staleFlagsCount: z.number().int().nonnegative(),
  rollbackStrategy: z.string()
});
export type ReleaseProfile = z.infer<typeof ReleaseProfileSchema>;

// 7. Production Readiness Schemas
export const ProductionReadinessProfileSchema = z.object({
  backupStrategyConfigured: z.boolean(),
  restoreVerified: z.boolean(),
  rpoHours: z.number().nonnegative(),
  rtoHours: z.number().nonnegative(),
  disasterRecoveryPlanExists: z.boolean(),
  readinessRating: z.enum(['READY', 'CONDITIONAL', 'NOT_READY'])
});
export type ProductionReadinessProfile = z.infer<typeof ProductionReadinessProfileSchema>;

// 8. Code Classification Schemas
export const CodeClassificationSchema = z.enum([
  'SOURCE',
  'GENERATED',
  'VENDORED',
  'BUILD_OUTPUT',
  'MIGRATION',
  'CONFIGURATION'
]);
export type CodeClassification = z.infer<typeof CodeClassificationSchema>;
