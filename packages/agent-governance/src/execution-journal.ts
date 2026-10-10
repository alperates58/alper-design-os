import fs from 'node:fs';
import path from 'node:path';
import { redactObject, redactText } from './secret-redaction.js';

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
  const runDir = path.join(baseDir, '.alper-design-os', 'runs', journal.runId);
  fs.mkdirSync(runDir, { recursive: true });

  const evidenceDir = path.join(runDir, 'evidence');
  fs.mkdirSync(evidenceDir, { recursive: true });

  let totalRedacted = 0;
  const filesWritten: string[] = [];

  // 1. plan.json
  const { sanitized: cleanPlan, count: c1 } = redactObject(journal.plan);
  totalRedacted += c1;
  const planPath = path.join(runDir, 'plan.json');
  fs.writeFileSync(planPath, JSON.stringify(cleanPlan, null, 2), 'utf-8');
  filesWritten.push(planPath);

  // 2. project-profile.json
  if (journal.projectProfile) {
    const { sanitized: cleanProfile, count: c2 } = redactObject(journal.projectProfile);
    totalRedacted += c2;
    const profilePath = path.join(runDir, 'project-profile.json');
    fs.writeFileSync(profilePath, JSON.stringify(cleanProfile, null, 2), 'utf-8');
    filesWritten.push(profilePath);
  }

  // 3. actions.json
  if (journal.actions) {
    const { sanitized: cleanActions, count: c3 } = redactObject(journal.actions);
    totalRedacted += c3;
    const actionsPath = path.join(runDir, 'actions.json');
    fs.writeFileSync(actionsPath, JSON.stringify(cleanActions, null, 2), 'utf-8');
    filesWritten.push(actionsPath);
  }

  // 4. verification.json
  if (journal.verification) {
    const { sanitized: cleanVerif, count: c4 } = redactObject(journal.verification);
    totalRedacted += c4;
    const verifPath = path.join(runDir, 'verification.json');
    fs.writeFileSync(verifPath, JSON.stringify(cleanVerif, null, 2), 'utf-8');
    filesWritten.push(verifPath);
  }

  // 5. review.json
  if (journal.review) {
    const { sanitized: cleanReview, count: c5 } = redactObject(journal.review);
    totalRedacted += c5;
    const reviewPath = path.join(runDir, 'review.json');
    fs.writeFileSync(reviewPath, JSON.stringify(cleanReview, null, 2), 'utf-8');
    filesWritten.push(reviewPath);
  }

  // 6. evidence/
  if (journal.evidence && journal.evidence.length > 0) {
    for (let i = 0; i < journal.evidence.length; i++) {
      const item = journal.evidence[i];
      const { sanitized: cleanEv, count: c6 } = redactObject(item);
      totalRedacted += c6;
      const evPath = path.join(evidenceDir, `evidence-${i + 1}.json`);
      fs.writeFileSync(evPath, JSON.stringify(cleanEv, null, 2), 'utf-8');
      filesWritten.push(evPath);
    }
  }

  // 7. summary.md
  const rawSummary =
    journal.summaryMarkdown ||
    `# Execution Journal - Run ${journal.runId}\n\n- Completed at: ${new Date().toISOString()}\n- Plan Objective: ${
      journal.plan.objective || 'N/A'
    }\n`;
  const { sanitized: cleanSummary, count: c7 } = redactText(rawSummary);
  totalRedacted += c7;
  const summaryPath = path.join(runDir, 'summary.md');
  fs.writeFileSync(summaryPath, cleanSummary, 'utf-8');
  filesWritten.push(summaryPath);

  return {
    runDir,
    filesWritten,
    secretsRedactedCount: totalRedacted
  };
}
