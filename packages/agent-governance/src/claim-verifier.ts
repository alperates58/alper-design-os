import {
  ClaimVerificationResult,
  ClaimVerificationStatus,
  VerificationEvidence
} from './types.js';
import { validateResponsiveVerification } from './evidence-engine.js';

const UNVERIFIED_CLAIM_RULES: Array<{
  pattern: RegExp;
  category: string;
  requiredEvidenceTypes: Array<VerificationEvidence['type']>;
  minEvidenceCount: number;
}> = [
  {
    pattern: /tamamen\s+test\s+edildi|fully\s+tested|100%\s+tested/i,
    category: 'FULL_TEST_COVERAGE',
    requiredEvidenceTypes: ['TEST_RESULT', 'BUILD_OUTPUT'],
    minEvidenceCount: 2
  },
  {
    pattern: /responsive\s+(?:çalışıyor|hazır|uyumlu)|fully\s+responsive/i,
    category: 'RESPONSIVE_CLAIM',
    requiredEvidenceTypes: ['SCREENSHOT', 'VISUAL_DIFF', 'ACCESSIBILITY_REPORT'],
    minEvidenceCount: 2
  },
  {
    pattern: /security\s+sorunu\s+yok|no\s+security\s+issues|güvenli/i,
    category: 'SECURITY_CLAIM',
    requiredEvidenceTypes: ['SECURITY_REPORT', 'STATIC_ANALYSIS'],
    minEvidenceCount: 1
  },
  {
    pattern: /performance\s+iyi|performans\s+mükemmel|high\s+performance/i,
    category: 'PERFORMANCE_CLAIM',
    requiredEvidenceTypes: ['PERFORMANCE_TRACE'],
    minEvidenceCount: 1
  },
  {
    pattern: /production\s+ready|canlıya\s+hazır/i,
    category: 'PRODUCTION_READY_CLAIM',
    requiredEvidenceTypes: ['BUILD_OUTPUT', 'TEST_RESULT', 'SECURITY_REPORT'],
    minEvidenceCount: 3
  },
  {
    pattern: /tüm\s+ekranlar\s+doğrulandı|all\s+screens\s+verified/i,
    category: 'ALL_SCREENS_CLAIM',
    requiredEvidenceTypes: ['SCREENSHOT', 'VISUAL_DIFF'],
    minEvidenceCount: 2
  },
  {
    pattern: /cross-browser\s+uyumlu|cross\s+browser\s+tested/i,
    category: 'CROSS_BROWSER_CLAIM',
    requiredEvidenceTypes: ['TEST_RESULT'],
    minEvidenceCount: 2
  }
];

export function evaluateCompletionClaim(
  claim: string,
  evidences: VerificationEvidence[] = []
): ClaimVerificationResult {
  const normClaim = claim.trim();

  // Find matching rule
  const matchedRule = UNVERIFIED_CLAIM_RULES.find(r => r.pattern.test(normClaim));

  if (!matchedRule) {
    // General claim check
    if (evidences.length > 0) {
      return {
        claim: normClaim,
        status: 'VERIFIED',
        evidenceIds: evidences.map(e => e.id),
        missingEvidence: [],
        notes: 'Claim is backed by verified execution evidence.'
      };
    }
    return {
      claim: normClaim,
      status: 'NOT_VERIFIED',
      evidenceIds: [],
      missingEvidence: ['TEST_RESULT or BUILD_OUTPUT'],
      notes: 'No concrete evidence attached to support this assertion.'
    };
  }

  // Check required evidence types
  const matchingEvidences = evidences.filter(e =>
    matchedRule.requiredEvidenceTypes.includes(e.type) && e.verified
  );

  const missingTypes = matchedRule.requiredEvidenceTypes.filter(
    t => !evidences.some(e => e.type === t && e.verified)
  );

  // Special handling for responsive claim: viewport matrix check
  if (matchedRule.category === 'RESPONSIVE_CLAIM') {
    // Check if viewports were tested
    const hasFullViewports = evidences.some(e =>
      e.rawData && Array.isArray(e.rawData.viewports) && e.rawData.viewports.length >= 4
    );

    if (!hasFullViewports && matchingEvidences.length < matchedRule.minEvidenceCount) {
      return {
        claim: normClaim,
        status: 'NOT_VERIFIED',
        evidenceIds: matchingEvidences.map(e => e.id),
        missingEvidence: ['Multi-viewport verification (390x844, 768x1024, 1440x900, 1920x1080)'],
        notes: 'Responsive claims require concrete multi-viewport evidence before assertion.'
      };
    }
  }

  let status: ClaimVerificationStatus;
  if (matchingEvidences.length >= matchedRule.minEvidenceCount && missingTypes.length === 0) {
    status = 'VERIFIED';
  } else if (matchingEvidences.length > 0) {
    status = 'PARTIALLY_VERIFIED';
  } else {
    status = 'NOT_VERIFIED';
  }

  return {
    claim: normClaim,
    status,
    evidenceIds: matchingEvidences.map(e => e.id),
    missingEvidence: missingTypes.map(t => `${t} evidence artifact`),
    notes:
      status === 'VERIFIED'
        ? `Claim verified against ${matchingEvidences.length} verified evidence artifact(s).`
        : `Claim unverified or partially verified. Missing: ${missingTypes.join(', ')}.`
  };
}

export function auditClaimsInText(
  text: string,
  evidences: VerificationEvidence[] = []
): {
  passed: boolean;
  evaluatedClaims: ClaimVerificationResult[];
  unverifiedPhrases: string[];
} {
  const evaluatedClaims: ClaimVerificationResult[] = [];
  const unverifiedPhrases: string[] = [];

  for (const rule of UNVERIFIED_CLAIM_RULES) {
    rule.pattern.lastIndex = 0;
    const match = rule.pattern.exec(text);
    if (match) {
      const phrase = match[0];
      const result = evaluateCompletionClaim(phrase, evidences);
      evaluatedClaims.push(result);

      if (result.status === 'NOT_VERIFIED' || result.status === 'FAILED') {
        unverifiedPhrases.push(phrase);
      }
    }
  }

  const passed = unverifiedPhrases.length === 0;
  return {
    passed,
    evaluatedClaims,
    unverifiedPhrases
  };
}
