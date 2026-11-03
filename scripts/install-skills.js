import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

/**
 * ALPER DESIGN OS - Host Skill Discovery & Installation Manager (Phase 3)
 * Validates all 74 repository SKILL.md files against the Agent Skills specification
 * and installs ONLY the 55 active skills into host discovery paths for Antigravity and Codex.
 * Deprecated aliases (19 skills) are retained strictly in skills/ for migration compatibility
 * and are NEVER exposed as selectable host skills.
 */

export function parseStrictSkillFrontmatter(markdownText, filePath = 'SKILL.md') {
  const normalized = markdownText.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    throw new Error(`Invalid SKILL.md (${filePath}): missing opening YAML frontmatter delimiter '---'`);
  }
  const endIdx = normalized.indexOf('\n---', 4);
  if (endIdx === -1) {
    throw new Error(`Invalid SKILL.md (${filePath}): missing closing YAML frontmatter delimiter '---'`);
  }

  const fmRaw = normalized.slice(4, endIdx);
  const lines = fmRaw.split('\n');
  const fields = {};
  let currentListKey = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && currentListKey) {
      fields[currentListKey].push(listMatch[1].trim());
      continue;
    }

    const kvMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!kvMatch) {
      throw new Error(`Invalid YAML frontmatter syntax at line ${i + 2} in ${filePath}: "${line}"`);
    }

    const key = kvMatch[1];
    const rawVal = kvMatch[2].trim();

    if (rawVal === '') {
      currentListKey = key;
      fields[key] = [];
      continue;
    }

    currentListKey = null;
    if (rawVal === '[]') {
      fields[key] = [];
      continue;
    }

    // Strict YAML scalar check: unquoted scalar cannot contain ': ' (colon followed by space)
    const isDoubleQuoted = rawVal.startsWith('"') && rawVal.endsWith('"');
    const isSingleQuoted = rawVal.startsWith("'") && rawVal.endsWith("'");
    if (!isDoubleQuoted && !isSingleQuoted && rawVal.includes(': ')) {
      throw new Error(
        `Invalid YAML frontmatter in ${filePath} (line ${i + 2}): unquoted colon in '${key}' value. Quote the scalar string.`
      );
    }

    if (isDoubleQuoted) {
      try {
        fields[key] = JSON.parse(rawVal);
      } catch {
        fields[key] = rawVal.slice(1, -1);
      }
    } else if (isSingleQuoted) {
      fields[key] = rawVal.slice(1, -1);
    } else if (rawVal === 'true') {
      fields[key] = true;
    } else if (rawVal === 'false') {
      fields[key] = false;
    } else {
      fields[key] = rawVal;
    }
  }

  if (!fields.name || typeof fields.name !== 'string') {
    throw new Error(`Invalid SKILL.md (${filePath}): missing required 'name' field`);
  }
  if (!fields.description || typeof fields.description !== 'string') {
    throw new Error(`Invalid SKILL.md (${filePath}): missing required 'description' field`);
  }

  return fields;
}

export function validateAllRepositorySkills(repoRoot = '.') {
  const resolvedRoot = path.resolve(repoRoot);
  const skillsDir = path.join(resolvedRoot, 'skills');
  if (!fs.existsSync(skillsDir)) {
    throw new Error(`Skills directory not found at ${skillsDir}`);
  }

  const dirs = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  const activeSkills = [];
  const deprecatedSkills = [];
  const errors = [];

  for (const dirName of dirs) {
    const skillMdPath = path.join(skillsDir, dirName, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) {
      errors.push({ skill: dirName, error: 'Missing SKILL.md' });
      continue;
    }

    try {
      const content = fs.readFileSync(skillMdPath, 'utf-8');
      const fm = parseStrictSkillFrontmatter(content, skillMdPath);
      if (fm.name !== dirName) {
        errors.push({ skill: dirName, error: `Frontmatter name '${fm.name}' does not match directory '${dirName}'` });
      }

      const refDir = path.join(skillsDir, dirName, 'references');
      const hasReferences = fs.existsSync(refDir);
      let referencesLinked = true;
      if (hasReferences) {
        const refFiles = fs.readdirSync(refDir).filter(f => f.endsWith('.md'));
        for (const rf of refFiles) {
          if (!content.includes(`references/${rf}`)) {
            referencesLinked = false;
            errors.push({ skill: dirName, error: `Unlinked reference file references/${rf}` });
          }
        }
      }

      if (fm.status === 'DEPRECATED' || fm.deprecated === true) {
        if (!fm.replacement) {
          errors.push({ skill: dirName, error: 'Deprecated skill missing replacement field' });
        }
        deprecatedSkills.push({
          name: dirName,
          description: fm.description,
          replacement: fm.replacement
        });
      } else {
        activeSkills.push({
          name: dirName,
          description: fm.description,
          capabilityFamily: fm.capabilityFamily,
          userFacing: fm.userFacing,
          hasReferences,
          referencesLinked
        });
      }
    } catch (err) {
      errors.push({ skill: dirName, error: err.message });
    }
  }

  return {
    valid: errors.length === 0 && dirs.length === 74 && activeSkills.length === 55 && deprecatedSkills.length === 19,
    totalCount: dirs.length,
    activeCount: activeSkills.length,
    deprecatedCount: deprecatedSkills.length,
    activeSkills,
    deprecatedSkills,
    errors
  };
}

