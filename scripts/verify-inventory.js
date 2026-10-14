import fs from 'node:fs';
import path from 'node:path';
import { SKILL_MIGRATION_MAP, CAPABILITY_FAMILIES } from './skill-standard.js';

const skillsDir = path.resolve('skills');
const existing = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const mappedKeys = Object.keys(SKILL_MIGRATION_MAP);
const unmapped = existing.filter(s => !mappedKeys.includes(s));
const newSkills = mappedKeys.filter(k => !existing.includes(k));

console.log('--- SKILL INVENTORY AUDIT ---');
console.log('Total directories in skills/:', existing.length);
console.log('Total mapped entries in standard:', mappedKeys.length);
console.log('Unmapped directories:', unmapped);
console.log('New canonical skills to be created:', newSkills);

const activeSkills = mappedKeys.filter(k => !SKILL_MIGRATION_MAP[k].deprecated);
const deprecatedSkills = mappedKeys.filter(k => SKILL_MIGRATION_MAP[k].deprecated);

console.log('Active canonical skills count:', activeSkills.length);
console.log('Deprecated skills count:', deprecatedSkills.length);
console.log('Capability families count:', CAPABILITY_FAMILIES.length);

import { CANONICAL_TOOL_DEFINITIONS } from '../packages/mcp-server/src/server.ts';

const canonicalToolNames = new Set(CANONICAL_TOOL_DEFINITIONS.map(t => t.name));
console.log('Total Canonical MCP Tools:', canonicalToolNames.size);

const mappedToolNames = new Set();
for (const [skillName, meta] of Object.entries(SKILL_MIGRATION_MAP)) {
  for (const t of (meta.mcpTools || [])) {
    mappedToolNames.add(t);
  }
}

const unreachedCanonicalTools = [...canonicalToolNames].filter(t => !mappedToolNames.has(t));
const unknownMappedTools = [...mappedToolNames].filter(t => !canonicalToolNames.has(t));

console.log('--- TOOL REACHABILITY AUDIT ---');
console.log('Tools directly mapped to active skills:', mappedToolNames.size);
console.log('Unreached Canonical MCP Tools:', unreachedCanonicalTools);
console.log('Unknown Mapped Tools (not in server):', unknownMappedTools);

