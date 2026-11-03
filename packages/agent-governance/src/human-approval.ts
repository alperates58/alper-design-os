import crypto from 'node:crypto';
import { z } from 'zod';

export const ApprovalProvenanceSchema = z.enum([
  'AGENT_ASSERTION',
  'USER_AUTHORED_PROJECT_DATA',
  'VERIFIED_HOST_AUTHORIZATION',
  'AUDIT_EVIDENCE'
]);
export type ApprovalProvenance = z.infer<typeof ApprovalProvenanceSchema>;

export const AuthorizationVerdictStatusSchema = z.enum([
  'VERIFIED_HOST_AUTHORIZATION',
  'HUMAN_APPROVAL_REQUIRED',
  'REJECTED_SYNTHETIC_IDENTITY',
  'REJECTED_EXPIRED_APPROVAL',
  'REJECTED_REPLAYED_APPROVAL',
  'REJECTED_SCOPE_OR_HASH_MISMATCH',
  'REJECTED_INVALID_SIGNATURE'
]);
export type AuthorizationVerdictStatus = z.infer<typeof AuthorizationVerdictStatusSchema>;

export const TrustedHumanApprovalTokenSchema = z.object({
  operatorIdentity: z.string().min(1),
  action: z.string().min(1),
  targetProject: z.string().min(1),
  requestedScope: z.union([z.string().min(1), z.array(z.string().min(1))]),
  targetRevisionOrHash: z.string().min(1),
  issuedAt: z.string(),
  expiresAt: z.string(),
  nonce: z.string().min(8),
  signature: z.string().min(32)
});
export type TrustedHumanApprovalToken = z.infer<typeof TrustedHumanApprovalTokenSchema>;

export interface HostApprovalVerificationResult {
  verified: boolean;
  status: AuthorizationVerdictStatus;
  provenance: ApprovalProvenance;
  operatorIdentity?: string;
  boundAction?: string;
  boundProject?: string;
  boundScope?: string;
  boundHash?: string;
  reason: string;
}

const HOST_SESSION_SECRET =
  process.env.ALPER_HOST_APPROVAL_SECRET ||
  crypto.randomBytes(32).toString('hex');

const consumedApprovalNonces = new Set<string>();

const SYNTHETIC_OR_AGENT_PATTERNS = [
  /^$/,
  /\bsynthetic\b/i,
  /\bbot\b/i,
  /\bagent\b/i,
  /\bautomated\b/i,
  /\bci[-_]?runner\b/i,
  /\bsystem\b/i,
  /\bmcp\b/i,
  /\bllm\b/i,
  /\bai\b/i,
  /\binferred\b/i,
  /\bclaude\b/i,
  /\bgpt\b/i,
  /\bcodex\b/i,
  /\bgemini\b/i,
  /\bantigravity\b/i,
  /\bassistant\b/i,
  /\bhuman-evaluator\b/i,
  /\bdefault\b/i,
  /\banonymous\b/i,
  /\bunknown\b/i,
  /\bself[-_]?approv/i
];

export function isSyntheticOrAgentIdentity(identity: string | undefined | null): boolean {
  if (!identity || typeof identity !== 'string') return true;
  const trimmed = identity.trim();
  if (trimmed.length < 2) return true;
  return SYNTHETIC_OR_AGENT_PATTERNS.some((rx) => rx.test(trimmed));
}

export function computeApprovalTargetHash(payload: unknown): string {
  const canonical = JSON.stringify(payload, Object.keys((payload as any) || {}).sort());
  return crypto.createHash('sha256').update(canonical, 'utf-8').digest('hex');
}

function normalizeScopeValue(scope: string | string[] | undefined): string {
  if (Array.isArray(scope)) return scope.join(',');
  return scope || '';
}

function signTokenPayload(fields: Omit<TrustedHumanApprovalToken, 'signature'>): string {
  const message = [
    fields.operatorIdentity,
    fields.action,
    fields.targetProject,
    normalizeScopeValue(fields.requestedScope),
    fields.targetRevisionOrHash,
    fields.issuedAt,
    fields.expiresAt,
    fields.nonce
  ].join('|');
  return crypto.createHmac('sha256', HOST_SESSION_SECRET).update(message, 'utf-8').digest('hex');
}

/**
 * Host-side API to issue a cryptographically bound human approval token.
 * Model-controlled MCP tool arguments cannot call this without the host secret.
 */
