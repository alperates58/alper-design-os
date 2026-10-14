import fs from 'node:fs';

// Read JSON payload from stdin passed by PreToolUse hook
let inputData = '';
process.stdin.setEncoding('utf-8');

process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    let commandLine = '';
    if (inputData.trim()) {
      const parsed = JSON.parse(inputData);
      commandLine = parsed?.args?.CommandLine || parsed?.tool_calls?.[0]?.CommandLine || inputData;
    } else {
      commandLine = process.argv.slice(2).join(' ');
    }

    const destructivePatterns = [
      /git\s+reset\s+--hard/i,
      /git\s+clean\s+-[a-z]*f/i,
      /git\s+push\s+.*--force/i,
      /git\s+push\s+-f\b/i,
      /rm\s+-rf\s+(\/|~|\.\.)/i,
      /drop\s+database/i,
      /format\s+[a-z]:/i
    ];

    for (const pattern of destructivePatterns) {
      if (pattern.test(commandLine)) {
        console.error(`[DESTRUCTIVE_COMMAND_GUARD] BLOCKED: Command matches prohibited destructive pattern: ${pattern}`);
        console.error(`Command: ${commandLine}`);
        console.error('Explicit human operator authorization is required to execute destructive operations.');
        process.exit(1);
      }
    }

    process.exit(0);
  } catch (err) {
    // If parsing fails, do not block unless pattern matches raw input
    if (/git\s+reset\s+--hard|git\s+clean\s+-[a-z]*f|git\s+push\s+.*--force/i.test(inputData)) {
      console.error('[DESTRUCTIVE_COMMAND_GUARD] BLOCKED destructive git command in raw payload.');
      process.exit(1);
    }
    process.exit(0);
  }
});
