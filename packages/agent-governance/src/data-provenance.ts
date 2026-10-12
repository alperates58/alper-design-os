import {
  DataProvenanceRecord,
  DataProvenanceRecordSchema,
  DataProvenanceAuditResult,
  DataProvenanceAuditResultSchema,
  DataOriginType,
  SourceAuthorityTier,
  DataFreshnessStatus,
  TruthfulUIPolicy,
  TruthfulUIPolicySchema
} from './types.js';
import { classifySourceAuthority } from './source-authority.js';

export interface CreateDataProvenanceParams {
  provenanceId?: string;
  fieldOrComponentId: string;
  originType: DataOriginType;
  authorityTier?: SourceAuthorityTier;
  freshness?: DataFreshnessStatus;
  endpointOrSource: string;
  timestamp?: string;
  latencyMs?: number;
  confidenceScore?: number;
  isSimulated?: boolean;
  isLabeledMock?: boolean;
  verificationHash?: string;
}

export function createDataProvenanceRecord(params: CreateDataProvenanceParams): DataProvenanceRecord {
  const provenanceId = params.provenanceId || `prov-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const timestamp = params.timestamp || new Date().toISOString();

  // If authorityTier not explicitly provided, classify automatically
  const authorityTier =
    params.authorityTier ||
    classifySourceAuthority({
      sourceId: params.endpointOrSource,
      urlOrPath: params.endpointOrSource,
      declaredOrigin: params.originType,
      isMock: params.isSimulated || params.originType === 'SYNTHETIC_MOCK'
    }).authorityTier;

  const freshness =
    params.freshness ||
    (params.originType === 'SYNTHETIC_MOCK' ? 'SYNTHETIC' : 'LIVE');

  const confidenceScore =
    params.confidenceScore !== undefined
      ? params.confidenceScore
      : authorityTier === 'AUTHORITATIVE_SYSTEM'
      ? 0.98
      : authorityTier === 'VERIFIED_EXTERNAL'
      ? 0.92
      : authorityTier === 'SYNTHETIC_MOCK'
      ? 0.7
      : authorityTier === 'HALLUCINATED_OR_FABRICATED'
      ? 0.0
      : 0.5;

  return DataProvenanceRecordSchema.parse({
    provenanceId,
    fieldOrComponentId: params.fieldOrComponentId,
    originType: params.originType,
    authorityTier,
    freshness,
    endpointOrSource: params.endpointOrSource,
    timestamp,
    latencyMs: params.latencyMs,
    confidenceScore,
    isSimulated: params.isSimulated ?? (params.originType === 'SYNTHETIC_MOCK' || params.originType === 'FABRICATED_UNGROUNDED'),
    isLabeledMock: params.isLabeledMock ?? false,
    verificationHash: params.verificationHash
  });
}

/**
 * Audits a collection of data provenance records against a Truthful UI Policy.
 */
export function auditDataProvenance(
  records: DataProvenanceRecord[],
  policyOverrides?: Partial<TruthfulUIPolicy>
): DataProvenanceAuditResult {
  const policy: TruthfulUIPolicy = TruthfulUIPolicySchema.parse(policyOverrides || {});
  const violations: Array<{ target: string; reason: string; severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' }> = [];

  let authoritativeCount = 0;
  let syntheticCount = 0;
  let fabricatedCount = 0;

  for (const record of records) {
    if (record.authorityTier === 'AUTHORITATIVE_SYSTEM' || record.authorityTier === 'VERIFIED_EXTERNAL') {
      authoritativeCount++;
    } else if (record.authorityTier === 'SYNTHETIC_MOCK') {
      syntheticCount++;
      // Check if synthetic mock is properly labeled
      if (policy.disallowUnlabeledMocks && !record.isLabeledMock) {
        violations.push({
          target: record.fieldOrComponentId,
          reason: `Synthetic mock data on '${record.fieldOrComponentId}' rendered without prominent mock/simulation indicator.`,
          severity: 'HIGH'
        });
      }
    } else if (
      record.authorityTier === 'HALLUCINATED_OR_FABRICATED' ||
      record.originType === 'FABRICATED_UNGROUNDED'
    ) {
      fabricatedCount++;
      violations.push({
        target: record.fieldOrComponentId,
        reason: `Deceptive or ungrounded telemetry stream detected on '${record.fieldOrComponentId}'. Missing authentic backend binding.`,
        severity: 'CRITICAL'
      });
    }

    // Block ungrounded telemetry check
    if (
      policy.blockUngroundedTelemetry &&
      (record.originType === 'TELEMETRY_STREAM' || record.fieldOrComponentId.toLowerCase().includes('telemetry'))
    ) {
      if (record.authorityTier !== 'AUTHORITATIVE_SYSTEM' && record.authorityTier !== 'VERIFIED_EXTERNAL') {
        if (!record.isLabeledMock) {
          violations.push({
            target: record.fieldOrComponentId,
            reason: `Telemetry metric '${record.fieldOrComponentId}' claims live status but lacks authoritative source verification.`,
            severity: 'CRITICAL'
          });
        }
      }
    }

    // Freshness check for live data
    if (record.freshness === 'EXPIRED' || record.freshness === 'STALE') {
      violations.push({
        target: record.fieldOrComponentId,
        reason: `Data source for '${record.fieldOrComponentId}' is ${record.freshness} and violates live operational integrity.`,
        severity: 'MEDIUM'
      });
    }
  }

  const isCompliant = violations.filter((v) => v.severity === 'CRITICAL').length === 0 &&
    (violations.filter((v) => v.severity === 'HIGH').length === 0 || !policy.requireDeclaredProvenance);

  const summary = isCompliant
    ? `Data Provenance audit PASSED: ${records.length} field(s) verified (${authoritativeCount} authoritative, ${syntheticCount} synthetic).`
    : `Data Provenance audit FAILED: ${violations.length} violation(s) identified (${fabricatedCount} fabricated, ${violations.filter(v => v.severity === 'CRITICAL').length} critical).`;

  return DataProvenanceAuditResultSchema.parse({
    totalFieldsAudited: records.length,
    authoritativeCount,
    syntheticCount,
    fabricatedCount,
    isCompliant,
    violations,
    summary
  });
}
