import {
  CompletionContract,
  CompletionContractSchema
} from './types.js';

export interface EvaluateCompletionInput {
  requested: string[];
  implemented: string[];
  verified: string[];
  changedFiles: string[];
  testsRun?: string[];
  evidence?: string[];
  knownIssues?: string[];
  warnings?: string[];
  scopeChanges?: string[];
  rollbackAvailable?: boolean;
}

export function createCompletionContract(input: EvaluateCompletionInput): CompletionContract {
  const notVerified: string[] = [];

  // Check each requested item
  for (const item of input.requested) {
    if (!input.implemented.includes(item)) {
      notVerified.push(`${item} (Not implemented)`);
    } else if (!input.verified.includes(item)) {
      notVerified.push(`${item} (Implemented but unverified)`);
    }
  }

  let isComplete = true;
  let blockReason: string | undefined;

  if (input.requested.length === 0) {
    isComplete = false;
    blockReason = 'Cannot complete task without explicit requested deliverables.';
  } else if (notVerified.length > 0) {
    isComplete = false;
    blockReason = `Task cannot be marked complete: ${notVerified.length} requested deliverable(s) are unverified or missing.`;
  } else if (!input.evidence || input.evidence.length === 0) {
    isComplete = false;
    blockReason = 'Task cannot be marked complete: Zero concrete evidence artifacts attached.';
  }

  return CompletionContractSchema.parse({
    requested: input.requested,
    implemented: input.implemented,
    verified: input.verified,
    notVerified,
    changedFiles: input.changedFiles,
    testsRun: input.testsRun || [],
    evidence: input.evidence || [],
    knownIssues: input.knownIssues || [],
    warnings: input.warnings || [],
    scopeChanges: input.scopeChanges || [],
    rollbackAvailable: input.rollbackAvailable ?? true,
    isComplete,
    blockReason
  });
}
