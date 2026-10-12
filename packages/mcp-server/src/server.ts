import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import * as Tools from './tools/index.js';
import * as T from './types.js';

export const TOOL_DEFINITIONS: Tool[] = [
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
    },
    {
      name: 'create_action_plan',
      description: 'Generates a validated AgentActionPlan with blast radius, forbidden files, rollback strategies, and mandatory verification.',
      inputSchema: {
        type: 'object',
        properties: {
          objective: { type: 'string' },
          requestedScope: { type: 'array', items: { type: 'string' } },
          filesExpectedToChange: { type: 'array', items: { type: 'string' } },
          filesForbiddenToChange: { type: 'array', items: { type: 'string' } },
          detectedProject: { type: 'object' }
        },
        required: ['objective', 'requestedScope', 'filesExpectedToChange']
      }
    },
    {
      name: 'evaluate_scope',
      description: 'Audits proposed file modifications against requested scope boundaries to prevent uninvited silent expansion.',
      inputSchema: {
        type: 'object',
        properties: {
          filesToChange: { type: 'array', items: { type: 'string' } },
          requestedScope: { type: 'array', items: { type: 'string' } },
          forbiddenList: { type: 'array', items: { type: 'string' } }
        },
        required: ['filesToChange', 'requestedScope']
      }
    },
    {
      name: 'evaluate_change_risk',
      description: 'Evaluates change blast radius across 10 safety dimensions and triggers mandatory checkpoints for high/critical risks.',
      inputSchema: {
        type: 'object',
        properties: {
          fileCount: { type: 'number' },
          architectureImpact: { type: 'boolean' },
          databaseImpact: { type: 'boolean' },
          authenticationImpact: { type: 'boolean' },
          authorizationImpact: { type: 'boolean' },
          publicApiImpact: { type: 'boolean' },
          dependencyImpact: { type: 'boolean' },
          configurationImpact: { type: 'boolean' },
          deploymentImpact: { type: 'boolean' },
          dataLossPossibility: { type: 'boolean' }
        }
      }
    },
    {
      name: 'create_checkpoint_plan',
      description: 'Inspects git status, guards uncommitted user work, and creates a safe pre-change checkpoint and rollback script.',
      inputSchema: {
        type: 'object',
        properties: {
          gitStatusText: { type: 'string' },
          taskName: { type: 'string' },
          currentBranch: { type: 'string' }
        },
        required: ['gitStatusText', 'taskName']
      }
    },
    {
      name: 'create_verification_plan',
      description: 'Generates a dynamic verification pipeline scaled to project archetype, UI context, and risk level.',
      inputSchema: {
        type: 'object',
        properties: {
          objective: { type: 'string' },
          isUI: { type: 'boolean' },
          isSecuritySensitive: { type: 'boolean' },
          riskLevel: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] }
        },
        required: ['objective']
      }
    },
    {
      name: 'normalize_verification_evidence',
      description: 'Normalizes heterogeneous verification artifacts into typed VerificationEvidence supporting 13 evidence types.',
      inputSchema: {
        type: 'object',
        properties: {
          rawItems: { type: 'array', items: { type: 'object' } }
        },
        required: ['rawItems']
      }
    },
    {
      name: 'review_change',
      description: 'Conducts independent reviewer audit across 12 criteria (scope, security, tests, console, network) yielding a verdict.',
      inputSchema: {
        type: 'object',
        properties: {
          taskObjective: { type: 'string' },
          diffContent: { type: 'string' },
          filesChanged: { type: 'array', items: { type: 'string' } },
          testOutput: { type: 'string' },
          testsPassed: { type: 'boolean' },
          consoleErrors: { type: 'array', items: { type: 'string' } },
          networkErrors: { type: 'array', items: { type: 'string' } },
          securityFindings: { type: 'array', items: { type: 'object' } }
        },
        required: ['taskObjective', 'diffContent', 'filesChanged']
      }
    },
    {
      name: 'detect_regression',
      description: 'Compares current routes, APIs, components, and database invariants against baseline snapshots to detect regression.',
      inputSchema: {
        type: 'object',
        properties: {
          baselines: { type: 'array', items: { type: 'object' } },
          currentStates: { type: 'array', items: { type: 'object' } }
        },
        required: ['baselines', 'currentStates']
      }
    },
    {
      name: 'create_environment_profile',
      description: 'Inspects project lockfiles, runtime versions, required env vars, and machine-specific path portability issues.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'route_context',
      description: 'Filters and scopes agent context to load only required skills, rules, sources, and tools to conserve token budget.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string' },
          taskBrief: { type: 'string' },
          detectedStack: { type: 'string' },
          domain: { type: 'string' },
          mode: { type: 'string', enum: ['NEW', 'REPAIR', 'MODERNIZE'] }
        },
        required: ['taskId', 'taskBrief']
      }
    },
    {
      name: 'route_tool',
      description: 'Intelligently selects the optimal tool based on capability, cost, latency, risk, offline status, and safety.',
      inputSchema: {
        type: 'object',
        properties: {
          taskDescription: { type: 'string' },
          isOffline: { type: 'boolean' },
          requireLiveBrowser: { type: 'boolean' }
        },
        required: ['taskDescription']
      }
    },
    {
      name: 'create_execution_journal',
      description: 'Creates machine-readable execution journal in .alper-design-os/runs/<run-id>/ with sanitized secrets.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          runId: { type: 'string' },
          plan: { type: 'object' },
          projectProfile: { type: 'object' },
          actions: { type: 'array', items: { type: 'object' } },
          verification: { type: 'object' },
          evidence: { type: 'array', items: { type: 'object' } },
          review: { type: 'object' },
          summaryMarkdown: { type: 'string' }
        },
        required: ['baseDir', 'runId', 'plan']
      }
    },
    {
      name: 'evaluate_completion_claim',
      description: 'Validates completion assertion against verified evidence, preventing unbacked claims like "tamamen test edildi".',
      inputSchema: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          evidences: { type: 'array', items: { type: 'object' } }
        },
        required: ['claim']
      }
    },
    {
      name: 'discover_design_sources',
      description: 'Discovers authoritative design systems, component libraries, registries, icon sets, charts, and data grids with multi-criteria filtering.',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          types: { type: 'array', items: { type: 'string' } },
          framework: { type: 'string' },
          domain: { type: 'string' },
          accessibilityLevel: { type: 'string' },
          minTrustScore: { type: 'number' },
          maxLicenseRisk: { type: 'string', enum: ['PERMISSIVE_ONLY', 'ANY'] },
          searchQuery: { type: 'string' }
        }
      }
    },
    {
      name: 'search_design_sources',
      description: 'Performs token-indexed fast inverted search across 65+ design systems, libraries, and frameworks.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          framework: { type: 'string' },
          domain: { type: 'string' },
          limit: { type: 'number' }
        },
        required: ['query']
      }
    },
    {
      name: 'inspect_design_source',
      description: 'Inspects full normalized metadata V2 for a design source including quality scores, suitability, and licenses.',
      inputSchema: {
        type: 'object',
        properties: {
          sourceId: { type: 'string' }
        },
        required: ['sourceId']
      }
    },
    {
      name: 'sync_design_sources',
      description: 'Syncs metadata with remote sources with rate-limit protection and offline cache resilience.',
      inputSchema: {
        type: 'object',
        properties: {
          sourceIds: { type: 'array', items: { type: 'string' } },
          force: { type: 'boolean' }
        }
      }
    },
    {
      name: 'recommend_design_sources',
      description: 'Recommends design sources with multi-criteria weighted scoring and structured "WHY" explanations.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          domain: { type: 'string' },
          density: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'] },
          commercialAllowedOnly: { type: 'boolean' },
          componentType: { type: 'string' }
        }
      }
    },
    {
      name: 'search_patterns',
      description: 'Searches the 28-node Pattern Knowledge Graph (e.g. DATA_TABLE, DENSE_GRID, MASTER_DETAIL).',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          category: { type: 'string' },
          applicableDomain: { type: 'string' }
        }
      }
    },
    {
      name: 'inspect_pattern',
      description: 'Inspects detailed pattern specifications including keyboard navigation, accessibility, and candidate sources.',
      inputSchema: {
        type: 'object',
        properties: {
          patternId: { type: 'string' }
        },
        required: ['patternId']
      }
    },
    {
      name: 'search_registries',
      description: 'Searches community and official UI component registries (shadcn/ui, Magic UI, Aceternity, Kokonut).',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          framework: { type: 'string' },
          freeTierOnly: { type: 'boolean' }
        }
      }
    },
    {
      name: 'search_registry_components',
      description: 'Searches components and blocks across discovered registries with dependency and file mapping.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          registryId: { type: 'string' },
          type: { type: 'string' }
        },
        required: ['query']
      }
    },
    {
      name: 'inspect_registry_component',
      description: 'Inspects a specific registry component or block with full dependency manifests.',
      inputSchema: {
        type: 'object',
        properties: {
          registryId: { type: 'string' },
          componentId: { type: 'string' }
        },
        required: ['registryId', 'componentId']
      }
    },
    {
      name: 'discover_ai_skills',
      description: 'Discovers verified AI prompt skills and templates.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          domain: { type: 'string' }
        }
      }
    },
    {
      name: 'inspect_ai_skill',
      description: 'Audits an AI skill or prompt for prompt injection and malicious shell command risks.',
      inputSchema: {
        type: 'object',
        properties: {
          skillId: { type: 'string' },
          promptContent: { type: 'string' }
        },
        required: ['skillId']
      }
    },
    {
      name: 'recommend_icon_system',
      description: 'Recommends optimal icon library (Lucide, Heroicons, Material Symbols, Tabler, Phosphor, Radix) preventing mixed icon aesthetics.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          useTailwind: { type: 'boolean' },
          useShadcn: { type: 'boolean' },
          density: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          existingIconImports: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    {
      name: 'recommend_chart_library',
      description: 'Recommends chart library (ECharts, Recharts, Chart.js) based on data volume, interactivity, and rendering engine.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          dataPoints: { type: 'number' },
          requireGanttOrTimeline: { type: 'boolean' },
          accessibleRequirement: { type: 'boolean' }
        }
      }
    },
    {
      name: 'recommend_data_grid',
      description: 'Recommends data grid (AG Grid Community vs TanStack Table) with strict commercial paywall feature separation.',
      inputSchema: {
        type: 'object',
        properties: {
          estimatedRows: { type: 'number' },
          requiresVirtualization: { type: 'boolean' },
          requiresServerSide: { type: 'boolean' },
          requiresGroupingOrPivot: { type: 'boolean' },
          licensePreference: { type: 'string', enum: ['PERMISSIVE_MIT', 'COMMERCIAL_OK'] }
        }
      }
    },
    {
      name: 'explain_source_recommendation',
      description: 'Generates multi-dimensional "WHY" explanation for a design source recommendation.',
      inputSchema: {
        type: 'object',
        properties: {
          sourceId: { type: 'string' },
          targetFramework: { type: 'string' },
          targetDomain: { type: 'string' }
        },
        required: ['sourceId']
      }
    },
    {
      name: 'create_design_intent',
      description: 'Synthesizes canonical, technology-neutral DesignIntent from contextual ProductUXProfile characteristics.',
      inputSchema: {
        type: 'object',
        properties: {
          productType: { type: 'string', enum: ['ENTERPRISE_INTERNAL', 'B2B_SAAS', 'B2C_CONSUMER', 'ADMIN_OPERATIONAL', 'ANALYTICS_DATA', 'DEVELOPER_TOOL'] },
          userExpertise: { type: 'string', enum: ['NOVICE', 'INTERMEDIATE', 'EXPERT'] },
          informationDensity: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] },
          taskCriticality: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'MISSION_CRITICAL'] }
        }
      }
    },
    {
      name: 'create_page_blueprint',
      description: 'Creates a technology-neutral PageBlueprint DSL structure with regions, layout, and component blueprints.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          preset: { type: 'string', enum: ['DATA_MANAGEMENT_WORKSPACE', 'LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE'] }
        }
      }
    },
    {
      name: 'create_component_blueprint',
      description: 'Generates canonical ComponentBlueprint with token bindings, states, and accessibility contracts for one of 15 canonical components.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['BUTTON', 'INPUT', 'SELECT', 'CHECKBOX', 'RADIO', 'SWITCH', 'BADGE', 'ALERT', 'CARD', 'MODAL_DIALOG', 'DRAWER', 'TOOLTIP', 'DROPDOWN_MENU', 'DATA_TABLE', 'FILTER_BAR'] },
          density: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] }
        },
        required: ['type']
      }
    },
    {
      name: 'create_app_shell_blueprint',
      description: 'Generates canonical ApplicationShellBlueprint (ENTERPRISE_DENSE, SAAS_STANDARD, CONSUMER_CONTENT) driven by UX profile.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          variant: { type: 'string', enum: ['ENTERPRISE_DENSE', 'SAAS_STANDARD', 'CONSUMER_CONTENT'] }
        }
      }
    },
    {
      name: 'render_blueprint',
      description: 'Renders a canonical PageBlueprint to a target production stack (html-css-js, react-typescript, laravel-blade, aspnet-razor).',
      inputSchema: {
        type: 'object',
        properties: {
          blueprintId: { type: 'string' },
          targetStack: { type: 'string', enum: ['html-css-js', 'react-typescript', 'laravel-blade', 'aspnet-razor'] },
          theme: { type: 'string', enum: ['LIGHT', 'DARK', 'HIGH_CONTRAST'] },
          density: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] }
        }
      }
    },
    {
      name: 'render_component',
      description: 'Renders an individual canonical component blueprint to target stack code without framework colonization.',
      inputSchema: {
        type: 'object',
        properties: {
          componentType: { type: 'string', enum: ['BUTTON', 'INPUT', 'SELECT', 'CHECKBOX', 'RADIO', 'SWITCH', 'BADGE', 'ALERT', 'CARD', 'MODAL_DIALOG', 'DRAWER', 'TOOLTIP', 'DROPDOWN_MENU', 'DATA_TABLE', 'FILTER_BAR'] },
          targetStack: { type: 'string', enum: ['html-css-js', 'react-typescript', 'laravel-blade', 'aspnet-razor'] },
          theme: { type: 'string', enum: ['LIGHT', 'DARK', 'HIGH_CONTRAST'] },
          density: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] }
        },
        required: ['componentType']
      }
    },
    {
      name: 'create_ui_recipe',
      description: 'Instantiates one of 6 canonical UI recipes (LOGIN_PAGE, SETTINGS_PAGE, LIST_DETAIL_PAGE, DATA_MANAGEMENT_PAGE, DASHBOARD_PAGE, FORM_PAGE).',
      inputSchema: {
        type: 'object',
        properties: {
          recipeType: { type: 'string', enum: ['LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DATA_MANAGEMENT_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE'] }
        },
        required: ['recipeType']
      }
    },
    {
      name: 'select_design_personality',
      description: 'Calculates 6 quantitative personality axes (-100 to +100) from contextual attributes, preventing superficial AI design clichés.',
      inputSchema: {
        type: 'object',
        properties: {
          productType: { type: 'string', enum: ['ENTERPRISE_INTERNAL', 'B2B_SAAS', 'B2C_CONSUMER', 'ADMIN_OPERATIONAL', 'ANALYTICS_DATA', 'DEVELOPER_TOOL'] },
          informationDensity: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] },
          brandCharacter: { type: 'string', enum: ['UTILITY_NEUTRAL', 'AUTHORITATIVE', 'FRIENDLY', 'TECHNICAL'] }
        }
      }
    },
    {
      name: 'evaluate_design_antipatterns',
      description: 'Design Critic evaluation for UI anti-patterns: excessive cards (card soup), meaningless gradients, glassmorphism, low contrast, tiny touch targets.',
      inputSchema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          blueprintPreset: { type: 'string', enum: ['DATA_MANAGEMENT_WORKSPACE', 'LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE'] }
        }
      }
    },
    {
      name: 'compare_renderer_parity',
      description: 'Evaluates visual, behavioral, and accessibility parity across HTML, React, Blade, and Razor renderers, outputting quantitative parity scores.',
      inputSchema: {
        type: 'object',
        properties: {
          blueprintPreset: { type: 'string', enum: ['DATA_MANAGEMENT_WORKSPACE', 'LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE'] }
        }
      }
    },
    {
      name: 'inspect_alper_registry',
      description: 'Inspects Alper UI canonical registry contents (tokens, 15 component blueprints, 28 patterns, 6 recipes).',
      inputSchema: {
        type: 'object',
        properties: {
          section: { type: 'string', enum: ['ALL', 'TOKENS', 'BLUEPRINTS', 'PATTERNS', 'RECIPES'] }
        }
      }
    },
    {
      name: 'evaluate_truthful_ui',
      description: 'Audits UI components and data bindings against Truthful UI Policy, detecting ungrounded telemetry, unlabeled mocks, and deceptive semantic colors.',
      inputSchema: {
        type: 'object',
        properties: {
          components: { type: 'array' },
          pageTitle: { type: 'string' },
          cognitiveClutterScore: { type: 'number' }
        },
        required: ['components']
      }
    },
    {
      name: 'audit_data_provenance',
      description: 'Audits data provenance records across fields, classifying authority, verifying freshness, and flagging ungrounded or fabricated sources.',
      inputSchema: {
        type: 'object',
        properties: {
          records: { type: 'array' }
        },
        required: ['records']
      }
    },
    {
      name: 'evaluate_page_intent',
      description: 'Audits whether page regions and components align with stated Page Intent, rejecting forbidden visual gimmicks.',
      inputSchema: {
        type: 'object',
        properties: {
          intentType: { type: 'string', enum: ['OPERATIONAL_MONITORING', 'EXECUTIVE_DECISION', 'DATA_ENTRY_TRANSACTION', 'EXPLORATORY_ANALYTICS', 'CONFIGURATION_ADMIN', 'DIAGNOSTIC_INVESTIGATION', 'DEMO_SHOWCASE'] },
          primaryGoal: { type: 'string' },
          targetAudience: { type: 'string' },
          components: { type: 'array' }
        },
        required: ['intentType', 'primaryGoal', 'targetAudience', 'components']
      }
    },
    {
      name: 'audit_information_relevance',
      description: 'Scores information relevance, signal-to-noise ratio, and cognitive load impact of elements on a page.',
      inputSchema: {
        type: 'object',
        properties: {
          intentType: { type: 'string' },
          primaryGoal: { type: 'string' },
          elements: { type: 'array' }
        },
        required: ['intentType', 'primaryGoal', 'elements']
      }
    },
    {
      name: 'classify_source_authority',
      description: 'Classifies data sources into formal Source Authority Tiers (AUTHORITATIVE_SYSTEM, VERIFIED_EXTERNAL, SYNTHETIC_MOCK, etc.).',
      inputSchema: {
        type: 'object',
        properties: {
          sourceId: { type: 'string' },
          urlOrPath: { type: 'string' },
          type: { type: 'string' },
          isProductionEndpoint: { type: 'boolean' },
          hasAuthHeaders: { type: 'boolean' },
          isMock: { type: 'boolean' }
        },
        required: ['sourceId']
      }
    },
    {
      name: 'evaluate_content_truth_gate',
      description: 'Evaluates the CONTENT_TRUTH_PASS governance release gate synthesizing UI truthfulness, provenance, and visual approval.',
      inputSchema: {
        type: 'object',
        properties: {
          components: { type: 'array' },
          requireVisualApproval: { type: 'boolean' }
        }
      }
    },
    {
      name: 'manage_human_visual_approval',
      description: 'Inspects or records human visual sign-off with anti-tamper bot protection.',
      inputSchema: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['GET_STATUS', 'RECORD_REVIEW'] },
          reviewedBy: { type: 'string' },
          status: { type: 'string', enum: ['NOT_REVIEWED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED'] },
          notes: { type: 'string' },
          viewports: { type: 'array', items: { type: 'string' } }
        },
        required: ['action']
      }
    },
    {
      name: 'audit_track_trace_telemetry',
      description: 'Statically audits Track Trace Direction B telemetry specimens, detecting ungrounded endpoints and tagging deferred live validations.',
      inputSchema: {
        type: 'object',
        properties: {
          sampleEndpoints: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    {
      name: 'create_manual_run_bundle',
      description: 'Generates an Operator-Assisted Manual Run Bundle with RUN.ps1, README, and evidence collector for corporate workstations.',
      inputSchema: {
        type: 'object',
        properties: {
          runId: { type: 'string' },
          plannedObjective: { type: 'string' }
        }
      }
    },
    {
      name: 'verify_manual_run_evidence',
      description: 'Verifies evidence artifacts generated by human operator execution in Windows PowerShell.',
      inputSchema: {
        type: 'object',
        properties: {
          runIdOrPath: { type: 'string' }
        },
        required: ['runIdOrPath']
      }
    },
    {
      name: 'resolve_browser_runtime',
      description: 'Resolves browser engine following the chain: managed Chromium -> system Edge -> system Chrome -> unavailable.',
      inputSchema: {
        type: 'object',
        properties: {
          forceChromiumBlocked: { type: 'boolean' }
        }
      }
    },
    {
      name: 'run_operator_doctor',
      description: 'Runs doctor diagnostics separating system capability from agent execution authority.',
      inputSchema: {
        type: 'object',
        properties: {
          overrideDockerCapability: { type: 'string', enum: ['AVAILABLE', 'UNAVAILABLE'] },
          overrideBrowserCapability: { type: 'string', enum: ['AVAILABLE', 'UNAVAILABLE'] }
        }
      }
    },
    {
      name: 'profile_existing_project',
      description: 'Profiles an existing legacy project: detects stack, styling, architecture, auth, database, routing, and debt heuristics.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string', description: 'Path to project directory' },
          projectName: { type: 'string', description: 'Optional project name' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'create_behavioral_baseline',
      description: 'Scans existing project files and captures behavioral baseline (routes, auth flows, db invariants, forms, external integrations).',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string', description: 'Path to project directory' },
          includeOpenApi: { type: 'boolean' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'create_preservation_contract',
      description: 'Creates a strict PreservationContract establishing MUST_PRESERVE boundaries for backend, database, and auth.',
      inputSchema: {
        type: 'object',
        properties: {
          contractId: { type: 'string' },
          customInvariants: { type: 'object' }
        }
      }
    },
    {
      name: 'classify_existing_elements',
      description: 'Classifies existing components, routes, and styles into KEEP, IMPROVE, REPLACE, DEFER, or high-risk REMOVE decisions.',
      inputSchema: {
        type: 'object',
        properties: {
          elements: { type: 'array' }
        },
        required: ['elements']
      }
    },
    {
      name: 'create_modernization_intent',
      description: 'Validates and structures modernization goals, rejecting vague inputs like "make it modern" without concrete criteria.',
      inputSchema: {
        type: 'object',
        properties: {
          why: { type: 'string' },
          targetOutcome: { type: 'string' },
          primaryProblems: { type: 'array', items: { type: 'string' } },
          autoSupplementFromProjectPath: { type: 'string' }
        },
        required: ['why']
      }
    },
    {
      name: 'create_modernization_plan',
      description: 'Creates a comprehensive staged modernization plan with preservation contracts, checkpoints, and rollback strategies.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          why: { type: 'string' },
          strategy: { type: 'string', enum: ['ADOPT', 'ADAPT', 'BRIDGE', 'MIGRATE', 'REBUILD_COMPONENT', 'REBUILD_PAGE', 'REBUILD_SHELL'] },
          scopeTarget: { type: 'string' },
          scopeLevel: { type: 'string', enum: ['COMPONENT', 'PAGE', 'FEATURE', 'SHELL', 'MODULE', 'APPLICATION'] }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'select_modernization_strategy',
      description: 'Evaluates and selects an appropriate modernization strategy, strictly blocking unapproved Big Bang rewrites.',
      inputSchema: {
        type: 'object',
        properties: {
          requestedStrategy: { type: 'string' },
          projectPath: { type: 'string' },
          explicitUserRequest: { type: 'boolean' },
          justification: { type: 'string' }
        },
        required: ['requestedStrategy']
      }
    },
    {
      name: 'create_modernization_stages',
      description: 'Generates scope-tailored implementation stages (Foundation, Shell, Page, Shared Components, Refinement) with checkpoints.',
      inputSchema: {
        type: 'object',
        properties: {
          scopeLevel: { type: 'string', enum: ['COMPONENT', 'PAGE', 'FEATURE', 'SHELL', 'MODULE', 'APPLICATION'] },
          targetName: { type: 'string' },
          strategy: { type: 'string', enum: ['ADOPT', 'ADAPT', 'BRIDGE', 'MIGRATE', 'REBUILD_COMPONENT', 'REBUILD_PAGE', 'REBUILD_SHELL'] }
        }
      }
    },
    {
      name: 'evaluate_modernization_completion',
      description: 'Evaluates completion gates: technical, visual AI, UX, a11y, security, regression, content truth, and mandatory human visual approval.',
      inputSchema: {
        type: 'object',
        properties: {
          technical: { type: 'string', enum: ['PASS', 'FAIL', 'BLOCKED'] },
          visualAI: { type: 'string', enum: ['PASS', 'FAIL', 'HEURISTIC_ACCEPTABLE'] },
          ux: { type: 'string', enum: ['PASS', 'FAIL'] },
          accessibility: { type: 'string', enum: ['PASS', 'FAIL'] },
          security: { type: 'string', enum: ['PASS', 'FAIL'] },
          regression: { type: 'string', enum: ['PASS', 'FAIL'] },
          contentTruth: { type: 'string', enum: ['PASS', 'FAIL'] },
          humanVisualApproval: { type: 'string', enum: ['APPROVED', 'PENDING', 'REJECTED'] }
        },
        required: ['technical', 'visualAI', 'ux', 'accessibility', 'security', 'regression', 'contentTruth', 'humanVisualApproval']
      }
    }
  ];

export function getToolDefinitions(): Tool[] {
  return TOOL_DEFINITIONS;
}

export function getRegisteredToolCount(): number {
  return TOOL_DEFINITIONS.length;
}

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

  const toolDefinitions = TOOL_DEFINITIONS;

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
        case 'create_action_plan':
          result = Tools.handleCreateActionPlan(T.CreateActionPlanInputSchema.parse(args));
          break;
        case 'evaluate_scope':
          result = Tools.handleEvaluateScope(T.EvaluateScopeInputSchema.parse(args));
          break;
        case 'evaluate_change_risk':
          result = Tools.handleEvaluateChangeRisk(T.EvaluateChangeRiskInputSchema.parse(args));
          break;
        case 'create_checkpoint_plan':
          result = Tools.handleCreateCheckpointPlan(T.CreateCheckpointPlanInputSchema.parse(args));
          break;
        case 'create_verification_plan':
          result = Tools.handleCreateVerificationPlan(T.CreateVerificationPlanInputSchema.parse(args));
          break;
        case 'normalize_verification_evidence':
          result = Tools.handleNormalizeVerificationEvidence(T.NormalizeVerificationEvidenceInputSchema.parse(args));
          break;
        case 'review_change':
          result = Tools.handleReviewChange(T.ReviewChangeInputSchema.parse(args));
          break;
        case 'detect_regression':
          result = Tools.handleDetectRegression(T.DetectRegressionInputSchema.parse(args));
          break;
        case 'create_environment_profile':
          result = Tools.handleCreateEnvironmentProfile(T.CreateEnvironmentProfileInputSchema.parse(args));
          break;
        case 'route_context':
          result = Tools.handleRouteContext(T.RouteContextInputSchema.parse(args));
          break;
        case 'route_tool':
          result = Tools.handleRouteTool(T.RouteToolInputSchema.parse(args));
          break;
        case 'create_execution_journal':
          result = Tools.handleCreateExecutionJournal(T.CreateExecutionJournalInputSchema.parse(args));
          break;
        case 'evaluate_completion_claim':
          result = Tools.handleEvaluateCompletionClaim(T.EvaluateCompletionClaimInputSchema.parse(args));
          break;
        case 'discover_design_sources':
          result = Tools.handleDiscoverDesignSources(T.DiscoverDesignSourcesInputSchema.parse(args));
          break;
        case 'search_design_sources':
          result = Tools.handleSearchDesignSources(T.SearchDesignSourcesInputSchema.parse(args));
          break;
        case 'inspect_design_source':
          result = Tools.handleInspectDesignSource(T.InspectDesignSourceInputSchema.parse(args));
          break;
        case 'sync_design_sources':
          result = await Tools.handleSyncDesignSources(T.SyncDesignSourcesInputSchema.parse(args));
          break;
        case 'recommend_design_sources':
          result = Tools.handleRecommendDesignSources(T.RecommendDesignSourcesInputSchema.parse(args));
          break;
        case 'search_patterns':
          result = Tools.handleSearchPatterns(T.SearchPatternsInputSchema.parse(args));
          break;
        case 'inspect_pattern':
          result = Tools.handleInspectPattern(T.InspectPatternInputSchema.parse(args));
          break;
        case 'search_registries':
          result = Tools.handleSearchRegistries(T.SearchRegistriesInputSchema.parse(args));
          break;
        case 'search_registry_components':
          result = Tools.handleSearchRegistryComponents(T.SearchRegistryComponentsInputSchema.parse(args));
          break;
        case 'inspect_registry_component':
          result = Tools.handleInspectRegistryComponent(T.InspectRegistryComponentInputSchema.parse(args));
          break;
        case 'discover_ai_skills':
          result = Tools.handleDiscoverAiSkills(T.DiscoverAiSkillsInputSchema.parse(args));
          break;
        case 'inspect_ai_skill':
          result = Tools.handleInspectAiSkill(T.InspectAiSkillInputSchema.parse(args));
          break;
        case 'recommend_icon_system':
          result = Tools.handleRecommendIconSystem(T.RecommendIconSystemInputSchema.parse(args));
          break;
        case 'recommend_chart_library':
          result = Tools.handleRecommendChartLibrary(T.RecommendChartLibraryInputSchema.parse(args));
          break;
        case 'recommend_data_grid':
          result = Tools.handleRecommendDataGrid(T.RecommendDataGridInputSchema.parse(args));
          break;
        case 'explain_source_recommendation':
          result = Tools.handleExplainSourceRecommendation(T.ExplainSourceRecommendationInputSchema.parse(args));
          break;
        case 'create_design_intent':
          result = Tools.handleCreateDesignIntent(T.CreateDesignIntentInputSchema.parse(args));
          break;
        case 'create_page_blueprint':
          result = Tools.handleCreatePageBlueprint(T.CreatePageBlueprintInputSchema.parse(args));
          break;
        case 'create_component_blueprint':
          result = Tools.handleCreateComponentBlueprint(T.CreateComponentBlueprintInputSchema.parse(args));
          break;
        case 'create_app_shell_blueprint':
          result = Tools.handleCreateAppShellBlueprint(T.CreateAppShellBlueprintInputSchema.parse(args));
          break;
        case 'render_blueprint':
          result = Tools.handleRenderBlueprint(T.RenderBlueprintInputSchema.parse(args));
          break;
        case 'render_component':
          result = Tools.handleRenderComponent(T.RenderComponentInputSchema.parse(args));
          break;
        case 'create_ui_recipe':
          result = Tools.handleCreateUiRecipe(T.CreateUiRecipeInputSchema.parse(args));
          break;
        case 'select_design_personality':
          result = Tools.handleSelectDesignPersonality(T.SelectDesignPersonalityInputSchema.parse(args));
          break;
        case 'evaluate_design_antipatterns':
          result = Tools.handleEvaluateDesignAntipatterns(T.EvaluateDesignAntipatternsInputSchema.parse(args));
          break;
        case 'compare_renderer_parity':
          result = Tools.handleCompareRendererParity(T.CompareRendererParityInputSchema.parse(args));
          break;
        case 'inspect_alper_registry':
          result = Tools.handleInspectAlperRegistry(T.InspectAlperRegistryInputSchema.parse(args));
          break;
        case 'evaluate_truthful_ui':
          result = Tools.handleEvaluateTruthfulUi(T.EvaluateTruthfulUiInputSchema.parse(args));
          break;
        case 'audit_data_provenance':
          result = Tools.handleAuditDataProvenance(T.AuditDataProvenanceInputSchema.parse(args));
          break;
        case 'evaluate_page_intent':
          result = Tools.handleEvaluatePageIntent(T.EvaluatePageIntentInputSchema.parse(args));
          break;
        case 'audit_information_relevance':
          result = Tools.handleAuditInformationRelevance(T.AuditInformationRelevanceInputSchema.parse(args));
          break;
        case 'classify_source_authority':
          result = Tools.handleClassifySourceAuthority(T.ClassifySourceAuthorityInputSchema.parse(args));
          break;
        case 'evaluate_content_truth_gate':
          result = Tools.handleEvaluateContentTruthGate(T.EvaluateContentTruthGateInputSchema.parse(args));
          break;
        case 'manage_human_visual_approval':
          result = Tools.handleManageHumanVisualApproval(T.ManageHumanVisualApprovalInputSchema.parse(args));
          break;
        case 'audit_track_trace_telemetry':
          result = Tools.handleAuditTrackTraceTelemetry(T.AuditTrackTraceTelemetryInputSchema.parse(args));
          break;
        case 'create_manual_run_bundle':
          result = Tools.handleCreateManualRunBundle(T.CreateManualRunBundleInputSchema.parse(args));
          break;
        case 'verify_manual_run_evidence':
          result = Tools.handleVerifyManualRunEvidence(T.VerifyManualRunEvidenceInputSchema.parse(args));
          break;
        case 'resolve_browser_runtime':
          result = Tools.handleResolveBrowserRuntime(T.ResolveBrowserRuntimeInputSchema.parse(args));
          break;
        case 'run_operator_doctor':
          result = Tools.handleRunOperatorDoctor(T.RunOperatorDoctorInputSchema.parse(args));
          break;
        case 'profile_existing_project':
          result = Tools.handleProfileExistingProject(T.ProfileExistingProjectInputSchema.parse(args));
          break;
        case 'create_behavioral_baseline':
          result = Tools.handleCreateBehavioralBaseline(T.CreateBehavioralBaselineInputSchema.parse(args));
          break;
        case 'create_preservation_contract':
          result = Tools.handleCreatePreservationContract(T.CreatePreservationContractInputSchema.parse(args));
          break;
        case 'classify_existing_elements':
          result = Tools.handleClassifyExistingElements(T.ClassifyExistingElementsInputSchema.parse(args));
          break;
        case 'create_modernization_intent':
          result = Tools.handleCreateModernizationIntent(T.CreateModernizationIntentInputSchema.parse(args));
          break;
        case 'create_modernization_plan':
          result = Tools.handleCreateModernizationPlan(T.CreateModernizationPlanInputSchema.parse(args));
          break;
        case 'select_modernization_strategy':
          result = Tools.handleSelectModernizationStrategy(T.SelectModernizationStrategyInputSchema.parse(args));
          break;
        case 'create_modernization_stages':
          result = Tools.handleCreateModernizationStages(T.CreateModernizationStagesInputSchema.parse(args));
          break;
        case 'evaluate_modernization_completion':
          result = Tools.handleEvaluateModernizationCompletion(T.EvaluateModernizationCompletionInputSchema.parse(args));
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
