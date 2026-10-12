import {
  PipelineStage,
  PipelineExecutionPlan,
  PipelineExecutionPlanSchema,
  ChangeRiskLevel
} from './types.js';

export interface PipelinePlanningContext {
  objective: string;
  projectProfile?: { stack?: string; isLegacy?: boolean; hasTests?: boolean };
  uxProfile?: { density?: string; domainClassification?: string };
  qualityProfile?: { securityLevel?: string; isMissionCritical?: boolean };
  riskLevel?: ChangeRiskLevel;
}

export function planPipeline(context: PipelinePlanningContext): PipelineExecutionPlan {
  const risk = context.riskLevel || 'MEDIUM';
  const pipelineId = `pipe-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const activeStages: PipelineStage[] = [
    'UNDERSTAND',
    'RESEARCH',
    'PROFILE',
    'PLAN',
    'RISK_ASSESS'
  ];

  const skippedStages: Array<{ stage: PipelineStage; reason: string }> = [];

  const requiresApproval = risk === 'HIGH' || risk === 'CRITICAL';
  if (requiresApproval) {
    activeStages.push('APPROVE_IF_REQUIRED');
  } else {
    skippedStages.push({
      stage: 'APPROVE_IF_REQUIRED',
      reason: 'Low/Medium risk change does not require out-of-band user approval gate'
    });
  }

  const requiresCheckpoint = risk === 'HIGH' || risk === 'CRITICAL';
  if (requiresCheckpoint) {
    activeStages.push('CHECKPOINT');
  } else {
    skippedStages.push({
      stage: 'CHECKPOINT',
      reason: 'Low blast radius; standard git working tree tracking is sufficient'
    });
  }

  activeStages.push('APPLY', 'BUILD', 'STATIC_VERIFY');

  // Content Truth verification (Phase 1E.7)
  const involvesDataOrUI =
    context.uxProfile !== undefined ||
    context.objective.toLowerCase().includes('ui') ||
    context.objective.toLowerCase().includes('data') ||
    context.objective.toLowerCase().includes('telemetry') ||
    context.objective.toLowerCase().includes('screen');

  if (involvesDataOrUI) {
    activeStages.push('CONTENT_TRUTH_VERIFY');
  } else {
    skippedStages.push({
      stage: 'CONTENT_TRUTH_VERIFY',
      reason: 'No UI data presentation or telemetry stream present in current task scope'
    });
  }

  // Runtime and visual verification
  const isUI = context.uxProfile !== undefined || context.objective.toLowerCase().includes('ui') || context.objective.toLowerCase().includes('screen');
  if (isUI) {
    activeStages.push('RUNTIME_VERIFY', 'VISUAL_VERIFY');

    // Human Visual Approval Gate (Mandatory for High/Critical or mission-critical UI)
    const requiresVisualApproval =
      risk === 'HIGH' ||
      risk === 'CRITICAL' ||
      context.qualityProfile?.isMissionCritical;

    if (requiresVisualApproval) {
      activeStages.push('HUMAN_VISUAL_APPROVAL');
    } else {
      skippedStages.push({
        stage: 'HUMAN_VISUAL_APPROVAL',
        reason: 'Low/Medium risk UI task does not require formal out-of-band visual sign-off gate'
      });
    }
  } else {
    skippedStages.push(
      { stage: 'RUNTIME_VERIFY', reason: 'Non-UI task; backend or pure logic modification' },
      { stage: 'VISUAL_VERIFY', reason: 'No visual or layout changes in current task objective' },
      { stage: 'HUMAN_VISUAL_APPROVAL', reason: 'Non-UI task; visual approval not applicable' }
    );
  }

  // Security verify
  const isSecuritySensitive =
    risk === 'HIGH' ||
    risk === 'CRITICAL' ||
    context.qualityProfile?.securityLevel === 'CRITICAL' ||
    context.objective.toLowerCase().includes('auth') ||
    context.objective.toLowerCase().includes('security');

  if (isSecuritySensitive) {
    activeStages.push('SECURITY_VERIFY');
  } else {
    skippedStages.push({
      stage: 'SECURITY_VERIFY',
      reason: 'Standard security linting in STATIC_VERIFY is sufficient for low-risk changes'
    });
  }

  // Performance verify
  if (context.qualityProfile?.isMissionCritical || context.uxProfile?.density === 'EXTREME') {
    activeStages.push('PERFORMANCE_VERIFY');
  } else {
    skippedStages.push({
      stage: 'PERFORMANCE_VERIFY',
      reason: 'Application does not have high-frequency or extreme latency SLA requirements'
    });
  }

  // Final review, evidence and closure are mandatory
  activeStages.push('INDEPENDENT_REVIEW', 'EVIDENCE', 'ACCEPT_REPAIR_ROLLBACK');

  return PipelineExecutionPlanSchema.parse({
    pipelineId,
    objective: context.objective,
    activeStages,
    skippedStages,
    estimatedRisk: risk,
    requiresApproval,
    requiresCheckpoint
  });
}
