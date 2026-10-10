import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectStack } from '../../packages/analyzer/dist/index.js';
import { createDefaultTokenCompiler, inferProductUXProfile } from '../../design-core/dist/index.js';
import { auditActionScope } from '../../packages/agent-governance/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const SCAN_DIRS = [
  'packages',
  'adapters',
  'design-core',
  'registry',
  'skills',
  'agents',
  'rules'
];

function scanForMachinePaths(dir, found = []) {
  if (!fs.existsSync(dir)) return found;
  const list = fs.readdirSync(dir);

  for (const item of list) {
    if (['node_modules', 'dist', '.git', '.alper-design-os', '.gemini'].includes(item)) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanForMachinePaths(fullPath, found);
    } else if (/\.(ts|js|json|md|ya?ml)$/i.test(item)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Look for machine-specific user home paths
      const matches = content.match(/(?:[a-zA-Z]:\\Users\\[a-zA-Z0-9_-]+|\/(?:home|Users)\/[a-zA-Z0-9_-]+)/g);
      if (matches) {
        // Exclude generic example or documentation paths
        const realMatches = matches.filter(
          (m) => !m.includes('/Users/username') && !m.includes('Users\\username') && !m.includes('/home/user')
        );
        if (realMatches.length > 0) {
          found.push({
            file: path.relative(rootDir, fullPath).replace(/\\/g, '/'),
            matches: Array.from(new Set(realMatches))
          });
        }
      }
    }
  }

  return found;
}

export async function runOfflinePortabilityCheck() {
  // 1. Portability Scan
  const machinePathViolations = [];
  for (const target of SCAN_DIRS) {
    scanForMachinePaths(path.join(rootDir, target), machinePathViolations);
  }

  // 2. Offline Execution Verification
  let offlineCapable = false;
  try {
    const stackResult = detectStack([
      { path: 'package.json', extension: '.json', content: JSON.stringify({ dependencies: { react: '18.2.0' } }) }
    ]);
    const compiler = createDefaultTokenCompiler();
    const tokenResult = compiler.compile('css');
    const domainResult = inferProductUXProfile({
      name: 'Manufacturing SCADA',
      description: 'Factory floor production monitor'
    });
    const scopeResult = auditActionScope(['src/index.ts'], ['src/index.ts']);

    offlineCapable =
      Boolean(stackResult.primaryStack) &&
      Boolean(tokenResult && tokenResult.content.length > 0) &&
      Boolean(domainResult.domainClassification) &&
      Boolean(scopeResult.isClean);
  } catch {
    offlineCapable = false;
  }

  const passed = machinePathViolations.length === 0 && offlineCapable;

  return {
    success: passed,
    offlineCapable,
    machinePathViolationsCount: machinePathViolations.length,
    machinePathViolations,
    summary: passed
      ? 'Repository is 100% portable with zero hardcoded machine paths and runs fully offline without internet access.'
      : `Found ${machinePathViolations.length} files with hardcoded machine paths or offline execution failed.`
  };
}

if (process.argv[1] && process.argv[1].endsWith('offline-portability-check.js')) {
  runOfflinePortabilityCheck().then((res) => {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.success ? 0 : 1);
  }).catch((err) => {
    console.error('Offline portability check failed:', err);
    process.exit(1);
  });
}
