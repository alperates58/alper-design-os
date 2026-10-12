import {
  HumanVisualApprovalRecord,
  HumanVisualApprovalRecordSchema,
  VisualApprovalStatus,
  ApprovalGateCheckResult,
  ApprovalGateCheckResultSchema
} from './types.js';

export function createVisualApprovalRecord(initial?: Partial<HumanVisualApprovalRecord>): HumanVisualApprovalRecord {
  const recordId = initial?.recordId || `vis-appr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return HumanVisualApprovalRecordSchema.parse({
    recordId,
    status: initial?.status || 'NOT_REVIEWED',
    reviewedBy: initial?.reviewedBy,
    timestamp: initial?.timestamp,
    viewportsReviewed: initial?.viewportsReviewed || [],
    notes: initial?.notes,
    criteriaChecked: {
      layoutStability: initial?.criteriaChecked?.layoutStability ?? false,
      typographyHierarchy: initial?.criteriaChecked?.typographyHierarchy ?? false,
      colorContrast: initial?.criteriaChecked?.colorContrast ?? false,
      responsiveFidelity: initial?.criteriaChecked?.responsiveFidelity ?? false,
      truthfulnessVisualAffordance: initial?.criteriaChecked?.truthfulnessVisualAffordance ?? false
    },
    canRelease: initial?.status === 'APPROVED'
  });
}

export interface RecordVisualReviewParams {
  status: VisualApprovalStatus;
  reviewedBy: string;
  notes?: string;
  viewportsReviewed?: string[];
  criteriaChecked?: Partial<HumanVisualApprovalRecord['criteriaChecked']>;
}

/**
 * Records a human reviewer's evaluation.
 * STRICT SECURITY GUARD: Automated scripts or AI agent tokens are strictly blocked from granting 'APPROVED'.
 */
export function recordVisualReview(
  current: HumanVisualApprovalRecord,
  params: RecordVisualReviewParams
): HumanVisualApprovalRecord {
  const reviewerLower = (params.reviewedBy || '').trim().toLowerCase();

  // Guard against synthetic auto-approvals
  const isAutomatedBot =
    reviewerLower === '' ||
    reviewerLower.includes('bot') ||
    reviewerLower.includes('agent') ||
    reviewerLower.includes('automated') ||
    reviewerLower.includes('ci-runner') ||
    reviewerLower.includes('system');

  if (params.status === 'APPROVED' && isAutomatedBot) {
    throw new Error(
      `Security Violation: Automated bot '${params.reviewedBy}' is prohibited from granting human visual approval. Authentic human reviewer credentials required.`
    );
  }

  const updatedCriteria = {
    layoutStability: params.criteriaChecked?.layoutStability ?? current.criteriaChecked.layoutStability,
    typographyHierarchy: params.criteriaChecked?.typographyHierarchy ?? current.criteriaChecked.typographyHierarchy,
    colorContrast: params.criteriaChecked?.colorContrast ?? current.criteriaChecked.colorContrast,
    responsiveFidelity: params.criteriaChecked?.responsiveFidelity ?? current.criteriaChecked.responsiveFidelity,
    truthfulnessVisualAffordance: params.criteriaChecked?.truthfulnessVisualAffordance ?? current.criteriaChecked.truthfulnessVisualAffordance
  };

  const allCriteriaSatisfied = Object.values(updatedCriteria).every(Boolean);
  const canRelease = params.status === 'APPROVED' && allCriteriaSatisfied;

  return HumanVisualApprovalRecordSchema.parse({
    recordId: current.recordId,
    status: params.status,
    reviewedBy: params.reviewedBy,
    timestamp: new Date().toISOString(),
    viewportsReviewed: params.viewportsReviewed || current.viewportsReviewed,
    notes: params.notes || current.notes,
    criteriaChecked: updatedCriteria,
    canRelease
  });
}

/**
 * Evaluates the Human Visual Approval Gate for release pipelines.
 */
export function evaluateVisualApprovalGate(
  record: HumanVisualApprovalRecord,
  requireApproval: boolean = true
): ApprovalGateCheckResult {
  if (!requireApproval) {
    return ApprovalGateCheckResultSchema.parse({
      gateStatus: 'PASSED',
      status: record.status,
      message: 'Visual approval gate marked optional for current execution context.',
      requiresHumanAction: false
    });
  }

  if (record.status === 'APPROVED' && record.canRelease) {
    return ApprovalGateCheckResultSchema.parse({
      gateStatus: 'PASSED',
      status: 'APPROVED',
      message: `Visual approval verified by human reviewer '${record.reviewedBy}'. All quality criteria satisfied.`,
      requiresHumanAction: false
    });
  }

  if (record.status === 'REJECTED') {
    return ApprovalGateCheckResultSchema.parse({
      gateStatus: 'BLOCKED',
      status: 'REJECTED',
      message: `Visual release BLOCKED by reviewer: ${record.notes || 'Defects found in visual presentation.'}`,
      requiresHumanAction: true
    });
  }

  if (record.status === 'CHANGES_REQUESTED') {
    return ApprovalGateCheckResultSchema.parse({
      gateStatus: 'BLOCKED',
      status: 'CHANGES_REQUESTED',
      message: `Visual release pending requested modifications: ${record.notes || 'Revisions required.'}`,
      requiresHumanAction: true
    });
  }

  // Default: NOT_REVIEWED or IN_REVIEW
  return ApprovalGateCheckResultSchema.parse({
    gateStatus: 'PENDING',
    status: record.status,
    message: `Human Visual Approval Gate is in state '${record.status}'. Authentic human review required before production release.`,
    requiresHumanAction: true
  });
}
