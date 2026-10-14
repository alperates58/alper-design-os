import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { runDoctor } from './doctor.js';
import { bootstrapSystem } from './bootstrap.js';

/**
 * ALPER DESIGN OS - Install from Repository URL
 * Programmatic and CLI installer for AI agents and developers.
 */

export async function installFromRepository(options = {}) {
  const {
    repoUrl = 'https://github.com/alperates58/alper-design-os.git',
    targetDir = path.resolve('alper-design-os'),
    ref = 'main'
  } = options;

  console.log('========================================================');
  console.log('  ALPER DESIGN OS - Install from Repository URL');
  console.log('========================================================');
  console.log(`Repository: ${repoUrl}`);
  console.log(`Target Dir: ${targetDir}`);
  console.log(`Ref/Branch: ${ref}`);

  // 1. Validate URL
  if (!repoUrl || typeof repoUrl !== 'string' || (!repoUrl.startsWith('https://') && !repoUrl.startsWith('git@') && !repoUrl.startsWith('file://'))) {
    throw new Error(`Invalid repository URL: "${repoUrl}". Must be a valid HTTPS, SSH, or file Git URL.`);
  }

  // 2. Inspect Target Directory Safety
  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    if (files.length > 0) {
      // Check if it's already an active git repo
      const isGit = fs.existsSync(path.join(targetDir, '.git'));
      if (isGit) {
        let currentRemote = '';
        try {
          currentRemote = execSync('git remote get-url origin', { cwd: targetDir, encoding: 'utf-8' }).trim();
        } catch {}

        let gitStatus = '';
        try {
          gitStatus = execSync('git status -s', { cwd: targetDir, encoding: 'utf-8' }).trim();
        } catch {}

        if (gitStatus.length > 0) {
          return {
            success: false,
            status: 'DIRTY_WORKSPACE_REFUSED',
            message: `Target directory "${targetDir}" is a Git repository with uncommitted changes. Aborting to prevent data loss.`,
            targetDir
          };
        }

        console.log(`[INFO] Target directory is an existing clean clone of: ${currentRemote}`);
        console.log('[INFO] Running bootstrap and verification on existing clone...');
        const bootstrapResult = await bootstrapSystem({ repoRoot: targetDir });
        return {
          success: bootstrapResult.success,
          status: bootstrapResult.status,
          message: 'Existing repository bootstrapped and verified.',
          targetDir
        };
      } else {
        return {
          success: false,
          status: 'DIRECTORY_NOT_EMPTY',
          message: `Target directory "${targetDir}" already exists and is not an empty directory or Git repository.`,
          targetDir
        };
      }
    }
  }

  // 3. Clone Repository
  console.log(`\n[1/3] Cloning repository into "${targetDir}"...`);
  try {
    execSync(`git clone "${repoUrl}" "${targetDir}"`, { stdio: 'inherit' });
  } catch (err) {
    return {
      success: false,
      status: 'CLONE_FAILED',
      message: `Failed to clone repository: ${err.message}`,
      targetDir
    };
  }

  // 4. Checkout Requested Ref
  if (ref && ref !== 'main' && ref !== 'HEAD') {
    console.log(`\n[2/3] Checking out ref "${ref}"...`);
    try {
      execSync(`git checkout "${ref}"`, { cwd: targetDir, stdio: 'inherit' });
    } catch (err) {
      console.warn(`[WARN] Failed to checkout ref "${ref}": ${err.message}. Remaining on default branch.`);
    }
  }

  // 5. Bootstrap & Doctor
  console.log(`\n[3/3] Bootstrapping newly cloned repository...`);
  const bootstrapResult = await bootstrapSystem({ repoRoot: targetDir });

  return {
    success: bootstrapResult.success,
    status: bootstrapResult.status,
    message: bootstrapResult.success
      ? 'Alper Design OS successfully installed, bootstrapped, and verified.'
      : 'Installation completed with warnings or required actions.',
    targetDir,
    doctor: bootstrapResult.doctor
  };
}

// CLI Execution Entrypoint
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1'));

if (isDirectRun) {
  const args = process.argv.slice(2);
  const repoUrl = args[0] || 'https://github.com/alperates58/alper-design-os.git';
  const targetDir = args[1] ? path.resolve(args[1]) : path.resolve('alper-design-os');
  const ref = args[2] || 'main';

  installFromRepository({ repoUrl, targetDir, ref }).then(res => {
    console.log('\n========================================================');
    console.log(`INSTALLATION RESULT: ${res.status}`);
    console.log(`Message: ${res.message}`);
    console.log('========================================================');
    process.exit(res.success ? 0 : 1);
  }).catch(err => {
    console.error('Installation error:', err);
    process.exit(1);
  });
}
