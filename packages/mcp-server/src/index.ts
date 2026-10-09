#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAlperDesignServer } from './server.js';

export * from './types.js';
export * from './server.js';
export * from './tools/index.js';

async function main() {
  const server = createAlperDesignServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error('[Alper Design OS MCP Server] Stdio transport connected.');
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  main().catch((error) => {
    console.error('[Alper Design OS MCP Server] Fatal error:', error);
    process.exit(1);
  });
}
