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
    },
    {
      name: 'discover_sources',
      description: 'Discovers world-class design systems, component libraries, and accessibility standards with filtering.',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          framework: { type: 'string' },
          domain: { type: 'string' },
          accessibilityLevel: { type: 'string' },
          minTrustScore: { type: 'number' },
          searchQuery: { type: 'string' }
        }
      }
    },
    {
      name: 'search_sources',
      description: 'Full-text ranked search across the open-source design systems and knowledge catalog.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          framework: { type: 'string' },
          domain: { type: 'string' }
        },
        required: ['query']
      }
    },
    {
      name: 'rank_sources',
      description: 'Scores and ranks design system sources using weighted multi-criteria algorithms.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          domain: { type: 'string' },
          requirePermissiveLicense: { type: 'boolean' }
        }
      }
    },
    {
      name: 'inspect_source',
      description: 'Inspects full normalized metadata for a specific design system, library, or standard.',
      inputSchema: {
        type: 'object',
        properties: {
          sourceId: { type: 'string' }
        },
        required: ['sourceId']
      }
    },
    {
      name: 'recommend_sources_for_product',
      description: 'Recommends matching design systems and guidelines based on a ProductUXProfile or product brief.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          productName: { type: 'string' },
          description: { type: 'string' },
          domain: { type: 'string' }
        }
      }
    },
    {
      name: 'recommend_sources_for_stack',
      description: 'Recommends design systems and component libraries tailored to a specific tech stack (React, Blade, Razor, etc.).',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          domain: { type: 'string' }
        },
        required: ['framework']
      }
    },
    {
      name: 'check_source_license',
      description: 'Checks software license compliance, commercial usage permissions, and attribution requirements.',
      inputSchema: {
        type: 'object',
        properties: {
          license: { type: 'string' }
        },
        required: ['license']
      }
    },
    {
      name: 'generate_engineering_policy',
      description: 'Generates stack-aware EngineeringQualityProfile (security, quality, performance budgets, release gates).',
      inputSchema: {
        type: 'object',
        properties: {
          stack: { type: 'string' },
          securityLevel: { type: 'string', enum: ['STANDARD', 'HIGH', 'CRITICAL'] },
          targetEnvironment: { type: 'string' }
        },
        required: ['stack']
      }
    },
    {
      name: 'evaluate_release_gates',
      description: 'Evaluates security, code quality, dependency, and secret findings against release gates.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          staticIssues: { type: 'array', items: { type: 'object' } },
          dynamicIssues: { type: 'array', items: { type: 'object' } },
          vulnerableDependencies: { type: 'array', items: { type: 'object' } },
          detectedSecrets: { type: 'array', items: { type: 'object' } }
        }
      }
    },
    {
      name: 'generate_threat_model',
      description: 'Generates STRIDE threat model with asset, boundary, and mitigation mapping.',
      inputSchema: {
        type: 'object',
        properties: {
          systemName: { type: 'string' },
          architecture: { type: 'string' },
          dataAssets: { type: 'array', items: { type: 'string' } },
          externalInterfaces: { type: 'array', items: { type: 'string' } }
        },
        required: ['systemName']
      }
    },
    {
      name: 'detect_tool_capabilities',
      description: 'Detects available security, linting, testing, and profiling tools on host machine.',
      inputSchema: {
        type: 'object',
        properties: {
          targetTools: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    {
      name: 'run_safe_security_scan',
      description: 'Executes safe passive code security scan. Active DAST requires targetUrl and activeScanApproved=true.',
      inputSchema: {
        type: 'object',
        properties: {
          targetDir: { type: 'string' },
          activeScanApproved: { type: 'boolean' },
          targetUrl: { type: 'string' }
        },
        required: ['targetDir']
      }
    },
    {
      name: 'generate_user_journeys',
      description: 'Synthesizes persona-driven user journeys from ProductUXProfile or product requirements.',
      inputSchema: {
        type: 'object',
        properties: {
          productName: { type: 'string' },
          description: { type: 'string' },
          domain: { type: 'string' }
        },
        required: ['productName', 'description']
      }
    },
    {
      name: 'generate_playwright_test',
      description: 'Generates resilient Playwright test script using accessible role locators and viewport matrix.',
      inputSchema: {
        type: 'object',
        properties: {
          journeyTitle: { type: 'string' },
          targetUrl: { type: 'string' },
          steps: { type: 'array', items: { type: 'object' } }
        },
        required: ['journeyTitle', 'targetUrl', 'steps']
      }
    },
    {
      name: 'generate_qa_report',
      description: 'Generates comprehensive QA verification report (markdown and JSON) with unverified areas prominently noted.',
      inputSchema: {
        type: 'object',
        properties: {
          targetApplication: { type: 'string' },
          testedFlows: { type: 'array', items: { type: 'string' } },
          consoleErrors: { type: 'array', items: { type: 'object' } },
          networkFailures: { type: 'array', items: { type: 'object' } },
          accessibilityFindings: { type: 'array', items: { type: 'string' } },
          visualDiffs: { type: 'array', items: { type: 'object' } },
          unverifiedAreas: { type: 'array', items: { type: 'string' } }
        },
        required: ['targetApplication']
      }
    },
    {
      name: 'generate_test_pyramid',
      description: 'Generates context-aware testing strategy pyramid based on application archetype.',
      inputSchema: {
        type: 'object',
        properties: {
          projectName: { type: 'string' },
          projectType: { type: 'string', enum: ['LANDING_PAGE', 'ENTERPRISE_ERP_CRM', 'MICROSERVICE_API', 'STANDARD_WEB'] }
        },
        required: ['projectName', 'projectType']
      }
    },
    {
      name: 'analyze_architecture',
      description: 'Detects architectural style, subsystem boundaries, coupling, and circular dependencies.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'generate_adr',
      description: 'Generates Architecture Decision Record (ADR) document with context, decision, and trade-offs.',
      inputSchema: {
        type: 'object',
        properties: {
          number: { type: 'number' },
          title: { type: 'string' },
          context: { type: 'string' },
          decision: { type: 'string' },
          consequences: { type: 'object' }
        },
        required: ['number', 'title', 'context', 'decision', 'consequences']
      }
    },
    {
      name: 'analyze_database_schema',
      description: 'Detects database engine, classifies migration safety (SAFE/REVIEW/DANGEROUS), and checks N+1 query hazards.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          migrationContent: { type: 'string' },
          querySample: { type: 'string' }
        }
      }
    },
    {
      name: 'evaluate_api_compatibility',
      description: 'Evaluates OpenAPI/AsyncAPI specifications for breaking changes, removed endpoints, and altered payloads.',
      inputSchema: {
        type: 'object',
        properties: {
          oldSpec: { type: 'string' },
          newSpec: { type: 'string' },
          specType: { type: 'string', enum: ['OPENAPI', 'ASYNCAPI'], default: 'OPENAPI' }
        },
        required: ['oldSpec', 'newSpec']
      }
    },
    {
      name: 'classify_code_paths',
      description: 'Classifies repository file paths into SOURCE, GENERATED, VENDORED, BUILD_OUTPUT, MIGRATION, or CONFIGURATION.',
      inputSchema: {
        type: 'object',
        properties: {
          paths: { type: 'array', items: { type: 'string' } }
        },
        required: ['paths']
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
        case 'discover_sources':
          result = Tools.handleDiscoverSources(T.DiscoverSourcesInputSchema.parse(args));
          break;
        case 'search_sources':
          result = Tools.handleSearchSources(T.SearchSourcesInputSchema.parse(args));
          break;
        case 'rank_sources':
          result = Tools.handleRankSources(T.RankSourcesInputSchema.parse(args));
          break;
        case 'inspect_source':
          result = Tools.handleInspectSource(T.InspectSourceInputSchema.parse(args));
          break;
        case 'recommend_sources_for_product':
          result = Tools.handleRecommendSourcesForProduct(T.RecommendSourcesForProductInputSchema.parse(args));
          break;
        case 'recommend_sources_for_stack':
          result = Tools.handleRecommendSourcesForStack(T.RecommendSourcesForStackInputSchema.parse(args));
          break;
        case 'check_source_license':
          result = Tools.handleCheckSourceLicense(T.CheckSourceLicenseInputSchema.parse(args));
          break;
        case 'generate_engineering_policy':
          result = Tools.handleGenerateEngineeringPolicy(T.GenerateEngineeringPolicyInputSchema.parse(args));
          break;
        case 'evaluate_release_gates':
          result = Tools.handleEvaluateReleaseGates(T.EvaluateReleaseGatesInputSchema.parse(args));
          break;
        case 'generate_threat_model':
          result = Tools.handleGenerateThreatModel(T.GenerateThreatModelInputSchema.parse(args));
          break;
        case 'detect_tool_capabilities':
          result = await Tools.handleDetectToolCapabilities(T.DetectToolCapabilitiesInputSchema.parse(args));
          break;
        case 'run_safe_security_scan':
          result = await Tools.handleRunSafeSecurityScan(T.RunSafeSecurityScanInputSchema.parse(args));
          break;
        case 'generate_user_journeys':
          result = Tools.handleGenerateUserJourneys(T.GenerateUserJourneysInputSchema.parse(args));
          break;
        case 'generate_playwright_test':
          result = Tools.handleGeneratePlaywrightTest(T.GeneratePlaywrightTestInputSchema.parse(args));
          break;
        case 'generate_qa_report':
          result = Tools.handleGenerateQAReport(T.GenerateQAReportInputSchema.parse(args));
          break;
        case 'generate_test_pyramid':
          result = Tools.handleGenerateTestPyramid(T.GenerateTestPyramidInputSchema.parse(args));
          break;
        case 'analyze_architecture':
          result = Tools.handleAnalyzeArchitecture(T.AnalyzeArchitectureInputSchema.parse(args));
          break;
        case 'generate_adr':
          result = Tools.handleGenerateADR(T.GenerateADRInputSchema.parse(args));
          break;
        case 'analyze_database_schema':
          result = Tools.handleAnalyzeDatabaseSchema(T.AnalyzeDatabaseSchemaInputSchema.parse(args));
          break;
        case 'evaluate_api_compatibility':
          result = Tools.handleEvaluateAPICompatibility(T.EvaluateAPICompatibilityInputSchema.parse(args));
          break;
        case 'classify_code_paths':
          result = Tools.handleClassifyCodePaths(T.ClassifyCodePathsInputSchema.parse(args));
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
