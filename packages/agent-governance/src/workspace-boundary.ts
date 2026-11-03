import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

export type WorkspaceCapability = 'READ' | 'WRITE';

export type WorkspaceBoundaryErrorCode =
  | 'WORKSPACE_AUTHORIZATION_REQUIRED'
  | 'PATH_TRAVERSAL_REJECTED'
  | 'INVALID_IDENTIFIER'
  | 'SYMLINK_OR_REPARSE_FORBIDDEN'
  | 'WINDOWS_RESERVED_NAME'
  | 'CAPABILITY_DENIED'
  | 'CONCURRENT_LOCK_TIMEOUT';

export interface WorkspaceAuthorizationRequirement {
  status: 'WORKSPACE_AUTHORIZATION_REQUIRED';
  errorCode: WorkspaceBoundaryErrorCode;
  requiredCapability: WorkspaceCapability;
  requestedPath: string;
  approvedRoots: string[];
  message: string;
}

export class WorkspaceAuthorizationError extends Error {
  public readonly code: WorkspaceBoundaryErrorCode;
  public readonly authorizationRequirement: WorkspaceAuthorizationRequirement;

  constructor(
    code: WorkspaceBoundaryErrorCode,
    message: string,
    details: {
      requiredCapability: WorkspaceCapability;
      requestedPath: string;
      approvedRoots?: string[];
    }
  ) {
    super(message);
    this.name = 'WorkspaceAuthorizationError';
    this.code = code;
    this.authorizationRequirement = {
      status: 'WORKSPACE_AUTHORIZATION_REQUIRED',
      errorCode: code,
      requiredCapability: details.requiredCapability,
      requestedPath: details.requestedPath,
      approvedRoots: details.approvedRoots || getApprovedRootPaths(),
      message
    };
  }
}

export interface TrustedRootConfig {
  path: string;
  capabilities?: WorkspaceCapability[];
}

interface InternalTrustedRoot {
  rootPath: string;
  canonicalPath: string;
  capabilities: Set<WorkspaceCapability>;
}

const WINDOWS_RESERVED_NAME_REGEX = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i;
const SAFE_IDENTIFIER_REGEX = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

let configuredTrustedRoots: InternalTrustedRoot[] = [];
let strictHostRootEnforcement = false;
let txCounter = 0;

function normalizeForComparison(p: string): string {
  const resolved = path.resolve(p);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function getSafeRealPath(targetPath: string): string {
  const resolved = path.resolve(targetPath);
  if (fs.existsSync(resolved)) {
    return fs.realpathSync.native(resolved);
  }
  // Find deepest existing ancestor
  let current = resolved;
  const trailingSegments: string[] = [];
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) break;
    trailingSegments.unshift(path.basename(current));
    current = parent;
  }
  const realBase = fs.existsSync(current) ? fs.realpathSync.native(current) : current;
  return path.join(realBase, ...trailingSegments);
}

