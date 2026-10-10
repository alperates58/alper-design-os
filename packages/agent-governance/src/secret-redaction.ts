/**
 * Central secret masking and redaction utility for Alper Design OS.
 * Ensures secrets never leak into QA reports, logs, MCP responses, screenshots, or git commits.
 */

const SECRET_PATTERNS: Array<{ name: string; pattern: RegExp; replacement: string }> = [
  // OpenAI & general AI keys
  { name: 'OpenAI API Key', pattern: /sk-(?:proj-)?[a-zA-Z0-9_-]{20,}/g, replacement: '[REDACTED_OPENAI_KEY]' },
  // GitHub tokens
  { name: 'GitHub Token', pattern: /(ghp|gho|ghu|ghs|ghr|github_pat)_[a-zA-Z0-9_]{20,}/g, replacement: '[REDACTED_GITHUB_TOKEN]' },
  // AWS Access Key ID
  { name: 'AWS Access Key', pattern: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g, replacement: '[REDACTED_AWS_KEY]' },
  // AWS Secret Key in env or config
  { name: 'AWS Secret', pattern: /(aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*[:=]\s*['"]?[a-zA-Z0-9/+=]{40}['"]?/gi, replacement: '$1=[REDACTED_AWS_SECRET]' },
  // Stripe keys
  { name: 'Stripe Secret Key', pattern: /[rs]k_(test|live)_[0-9a-zA-Z]{24,}/g, replacement: '[REDACTED_STRIPE_KEY]' },
  // Slack tokens
  { name: 'Slack Token', pattern: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*/g, replacement: '[REDACTED_SLACK_TOKEN]' },
  // Bearer Authorization Header
  { name: 'Bearer Token', pattern: /Bearer\s+[a-zA-Z0-9_\-\.]{15,}/gi, replacement: 'Bearer [REDACTED_TOKEN]' },
  // JWT tokens
  { name: 'JWT Token', pattern: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{8,}/g, replacement: '[REDACTED_JWT_TOKEN]' },
  // Generic Database Connection Strings with Passwords
  {
    name: 'Database URL with Password',
    pattern: /(postgres(?:ql)?|mysql|mongodb(?:\+srv)?|sqlserver|redis):\/\/([^:]+):([^@]+)@/gi,
    replacement: '$1://$2:[REDACTED_PASSWORD]@'
  },
  // Key=Value secret definitions in .env
  {
    name: 'Env Key-Value Secret',
    pattern: /^(.*?(?:PASSWORD|SECRET|TOKEN|API_KEY|PRIVATE_KEY|AUTH_KEY|CREDENTIALS|ACCESS_KEY).*?)\s*=\s*(['"]?)(?!\s*\[REDACTED)[^\r\n"']+\2$/gim,
    replacement: '$1="[REDACTED_SECRET]"'
  },
  // JSON secret fields
  {
    name: 'JSON Secret Field',
    pattern: /"((?:password|secret|token|apiKey|apiKeyId|accessToken|privateKey|clientSecret|client_secret))"\s*:\s*"([^"]+)"/gi,
    replacement: '"$1": "[REDACTED_SECRET]"'
  },
  // Private Key Blocks
  {
    name: 'Private Key Block',
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[a-zA-Z0-9\n\r\/+=]+-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    replacement: '[REDACTED_PRIVATE_KEY_BLOCK]'
  }
];

export interface RedactionResult {
  sanitized: string;
  count: number;
  redactedKeys: string[];
}

export function redactText(text: string): RedactionResult {
  if (!text || typeof text !== 'string') {
    return { sanitized: text || '', count: 0, redactedKeys: [] };
  }

  let sanitized = text;
  let count = 0;
  const redactedKeys: string[] = [];

  for (const { name, pattern, replacement } of SECRET_PATTERNS) {
    const matches = sanitized.match(pattern);
    if (matches && matches.length > 0) {
      count += matches.length;
      if (!redactedKeys.includes(name)) {
        redactedKeys.push(name);
      }
      sanitized = sanitized.replace(pattern, replacement);
    }
  }

  return { sanitized, count, redactedKeys };
}

export function redactObject<T>(obj: T): { sanitized: T; count: number; redactedKeys: string[] } {
  if (obj === null || obj === undefined) {
    return { sanitized: obj, count: 0, redactedKeys: [] };
  }

  const rawJson = JSON.stringify(obj, null, 2);
  const { sanitized, count, redactedKeys } = redactText(rawJson);

  try {
    const parsed = JSON.parse(sanitized) as T;
    return { sanitized: parsed, count, redactedKeys };
  } catch {
    return { sanitized: obj, count, redactedKeys };
  }
}

export function containsSecrets(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return SECRET_PATTERNS.some(({ pattern }) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}
