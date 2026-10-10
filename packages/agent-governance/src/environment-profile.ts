import {
  EnvironmentProfile,
  EnvironmentProfileSchema
} from './types.js';

export interface ProjectFileInfo {
  path: string;
  content?: string;
}

export function createEnvironmentProfile(files: ProjectFileInfo[]): EnvironmentProfile {
  let nodeVersion: string | undefined;
  let phpVersion: string | undefined;
  let dotnetSdkVersion: string | undefined;
  let packageManager: { name: string; version?: string } | undefined;

  const lockFiles: string[] = [];
  const requiredEnvVars: string[] = [];
  const externalServices: string[] = [];
  const databaseRequirements: string[] = [];
  const portabilityIssues: string[] = [];

  for (const file of files) {
    const normPath = file.path.replace(/\\/g, '/');
    const baseName = normPath.split('/').pop() || '';
    const content = file.content || '';

    // Detect lock files
    if (['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'bun.lockb', 'composer.lock'].includes(baseName)) {
      lockFiles.push(baseName);
      if (baseName === 'pnpm-lock.yaml') packageManager = { name: 'pnpm' };
      if (baseName === 'package-lock.json') packageManager = { name: 'npm' };
      if (baseName === 'yarn.lock') packageManager = { name: 'yarn' };
      if (baseName === 'composer.lock') packageManager = { name: 'composer' };
    }

    // Inspect package.json
    if (baseName === 'package.json' && content) {
      try {
        const pkg = JSON.parse(content);
        if (pkg.engines?.node) {
          nodeVersion = pkg.engines.node;
        }
        if (pkg.packageManager) {
          const [pmName, pmVer] = pkg.packageManager.split('@');
          packageManager = { name: pmName, version: pmVer };
        }
      } catch {
        // ignore parse error
      }
    }

    // Inspect composer.json
    if (baseName === 'composer.json' && content) {
      try {
        const comp = JSON.parse(content);
        if (comp.require?.php) {
          phpVersion = comp.require.php;
        }
      } catch {
        // ignore
      }
    }

    // Inspect global.json (.NET SDK)
    if (baseName === 'global.json' && content) {
      try {
        const glob = JSON.parse(content);
        if (glob.sdk?.version) {
          dotnetSdkVersion = glob.sdk.version;
        }
      } catch {
        // ignore
      }
    }

    // Inspect .env.example
    if (baseName === '.env.example' && content) {
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const varName = trimmed.split('=')[0]?.trim();
          if (varName && !requiredEnvVars.includes(varName)) {
            requiredEnvVars.push(varName);
          }
        }
      }
    }

    // Detect hardcoded machine-specific absolute paths
    if (content) {
      const winAbsMatch = content.match(/[A-Za-z]:\\\\*(?:Users|Documents|Desktop|Program Files)[^\s"']+/gi);
      const unixAbsMatch = content.match(/\/(?:home|Users)\/[a-zA-Z0-9_-]+\/[^\s"']+/g);

      if (winAbsMatch && winAbsMatch.length > 0) {
        portabilityIssues.push(
          `Hardcoded Windows absolute path in ${file.path}: ${winAbsMatch[0].slice(0, 40)}... (breaks cross-machine reproducibility)`
        );
      }
      if (unixAbsMatch && unixAbsMatch.length > 0) {
        portabilityIssues.push(
          `Hardcoded Unix home absolute path in ${file.path}: ${unixAbsMatch[0].slice(0, 40)}... (breaks cross-machine reproducibility)`
        );
      }
    }

    // Detect external services and DBs
    if (/redis|ioredis/i.test(content)) externalServices.push('Redis');
    if (/postgresql|pg|psql/i.test(content)) databaseRequirements.push('PostgreSQL');
    if (/mysql|mariadb/i.test(content)) databaseRequirements.push('MySQL');
    if (/sqlite3?/i.test(content)) databaseRequirements.push('SQLite');
  }

  // Deduplicate
  const uniqueExt = Array.from(new Set(externalServices));
  const uniqueDb = Array.from(new Set(databaseRequirements));
  const uniqueLock = Array.from(new Set(lockFiles));

  if (uniqueLock.length === 0) {
    portabilityIssues.push('Missing package lock file (e.g. pnpm-lock.yaml or package-lock.json). Non-deterministic builds across machines.');
  }

  const machineIndependent = portabilityIssues.length === 0;

  return EnvironmentProfileSchema.parse({
    nodeVersion,
    phpVersion,
    dotnetSdkVersion,
    packageManager,
    lockFiles: uniqueLock,
    requiredEnvVars,
    externalServices: uniqueExt,
    databaseRequirements: uniqueDb,
    machineIndependent,
    portabilityIssues
  });
}
