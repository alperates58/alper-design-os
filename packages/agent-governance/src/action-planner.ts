import {
  AgentActionPlan,
  AgentActionPlanSchema,
  PlannedAction,
  VerificationPlanStep,
  RollbackPlan,
  ChangeRiskLevel
} from './types.js';
import { evaluateChangeRisk } from './risk-evaluator.js';
import { auditActionScope } from './scope-guard.js';

export interface CreateActionPlanParams {
  objective: string;
  requestedScope: string[];
  filesExpectedToChange: string[];
  filesForbiddenToChange?: string[];
  detectedProject?: Record<string, any>;
  plannedActions?: PlannedAction[];
  toolsRequired?: string[];
  risks?: string[];
  assumptions?: string[];
  verificationSteps?: VerificationPlanStep[];
  rollbackPlan?: Partial<RollbackPlan>;
}

export function createActionPlan(params: CreateActionPlanParams): AgentActionPlan {
  if (!params.objective || params.objective.trim().length === 0) {
    throw new Error('Action plan requires a clear, non-empty objective.');
  }

  if (!params.requestedScope || params.requestedScope.length === 0) {
    throw new Error('Action plan requires explicit requestedScope boundaries.');
  }

  // Check scope compliance of expected files
  const scopeAudit = auditActionScope(
    params.filesExpectedToChange,
    params.requestedScope,
    params.filesForbiddenToChange || []
  );

  if (!scopeAudit.isClean) {
    const errorDetails = [
      ...scopeAudit.violations.map(v => `Forbidden: ${v.file} (${v.reason})`),
      ...scopeAudit.expansions.map(e => `Scope Expansion: ${e.file} (${e.reason})`)
    ].join('; ');
    throw new Error(`Action plan rejected due to scope boundary violations: ${errorDetails}`);
  }

  // Assess risk
  const hasDb = params.filesExpectedToChange.some(f => /migration|schema|db/i.test(f));
  const hasAuth = params.filesExpectedToChange.some(
    f => /(?:auth\/|loginController|authController|session|password|token|credentials)/i.test(f) && !f.endsWith('Button.tsx')
  );
  const hasConfig = params.filesExpectedToChange.some(f => /\.env|config|appsettings/i.test(f));

  const riskAssessment = evaluateChangeRisk({
    fileCount: params.filesExpectedToChange.length,
    databaseImpact: hasDb,
    authenticationImpact: hasAuth,
    configurationImpact: hasConfig
  });

  const estimatedBlastRadius: ChangeRiskLevel = riskAssessment.overallRisk;
  const approvalRequired = riskAssessment.requiresApproval;

  // Build default planned actions if not provided
  const plannedActions: PlannedAction[] = params.plannedActions && params.plannedActions.length > 0
    ? params.plannedActions
    : params.filesExpectedToChange.map((file, idx) => ({
        id: `act-${idx + 1}`,
        description: `Apply targeted modification to ${file}`,
        file,
        riskLevel: 'LOW' as const,
        requiresVerification: true
      }));

  // Build default verification plan if not provided
  const verificationPlan: VerificationPlanStep[] = params.verificationSteps && params.verificationSteps.length > 0
    ? params.verificationSteps
    : [
        { type: 'BUILD', description: 'Run typescript build check to prevent type regressions' },
        { type: 'STATIC_LINT', description: 'Execute static analysis / lint check on modified files' },
        { type: 'UNIT_TEST', description: 'Run automated vitest test suite' }
      ];

  // Default rollback plan
  const rollbackPlan: RollbackPlan = {
    strategy: 'GIT_CHECKOUT',
    checkpointRef: `alper-pre-change-${Date.now()}`,
    steps: [
      `git checkout -- ${params.filesExpectedToChange.join(' ')}`,
      'Verify clean git status after rollback'
    ],
    automated: true,
    ...(params.rollbackPlan || {})
  };

  const plan: AgentActionPlan = {
    objective: params.objective,
    requestedScope: params.requestedScope,
    detectedProject: params.detectedProject,
    filesExpectedToChange: params.filesExpectedToChange,
    filesForbiddenToChange: params.filesForbiddenToChange || [],
    plannedActions,
    toolsRequired: params.toolsRequired || ['view_file', 'replace_file_content', 'run_command'],
    risks: params.risks && params.risks.length > 0 ? params.risks : riskAssessment.reasons,
    assumptions: params.assumptions || [
      'Existing test suites pass before change',
      'No uncommitted conflicting user changes in target files'
    ],
    verificationPlan,
    rollbackPlan,
    approvalRequired,
    estimatedBlastRadius
  };

  // Validate with Zod
  const validated = AgentActionPlanSchema.parse(plan);
  return validated;
}

export function validateActionPlan(plan: unknown): { valid: boolean; errors?: string[] } {
  const result = AgentActionPlanSchema.safeParse(plan);
  if (result.success) {
    return { valid: true };
  }
  return {
    valid: false,
    errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
  };
}
