import { createManualRunBundle } from '../packages/agent-governance/dist/manual-run-bundle.js';

const runId = process.argv[2] || 'faz-1e-runtime-validation-01';
console.log(`[Creating Manual Run Bundle] Run ID: ${runId}`);

const bundle = createManualRunBundle({
  runId,
  plannedObjective: 'FAZ 1E Final Operator-Assisted Runtime Evidence Run'
});

console.log(`[+] Bundle created successfully at: ${bundle.bundlePath}`);
console.log(`[+] Status: ${bundle.status}`);
console.log(`[+] Script: ${bundle.scriptPath}`);
console.log(`[+] Expected evidence files: ${bundle.expectedEvidence.join(', ')}`);
