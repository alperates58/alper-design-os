import {
  PageIntent,
  PageIntentSchema,
  PageIntentType,
  PageIntentAuditResult,
  PageIntentAuditResultSchema,
  DataOriginType
} from './types.js';

export interface CreatePageIntentParams {
  intentType: PageIntentType;
  primaryGoal: string;
  targetAudience: string;
  criticality?: 'MISSION_CRITICAL' | 'BUSINESS_CRITICAL' | 'OPERATIONAL' | 'INFORMATIONAL';
  dataFreshnessRequirement?: 'REALTIME' | 'NEAR_REALTIME' | 'BATCH_HOURLY' | 'STATIC';
  acceptableOrigins?: DataOriginType[];
  requiredActionPaths?: string[];
  forbiddenVisualGimmicks?: string[];
}

export function createPageIntent(params: CreatePageIntentParams): PageIntent {
  const criticality =
    params.criticality ||
    (params.intentType === 'OPERATIONAL_MONITORING' || params.intentType === 'DIAGNOSTIC_INVESTIGATION'
      ? 'MISSION_CRITICAL'
      : params.intentType === 'EXECUTIVE_DECISION'
      ? 'BUSINESS_CRITICAL'
      : 'OPERATIONAL');

  const dataFreshnessRequirement =
    params.dataFreshnessRequirement ||
    (params.intentType === 'OPERATIONAL_MONITORING'
      ? 'REALTIME'
      : params.intentType === 'EXECUTIVE_DECISION'
      ? 'NEAR_REALTIME'
      : 'STATIC');

  const acceptableOrigins =
    params.acceptableOrigins ||
    (params.intentType === 'OPERATIONAL_MONITORING'
      ? ['AUTHORITATIVE_API', 'TELEMETRY_STREAM', 'DATABASE_RECORD']
      : params.intentType === 'DEMO_SHOWCASE'
      ? ['AUTHORITATIVE_API', 'SYNTHETIC_MOCK', 'STATIC_FIXTURE', 'USER_INPUT']
      : ['AUTHORITATIVE_API', 'TELEMETRY_STREAM', 'DATABASE_RECORD', 'DERIVED_COMPUTATION', 'CACHE_SNAPSHOT', 'USER_INPUT']);

  const forbiddenVisualGimmicks =
    params.forbiddenVisualGimmicks ||
    (params.intentType === 'OPERATIONAL_MONITORING'
      ? [
          'DECORATIVE_TICKER_TAPE',
          'UNCONNECTED_ANALOG_GAUGE',
          'SPURIOUS_ANIMATION',
          'SYNTHETIC_PULSE_WITHOUT_FEED',
          'MOCK_CAROUSEL'
        ]
      : params.intentType === 'EXECUTIVE_DECISION'
      ? ['DECORATIVE_TICKER_TAPE', 'FLASHING_ALERT_BANNER', 'RAW_LOG_DUMP']
      : ['DECORATIVE_TICKER_TAPE']);

  const requiredActionPaths = params.requiredActionPaths || [
    'primary_filter',
    'drilldown_inspection',
    'status_refresh'
  ];

  return PageIntentSchema.parse({
    intentType: params.intentType,
    primaryGoal: params.primaryGoal,
    targetAudience: params.targetAudience,
    criticality,
    dataFreshnessRequirement,
    acceptableOrigins,
    requiredActionPaths,
    forbiddenVisualGimmicks
  });
}

export interface AuditedComponentInput {
  id: string;
  type: string;
  role: string;
  originType?: DataOriginType;
  isSimulated?: boolean;
  title?: string;
  visualGimmicks?: string[];
}

export function auditPageIntent(
  intent: PageIntent,
  components: AuditedComponentInput[]
): PageIntentAuditResult {
  const mismatchedComponents: Array<{ componentId: string; reason: string }> = [];
  const forbiddenGimmicksFound: string[] = [];

  for (const comp of components) {
    // 1. Check acceptable data origins for component
    if (comp.originType && !intent.acceptableOrigins.includes(comp.originType)) {
      mismatchedComponents.push({
        componentId: comp.id,
        reason: `Component '${comp.id}' utilizes origin '${comp.originType}', which is disallowed for Page Intent '${intent.intentType}'.`
      });
    }

    // 2. Strict live requirement for operational monitoring
    if (intent.intentType === 'OPERATIONAL_MONITORING' && comp.isSimulated) {
      mismatchedComponents.push({
        componentId: comp.id,
        reason: `Component '${comp.id}' uses simulated data in a MISSION_CRITICAL OPERATIONAL_MONITORING intent without isolation.`
      });
    }

    // 3. Inspect forbidden visual gimmicks
    if (comp.visualGimmicks && comp.visualGimmicks.length > 0) {
      for (const gimmick of comp.visualGimmicks) {
        if (intent.forbiddenVisualGimmicks.includes(gimmick)) {
          forbiddenGimmicksFound.push(`${comp.id}: ${gimmick}`);
        }
      }
    }

    // 4. Role mismatch checks
    if (intent.intentType === 'OPERATIONAL_MONITORING' && comp.role === 'marketing-hero') {
      mismatchedComponents.push({
        componentId: comp.id,
        reason: `Marketing hero component '${comp.id}' directly contradicts operational monitoring focus.`
      });
    }
  }

  const penalty = mismatchedComponents.length * 20 + forbiddenGimmicksFound.length * 25;
  const alignmentScore = Math.max(0, Math.min(100, 100 - penalty));
  const matchesIntent = alignmentScore >= 75 && forbiddenGimmicksFound.length === 0;

  const summary = matchesIntent
    ? `Page Intent alignment PASSED (${alignmentScore}/100) for intent '${intent.intentType}'.`
    : `Page Intent alignment FAILED (${alignmentScore}/100): ${mismatchedComponents.length} component mismatch(es), ${forbiddenGimmicksFound.length} forbidden gimmick(s).`;

  return PageIntentAuditResultSchema.parse({
    matchesIntent,
    alignmentScore,
    mismatchedComponents,
    forbiddenGimmicksFound,
    summary
  });
}