export function installHostSkills(options = {}) {
  const repoRoot = options.repoRoot ? path.resolve(options.repoRoot) : path.resolve('.');
  const targetProjectRoot = options.targetProjectRoot ? path.resolve(options.targetProjectRoot) : repoRoot;
  const hosts = options.hosts || ['antigravity', 'codex'];
  const isGlobal = Boolean(options.global);

  const validation = validateAllRepositorySkills(repoRoot);
  if (!validation.valid) {
    throw new Error(
      `Cannot install skills: repository skill validation failed (${validation.errors.map(e => `${e.skill}: ${e.error}`).join('; ')})`
    );
  }

  const sourceSkillsDir = path.join(repoRoot, 'skills');
  const targetDirectories = [];

  if (isGlobal) {
    const home = options.homeDir || os.homedir();
    if (hosts.includes('antigravity')) {
      targetDirectories.push({ host: 'antigravity', scope: 'global', dir: path.join(home, '.gemini', 'config', 'skills') });
    }
    if (hosts.includes('codex')) {
      targetDirectories.push({ host: 'codex', scope: 'global', dir: path.join(home, '.agents', 'skills') });
    }
  } else {
    // Both Antigravity and Codex discover project skills from .agents/skills
    targetDirectories.push({
      host: hosts.join('+'),
      scope: 'project',
      dir: path.join(targetProjectRoot, '.agents', 'skills')
    });
  }

  const activeNames = new Set(validation.activeSkills.map(s => s.name));
  const deprecatedNames = new Set(validation.deprecatedSkills.map(s => s.name));
  let purgedDeprecatedCount = 0;

  for (const target of targetDirectories) {
    fs.mkdirSync(target.dir, { recursive: true });

    // 1. Purge any deprecated skill aliases from host discovery directory
    const existingEntries = fs.readdirSync(target.dir, { withFileTypes: true });
    for (const entry of existingEntries) {
      if (entry.isDirectory() && deprecatedNames.has(entry.name)) {
        fs.rmSync(path.join(target.dir, entry.name), { recursive: true, force: true });
        purgedDeprecatedCount++;
      }
    }

    // 2. Install ONLY the 55 active skills
    for (const active of validation.activeSkills) {
      const srcDir = path.join(sourceSkillsDir, active.name);
      const destDir = path.join(target.dir, active.name);
      fs.mkdirSync(destDir, { recursive: true });

      const srcSkillMd = path.join(srcDir, 'SKILL.md');
      fs.copyFileSync(srcSkillMd, path.join(destDir, 'SKILL.md'));

      const srcRefsDir = path.join(srcDir, 'references');
      if (fs.existsSync(srcRefsDir)) {
        const destRefsDir = path.join(destDir, 'references');
        fs.mkdirSync(destRefsDir, { recursive: true });
        for (const refFile of fs.readdirSync(srcRefsDir)) {
          fs.copyFileSync(path.join(srcRefsDir, refFile), path.join(destRefsDir, refFile));
        }
      }
    }
  }

  // 3. Install AGENTS.md rules for Antigravity (.agents/rules/AGENTS.md) and Codex (root AGENTS.md)
  const rulesSource = path.join(repoRoot, 'rules', 'AGENTS.md');
  if (!isGlobal && fs.existsSync(rulesSource)) {
    const agyRulesDir = path.join(targetProjectRoot, '.agents', 'rules');
    fs.mkdirSync(agyRulesDir, { recursive: true });
    fs.copyFileSync(rulesSource, path.join(agyRulesDir, 'AGENTS.md'));

    const rootAgentsMd = path.join(targetProjectRoot, 'AGENTS.md');
    if (options.syncRootAgentsMd || !fs.existsSync(rootAgentsMd)) {
      fs.copyFileSync(rulesSource, rootAgentsMd);
    }
  }

  // 4. Write host skill discovery manifest
  const manifestPath = path.join(targetProjectRoot, '.agents', 'skills-manifest.json');
  if (!isGlobal) {
    const manifest = {
      system: 'alper-design-os',
      installedAt: new Date().toISOString(),
      hosts,
      activeSelectableCount: validation.activeCount,
      deprecatedHiddenCount: validation.deprecatedCount,
      activeSkills: [...activeNames],
      deprecatedMigrationMap: Object.fromEntries(
        validation.deprecatedSkills.map(d => [d.name, d.replacement])
      )
    };
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  }

  return {
    success: true,
    hosts,
    installedActiveCount: validation.activeCount,
    excludedDeprecatedCount: validation.deprecatedCount,
    purgedDeprecatedCount,
    targetDirectories: targetDirectories.map(t => t.dir)
  };
}

