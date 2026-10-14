import {
  GitWorkingTreeStatus,
  CheckpointPlan,
  DestructiveCommandCheck
} from './types.js';

const DESTRUCTIVE_COMMAND_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /git\s+reset\s+--hard/i, reason: 'Destructive git reset --hard permanently discards uncommitted working tree and staged changes.' },
  { pattern: /git\s+clean\s+-[a-zA-Z]*f/i, reason: 'Destructive git clean permanently deletes untracked files.' },
  { pattern: /git\s+push\s+.*--force/i, reason: 'Force push overwrites remote history and can destroy team commits.' },
  { pattern: /git\s+push\s+.*-f\b/i, reason: 'Force push flag (-f) overwrites remote history.' },
  { pattern: /git\s+checkout\s+(--\s+)?\.\b/i, reason: 'git checkout . permanently reverts all modifications across the entire repository.' },
  { pattern: /git\s+restore\s+(--staged\s+)?\.\b/i, reason: 'git restore . discards changes in all files without review.' },
  { pattern: /rm\s+-rf\s+[\/\*]/i, reason: 'Root or wildcard filesystem removal.' }
];

export function checkCommandDestructiveness(command: string, userExplicitApproval: boolean = false): DestructiveCommandCheck {
  for (const { pattern, reason } of DESTRUCTIVE_COMMAND_PATTERNS) {
    if (pattern.test(command)) {
      return {
        command,
        isDestructive: true,
        blockedReason: userExplicitApproval
          ? undefined
          : `Blocked destructive command: ${reason} Explicit user approval is mandatory.`,
        requiresExplicitApproval: true
      };
    }
  }

  return {
    command,
    isDestructive: false,
    requiresExplicitApproval: false
  };
}

export function parseGitStatus(statusText: string, currentBranch: string = 'unknown'): GitWorkingTreeStatus {
  const lines = statusText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const stagedFiles: string[] = [];
  const modifiedFiles: string[] = [];
  const untrackedFiles: string[] = [];

  let detectedBranch = currentBranch;
  let inUntrackedSection = false;

  for (const line of lines) {
    if (line.startsWith('On branch ')) {
      detectedBranch = line.replace('On branch ', '').trim();
      continue;
    }
    if (line.startsWith('## ')) {
      detectedBranch = line.replace('## ', '').split('...')[0]?.trim() || detectedBranch;
      continue;
    }

    if (line.includes('Untracked files:')) {
      inUntrackedSection = true;
      continue;
    }

    if (inUntrackedSection) {
      if (line.startsWith('(') || line.startsWith('no changes added to commit')) {
        continue;
      }
      if (line.endsWith(':') || line.startsWith('Changes to be committed') || line.startsWith('Changes not staged')) {
        inUntrackedSection = false;
      } else {
        const file = line.trim();
        if (file && !file.includes(' ')) {
          untrackedFiles.push(file);
          continue;
        }
      }
    }

    // Porcelain short format (e.g., M file, ?? file, A file)
    if (/^[MADRCU?!]{1,2}\s+/.test(line)) {
      const status = line.slice(0, 2);
      const filePath = line.slice(2).trim();

      if (status.includes('?')) {
        untrackedFiles.push(filePath);
      } else if (status[0] !== ' ' && status[0] !== '?') {
        stagedFiles.push(filePath);
      } else if (status[1] && status[1] !== ' ') {
        modifiedFiles.push(filePath);
      }
      continue;
    }

    // Standard human-readable git status output
    if (line.includes('modified:') || line.includes('deleted:')) {
      const parts = line.split(':');
      if (parts[1]) modifiedFiles.push(parts[1].trim());
    } else if (line.startsWith('new file:')) {
      const parts = line.split(':');
      if (parts[1]) stagedFiles.push(parts[1].trim());
    }
  }

  const isMainOrMaster = ['main', 'master', 'prod', 'production'].includes(detectedBranch.toLowerCase());
  const isClean = stagedFiles.length === 0 && modifiedFiles.length === 0 && untrackedFiles.length === 0;

  return {
    isClean,
    branch: detectedBranch,
    isMainOrMaster,
    stagedFiles: Array.from(new Set(stagedFiles)),
    modifiedFiles: Array.from(new Set(modifiedFiles)),
    untrackedFiles: Array.from(new Set(untrackedFiles))
  };
}

export function createCheckpointPlan(
  status: GitWorkingTreeStatus,
  taskName: string
): CheckpointPlan {
  const timestamp = Date.now();
  const sanitizedTask = taskName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  const checkpointId = `checkpoint-${sanitizedTask}-${timestamp}`;
  const warnings: string[] = [];

  let branchName: string | undefined;
  let commitMessage = `checkpoint: pre-change snapshot for ${taskName}`;
  let requiresApproval = false;

  if (status.isMainOrMaster) {
    warnings.push(`Current branch is '${status.branch}'. Changes should be made on a temporary feature branch.`);
    branchName = `alper/${sanitizedTask}-${timestamp}`;
  }

  if (!status.isClean) {
    warnings.push(
      `Working tree is dirty (${status.modifiedFiles.length} modified, ${status.untrackedFiles.length} untracked files). Preserving existing user work.`
    );
    requiresApproval = true;
  }

  const rollbackScript: string[] = [
    `# Rollback steps for ${checkpointId}`,
    branchName ? `git checkout ${status.branch}` : `# Retain branch ${status.branch}`,
    status.modifiedFiles.length > 0
      ? `git stash list # inspect stash or run: git checkout -- ${status.modifiedFiles.join(' ')}`
      : `# No pre-existing modified files to restore`
  ];

  return {
    checkpointId,
    branchName,
    commitMessage,
    stashRef: !status.isClean ? `stash@{pre-${sanitizedTask}}` : undefined,
    safeToProceed: true,
    requiresApproval,
    warnings,
    rollbackScript,
    checkpoints: [
      {
        checkpointId,
        stageId: 'PRE_EXECUTION',
        gitBranch: branchName || status.branch,
        commitTag: checkpointId,
        rollbackCommand: rollbackScript.join(' && ')
      }
    ]
  };
}

export function generateRollbackScript(files: string[], checkpointRef?: string): string[] {
  const commands: string[] = [];
  if (checkpointRef) {
    commands.push(`# Reverting to checkpoint reference: ${checkpointRef}`);
  }
  for (const file of files) {
    commands.push(`git checkout -- "${file}"`);
  }
  commands.push('git status');
  return commands;
}
