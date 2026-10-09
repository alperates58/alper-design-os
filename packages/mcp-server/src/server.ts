import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import * as Tools from './tools/index.js';
import * as T from './types.js';

export function createAlperDesignServer(): Server {
  const server = new Server(
    {
      name: 'alper-design-os',
      version: '0.1.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  const toolDefinitions: Tool[] = [
    {
      name: 'analyze_project',
      description: 'Performs read-only comprehensive stack, UI, and accessibility analysis on an existing project.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string', description: 'Path to directory to inspect' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'detect_stack',
      description: 'Quickly detects project languages, frameworks, styling libraries, and package managers.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string', description: 'Path to inspect' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'understand_product',
      description: 'Infuses product brief with Domain Intelligence and outputs a structured ProductUXProfile.',
      inputSchema: {
        type: 'object',
        properties: {
          productName: { type: 'string' },
          description: { type: 'string' },
          domain: { type: 'string' },
          targetUsers: { type: 'array', items: { type: 'string' } },
          keyFeatures: { type: 'array', items: { type: 'string' } },
          operatingEnvironment: { type: 'string' }
        },
        required: ['productName', 'description']
      }
    },
    {
      name: 'research_domain',
      description: 'Extracts domain classification, mental models, typical personas, and workflows for any software domain.',
      inputSchema: {
        type: 'object',
        properties: {
          domainQuery: { type: 'string', description: 'Domain name or topic (e.g. Finite capacity scheduling, ERP)' }
        },
        required: ['domainQuery']
      }
    },
    {
      name: 'recommend_ux_patterns',
      description: 'Recommends core UX patterns matched to density and interaction style.',
      inputSchema: {
        type: 'object',
        properties: {
          density: { type: 'string', enum: ['EXTREME', 'HIGH', 'MEDIUM', 'SPACIOUS'] },
          interactionStyle: { type: 'string', enum: ['KEYBOARD_FIRST', 'HYBRID_MOUSE_KEYBOARD', 'TOUCH_OPTIMIZED', 'GUIDED_WIZARD'] }
        }
      }
    },
    {
      name: 'search_design_patterns',
      description: 'Searches the core UX pattern catalog (Gantt, High-density grids, Split panes, etc.).',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' }
        },
        required: ['query']
      }
    },
    {
      name: 'search_components',
      description: 'Inspects available adapter components implementing a specific pattern.',
      inputSchema: {
        type: 'object',
        properties: {
          patternId: { type: 'string' },
          adapterId: { type: 'string' }
        },
        required: ['patternId']
      }
    },
    {
      name: 'get_design_tokens',
      description: 'Compiles technology-agnostic DTCG tokens into target format (css, scss, typescript, tailwind-json).',
      inputSchema: {
        type: 'object',
        properties: {
          format: { type: 'string', enum: ['css', 'scss', 'typescript', 'tailwind-json'], default: 'css' }
        }
      }
    },
    {
      name: 'create_design_plan',
      description: 'Generates a phased design execution plan for NEW, REPAIR, or MODERNIZE workflows.',
      inputSchema: {
        type: 'object',
        properties: {
          mode: { type: 'string', enum: ['NEW', 'REPAIR', 'MODERNIZE'] },
          productName: { type: 'string' },
          adapterId: { type: 'string' },
          briefOrProfile: { type: 'object' }
        },
        required: ['mode', 'productName', 'adapterId', 'briefOrProfile']
      }
    },
    {
      name: 'audit_existing_ui',
      description: 'Audits existing stylesheets and markup for token violations and overflow bugs.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'audit_accessibility',
      description: 'Checks markup for WCAG 2.1 AA/AAA compliance issues (contrast, labels, aria).',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          targetLevel: { type: 'string', enum: ['WCAG_2_1_AA', 'WCAG_2_1_AAA'], default: 'WCAG_2_1_AA' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'audit_responsive',
      description: 'Evaluates layout responsiveness and split pane flexibility.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'recommend_modernization',
      description: 'Generates an incremental 4-phase modernization strategy for legacy codebases.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          targetAdapter: { type: 'string' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'search_public_apis',
      description: 'Discovers verified public APIs from the public-apis index for data modeling.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          category: { type: 'string' }
        },
        required: ['query']
      }
    },
    {
      name: 'search_mcp_servers',
      description: 'Discovers verified MCP servers from the awesome-mcp-servers index.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          category: { type: 'string' }
        },
        required: ['query']
      }
    }
  ];

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: toolDefinitions };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    try {
      let result: unknown;

      switch (name) {
        case 'analyze_project':
          result = Tools.handleAnalyzeProject(T.AnalyzeProjectInputSchema.parse(args));
          break;
        case 'detect_stack':
          result = Tools.handleDetectStack(T.DetectStackInputSchema.parse(args));
          break;
        case 'understand_product':
          result = Tools.handleUnderstandProduct(T.UnderstandProductInputSchema.parse(args));
          break;
        case 'research_domain':
          result = Tools.handleResearchDomain(T.ResearchDomainInputSchema.parse(args));
          break;
        case 'recommend_ux_patterns':
          result = Tools.handleRecommendUXPatterns(T.RecommendUXPatternsInputSchema.parse(args));
          break;
        case 'search_design_patterns':
          result = Tools.handleSearchDesignPatterns(T.SearchDesignPatternsInputSchema.parse(args));
          break;
        case 'search_components':
          result = Tools.handleSearchComponents(T.SearchComponentsInputSchema.parse(args));
          break;
        case 'get_design_tokens':
          result = Tools.handleGetDesignTokens(T.GetDesignTokensInputSchema.parse(args));
          break;
        case 'create_design_plan':
          result = Tools.handleCreateDesignPlan(T.CreateDesignPlanInputSchema.parse(args));
          break;
        case 'audit_existing_ui':
          result = Tools.handleAuditExistingUI(T.AuditExistingUIInputSchema.parse(args));
          break;
        case 'audit_accessibility':
          result = Tools.handleAuditAccessibility(T.AuditAccessibilityInputSchema.parse(args));
          break;
        case 'audit_responsive':
          result = Tools.handleAuditResponsive(T.AuditResponsiveInputSchema.parse(args));
          break;
        case 'recommend_modernization':
          result = Tools.handleRecommendModernization(T.RecommendModernizationInputSchema.parse(args));
          break;
        case 'search_public_apis':
          result = Tools.handleSearchPublicApis(T.SearchPublicApisInputSchema.parse(args));
          break;
        case 'search_mcp_servers':
          result = Tools.handleSearchMcpServers(T.SearchMcpServersInputSchema.parse(args));
          break;
        default:
          throw new Error(`Tool not found: ${name}`);
      }

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