export function issueHostHumanApproval(params: {
  operatorIdentity: string;
  action: string;
  targetProject: string;
  requestedScope: string | string[];
  targetRevisionOrHash: string;
  ttlMs?: number;
  issuedAtMs?: number;
  nonce?: string;
}): TrustedHumanApprovalToken {
  if (isSyntheticOrAgentIdentity(params.operatorIdentity)) {
    throw new Error(
      `HUMAN_APPROVAL_REQUIRED: Cannot issue host human approval for synthetic or agent identity '${params.operatorIdentity}'.`
    );
  }

  const now = params.issuedAtMs ?? Date.now();
  const ttl = params.ttlMs ?? 15 * 60 * 1000; // Default 15 minutes
  const issuedAt = new Date(now).toISOString();
  const expiresAt = new Date(now + ttl).toISOString();
  const nonce = params.nonce || crypto.randomBytes(16).toString('hex');

  const unsigned = {
    operatorIdentity: params.operatorIdentity.trim(),
    action: params.action,
    targetProject: params.targetProject,
    requestedScope: params.requestedScope,
    targetRevisionOrHash: params.targetRevisionOrHash,
    issuedAt,
    expiresAt,
    nonce
  };

  const signature = signTokenPayload(unsigned);
  return {
    ...unsigned,
    signature
  };
}

export interface VerifyHostApprovalExpected {
  action?: string;
  expectedAction?: string;
  targetProject?: string;
  expectedTargetProject?: string;
  expectedProject?: string;
  requestedScope?: string | string[];
  expectedScope?: string | string[];
  requiredScope?: string | string[];
  targetRevisionOrHash?: string;
  expectedTargetHash?: string;
  claimedIdentity?: string;
  consumeNonce?: boolean;
}

export interface VerifyHostApprovalSingleArg extends VerifyHostApprovalExpected {
  token?: unknown;
}

/**
 * Verifies a host approval token against expected action, project, scope, target hash, expiration, and replay policy.
 * Supports both 2-argument `(token, expected)` and 1-argument `({ token, expectedAction, ... })` forms.
 */
