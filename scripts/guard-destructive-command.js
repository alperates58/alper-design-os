import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const DESTRUCTIVE_COMMAND_PATTERNS = [
  // Git destructive commands
  /\bgit\s+reset\s+--hard\b/i,
  /\bgit\s+clean\s+-[a-z]*f/i,
  /\bgit\s+push\s+.*--force(?:-with-lease)?\b/i,
  /\bgit\s+push\s+(?:-[a-z]*f\b|.*\s-[a-z]*f\b)/i,
  /\bgit\s+checkout\s+--\s+\./i,
  /\bgit\s+restore\s+(?:--staged\s+--worktree|--worktree\s+--staged|\.)/i,
  /\bgit\s+branch\s+-D\b/i,

  // PowerShell destructive commands
  /\b(?:Remove-Item|ri|rm|rmdir|rd|del|erase)\b[^\n;|]*-(?:Recurse|Force|r\b|f\b)/i,
  /\b(?:rmdir|rd)\s+\/s\b/i,
  /\b(?:del|erase)\s+\/[fqs]\b/i,
  /\bFormat-Volume\b/i,
  /\bClear-Disk\b/i,
  /\bClear-Content\b[^\n;|]*-Force\b/i,
  /\b(?:Stop-Computer|Restart-Computer)\b/i,

  // POSIX / Bash / CMD / SQL destructive commands
  /\brm\s+-(?:[a-z]*r[a-z]*f|[a-z]*f[a-z]*r|--recursive|--force)\b/i,
  /\brm\s+-(?:r|f)\s+-(?:r|f)\b/i,
  /\brm\s+-rf\b/i,
  /\bmkfs(?:\.[a-z0-9]+)?\b/i,
  /\bdd\s+if=/i,
  /\bdrop\s+(?:database|table|schema)\b/i,
  /\btruncate\s+table\b/i,
  /\bformat\s+[a-z]:/i
];

/**
 * Extracts all candidate command strings from a hook payload or raw string.
 */
export function extractCandidateCommands(rawInput = '', argvArgs = []) {
  const candidates = [];
  const trimmed = String(rawInput || '').trim();

  if (trimmed) {
    candidates.push(trimmed);
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        const extracted = [
          parsed?.args?.CommandLine,
          parsed?.args?.command,
          parsed?.CommandLine,
          parsed?.command,
          parsed?.tool_input?.CommandLine,
          parsed?.tool_input?.command,
          parsed?.tool_calls?.[0]?.CommandLine,
          parsed?.tool_calls?.[0]?.command,
          parsed?.tool_calls?.[0]?.args?.CommandLine,
          parsed?.tool_calls?.[0]?.args?.command
        ].filter(Boolean);
        candidates.push(...extracted.map(String));
      } catch {
        // Keep raw trimmed input in candidates when JSON parsing fails
      }
    }
  }

  if (Array.isArray(argvArgs) && argvArgs.length > 0) {
    candidates.push(argvArgs.join(' '));
  }

  return candidates;
}

/**
 * Evaluates whether a command payload or raw string contains a destructive operation.
 */
export function evaluateDestructiveCommandGuard(rawInput = '', argvArgs = []) {
  const candidates = extractCandidateCommands(rawInput, argvArgs);

  for (const candidate of candidates) {
    for (const pattern of DESTRUCTIVE_COMMAND_PATTERNS) {
      if (pattern.test(candidate)) {
        return {
          allowed: false,
          blocked: true,
          matchedPattern: pattern.toString(),
          commandLine: candidate
        };
      }
    }
  }

  return {
    allowed: true,
    blocked: false,
    matchedPattern: null,
    commandLine: candidates[0] || ''
  };
}

const isDirectRun = Boolean(
  process.argv[1] &&
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(fileURLToPath(import.meta.url)).toLowerCase()
);

if (isDirectRun) {
  let inputData = '';
  process.stdin.setEncoding('utf-8');

  process.stdin.on('data', chunk => {
    inputData += chunk;
  });

  process.stdin.on('end', () => {
    const cliArgs = process.argv.slice(2);
    const result = evaluateDestructiveCommandGuard(inputData, cliArgs);
    if (result.blocked) {
      console.error(`[DESTRUCTIVE_COMMAND_GUARD] BLOCKED: Command matches prohibited destructive pattern: ${result.matchedPattern}`);
      console.error(`Command: ${result.commandLine}`);
      console.error('Explicit human operator authorization is required to execute destructive operations.');
      process.exit(1);
    }
    process.exit(0);
  });
}
