import {
  VerificationEvidence,
  VerificationEvidenceSchema,
  EvidenceType
} from './types.js';

export const MANDATORY_RESPONSIVE_VIEWPORTS = [
  { width: 390, height: 844, name: 'Mobile (iPhone 14/15)' },
  { width: 768, height: 1024, name: 'Tablet (iPad Portrait)' },
  { width: 1440, height: 900, name: 'Desktop Standard' },
  { width: 1920, height: 1080, name: 'Full HD / Ultra-wide' }
];

export function createEvidence(
  type: EvidenceType,
  source: string,
  summary: string,
  options?: { uriOrPath?: string; rawData?: any; verified?: boolean }
): VerificationEvidence {
  const evidence: VerificationEvidence = {
    id: `ev-${type.toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    source,
    timestamp: new Date().toISOString(),
    uriOrPath: options?.uriOrPath,
    summary,
    verified: options?.verified ?? true,
    rawData: options?.rawData
  };

  return VerificationEvidenceSchema.parse(evidence);
}

export function validateResponsiveVerification(
  viewportsTested: Array<{ width: number; height: number }>,
  evidences: VerificationEvidence[]
): {
  verified: boolean;
  testedCount: number;
  totalRequired: number;
  missingViewports: string[];
  status: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'NOT_VERIFIED';
} {
  const missing: string[] = [];

  for (const req of MANDATORY_RESPONSIVE_VIEWPORTS) {
    const isTested = viewportsTested.some(
      v => Math.abs(v.width - req.width) <= 10 && Math.abs(v.height - req.height) <= 10
    );
    if (!isTested) {
      missing.push(`${req.width}x${req.height} (${req.name})`);
    }
  }

  const hasScreenshotsOrAudits = evidences.some(
    e => e.type === 'SCREENSHOT' || e.type === 'VISUAL_DIFF' || e.type === 'ACCESSIBILITY_REPORT'
  );

  if (viewportsTested.length === 0 || !hasScreenshotsOrAudits) {
    return {
      verified: false,
      testedCount: 0,
      totalRequired: MANDATORY_RESPONSIVE_VIEWPORTS.length,
      missingViewports: MANDATORY_RESPONSIVE_VIEWPORTS.map(v => `${v.width}x${v.height} (${v.name})`),
      status: 'NOT_VERIFIED'
    };
  }

  if (missing.length === 0) {
    return {
      verified: true,
      testedCount: 4,
      totalRequired: MANDATORY_RESPONSIVE_VIEWPORTS.length,
      missingViewports: [],
      status: 'VERIFIED'
    };
  }

  return {
    verified: false,
    testedCount: MANDATORY_RESPONSIVE_VIEWPORTS.length - missing.length,
    totalRequired: MANDATORY_RESPONSIVE_VIEWPORTS.length,
    missingViewports: missing,
    status: 'PARTIALLY_VERIFIED'
  };
}

export function normalizeEvidenceBatch(rawItems: any[]): VerificationEvidence[] {
  const normalized: VerificationEvidence[] = [];

  for (const raw of rawItems) {
    try {
      const parsed = VerificationEvidenceSchema.parse(raw);
      normalized.push(parsed);
    } catch {
      // Map arbitrary structured test result to normalized schema
      if (raw && typeof raw === 'object') {
        const type: EvidenceType = raw.type || 'TEST_RESULT';
        normalized.push(
          createEvidence(
            type,
            raw.source || 'automated-runner',
            raw.summary || raw.message || 'Evidence captured',
            {
              uriOrPath: raw.uriOrPath || raw.path,
              rawData: raw.rawData || raw.details,
              verified: raw.verified !== false
            }
          )
        );
      }
    }
  }

  return normalized;
}
