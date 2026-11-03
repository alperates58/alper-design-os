import { z } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import {
  CANONICAL_TOOL_DEFINITIONS,
  canonicalToolRegistry,
  toolRegistry,
  McpToolDefinition
} from './tools/index.js';

export { CANONICAL_TOOL_DEFINITIONS, canonicalToolRegistry, toolRegistry };
export type { McpToolDefinition };

export const SUPPORTED_MCP_PROTOCOL_VERSIONS = [
  '2024-11-05',
  '2025-03-26',
  '2025-06-18',
  '2025-11-25',
  '2026-03-26'
] as const;

export const ServerDiscoverRequestSchema = z.object({
  method: z.literal('server/discover'),
  params: z
    .object({
      protocolVersion: z.string().optional(),
      clientInfo: z
        .object({
          name: z.string().optional(),
          version: z.string().optional()
        })
        .passthrough()
        .optional(),
      capabilities: z.record(z.unknown()).optional()
    })
    .passthrough()
    .optional()
});

export const TOOL_DEFINITIONS: Tool[] = CANONICAL_TOOL_DEFINITIONS.map((def) => ({
  name: def.name,
  description: def.description,
  inputSchema: def.inputSchema
}));

export function getToolDefinitions(): Tool[] {
  return Array.from(canonicalToolRegistry.values()).map((def) => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema
  }));
}

export function getRegisteredToolCount(): number {
  return canonicalToolRegistry.size;
}

export async function dispatchCanonicalToolCall(
  name: string,
  rawArgs: unknown = {}
): Promise<unknown> {
  const toolDef = canonicalToolRegistry.get(name);
  if (!toolDef) {
    throw new Error(`Unknown tool: ${name} (Tool not found in canonicalToolRegistry)`);
  }
  const parsedArgs = toolDef.parser(rawArgs ?? {});
  return await toolDef.handler(parsedArgs);
}

export function createAlperDesignServer(): Server {
  const server = new Server(
    {
      name: 'alper-design-os',
      version: '1.0.0-rc.1'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  server.setRequestHandler(ServerDiscoverRequestSchema, async (request) => {
    const requestedVersion = request.params?.protocolVersion;
    const negotiatedVersion =
      requestedVersion && (SUPPORTED_MCP_PROTOCOL_VERSIONS as readonly string[]).includes(requestedVersion)
        ? requestedVersion
        : '2025-11-25';

    return {
      protocolVersion: negotiatedVersion,
      supportedProtocolVersions: [...SUPPORTED_MCP_PROTOCOL_VERSIONS],
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'alper-design-os',
        version: '1.0.0-rc.1'
      },
      toolsCount: getRegisteredToolCount()
    };
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: getToolDefinitions() };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    try {
      const result = await dispatchCanonicalToolCall(name, args);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing tool '${name}': ${err.message}`
          }
        ],
        isError: true
      };
    }
  });

  return server;
}