function isSubPathOrEqual(parentPath: string, candidatePath: string): boolean {
  const normParent = normalizeForComparison(parentPath);
  const normCandidate = normalizeForComparison(candidatePath);
  const rel = path.relative(normParent, normCandidate);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

export function configureTrustedWorkspaceRoots(
  roots: Array<TrustedRootConfig & { rootPath?: string }>,
  options?: { strictHostEnforcement?: boolean }
): void {
  configuredTrustedRoots = roots.map((r) => {
    const resolved = path.resolve(r.path || r.rootPath || '');
    const canonical = getSafeRealPath(resolved);
    return {
      rootPath: resolved,
      canonicalPath: canonical,
      capabilities: new Set<WorkspaceCapability>(r.capabilities || ['READ', 'WRITE'])
    };
  });
  strictHostRootEnforcement = options?.strictHostEnforcement ?? true;
}

export function resetTrustedWorkspaceRoots(): void {
  configuredTrustedRoots = [];
  strictHostRootEnforcement = false;
}

export const clearTrustedWorkspaceRoots = resetTrustedWorkspaceRoots;

export function getApprovedRootPaths(): string[] {
  if (configuredTrustedRoots.length > 0) {
    return configuredTrustedRoots.map((r) => r.rootPath);
  }
  const envRoots = process.env.ALPER_DESIGN_OS_TRUSTED_ROOTS;
  if (envRoots && envRoots.trim().length > 0) {
    return envRoots
      .split(path.delimiter)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((p) => path.resolve(p));
  }
  return [path.resolve(process.cwd())];
}

export function withTrustedWorkspaceRoots<T>(
  roots: TrustedRootConfig[],
  fn: () => T,
  options?: { strictHostEnforcement?: boolean }
): T {
  const prevRoots = [...configuredTrustedRoots];
  const prevStrict = strictHostRootEnforcement;
  try {
    configureTrustedWorkspaceRoots(roots, {
      strictHostEnforcement: options?.strictHostEnforcement ?? true
    });
    return fn();
  } finally {
    configuredTrustedRoots = prevRoots;
    strictHostRootEnforcement = prevStrict;
  }
}

/**
 * Validates that an identifier (ADR id, runId, ruleId, snapshotId, etc.)
 * is strictly data and cannot traverse paths or inject shell/template expressions.
 */
export function assertSafeIdentifier(id: unknown, fieldName = 'id'): string {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new WorkspaceAuthorizationError(
      'INVALID_IDENTIFIER',
      `Invalid ${fieldName}: identifier must be a non-empty string.`,
      { requiredCapability: 'WRITE', requestedPath: String(id) }
    );
  }

  if (id.includes('\0') || id.includes('..') || id.includes('/') || id.includes('\\') || id.includes(':')) {
    throw new WorkspaceAuthorizationError(
      'PATH_TRAVERSAL_REJECTED',
      `Path traversal or separator rejected in ${fieldName}: '${id}'`,
      { requiredCapability: 'WRITE', requestedPath: id }
    );
  }

  if (WINDOWS_RESERVED_NAME_REGEX.test(id)) {
    throw new WorkspaceAuthorizationError(
      'WINDOWS_RESERVED_NAME',
      `Windows reserved device name rejected in ${fieldName}: '${id}'`,
      { requiredCapability: 'WRITE', requestedPath: id }
    );
  }

  if (!SAFE_IDENTIFIER_REGEX.test(id)) {
    throw new WorkspaceAuthorizationError(
      'INVALID_IDENTIFIER',
      `Unsafe characters rejected in ${fieldName}: '${id}'. Only alphanumeric, '.', '_', and '-' are allowed (1..128 chars).`,
      { requiredCapability: 'WRITE', requestedPath: id }
    );
  }

  return id;
}

/**
 * Checks that no segment from startDir down to targetPath is a symlink, junction, or reparse point.
 */
export function assertNoSymlinkOrReparseInChain(rootDir: string, targetPath?: string): void {
  const resolvedRoot = path.resolve(rootDir);

  // Check rootDir and its existing ancestors if rootDir itself is a symlink/junction
  if (fs.existsSync(resolvedRoot)) {
    const rootStat = fs.lstatSync(resolvedRoot);
    if (rootStat.isSymbolicLink()) {
      throw new WorkspaceAuthorizationError(
        'SYMLINK_OR_REPARSE_FORBIDDEN',
        `Workspace root '${resolvedRoot}' is a symbolic link or junction, which is forbidden by workspace boundary policy.`,
        { requiredCapability: 'WRITE', requestedPath: resolvedRoot }
      );
    }
  }

  if (!targetPath) return;

  const resolvedTarget = path.resolve(targetPath);
  const rel = path.relative(resolvedRoot, resolvedTarget);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new WorkspaceAuthorizationError(
      'PATH_TRAVERSAL_REJECTED',
      `Target path '${resolvedTarget}' escapes approved workspace boundary '${resolvedRoot}'.`,
      { requiredCapability: 'WRITE', requestedPath: resolvedTarget, approvedRoots: [resolvedRoot] }
    );
  }

  if (rel === '') return;

  const segments = rel.split(/[\\/]/).filter(Boolean);
  let current = resolvedRoot;
  for (const seg of segments) {
    if (WINDOWS_RESERVED_NAME_REGEX.test(seg)) {
      throw new WorkspaceAuthorizationError(
        'WINDOWS_RESERVED_NAME',
        `Invalid path segment: Windows reserved device name detected: '${seg}'`,
        { requiredCapability: 'WRITE', requestedPath: resolvedTarget, approvedRoots: [resolvedRoot] }
      );
    }
    current = path.join(current, seg);
    if (fs.existsSync(current)) {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink()) {
        throw new WorkspaceAuthorizationError(
          'SYMLINK_OR_REPARSE_FORBIDDEN',
          `Unsafe symlink/junction/reparse-point traversal rejected at '${current}'.`,
          { requiredCapability: 'WRITE', requestedPath: resolvedTarget, approvedRoots: [resolvedRoot] }
        );
      }
    } else {
      // Also check if a broken symlink exists at current
      try {
        const stat = fs.lstatSync(current);
        if (stat.isSymbolicLink()) {
          throw new WorkspaceAuthorizationError(
            'SYMLINK_OR_REPARSE_FORBIDDEN',
            `Broken symlink/reparse-point traversal rejected at '${current}'.`,
            { requiredCapability: 'WRITE', requestedPath: resolvedTarget, approvedRoots: [resolvedRoot] }
          );
        }
      } catch (err: any) {
        if (err instanceof WorkspaceAuthorizationError) throw err;
        // ENOENT is normal for not-yet-created path
      }
    }
  }

  // Verify realpath of deepest existing ancestor stays within realpath of resolvedRoot
  if (fs.existsSync(resolvedRoot)) {
    const realRoot = fs.realpathSync.native(resolvedRoot);
    const realTarget = getSafeRealPath(resolvedTarget);
    if (!isSubPathOrEqual(realRoot, realTarget)) {
      throw new WorkspaceAuthorizationError(
        'SYMLINK_OR_REPARSE_FORBIDDEN',
        `Canonical realpath '${realTarget}' escapes workspace realpath '${realRoot}'.`,
        { requiredCapability: 'WRITE', requestedPath: resolvedTarget, approvedRoots: [realRoot] }
      );
    }
  }
}