export function verifyHostSkillDiscovery(options = {}) {
  const targetProjectRoot = options.targetProjectRoot ? path.resolve(options.targetProjectRoot) : path.resolve('.');
  const hostSkillsDir = path.join(targetProjectRoot, '.agents', 'skills');

  if (!fs.existsSync(hostSkillsDir)) {
    return {
      discovered: false,
      status: 'NOT_INSTALLED',
      activeDiscoveredCount: 0,
      deprecatedExposedCount: 0,
      yamlErrors: ['Host skill directory .agents/skills does not exist']
    };
  }

  const entries = fs.readdirSync(hostSkillsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  let activeDiscoveredCount = 0;
  let deprecatedExposedCount = 0;
  const yamlErrors = [];
  const discoveredSkills = [];

  for (const dirName of entries) {
    const skillMdPath = path.join(hostSkillsDir, dirName, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) {
      yamlErrors.push(`${dirName}: missing SKILL.md`);
      continue;
    }
    try {
      const content = fs.readFileSync(skillMdPath, 'utf-8');
      const fm = parseStrictSkillFrontmatter(content, skillMdPath);
      if (fm.status === 'DEPRECATED' || fm.deprecated === true) {
        deprecatedExposedCount++;
      } else {
        activeDiscoveredCount++;
        discoveredSkills.push(fm.name);
      }
    } catch (err) {
      yamlErrors.push(`${dirName}: ${err.message}`);
    }
  }

  const rootAgentsMdExists = fs.existsSync(path.join(targetProjectRoot, 'AGENTS.md'));
  const agyRulesExists = fs.existsSync(path.join(targetProjectRoot, '.agents', 'rules', 'AGENTS.md'));

  const isHealthy =
    activeDiscoveredCount === 55 &&
    deprecatedExposedCount === 0 &&
    yamlErrors.length === 0 &&
    rootAgentsMdExists &&
    agyRulesExists;

  return {
    discovered: isHealthy,
    status: isHealthy ? 'VERIFIED' : 'INCOMPLETE_OR_INVALID',
    activeDiscoveredCount,
    deprecatedExposedCount,
    rootAgentsMdExists,
    agyRulesExists,
    yamlErrors,
    discoveredSkills
  };
}

const isDirectRun = Boolean(
  process.argv[1] &&
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(fileURLToPath(import.meta.url)).toLowerCase()
);

if (isDirectRun || process.argv.includes('--run-direct')) {
  const isGlobal = process.argv.includes('--global');
  const res = installHostSkills({ global: isGlobal });
  console.log(`[+] Installed ${res.installedActiveCount} active skills (${res.excludedDeprecatedCount} deprecated aliases excluded) into: ${res.targetDirectories.join(', ')}`);
}
