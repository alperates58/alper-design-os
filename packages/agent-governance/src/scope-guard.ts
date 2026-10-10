import {
  ScopeStatus,
  ScopeEvaluation,
  ScopeAuditResult
} from './types.js';

// Patterns that are sensitive or dangerous to touch uninvited
const DEFAULT_FORBIDDEN_PATTERNS = [
  /^\.env/i,
  /^credentials/i,
  /^secrets/i,
  /id_rsa/i,
  /\.pem$/i,
  /docker-compose/i,
  /\.github\/workflows/i,
  /k8s/i,
  /kubernetes/i,
  /deployment/i,
  /terraform/i
];

// Patterns typically classified as infrastructure or database
const DATABASE_PATTERNS = [
  /migrations?\//i,
  /schema\.sql/i,
  /prisma\/schema/i,
  /database\/migrations/i,
  /database\.sqlite/i
];

const PACKAGE_UPGRADE_PATTERNS = [
  /package\.json$/i,
  /pnpm-lock\.yaml$/i,
  /package-lock\.json$/i,
  /composer\.json$/i,
  /composer\.lock$/i
];

export function isPathMatching(file: string, pattern: string): boolean {
  const normFile = file.replace(/\\/g, '/').toLowerCase();
  const normPattern = pattern.replace(/\\/g, '/').toLowerCase();

  if (normPattern.includes('*')) {
    const regexStr = '^' + normPattern.replace(/\./g, '\\.').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*') + '$';
    return new RegExp(regexStr).test(normFile);
  }

  return normFile.includes(normPattern) || normFile.endsWith(normPattern) || normFile.startsWith(normPattern);
}

export function evaluateFileScope(
  file: string,
  requestedScope: string[],
  explicitForbidden: string[] = []
): ScopeEvaluation {
  const normFile = file.replace(/\\/g, '/').toLowerCase();

  // 1. Check explicit forbidden patterns
  for (const forbidden of explicitForbidden) {
    if (isPathMatching(normFile, forbidden)) {
      return {
        file,
        status: 'FORBIDDEN',
        reason: `Explicitly forbidden by action plan guard: ${forbidden}`
      };
    }
  }

  // 2. Check system default sensitive forbidden patterns
  for (const pattern of DEFAULT_FORBIDDEN_PATTERNS) {
    if (pattern.test(normFile)) {
      return {
        file,
        status: 'FORBIDDEN',
        reason: `System-protected sensitive file pattern: ${pattern.source}`
      };
    }
  }

  // 3. Check requested scope matches
  for (const scopeItem of requestedScope) {
    if (isPathMatching(normFile, scopeItem)) {
      return {
        file,
        status: 'IN_SCOPE',
        reason: `Matches user-requested scope: ${scopeItem}`
      };
    }
  }

  // 4. Check if it is a secondary required dependency (e.g. style or component import of an in-scope file)
  const isDirectUIStyleOrAsset =
    normFile.endsWith('.css') ||
    normFile.endsWith('.scss') ||
    normFile.endsWith('.module.css') ||
    normFile.includes('/styles/') ||
    normFile.includes('/components/ui/');

  if (isDirectUIStyleOrAsset && requestedScope.some(s => s.toLowerCase().includes('ui') || s.toLowerCase().includes('component') || s.toLowerCase().includes('screen') || s.toLowerCase().includes('view') || s.toLowerCase().includes('login'))) {
    return {
      file,
      status: 'REQUIRED_DEPENDENCY',
      reason: 'Direct styling or sub-component required dependency for requested UI task'
    };
  }

  // 5. Check if it touches database or package manager uninvited
  if (DATABASE_PATTERNS.some(p => p.test(normFile))) {
    return {
      file,
      status: 'OUT_OF_SCOPE',
      reason: 'Database schema or migration file touched without explicit database modification requirement'
    };
  }

  if (PACKAGE_UPGRADE_PATTERNS.some(p => p.test(normFile))) {
    return {
      file,
      status: 'OUT_OF_SCOPE',
      reason: 'Package manager dependency manifest modified without explicit dependency upgrade requirement'
    };
  }

  return {
    file,
    status: 'OUT_OF_SCOPE',
    reason: 'File was not declared in requested scope and has no verified dependency link'
  };
}

export function auditActionScope(
  filesToChange: string[],
  requestedScope: string[],
  explicitForbidden: string[] = []
): ScopeAuditResult {
  const violations: ScopeEvaluation[] = [];
  const expansions: ScopeEvaluation[] = [];
  const allowedFiles: string[] = [];
  const rejectedFiles: string[] = [];

  for (const file of filesToChange) {
    const evaluation = evaluateFileScope(file, requestedScope, explicitForbidden);

    if (evaluation.status === 'FORBIDDEN') {
      violations.push(evaluation);
      rejectedFiles.push(file);
    } else if (evaluation.status === 'OUT_OF_SCOPE') {
      expansions.push(evaluation);
      rejectedFiles.push(file);
    } else {
      allowedFiles.push(file);
    }
  }

  const isClean = violations.length === 0 && expansions.length === 0;
  const summary = isClean
    ? `All ${filesToChange.length} file(s) are strictly compliant with the requested scope.`
    : `Scope violations detected: ${violations.length} forbidden file(s), ${expansions.length} unrequested scope expansion(s).`;

  return {
    isClean,
    allowedFiles,
    violations,
    expansions,
    rejectedFiles,
    summary
  };
}