/**
 * Validates that a workspace baseDir / targetDirectory is authorized by host policy.
 */
export function assertAuthorizedWorkspaceRoot(
  baseDir: string,
  requiredCapability: WorkspaceCapability = 'WRITE'
): string {
  if (typeof baseDir !== 'string' || baseDir.trim().length === 0 || baseDir.includes('\0')) {
    throw new WorkspaceAuthorizationError(
      'WORKSPACE_AUTHORIZATION_REQUIRED',
      `Invalid workspace root path: '${String(baseDir)}'`,
      { requiredCapability, requestedPath: String(baseDir) }
    );
  }

  // Reject relative paths that traverse upward via '..' from process.cwd()
  if (!path.isAbsolute(baseDir)) {
    const normRel = path.normalize(baseDir);
    if (normRel.startsWith('..') || normRel.includes(`..${path.sep}`) || normRel.includes('../')) {
      throw new WorkspaceAuthorizationError(
        'PATH_TRAVERSAL_REJECTED',
        `WORKSPACE_AUTHORIZATION_REQUIRED: Relative baseDir '${baseDir}' cannot traverse outside current working directory.`,
        { requiredCapability, requestedPath: baseDir }
      );
    }
  }

  const resolvedBase = path.resolve(baseDir);
  const segments = resolvedBase.split(/[\\/]/).filter(Boolean);
  for (const seg of segments) {
    if (WINDOWS_RESERVED_NAME_REGEX.test(seg)) {
      throw new WorkspaceAuthorizationError(
        'WINDOWS_RESERVED_NAME',
        `Invalid target directory: Windows reserved device name detected: ${seg}`,
        { requiredCapability, requestedPath: resolvedBase }
      );
    }
  }

  // Never allow writing directly to filesystem root, OS directories, or bare home directory
  const parsedRoot = path.parse(resolvedBase).root;
  if (
    normalizeForComparison(resolvedBase) === normalizeForComparison(parsedRoot) ||
    normalizeForComparison(resolvedBase) === normalizeForComparison(os.homedir())
  ) {
    throw new WorkspaceAuthorizationError(
      'WORKSPACE_AUTHORIZATION_REQUIRED',
      `WORKSPACE_AUTHORIZATION_REQUIRED: Refusing operation on protected root or home directory '${resolvedBase}'.`,
      { requiredCapability, requestedPath: resolvedBase }
    );
  }

  assertNoSymlinkOrReparseInChain(resolvedBase);

  const realCandidate = getSafeRealPath(resolvedBase);

  // Check explicit host root configuration or ALPER_DESIGN_OS_TRUSTED_ROOTS env var
  const envRootsRaw = process.env.ALPER_DESIGN_OS_TRUSTED_ROOTS;
  const activeRoots: InternalTrustedRoot[] =
    configuredTrustedRoots.length > 0
      ? configuredTrustedRoots
      : envRootsRaw && envRootsRaw.trim().length > 0
      ? envRootsRaw
          .split(path.delimiter)
          .map((s) => s.trim())
          .filter(Boolean)
          .map((p) => {
            const res = path.resolve(p);
            return {
              rootPath: res,
              canonicalPath: getSafeRealPath(res),
              capabilities: new Set<WorkspaceCapability>(['READ', 'WRITE'])
            };
          })
      : [];

  if (strictHostRootEnforcement || activeRoots.length > 0) {
    const matchedRoot = activeRoots.find((r) => isSubPathOrEqual(r.canonicalPath, realCandidate));
    if (!matchedRoot) {
      throw new WorkspaceAuthorizationError(
        'WORKSPACE_AUTHORIZATION_REQUIRED',
        `WORKSPACE_AUTHORIZATION_REQUIRED: Target path '${resolvedBase}' is outside approved workspace roots [${activeRoots
          .map((r) => r.rootPath)
          .join(', ')}].`,
        {
          requiredCapability,
          requestedPath: resolvedBase,
          approvedRoots: activeRoots.map((r) => r.rootPath)
        }
      );
    }
    if (!matchedRoot.capabilities.has(requiredCapability)) {
      throw new WorkspaceAuthorizationError(
        'CAPABILITY_DENIED',
        `WORKSPACE_AUTHORIZATION_REQUIRED: Approved root '${matchedRoot.rootPath}' does not grant '${requiredCapability}' capability for '${resolvedBase}'.`,
        {
          requiredCapability,
          requestedPath: resolvedBase,
          approvedRoots: activeRoots.map((r) => r.rootPath)
        }
      );
    }
  }

  return resolvedBase;
}

