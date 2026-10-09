import {
  ObservabilityProfile,
  ObservabilityProfileSchema,
  ReliabilityProfile,
  ReliabilityProfileSchema
} from './types.js';

export function createObservabilityPlan(options: {
  isDistributed?: boolean;
  exporterType?: 'OTLP_GRPC' | 'OTLP_HTTP' | 'CONSOLE' | 'PROMETHEUS';
}): ObservabilityProfile {
  const profile: ObservabilityProfile = {
    supportedSignals: ['TRACES', 'METRICS', 'LOGS'],
    structuredLoggingEnabled: true,
    correlationIdPropagated: true,
    distributedTracingEnabled: options.isDistributed ?? true,
    piiRedactionEnforced: true,
    redactedPatterns: [
      'password',
      'token',
      'cookie',
      'authorization',
      'secret',
      'ssn',
      'credit_card',
      'api_key'
    ],
    healthEndpoints: {
      liveness: true,
      readiness: true,
      dependencies: true
    },
    exporterType: options.exporterType || 'OTLP_GRPC'
  };

  return ObservabilityProfileSchema.parse(profile);
}

export function detectSensitiveLogging(logSample: string): {
  hasSensitiveData: boolean;
  leakedFields: string[];
  remediation: string;
} {
  const sensitiveKeys = [
    'password',
    'passwd',
    'token',
    'access_token',
    'bearer',
    'cookie',
    'auth_header',
    'secret',
    'private_key'
  ];

  const leaked: string[] = [];
  const lower = logSample.toLowerCase();

  for (const key of sensitiveKeys) {
    const regex = new RegExp(`["']?${key}["']?\\s*[:=]\\s*["'][^"']+["']`, 'i');
    if (regex.test(lower)) {
      leaked.push(key);
    }
  }

  return {
    hasSensitiveData: leaked.length > 0,
    leakedFields: leaked,
    remediation: leaked.length > 0
      ? 'Apply OpenTelemetry or logger PII redaction transform before serialization to disk/stream.'
      : 'Log sample verified free of cleartext credentials and tokens.'
  };
}

export function createReliabilityProfile(options: {
  isMissionCritical?: boolean;
  targetAvailabilityPercent?: number;
}): ReliabilityProfile {
  const isCritical = options.isMissionCritical ?? false;
  const targetAvailability = options.targetAvailabilityPercent ?? (isCritical ? 99.95 : 99.9);

  const profile: ReliabilityProfile = {
    slis: [
      {
        type: 'AVAILABILITY',
        targetPercentage: targetAvailability,
        measurementWindowDays: 30
      },
      {
        type: 'REQUEST_LATENCY',
        targetPercentage: isCritical ? 99.0 : 95.0, // 99% of requests < 500ms
        measurementWindowDays: 30
      },
      {
        type: 'ERROR_RATE',
        targetPercentage: isCritical ? 99.9 : 99.0, // Error rate < 0.1%
        measurementWindowDays: 30
      }
    ],
    errorBudgetPolicy: isCritical
      ? 'Exceeding 20% error budget freezes feature releases; engineering pivots to reliability hardening.'
      : 'Exceeding 50% error budget triggers sprint reliability retro.',
    isMissionCritical: isCritical
  };

  return ReliabilityProfileSchema.parse(profile);
}
