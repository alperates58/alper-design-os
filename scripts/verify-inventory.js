import fs from 'node:fs';
import path from 'node:path';
import {
  CANONICAL_SKILL_CATALOG,
  ALL_ACTIVE_SKILLS,
  DEPRECATED_SKILLS,
  USER_ENTRYPOINT_SKILLS,
  INTERNAL_ORCHESTRATION_SKILLS,
  CAPABILITY_FAMILIES
} from '../packages/agent-governance/src/skill-registry.ts';
import { CANONICAL_TOOL_DEFINITIONS } from '../packages/mcp-server/src/server.ts';

const skillsDir = path.resolve('skills');
const existing = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const mappedKeys = Object.keys(CANONICAL_SKILL_CATALOG);
const unmapped = existing.filter(s => !mappedKeys.includes(s));

console.log('--- CANONICAL SKILL REGISTRY AUDIT ---');
console.log('Total directories in skills/:', existing.length);
console.log('Total entries in canonical registry:', mappedKeys.length);
console.log('Unmapped directories:', unmapped);
console.log('Active canonical skills:', ALL_ACTIVE_SKILLS.length);
console.log('Deprecated skills:', DEPRECATED_SKILLS.length);
console.log('User Entrypoints (userFacing: true):', USER_ENTRYPOINT_SKILLS.length);
console.log('Internal / Supporting (userFacing: false):', INTERNAL_ORCHESTRATION_SKILLS.length);
console.log('Capability families count:', CAPABILITY_FAMILIES.length);

const canonicalToolNames = new Set(CANONICAL_TOOL_DEFINITIONS.map(t => t.name));
console.log('Total Canonical MCP Tools:', canonicalToolNames.size);

const mappedToolNames = new Set();
for (const skill of Object.values(CANONICAL_SKILL_CATALOG)) {
  if (skill.status === 'ACTIVE' && skill.mcpTools) {
    for (const t of skill.mcpTools) {
      mappedToolNames.add(t);
    }
  }
}

const unreachedCanonicalTools = [...canonicalToolNames].filter(t => !mappedToolNames.has(t));
const unknownMappedTools = [...mappedToolNames].filter(t => !canonicalToolNames.has(t));

console.log('--- TOOL REACHABILITY AUDIT ---');
console.log('Tools directly mapped to active skills:', mappedToolNames.size);
console.log('Unreached Canonical MCP Tools:', unreachedCanonicalTools);
console.log('Unknown Mapped Tools (not in server):', unknownMappedTools);