export function verifyHostHumanApproval(
  tokenOrParams: unknown | VerifyHostApprovalSingleArg,
  expectedArg?: VerifyHostApprovalExpected
): HostApprovalVerificationResult {
  let token: unknown = tokenOrParams;
  let expected: VerifyHostApprovalExpected = expectedArg || {};

  if (
    expectedArg === undefined &&
    tokenOrParams &&
    typeof tokenOrParams === 'object' &&
    ('expectedAction' in tokenOrParams || 'action' in tokenOrParams) &&
    !('signature' in tokenOrParams)
  ) {
    const single = tokenOrParams as VerifyHostApprovalSingleArg;
    token = single.token;
    expected = single;
  }

  const reqAction = expected.action || expected.expectedAction || '';
  const reqProject = expected.targetProject || expected.expectedTargetProject || expected.expectedProject;
  const reqScope = expected.requestedScope || expected.expectedScope || expected.requiredScope;
  const reqHash = expected.targetRevisionOrHash || expected.expectedTargetHash;

  if (!token || typeof token !== 'object') {
    return {
      verified: false,
      status: 'HUMAN_APPROVAL_REQUIRED',
      provenance: 'AGENT_ASSERTION',
      reason: 'HUMAN_APPROVAL_REQUIRED: No verified host authorization token supplied. Model-provided fields (approvedBy, confirmedByUser, reviewedBy) are treated as unverified agent assertions.'
    };
  }

  const parsed = TrustedHumanApprovalTokenSchema.safeParse(token);
  if (!parsed.success) {
    return {
      verified: false,
      status: 'HUMAN_APPROVAL_REQUIRED',
      provenance: 'AGENT_ASSERTION',
      reason: `HUMAN_APPROVAL_REQUIRED: Malformed host approval token (${parsed.error.issues[0]?.message || 'invalid schema'}).`
    };
  }

  const t = parsed.data;

  if (isSyntheticOrAgentIdentity(t.operatorIdentity)) {
    return {
      verified: false,
      status: 'REJECTED_SYNTHETIC_IDENTITY',
      provenance: 'AGENT_ASSERTION',
      reason: `HUMAN_APPROVAL_REQUIRED: Operator identity '${t.operatorIdentity}' is a synthetic/bot/agent identifier.`
    };
  }

  if (expected.claimedIdentity && isSyntheticOrAgentIdentity(expected.claimedIdentity)) {
    return {
      verified: false,
      status: 'REJECTED_SYNTHETIC_IDENTITY',
      provenance: 'AGENT_ASSERTION',
      reason: `HUMAN_APPROVAL_REQUIRED: Claimed identity '${expected.claimedIdentity}' is a synthetic/bot/agent identifier.`
    };
  }

  // Constant-time HMAC verification
  const expectedSig = signTokenPayload(t);
  const sigBufA = Buffer.from(t.signature, 'utf-8');
  const sigBufB = Buffer.from(expectedSig, 'utf-8');
  if (sigBufA.length !== sigBufB.length || !crypto.timingSafeEqual(sigBufA, sigBufB)) {
    return {
      verified: false,
      status: 'REJECTED_INVALID_SIGNATURE',
      provenance: 'AGENT_ASSERTION',
      reason: 'HUMAN_APPROVAL_REQUIRED: Cryptographic signature verification failed on host approval token.'
    };
  }

  // Action, Project, Scope, and Revision/Hash binding checks
  if (reqAction && t.action !== reqAction) {
    return {
      verified: false,
      status: 'REJECTED_SCOPE_OR_HASH_MISMATCH',
      provenance: 'AGENT_ASSERTION',
      reason: `HUMAN_APPROVAL_REQUIRED: Approval token action '${t.action}' does not match required action '${reqAction}'.`
    };
  }

  if (reqProject && t.targetProject !== reqProject) {
    return {
      verified: false,
      status: 'REJECTED_SCOPE_OR_HASH_MISMATCH',
      provenance: 'AGENT_ASSERTION',
      reason: `HUMAN_APPROVAL_REQUIRED: Approval token project '${t.targetProject}' does not match target project '${reqProject}'.`
    };
  }

  if (reqScope && normalizeScopeValue(t.requestedScope) !== normalizeScopeValue(reqScope)) {
    return {
      verified: false,
      status: 'REJECTED_SCOPE_OR_HASH_MISMATCH',
      provenance: 'AGENT_ASSERTION',
      reason: `HUMAN_APPROVAL_REQUIRED: Approval token scope '${normalizeScopeValue(t.requestedScope)}' does not match requested scope '${normalizeScopeValue(reqScope)}'.`
    };
  }

  if (reqHash && t.targetRevisionOrHash !== reqHash) {
    return {
      verified: false,
      status: 'REJECTED_SCOPE_OR_HASH_MISMATCH',
      provenance: 'AGENT_ASSERTION',
      reason: `HUMAN_APPROVAL_REQUIRED: Approval token content/revision hash '${t.targetRevisionOrHash}' does not match current target hash '${reqHash}'.`
    };
  }

  // Expiration check
  const now = Date.now();
  const expiresMs = Date.parse(t.expiresAt);
  const issuedMs = Date.parse(t.issuedAt);
  if (Number.isNaN(expiresMs) || Number.isNaN(issuedMs) || now > expiresMs || issuedMs > now + 60_000) {
    return {
      verified: false,
      status: 'REJECTED_EXPIRED_APPROVAL',
      provenance: 'AGENT_ASSERTION',
      reason: `HUMAN_APPROVAL_REQUIRED: Approval token expired at '${t.expiresAt}' or has invalid timestamps.`
    };
  }

  // Replay protection
  if (consumedApprovalNonces.has(t.nonce)) {
    return {
      verified: false,
      status: 'REJECTED_REPLAYED_APPROVAL',
      provenance: 'AGENT_ASSERTION',
      reason: `HUMAN_APPROVAL_REQUIRED: Approval token nonce '${t.nonce}' has already been consumed (replay rejected).`
    };
  }

  if (expected.consumeNonce !== false) {
    consumedApprovalNonces.add(t.nonce);
  }

  return {
    verified: true,
    status: 'VERIFIED_HOST_AUTHORIZATION',
    provenance: 'VERIFIED_HOST_AUTHORIZATION',
    operatorIdentity: t.operatorIdentity,
    boundAction: t.action,
    boundProject: t.targetProject,
    boundScope: normalizeScopeValue(t.requestedScope),
    boundHash: t.targetRevisionOrHash,
    reason: `Verified host human authorization by '${t.operatorIdentity}' for action '${t.action}' on scope '${normalizeScopeValue(t.requestedScope)}'.`
  };
}

export function resetConsumedApprovalNonces(): void {
  consumedApprovalNonces.clear();
}
