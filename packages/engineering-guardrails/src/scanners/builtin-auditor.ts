import { AuditFinding } from '../types.js';
import { ScanTarget } from './contract.js';

export function runBuiltinStaticAudit(target: ScanTarget): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const files = target.files || [];

  for (const file of files) {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;

      // 1. Secret Detection
      if (/AKIA[0-9A-Z]{16}/.test(line)) {
        findings.push({
          id: `sec-secret-aws-${file.path}-${lineNum}`,
          category: 'SECRET',
          severity: 'CRITICAL',
          title: 'Exposed AWS Access Key Identified',
          description: 'A live AWS Access Key format was detected in source code.',
          location: { file: file.path, line: lineNum },
          tool: 'builtin-secret-scanner',
          remediation: 'Immediately revoke key, remove from commit history, and configure via environment variable.'
        });
      }

      if (/sk-[a-zA-Z0-9]{48}/.test(line) || /sk-proj-[a-zA-Z0-9_-]{20,}/.test(line)) {
        findings.push({
          id: `sec-secret-openai-${file.path}-${lineNum}`,
          category: 'SECRET',
          severity: 'CRITICAL',
          title: 'Exposed OpenAI Secret Key Identified',
          description: 'An OpenAI API secret key was detected in cleartext in source code.',
          location: { file: file.path, line: lineNum },
          tool: 'builtin-secret-scanner',
          remediation: 'Rotate secret immediately in OpenAI platform and populate through secure secret store.'
        });
      }

      if (/-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/.test(line)) {
        findings.push({
          id: `sec-secret-privkey-${file.path}-${lineNum}`,
          category: 'SECRET',
          severity: 'CRITICAL',
          title: 'Cryptographic Private Key Committed in Source',
          description: 'A private key block was found embedded in project files.',
          location: { file: file.path, line: lineNum },
          tool: 'builtin-secret-scanner',
          remediation: 'Move private key to an encrypted secret vault or HSM.'
        });
      }

      if (/(?:postgres|mysql|mongodb(?:\+srv)?):\/\/[a-zA-Z0-9_-]+:[^@\s]+@[a-zA-Z0-9.-]+/i.test(line) && !line.includes('example.com') && !line.includes('placeholder')) {
        findings.push({
          id: `sec-secret-dburi-${file.path}-${lineNum}`,
          category: 'SECRET',
          severity: 'CRITICAL',
          title: 'Hardcoded Database Connection URI with Password',
          description: 'Database credentials with raw password found in connection string.',
          location: { file: file.path, line: lineNum },
          tool: 'builtin-secret-scanner',
          remediation: 'Extract credentials into DATABASE_URL environment variable.'
        });
      }

      // 2. Dangerous Code Patterns (SAST)
      if (/\beval\s*\(/.test(line) && !file.path.includes('.test.')) {
        findings.push({
          id: `sec-sast-eval-${file.path}-${lineNum}`,
          category: 'SECURITY',
          severity: 'HIGH',
          title: 'Dangerous eval() Execution',
          description: 'Dynamic execution with eval() enables remote code execution if input is tainted.',
          location: { file: file.path, line: lineNum },
          tool: 'builtin-sast-scanner',
          remediation: 'Refactor to safe JSON.parse or strict map lookup without dynamic code execution.'
        });
      }

      if (/dangerouslySetInnerHTML/.test(line)) {
        findings.push({
          id: `sec-sast-react-innerhtml-${file.path}-${lineNum}`,
          category: 'SECURITY',
          severity: 'HIGH',
          title: 'React dangerouslySetInnerHTML Detected',
          description: 'Direct HTML rendering can introduce cross-site scripting (XSS) if unsanitized.',
          location: { file: file.path, line: lineNum },
          tool: 'builtin-sast-scanner',
          remediation: 'Sanitize content with DOMPurify or replace with structured React component children.'
        });
      }

      // 3. AI-Assisted Coding Safety & Supply Chain
      if (/curl\s+.*\|\s*(?:bash|sh|powershell)/i.test(line)) {
        findings.push({
          id: `sec-supply-pipe-shell-${file.path}-${lineNum}`,
          category: 'SUPPLY_CHAIN',
          severity: 'CRITICAL',
          title: 'Piping Remote Script to Shell',
          description: 'curl piped to bash/sh bypasses supply chain integrity verification.',
          location: { file: file.path, line: lineNum },
          tool: 'builtin-supply-chain-scanner',
          remediation: 'Download script, verify SHA-256 cryptographic checksum, and inspect before running.'
        });
      }
    });

    // 4. Dependency Manifest Hygiene
    if (file.path.endsWith('package.json')) {
      try {
        const pkg = JSON.parse(content);
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

        for (const [dep, ver] of Object.entries(allDeps)) {
          if (ver === '*' || ver === 'latest') {
            findings.push({
              id: `sec-supply-wildcard-${dep}`,
              category: 'SUPPLY_CHAIN',
              severity: 'HIGH',
              title: `Unpinned Wildcard Dependency: ${dep}@${ver}`,
              description: 'Wildcard or latest dependency ranges allow untrusted upstream changes into builds.',
              location: { file: file.path },
              tool: 'builtin-dependency-scanner',
              remediation: `Pin ${dep} to a specific immutable semantic version or semver caret range.`
            });
          }
        }
      } catch {
        // Skip malformed JSON
      }
    }
  }

  return findings;
}