/**
 * Resolves a relative path strictly inside an approved boundaryRoot.
 */
export function resolveWithinBoundary(
  boundaryRoot: string,
  relativeTarget: string,
  requiredCapability: WorkspaceCapability = 'WRITE'
): string {
  const authorizedRoot = assertAuthorizedWorkspaceRoot(boundaryRoot, requiredCapability);

  if (typeof relativeTarget !== 'string' || relativeTarget.trim().length === 0 || relativeTarget.includes('\0')) {
    throw new WorkspaceAuthorizationError(
      'PATH_TRAVERSAL_REJECTED',
      `Invalid relative path '${String(relativeTarget)}' inside boundary '${authorizedRoot}'.`,
      { requiredCapability, requestedPath: String(relativeTarget), approvedRoots: [authorizedRoot] }
    );
  }

  if (
    path.isAbsolute(relativeTarget) ||
    relativeTarget.startsWith('/') ||
    relativeTarget.startsWith('\\') ||
    /^[a-zA-Z]:/.test(relativeTarget)
  ) {
    throw new WorkspaceAuthorizationError(
      'PATH_TRAVERSAL_REJECTED',
      `Path traversal rejected: Absolute path forbidden in relative path '${relativeTarget}'.`,
      { requiredCapability, requestedPath: relativeTarget, approvedRoots: [authorizedRoot] }
    );
  }

  const rawSegments = relativeTarget.split(/[\\/]/);
  for (const seg of rawSegments) {
    if (seg === '..') {
      throw new WorkspaceAuthorizationError(
        'PATH_TRAVERSAL_REJECTED',
        `Path traversal rejected: '..' segment forbidden in '${relativeTarget}'.`,
        { requiredCapability, requestedPath: relativeTarget, approvedRoots: [authorizedRoot] }
      );
    }
    if (seg && WINDOWS_RESERVED_NAME_REGEX.test(seg)) {
      throw new WorkspaceAuthorizationError(
        'WINDOWS_RESERVED_NAME',
        `Invalid filename: Windows reserved device name detected: '${seg}'`,
        { requiredCapability, requestedPath: relativeTarget, approvedRoots: [authorizedRoot] }
      );
    }
  }

  const resolvedTarget = path.resolve(authorizedRoot, relativeTarget);
  assertNoSymlinkOrReparseInChain(authorizedRoot, resolvedTarget);

  return resolvedTarget;
}

