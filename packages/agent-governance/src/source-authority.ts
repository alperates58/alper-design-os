import {
  SourceAuthorityRecord,
  SourceAuthorityRecordSchema,
  SourceAuthorityTier
} from './types.js';

export interface ClassifySourceInput {
  sourceId: string;
  urlOrPath?: string;
  type?: string;
  isProductionEndpoint?: boolean;
  hasAuthHeaders?: boolean;
  isMock?: boolean;
  declaredOrigin?: string;
}

/**
 * Classifies data and telemetry sources into formal Source Authority Tiers.
 * Rejects hallucinated or ungrounded data streams from production pipelines.
 */
export function classifySourceAuthority(input: ClassifySourceInput): SourceAuthorityRecord {
  const idLower = input.sourceId.toLowerCase();
  const urlLower = (input.urlOrPath || '').toLowerCase();
  const typeLower = (input.type || '').toLowerCase();
  const declaredLower = (input.declaredOrigin || '').toLowerCase();

  let authorityTier: SourceAuthorityTier = 'UNVERIFIED_USER_INPUT';
  let trustScore = 50;
  let isAuthoritative = false;
  let allowedForProduction = false;
  let rationale = 'Default provisional classification; verification required.';
  let verificationMethod = 'HEURISTIC_STATIC_INSPECTION';

  // 1. Detect Hallucinated or Fabricated streams
  if (
    idLower.includes('hallucinated') ||
    idLower.includes('fake-telemetry') ||
    idLower.includes('unverified-telemetry') ||
    urlLower.includes('missing-telemetry') ||
    urlLower.includes('fake') ||
    declaredLower.includes('fabricated')
  ) {
    authorityTier = 'HALLUCINATED_OR_FABRICATED';
    trustScore = 0;
    isAuthoritative = false;
    allowedForProduction = false;
    rationale = 'Identified ungrounded or fabricated telemetry source lacking authentic data pipeline.';
    verificationMethod = 'INTEGRITY_VIOLATION_SCAN';
  }
  // 2. Explicit Synthetic Mocks
  else if (
    input.isMock ||
    idLower.includes('mock') ||
    idLower.includes('fixture') ||
    idLower.includes('seeded') ||
    urlLower.includes('/mock') ||
    urlLower.includes('fixture') ||
    declaredLower.includes('synthetic')
  ) {
    authorityTier = 'SYNTHETIC_MOCK';
    trustScore = 70;
    isAuthoritative = false;
    allowedForProduction = false; // Synthetic mocks strictly forbidden in production without demo flag
    rationale = 'Explicitly declared synthetic mock or test fixture. Valid for development/benchmarks only.';
    verificationMethod = 'MOCK_DECLARATION_CHECK';
  }
  // 3. Verified External (Stripe, GitHub, AWS, Google, etc.)
  else if (
    urlLower.includes('stripe.com') ||
    urlLower.includes('github.com') ||
    urlLower.includes('googleapis.com') ||
    urlLower.includes('amazonaws.com') ||
    declaredLower === 'verified_external'
  ) {
    authorityTier = 'VERIFIED_EXTERNAL';
    trustScore = 90;
    isAuthoritative = true;
    allowedForProduction = true;
    rationale = 'Recognized authoritative external platform API with verified TLS certificate.';
    verificationMethod = 'EXTERNAL_TLS_CERT_AND_TOKEN';
  }
  // 4. Authoritative System (Canonical DB, Verified Telemetry Broker, Production API with Auth)
  else if (
    (input.isProductionEndpoint && input.hasAuthHeaders) ||
    urlLower.startsWith('https://api.') ||
    urlLower.includes('broker') ||
    typeLower.includes('database') ||
    declaredLower === 'authoritative_api' ||
    declaredLower === 'telemetry_stream'
  ) {
    authorityTier = 'AUTHORITATIVE_SYSTEM';
    trustScore = 95;
    isAuthoritative = true;
    allowedForProduction = true;
    rationale = 'Cryptographically authenticated production endpoint or canonical database connection.';
    verificationMethod = 'SECURE_TRANSPORT_AND_AUTH_CONTRACT';
  }
  // 5. Derived Analytics
  else if (
    typeLower.includes('analytics') ||
    typeLower.includes('rollup') ||
    declaredLower === 'derived_computation'
  ) {
    authorityTier = 'DERIVED_ANALYTICS';
    trustScore = 80;
    isAuthoritative = false;
    allowedForProduction = true;
    rationale = 'Aggregated or computed analytical metrics derived from authoritative base data.';
    verificationMethod = 'ETL_LINEAGE_TRACING';
  }
  // 6. Provisional Cache
  else if (
    urlLower.includes('cache') ||
    typeLower.includes('redis') ||
    declaredLower === 'cache_snapshot'
  ) {
    authorityTier = 'PROVISIONAL_CACHE';
    trustScore = 75;
    isAuthoritative = false;
    allowedForProduction = true;
    rationale = 'Provisional cache layer snapshot subject to freshness TTL constraints.';
    verificationMethod = 'CACHE_HEADER_AND_TTL_INSPECTION';
  }

  return SourceAuthorityRecordSchema.parse({
    sourceId: input.sourceId,
    authorityTier,
    trustScore,
    isAuthoritative,
    allowedForProduction,
    rationale,
    verificationMethod
  });
}
