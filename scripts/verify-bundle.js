import { verifyManualRunEvidence } from '../packages/agent-governance/dist/manual-run-bundle.js';

const target = process.argv[2] || '.alper-design-os/manual-runs/faz-1e-runtime-validation-01';
const result = verifyManualRunEvidence(target);
console.log(JSON.stringify(result, null, 2));
