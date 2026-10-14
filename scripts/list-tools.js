import { CANONICAL_TOOL_DEFINITIONS } from '../packages/mcp-server/src/server.ts';

const names = CANONICAL_TOOL_DEFINITIONS.map(t => t.name).sort();
console.log('Total Canonical MCP Tools:', names.length);
console.log(JSON.stringify(names, null, 2));