/**
 * Acquires a filesystem lockfile inside boundaryRoot to serialize concurrent mutations.
 */
function acquireLockFile(boundaryRoot: string, timeoutMs = 5000): () => void {
  const lockDir = path.join(boundaryRoot, '.alper-design-os');
  if (!fs.existsSync(lockDir)) {
    fs.mkdirSync(lockDir, { recursive: true });
  }
  assertNoSymlinkOrReparseInChain(boundaryRoot, lockDir);

  const lockFile = path.join(lockDir, '.boundary-write.lock');
  const start = Date.now();

  while (true) {
    try {
      const fd = fs.openSync(lockFile, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY, 0o600);
      fs.writeFileSync(fd, `${process.pid}:${Date.now()}`);
      fs.closeSync(fd);
      return () => {
        try {
          if (fs.existsSync(lockFile)) {
            fs.unlinkSync(lockFile);
          }
        } catch {
          // Ignore cleanup errors
        }
      };
    } catch (err: any) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
      // Check if lock is stale (> 10s old)
      try {
        const stat = fs.statSync(lockFile);
        if (Date.now() - stat.mtimeMs > 10000) {
          fs.unlinkSync(lockFile);
          continue;
        }
      } catch {
        continue;
      }

      if (Date.now() - start > timeoutMs) {
        throw new WorkspaceAuthorizationError(
          'CONCURRENT_LOCK_TIMEOUT',
          `Timed out waiting for workspace write lock at '${lockFile}'.`,
          { requiredCapability: 'WRITE', requestedPath: boundaryRoot, approvedRoots: [boundaryRoot] }
        );
      }

      // Brief synchronous spin wait (1-5ms) using Atomics.wait on a shared dummy buffer
      const sab = new SharedArrayBuffer(4);
      const ia = new Int32Array(sab);
      Atomics.wait(ia, 0, 0, 2);
    }
  }
}

export interface WorkspaceTransactionContext {
  readonly rootDir: string;
  resolvePath(relativePath: string): string;
  ensureDir(relativeDir: string): string;
  mkdir(relativeDir: string): string;
  writeFile(relativePath: string, content: string | Buffer): string;
  writeJson(relativePath: string, data: unknown): string;
  readFile(relativePath: string): string;
  exists(relativePath: string): boolean;
}

/**
 * Executes a set of filesystem writes atomically within `boundaryRoot`.
 * If any step throws, all modified and created files in the transaction are rolled back
 * to their exact pre-transaction byte state.
 */
