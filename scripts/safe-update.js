import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { bootstrapSystem } from './bootstrap.js';

/**
 * ALPER DESIGN OS - Safe Update V1
 * Deterministic, non-destructive repository updater with dirty-worktree guard.
 */

export async function safeUpdate(options = {}) {
  const repoRoot = options.repoRoot ? path.resolve(options.repoRoot) : path.resolve('.');
  console.log('========================================================');
  console.log('  ALPER DESIGN OS - Safe Repository Update');
  console.log('========================================================');

  // 1. Verify Git Repository
  if (!fs.existsSync(path.join(repoRoot, '.git'))) {
    throw new Error(`Target directory "${repoRoot}" is not a Git repository.`);
  }

  // 2. Strict Dirty-Worktree Guard (NEVER discard local changes!)
  console.log('[1/5] Inspecting local workspace state...');
  let gitStatus = '';
  try {
    gitStatus = execSync('git status -s', { cwd: repoRoot, encoding: 'utf-8' }).trim();
  } catch (err) {
    throw new Error(`Failed to check git status: ${err.message}`);
  }

  if (gitStatus.length > 0) {
    console.error('\n[ABORTED] Dirty workspace detected!');
    console.error('The following files have uncommitted changes or untracked state:');
    console.error(gitStatus);
    console.error('\nSafety Rule: Alper Design OS safe-update NEVER executes "git reset --hard", "git clean", or discards local edits.');
    console.error('Action Required: Commit or stash your changes before updating:');
    console.error('  git stash save "local-work-before-update"');
    console.error('Then re-run: npm run update');

    return {
      success: false,
      status: 'DIRTY_WORKTREE_ABORTED',
      dirtyFiles: gitStatus.split('\n').map(l => l.trim()),
      message: 'Aborted due to uncommitted local changes in repository.'
    };
  }
  console.log('      Working directory is clean.');

  // 3. Identify Current Version & Target
  console.log('[2/5] Identifying current and upstream versions...');
  const currentBranch = execSync('git branch --show-current', { cwd: repoRoot, encoding: 'utf-8' }).trim() || 'main';
  const currentCommit = execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf-8' }).trim();
  console.log(`      Active branch: ${currentBranch} (Commit: ${currentCommit.substring(0, 7)})`);

  // Fetch remote updates
  console.log('[3/5] Fetching upstream commits from remote origin...');
  try {
    execSync('git fetch origin', { cwd: repoRoot, stdio: 'inherit' });
  } catch (err) {
    console.warn(`[WARN] git fetch origin failed: ${err.message}. Attempting update from local tracking branch.`);
  }

  let upstreamCommit = currentCommit;
  try {
    upstreamCommit = execSync(`git rev-parse origin/${currentBranch}`, { cwd: repoRoot, encoding: 'utf-8' }).trim();
  } catch {}

  if (currentCommit === upstreamCommit) {
    console.log('\n[INFO] Repository is already up to date with origin/' + currentBranch + '.');
    return {
      success: true,
      status: 'ALREADY_UP_TO_DATE',
      currentCommit,
      message: 'Repository is already up to date.'
    };
  }

  // 4. Create Rollback Checkpoint Branch
  const checkpointBranch = `backup-before-update-${Date.now()}`;
  console.log(`[4/5] Creating rollback safety checkpoint branch: "${checkpointBranch}"...`);
  try {
    execSync(`git branch "${checkpointBranch}"`, { cwd: repoRoot });
    console.log(`      Rollback branch created at ${currentCommit.substring(0, 7)}.`);
  } catch (err) {
    console.warn(`      Could not create checkpoint branch: ${err.message}`);
  }

  // 5. Fast-Forward Pull Only
  console.log('[5/5] Performing fast-forward merge...');
  try {
    execSync(`git merge --ff-only origin/${currentBranch}`, { cwd: repoRoot, stdio: 'inherit' });
    console.log('      Fast-forward merge succeeded.');
  } catch (err) {
    console.error(`\n[ABORTED] Fast-forward update failed: ${err.message}`);
    console.error('Your branch has diverged from upstream. Please rebase or merge manually.');
    return {
      success: false,
      status: 'FAST_FORWARD_FAILED',
      checkpointBranch,
      message: 'Fast-forward merge failed. Local branch has diverged.'
    };
  }

  // 6. Run Bootstrap Post-Update
  console.log('\nRunning post-update bootstrap and verification...');
  const bootstrapResult = await bootstrapSystem({ repoRoot });

  return {
    success: bootstrapResult.success,
    status: bootstrapResult.status,
    checkpointBranch,
    previousCommit: currentCommit,
    updatedCommit: execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf-8' }).trim(),
    message: 'Repository safely updated and bootstrapped.'
  };
}

// CLI Execution Entrypoint
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1'));

if (isDirectRun) {
  safeUpdate().then(res => {
    console.log('\n========================================================');
    console.log(`SAFE UPDATE RESULT: ${res.status}`);
    console.log(`Message: ${res.message}`);
    console.log('========================================================');
    process.exit(res.success ? 0 : 1);
  }).catch(err => {
    console.error('Update error:', err);
    process.exit(1);
  });
}
