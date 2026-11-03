import path from 'node:path';
import { redactObject, redactText } from './secret-redaction.js';
import {
  assertSafeIdentifier,
  assertAuthorizedWorkspaceRoot,
  executeAtomicWorkspaceTransaction
} from './workspace-boundary.js';

export interface ExecutionJournalData {
  runId: string;
  plan: Record<string, any>;
  projectProfile?: Record<string, any>;
  actions?: Record<string, any>[];
  verification?: Record<string, any>;
  evidence?: Record<string, any>[];
  review?: Record<string, any>;
  summaryMarkdown?: string;
}

export function writeExecutionJournal(
  baseDir: string,
  journal: ExecutionJournalData
): {
  runDir: string;
  filesWritten: string[];
  secretsRedactedCount: number;
} {
  const safeRunId = assertSafeIdentifier(journal.runId, 'runId');
  const authorizedBaseDir = assertAuthorizedWorkspaceRoot(baseDir, 'WRITE');

  return executeAtomicWorkspaceTransaction(authorizedBaseDir, (tx) => {
    const relRunDir = path.join('.alper-design-os', 'runs', safeRunId);
    const runDir = tx.ensureDir(relRunDir);
    tx.ensureDir(path.join(relRunDir, 'evidence'));

    let totalRedacted = 0;
    const filesWritten: string[] = [];

    // 1. plan.json
    const { sanitized: cleanPlan, count: c1 } = redactObject(journal.plan);
    totalRedacted += c1;
    const planPath = tx.writeJson(path.join(relRunDir, 'plan.json'), cleanPlan);
    filesWritten.push(planPath);

    // 2. project-profile.json
    if (journal.projectProfile) {
      const { sanitized: cleanProfile, count: c2 } = redactObject(journal.projectProfile);
      totalRedacted += c2;
      const profilePath = tx.writeJson(path.join(relRunDir, 'project-profile.json'), cleanProfile);
      filesWritten.push(profilePath);
    }

    // 3. actions.json
    if (journal.actions) {
      const { sanitized: cleanActions, count: c3 } = redactObject(journal.actions);
      totalRedacted += c3;
      const actionsPath = tx.writeJson(path.join(relRunDir, 'actions.json'), cleanActions);
      filesWritten.push(actionsPath);
    }

    // 4. verification.json
    if (journal.verification) {
      const { sanitized: cleanVerif, count: c4 } = redactObject(journal.verification);
      totalRedacted += c4;
      const verifPath = tx.writeJson(path.join(relRunDir, 'verification.json'), cleanVerif);
      filesWritten.push(verifPath);
    }

    // 5. review.json
    if (journal.review) {
      const { sanitized: cleanReview, count: c5 } = redactObject(journal.review);
      totalRedacted += c5;
      const reviewPath = tx.writeJson(path.join(relRunDir, 'review.json'), cleanReview);
      filesWritten.push(reviewPath);
    }

    // 6. evidence/
    if (journal.evidence && journal.evidence.length > 0) {
      for (let i = 0; i < journal.evidence.length; i++) {
        const item = journal.evidence[i];
        const { sanitized: cleanEv, count: c6 } = redactObject(item);
        totalRedacted += c6;
        const evPath = tx.writeJson(path.join(relRunDir, 'evidence', `evidence-${i + 1}.json`), cleanEv);
        filesWritten.push(evPath);
      }
    }

    // 7. summary.md
    const rawSummary =
      journal.summaryMarkdown ||
      `# Execution Journal - Run ${safeRunId}\n\n- Completed at: ${new Date().toISOString()}\n- Plan Objective: ${
        journal.plan.objective || 'N/A'
      }\n`;
    const { sanitized: cleanSummary, count: c7 } = redactText(rawSummary);
    totalRedacted += c7;
    const summaryPath = tx.writeFile(path.join(relRunDir, 'summary.md'), cleanSummary);
    filesWritten.push(summaryPath);

    return {
      runDir,
      filesWritten,
      secretsRedactedCount: totalRedacted
    };
  });
}
