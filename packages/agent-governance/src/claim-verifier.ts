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
  },
  {
    pattern: /zero\s+defects?|bug[-\s]?free|hatasız|sıfır\s+hata|all\s+tests?\s+pass(?:ed)?|tüm\s+testler\s+geçti/i,
    category: 'ZERO_DEFECTS_CLAIM',
    requiredEvidenceTypes: ['TEST_RESULT', 'BUILD_OUTPUT'],
    minEvidenceCount: 2
  },
  {
    pattern: /wcag|accessible|accessibility\s+verified|erişilebilir/i,
    category: 'ACCESSIBILITY_CLAIM',
    requiredEvidenceTypes: ['ACCESSIBILITY_REPORT'],
    minEvidenceCount: 1
  }
];

export interface ClaimEvaluationOptions {
  expectedProject?: string;
  expectedRevision?: string;
  maxAgeMs?: number;
}

function isEvidenceFailedOrSynthetic(e: VerificationEvidence): boolean {
  if (!e || e.verified !== true) return true;
  const raw = e.rawData as Record<string, any> | undefined;
  if (raw) {
    if (typeof raw.exitCode === 'number' && raw.exitCode !== 0) return true;
    if (raw.passed === false || raw.status === 'FAILED' || raw.status === 'UNVERIFIED') return true;
    if (raw.synthetic === true || raw.mock === true) return true;
  }
  const summary = String(e.summary || '');
  if (
    /\b(?:[1-9]\d*\s+(?:failed|errors?|vulnerabilities|violations)|build\s+failed|test\s+failed|exit\s+code\s+[1-9]|unverified|synthetic|mock\s+pass)\b/i.test(
      summary
    )
  ) {
    return true;
  }
  return false;
}

function isEvidenceStaleOrMismatched(
  e: VerificationEvidence,
  options?: ClaimEvaluationOptions
): boolean {
  const raw = e.rawData as Record<string, any> | undefined;
  if (options?.expectedProject && raw?.projectId && raw.projectId !== options.expectedProject) {
    return true;
  }
  if (options?.expectedRevision && raw?.revision && raw.revision !== options.expectedRevision) {
    return true;
  }
  if (options?.maxAgeMs && e.timestamp) {
    const ts = Date.parse(e.timestamp);
    if (!Number.isNaN(ts) && Date.now() - ts > options.maxAgeMs) {
      return true;
    }
  }
  return false;
}

export function evaluateCompletionClaim(
  claim: string,
  evidences: VerificationEvidence[] = [],
  options?: ClaimEvaluationOptions
): ClaimVerificationResult {
  const normClaim = claim.trim();

  if (!normClaim) {
    return {
      claim: normClaim,
      status: 'NOT_VERIFIED',
      evidenceIds: [],
      missingEvidence: ['Non-empty claim statement'],
      notes: 'Empty claim cannot be verified.'
    };
  }

  // Filter for genuinely verified, non-failed, non-synthetic, scope-matching evidence
  const validEvidences = evidences.filter(
    (e) => !isEvidenceFailedOrSynthetic(e) && !isEvidenceStaleOrMismatched(e, options)
  );
  const failedEvidences = evidences.filter(
    (e) =>
      e.verified === false ||
      isEvidenceFailedOrSynthetic(e) ||
      isEvidenceStaleOrMismatched(e, options)
  );

  // Find matching rule
  const matchedRule = UNVERIFIED_CLAIM_RULES.find((r) => r.pattern.test(normClaim));

  if (!matchedRule) {
    // Unrecognized / general claim: NEVER auto-verify from unverified, failed, or unrelated single evidence.
    if (failedEvidences.length > 0 && validEvidences.length === 0) {
      return {
        claim: normClaim,
        status: 'NOT_VERIFIED',
        evidenceIds: [],
        missingEvidence: ['Verified non-failing TEST_RESULT and BUILD_OUTPUT'],
        notes: 'Supplied evidence is unverified, failed, stale, or mismatched.'
      };
    }

    const hasVerifiedTest = validEvidences.some((e) => e.type === 'TEST_RESULT');
    const hasVerifiedBuild = validEvidences.some((e) => e.type === 'BUILD_OUTPUT');

    if (hasVerifiedTest && hasVerifiedBuild && failedEvidences.length === 0) {
      return {
        claim: normClaim,
        status: 'VERIFIED',
        evidenceIds: validEvidences.map((e) => e.id),
        missingEvidence: [],
        notes: 'Claim is backed by verified TEST_RESULT and BUILD_OUTPUT execution evidence.'
      };
    }

    const missing: string[] = [];
    if (!hasVerifiedTest) missing.push('Verified TEST_RESULT');
    if (!hasVerifiedBuild) missing.push('Verified BUILD_OUTPUT');

    return {
      claim: normClaim,
      status: validEvidences.length > 0 ? 'NOT_VERIFIED' : 'NOT_VERIFIED',
      evidenceIds: validEvidences.map((e) => e.id),
      missingEvidence: missing.length > 0 ? missing : ['TEST_RESULT and BUILD_OUTPUT'],
      notes: 'General completion claims require both verified TEST_RESULT and BUILD_OUTPUT with zero failed evidence.'
    };
  }

  // Check required evidence types against validEvidences only
  const matchingEvidences = validEvidences.filter((e) =>
    matchedRule.requiredEvidenceTypes.includes(e.type)
  );

  const missingTypes = matchedRule.requiredEvidenceTypes.filter(
    (t) => !validEvidences.some((e) => e.type === t)
  );

  // If any required evidence type explicitly failed, return FAILED
  const explicitlyFailedRequired = evidences.some(
    (e) => matchedRule.requiredEvidenceTypes.includes(e.type) && isEvidenceFailedOrSynthetic(e)
  );
  if (explicitlyFailedRequired && matchingEvidences.length === 0) {
    return {
      claim: normClaim,
      status: 'FAILED',
      evidenceIds: [],
      missingEvidence: missingTypes.map((t) => `${t} evidence artifact`),
      notes: 'Required evidence artifact reported failure or was marked unverified.'
    };
  }

  // Special handling for responsive claim: viewport matrix check
  if (matchedRule.category === 'RESPONSIVE_CLAIM') {
    const hasFullViewports = validEvidences.some(
      (e) => e.rawData && Array.isArray(e.rawData.viewports) && e.rawData.viewports.length >= 4
    );

    if (!hasFullViewports && matchingEvidences.length < matchedRule.minEvidenceCount) {
      return {
        claim: normClaim,
        status: 'NOT_VERIFIED',
        evidenceIds: matchingEvidences.map((e) => e.id),
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
    evidenceIds: matchingEvidences.map((e) => e.id),
    missingEvidence: missingTypes.map((t) => `${t} evidence artifact`),
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
