import {
  APIProfile,
  APIProfileSchema,
  CodeClassification,
  ProductionReadinessProfile,
  ProductionReadinessProfileSchema,
  ReleaseProfile,
  ReleaseProfileSchema
} from './types.js';

export function analyzeApiContract(options: {
  endpointsCount?: number;
  hasOpenApi?: boolean;
  hasAsyncApi?: boolean;
  previousSpec?: any;
  currentSpec?: any;
}): APIProfile {
  const breakingChanges: string[] = [];

  // Check for breaking changes between specifications if provided
  if (options.previousSpec && options.currentSpec) {
    const prevEndpoints = Object.keys(options.previousSpec.paths || {});
    const currEndpoints = Object.keys(options.currentSpec.paths || {});

    for (const ep of prevEndpoints) {
      if (!currEndpoints.includes(ep)) {
        breakingChanges.push(`Removed endpoint [${ep}] is a breaking change.`);
      }
    }
  }

  const profile: APIProfile = {
    protocol: options.hasAsyncApi ? 'EVENT_ASYNCAPI' : 'REST_OPENAPI',
    specificationFile: options.hasOpenApi ? 'openapi.yaml' : options.hasAsyncApi ? 'asyncapi.yaml' : undefined,
    endpointsCount: options.endpointsCount || 12,
    hasBreakingChanges: breakingChanges.length > 0,
    breakingChangesSummary: breakingChanges,
    rateLimitingEnforced: true,
    idempotencyKeysSupported: true,
    validationSchemaEnforced: true
  };

  return APIProfileSchema.parse(profile);
}

export function classifyFileCodeType(filePath: string): CodeClassification {
  const norm = filePath.toLowerCase().replace(/\\/g, '/');

  if (norm.startsWith('node_modules/') || norm.includes('/node_modules/') || norm.startsWith('vendor/') || norm.includes('/vendor/')) {
    return 'VENDORED';
  }
  if (norm.startsWith('dist/') || norm.includes('/dist/') || norm.startsWith('build/') || norm.includes('/build/') || norm.includes('/out/') || norm.includes('.next/')) {
    return 'BUILD_OUTPUT';
  }
  if (norm.startsWith('migrations/') || norm.includes('/migrations/') || norm.includes('migration.sql') || norm.includes('/database/migrations/') || norm.endsWith('.sql')) {
    return 'MIGRATION';
  }
  if (
    norm.endsWith('.g.ts') ||
    norm.endsWith('.generated.ts') ||
    norm.includes('graphql.schema.ts') ||
    norm.startsWith('generated/') ||
    norm.includes('/generated/') ||
    norm.includes('swagger-client.ts')
  ) {
    return 'GENERATED';
  }
  if (
    norm.endsWith('.json') ||
    norm.endsWith('.yaml') ||
    norm.endsWith('.yml') ||
    norm.endsWith('.toml') ||
    norm.endsWith('.env.example')
  ) {
    return 'CONFIGURATION';
  }

  return 'SOURCE';
}

export function evaluateProductionReadiness(options: {
  hasBackupPlan: boolean;
  isRestoreVerified: boolean;
  rpoHours?: number;
  rtoHours?: number;
}): ProductionReadinessProfile {
  const rpo = options.rpoHours ?? 1;
  const rto = options.rtoHours ?? 4;

  let rating: 'READY' | 'CONDITIONAL' | 'NOT_READY' = 'NOT_READY';
  if (options.hasBackupPlan && options.isRestoreVerified) {
    rating = 'READY';
  } else if (options.hasBackupPlan && !options.isRestoreVerified) {
    rating = 'CONDITIONAL'; // Backup exists, but restore unverified!
  }

  const profile: ProductionReadinessProfile = {
    backupStrategyConfigured: options.hasBackupPlan,
    restoreVerified: options.isRestoreVerified,
    rpoHours: rpo,
    rtoHours: rto,
    disasterRecoveryPlanExists: options.hasBackupPlan,
    readinessRating: rating
  };

  return ProductionReadinessProfileSchema.parse(profile);
}

export function createReleaseProfile(options?: {
  canarySupported?: boolean;
}): ReleaseProfile {
  const profile: ReleaseProfile = {
    featureFlagProvider: 'OpenFeature',
    deploymentStrategy: options?.canarySupported ? 'CANARY' : 'ROLLING',
    canaryRolloutSupported: options?.canarySupported ?? true,
    killSwitchSupported: true,
    staleFlagsCount: 0,
    rollbackStrategy: 'Automated health probe rollback within 60s of anomaly detection'
  };

  return ReleaseProfileSchema.parse(profile);
}
