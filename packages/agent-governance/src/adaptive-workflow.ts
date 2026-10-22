/**
 * Adaptive Engineering Workflow Engine V2
 * Establishes task-size-aware execution modes: QUICK, STANDARD, DEEP.
 * Enforces evidence-backed completion claims without unnecessary ceremony for small fixes.
 */

export type AdaptiveExecutionMode = 'QUICK' | 'STANDARD' | 'DEEP';

export interface WorkflowEvaluationInput {
  taskBrief: string;
  touchedFilesCount?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'MISSION_CRITICAL';
  isArchitectureMutation?: boolean;
  hasSecurityImplications?: boolean;
}

export interface WorkflowRequirement {
  mode: AdaptiveExecutionMode;
  maxSkillsAllowed: number;
  planDepth: 'MINIMAL_SUMMARY' | 'STRUCTURED_STEPS' | 'STAGED_CHECKPOINTS';
  subagentDispatchAllowed: boolean;
  mandatoryEvidence: Array<'UNIT_TEST' | 'DIFF_INSPECTION' | 'BROWSER_SCREENSHOT' | 'REGRESSION_CHECK' | 'PRESERVATION_PROOF'>;
  allowAutonomousCompletion: boolean;
  rationale: string;
}

export interface WorkflowEvidencePayload {
  executedTests?: {
    total: number;
    passed: number;
    failed: number;
  };
  diffVerified?: boolean;
  screenshotPaths?: string[];
  preservationVerified?: boolean;
  notes?: string[];
}

export interface CompletionClaimEvaluation {
  canClaimCompletion: boolean;
  missingEvidence: string[];
  status: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'REJECTED';
  summary: string;
}

export class AdaptiveWorkflowEngine {
  /**
   * Evaluates task context to select appropriate execution mode.
   */
  public evaluateWorkflowMode(input: WorkflowEvaluationInput): WorkflowRequirement {
    const brief = input.taskBrief.toLowerCase();
    const count = input.touchedFilesCount ?? 1;
    const isHighRisk = input.riskLevel === 'HIGH' || input.riskLevel === 'MISSION_CRITICAL' || input.hasSecurityImplications;
    const isArch = input.isArchitectureMutation || brief.includes('refactor entire') || brief.includes('monolith') || brief.includes('modernize architecture');

    if (isHighRisk || isArch || count > 8) {
      return {
        mode: 'DEEP',
        maxSkillsAllowed: 6,
        planDepth: 'STAGED_CHECKPOINTS',
        subagentDispatchAllowed: true,
        mandatoryEvidence: ['UNIT_TEST', 'DIFF_INSPECTION', 'REGRESSION_CHECK', 'PRESERVATION_PROOF'],
        allowAutonomousCompletion: false,
        rationale: 'Deep mode active: task spans high-risk scope, architecture changes, or >8 files. Mandates rigorous staged verification.'
      };
    }

    if (count > 2 || brief.includes('redesign') || brief.includes('new feature') || brief.includes('implement page') || input.riskLevel === 'MEDIUM') {
      return {
        mode: 'STANDARD',
        maxSkillsAllowed: 4,
        planDepth: 'STRUCTURED_STEPS',
        subagentDispatchAllowed: false,
        mandatoryEvidence: ['UNIT_TEST', 'DIFF_INSPECTION'],
        allowAutonomousCompletion: true,
        rationale: 'Standard mode active: typical feature implementation or multi-component enhancement. Requires structured plan and automated tests.'
      };
    }

    // Default to QUICK mode for surgical fixes, typo repairs, and single-file corrections
    return {
      mode: 'QUICK',
      maxSkillsAllowed: 3,
      planDepth: 'MINIMAL_SUMMARY',
      subagentDispatchAllowed: false,
      mandatoryEvidence: ['DIFF_INSPECTION'],
      allowAutonomousCompletion: true,
      rationale: 'Quick mode active: localized surgical repair (<=2 files, low risk). Streamlined verification with zero process bloat.'
    };
  }

  /**
   * Validates completion claim against mandatory evidence for the active mode.
   */
  public evaluateCompletionClaim(
    requirement: WorkflowRequirement,
    evidence: WorkflowEvidencePayload
  ): CompletionClaimEvaluation {
    const missing: string[] = [];

    for (const mandate of requirement.mandatoryEvidence) {
      if (mandate === 'DIFF_INSPECTION' && !evidence.diffVerified) {
        missing.push('Diff inspection not verified.');
      }
      if (mandate === 'UNIT_TEST') {
        if (!evidence.executedTests || evidence.executedTests.failed > 0 || evidence.executedTests.passed === 0) {
          missing.push('Automated tests not executed or reported failures.');
        }
      }
      if (mandate === 'BROWSER_SCREENSHOT' && (!evidence.screenshotPaths || evidence.screenshotPaths.length === 0)) {
        missing.push('Required browser visual screenshot evidence missing.');
      }
      if (mandate === 'PRESERVATION_PROOF' && !evidence.preservationVerified) {
        missing.push('Behavioral preservation contract verification not established.');
      }
    }

    if (missing.length === 0) {
      return {
        canClaimCompletion: true,
        missingEvidence: [],
        status: 'VERIFIED',
        summary: `All ${requirement.mandatoryEvidence.length} mandatory evidence requirements verified for ${requirement.mode} mode.`
      };
    }

    return {
      canClaimCompletion: false,
      missingEvidence: missing,
      status: missing.length <= 1 ? 'PARTIALLY_VERIFIED' : 'REJECTED',
      summary: `Completion claim blocked for ${requirement.mode} mode: missing ${missing.length} evidence items.`
    };
  }
}
