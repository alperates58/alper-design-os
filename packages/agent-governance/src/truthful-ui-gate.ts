import {
  ContentTruthVerdict,
  TruthfulUIPolicy,
  TruthfulUIEvaluation,
  DataProvenanceRecord,
  DataProvenanceAuditResult,
  PageIntent,
  PageIntentAuditResult,
  HumanVisualApprovalRecord,
  ApprovalGateCheckResult
} from './types.js';
import { evaluateTruthfulUI, UIComponentSpec } from './truthful-ui-policy.js';
import { auditDataProvenance } from './data-provenance.js';
import { auditPageIntent, AuditedComponentInput } from './page-intent.js';
import { auditInformationRelevance, EvaluateElementInput } from './information-relevance.js';
import { evaluateVisualApprovalGate, createVisualApprovalRecord } from './human-visual-approval.js';

export interface ContentTruthGateInput {
  components?: UIComponentSpec[];
  provenanceRecords?: DataProvenanceRecord[];
  pageIntent?: PageIntent;
  intentComponents?: AuditedComponentInput[];
  relevanceElements?: EvaluateElementInput[];
  visualApproval?: HumanVisualApprovalRecord;
  policy?: Partial<TruthfulUIPolicy>;
  requireVisualApproval?: boolean;
}

export interface ContentTruthGateEvaluation {
  verdict: ContentTruthVerdict;
  passed: boolean;
  truthfulUIEvaluation: TruthfulUIEvaluation;
  provenanceAudit?: DataProvenanceAuditResult;
  pageIntentAudit?: PageIntentAuditResult;
  visualApprovalGate: ApprovalGateCheckResult;
  summary: string;
}

/**
 * High-level Governance Release Gate: CONTENT_TRUTH_PASS.
 * Coordinates policy compliance across UI truthfulness, provenance, page intent, and visual approval.
 */
export function evaluateContentTruthGate(input: ContentTruthGateInput): ContentTruthGateEvaluation {
  // 1. Truthful UI Policy Evaluation
  const truthfulUIEvaluation = evaluateTruthfulUI({
    components: input.components || [],
    policy: input.policy
  });

  // 2. Data Provenance Audit
  let provenanceAudit: DataProvenanceAuditResult | undefined;
  if (input.provenanceRecords && input.provenanceRecords.length > 0) {
    provenanceAudit = auditDataProvenance(input.provenanceRecords, input.policy);
  }

  // 3. Page Intent Audit
  let pageIntentAudit: PageIntentAuditResult | undefined;
  if (input.pageIntent && input.intentComponents) {
    pageIntentAudit = auditPageIntent(input.pageIntent, input.intentComponents);
  }

  // 4. Human Visual Approval Gate
  const visualRecord = input.visualApproval || createVisualApprovalRecord();
  const visualApprovalGate = evaluateVisualApprovalGate(
    visualRecord,
    input.requireVisualApproval ?? false
  );

  // Synthesize overall verdict
  let verdict: ContentTruthVerdict = truthfulUIEvaluation.verdict;

  if (provenanceAudit && !provenanceAudit.isCompliant) {
    verdict = 'CONTENT_TRUTH_FAIL';
  }

  if (pageIntentAudit && !pageIntentAudit.matchesIntent) {
    if (verdict !== 'CONTENT_TRUTH_FAIL') {
      verdict = 'CONTENT_TRUTH_WARN';
    }
  }

  const passed = verdict === 'CONTENT_TRUTH_PASS' && (visualApprovalGate.gateStatus !== 'BLOCKED');

  const summary = passed
    ? `CONTENT_TRUTH_PASS: All content truthfulness, provenance, and semantic criteria verified.`
    : verdict === 'CONTENT_TRUTH_WARN'
    ? `CONTENT_TRUTH_WARN: Non-blocking discrepancies detected; manual review recommended.`
    : `CONTENT_TRUTH_FAIL: Critical truthfulness or ungrounded telemetry violations detected. Release BLOCKED.`;

  return {
    verdict,
    passed,
    truthfulUIEvaluation,
    provenanceAudit,
    pageIntentAudit,
    visualApprovalGate,
    summary
  };
}