export function executeAtomicWorkspaceTransaction<T>(
  boundaryRoot: string,
  fn: (tx: WorkspaceTransactionContext) => T
): T {
  const authorizedRoot = assertAuthorizedWorkspaceRoot(boundaryRoot, 'WRITE');
  const rootExistedBefore = fs.existsSync(authorizedRoot);
  const alperDirPath = path.join(authorizedRoot, '.alper-design-os');
  const alperDirExistedBefore = fs.existsSync(alperDirPath);

  if (!rootExistedBefore) {
    fs.mkdirSync(authorizedRoot, { recursive: true });
  }
  assertNoSymlinkOrReparseInChain(authorizedRoot);

  const releaseLock = acquireLockFile(authorizedRoot);
  const fileBackups = new Map<string, Buffer | null>();
  const createdDirs: string[] = [];
  const tempFiles = new Set<string>();

  const ensureDirInternal = (relativeDir: string): string => {
    const targetDir = relativeDir === '.' || relativeDir === ''
      ? authorizedRoot
      : resolveWithinBoundary(authorizedRoot, relativeDir, 'WRITE');

    const rel = path.relative(authorizedRoot, targetDir);
    if (!rel) return authorizedRoot;

    const segments = rel.split(path.sep).filter(Boolean);
    let current = authorizedRoot;
    for (const seg of segments) {
      current = path.join(current, seg);
      if (!fs.existsSync(current)) {
        fs.mkdirSync(current);
        createdDirs.push(current);
      } else {
        const stat = fs.lstatSync(current);
        if (stat.isSymbolicLink()) {
          throw new WorkspaceAuthorizationError(
            'SYMLINK_OR_REPARSE_FORBIDDEN',
            `TOCTOU symlink/reparse violation detected on directory '${current}'.`,
            { requiredCapability: 'WRITE', requestedPath: current, approvedRoots: [authorizedRoot] }
          );
        }
      }
    }
    return targetDir;
  };

  const writeFileInternal = (relativePath: string, content: string | Buffer): string => {
    const targetPath = resolveWithinBoundary(authorizedRoot, relativePath, 'WRITE');
    const relParent = path.relative(authorizedRoot, path.dirname(targetPath));
    ensureDirInternal(relParent);

    // Re-verify target is not a symlink right before snapshotting/writing
    assertNoSymlinkOrReparseInChain(authorizedRoot, targetPath);

    if (!fileBackups.has(targetPath)) {
      if (fs.existsSync(targetPath)) {
        const stat = fs.lstatSync(targetPath);
        if (stat.isSymbolicLink()) {
          throw new WorkspaceAuthorizationError(
            'SYMLINK_OR_REPARSE_FORBIDDEN',
            `Refusing to overwrite symlink at '${targetPath}'.`,
            { requiredCapability: 'WRITE', requestedPath: targetPath, approvedRoots: [authorizedRoot] }
          );
        }
        fileBackups.set(targetPath, fs.readFileSync(targetPath));
      } else {
        fileBackups.set(targetPath, null);
      }
    }

    const tmpPath = `${targetPath}.tmp-${process.pid}-${++txCounter}-${crypto.randomBytes(6).toString('hex')}`;
    tempFiles.add(tmpPath);

    const buf = typeof content === 'string' ? Buffer.from(content, 'utf-8') : content;
    const fd = fs.openSync(tmpPath, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY, 0o600);
    try {
      fs.writeFileSync(fd, buf);
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }

    // Final TOCTOU verification before atomic rename
    assertNoSymlinkOrReparseInChain(authorizedRoot, targetPath);
    fs.renameSync(tmpPath, targetPath);
    tempFiles.delete(tmpPath);

    return targetPath;
  };

  const txContext: WorkspaceTransactionContext = {
    rootDir: authorizedRoot,
    resolvePath: (relPath: string) => resolveWithinBoundary(authorizedRoot, relPath, 'WRITE'),
    ensureDir: ensureDirInternal,
    mkdir: ensureDirInternal,
    writeFile: writeFileInternal,
    writeJson: (relPath: string, data: unknown) => writeFileInternal(relPath, JSON.stringify(data, null, 2)),
    readFile: (relPath: string) => {
      const p = resolveWithinBoundary(authorizedRoot, relPath, 'READ');
      return fs.readFileSync(p, 'utf-8');
    },
    exists: (relPath: string) => {
      const p = resolveWithinBoundary(authorizedRoot, relPath, 'READ');
      return fs.existsSync(p);
    }
  };

  try {
    return fn(txContext);
  } catch (err) {
    // 1. Clean up any lingering temp files
    for (const tmp of tempFiles) {
      try {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      } catch {
        // ignore
      }
    }

    // 2. Roll back modified / created files in reverse order
    const entries = Array.from(fileBackups.entries()).reverse();
    for (const [filePath, backupBuf] of entries) {
      try {
        if (backupBuf === null) {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } else {
          const restoreTmp = `${filePath}.rollback-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
          fs.writeFileSync(restoreTmp, backupBuf);
          fs.renameSync(restoreTmp, filePath);
        }
      } catch {
        // best-effort rollback
      }
    }

    // 3. Remove newly created empty directories in reverse order
    for (let i = createdDirs.length - 1; i >= 0; i--) {
      try {
        const d = createdDirs[i];
        if (fs.existsSync(d) && fs.readdirSync(d).length === 0) {
          fs.rmdirSync(d);
        }
      } catch {
        // ignore
      }
    }

    // Release lock before cleaning up .alper-design-os if it was created by lock acquisition
    releaseLock();

    if (!alperDirExistedBefore) {
      try {
        if (fs.existsSync(alperDirPath) && fs.readdirSync(alperDirPath).length === 0) {
          fs.rmdirSync(alperDirPath);
        }
      } catch {
        // ignore
      }
    }
    if (!rootExistedBefore) {
      try {
        if (fs.existsSync(authorizedRoot) && fs.readdirSync(authorizedRoot).length === 0) {
          fs.rmdirSync(authorizedRoot);
        }
      } catch {
        // ignore
      }
    }

    throw err;
  } finally {
    releaseLock();
  }
}
