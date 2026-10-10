import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectStack } from '../../packages/analyzer/dist/index.js';
import { inferProductUXProfile } from '../../design-core/dist/index.js';
import {
  SourceIntelligenceEngine,
  specializedIntelligenceEngine,
  patternKnowledgeGraph,
  auditSkillSecurity
} from '../../packages/source-intelligence/dist/index.js';
import { routeTool } from '../../packages/agent-governance/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const externalDir = path.resolve(rootDir, 'benchmarks/external');

function getProjectFiles(dir, base = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(base, file).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getProjectFiles(fullPath, relPath));
    } else {
      results.push({
        path: relPath,
        extension: path.extname(file),
        content: fs.readFileSync(fullPath, 'utf8')
      });
    }
  }
  return results;
}

export async function runExternalBenchmark() {
  const engine = SourceIntelligenceEngine.getInstance();
  const projects = [
    {
      id: 'ecommerce-storefront',
      name: 'Unseeded E-Commerce Storefront',
      expectedStack: 'react',
      expectedDomain: 'COMMERCE',
      brief: {
        productName: 'Nordic Apparel Storefront',
        description: 'B2C consumer e-commerce storefront with product catalog, cart, and checkout.',
        domain: 'E-commerce B2C retail storefront'
      }
    },
    {
      id: 'fintech-analytics',
      name: 'Unseeded Fintech Analytics Dashboard',
      expectedStack: 'react',
      expectedDomain: 'FINTECH',
      brief: {
        productName: 'Apex Capital Execution Terminal',
        description: 'High-frequency institutional trading execution terminal and market liquidity curves.',
        domain: 'Fintech capital markets liquidity analysis'
      }
    },
    {
      id: 'embedded-iot-controller',
      name: 'Unseeded Embedded IoT Device Controller Web UI',
      expectedStack: 'generic-web',
      expectedDomain: 'INDUSTRIAL_OPERATIONAL',
      brief: {
        productName: 'RTU Industrial Gateway 04',
        description: 'Embedded microcontroller web portal displaying real-time telemetry, relay coils, and RTU status.',
        domain: 'Industrial telemetry IoT device monitoring'
      }
    }
  ];

  const results = {
    totalProjects: projects.length,
    passedProjects: 0,
    timestamp: new Date().toISOString(),
    evaluations: []
  };

  for (const p of projects) {
    const projectPath = path.join(externalDir, p.id);
    const files = getProjectFiles(projectPath);

    // 1. Stack Detection
    const detectedStack = detectStack(files, p.id);
    const stackPass =
      (p.id === 'ecommerce-storefront' && detectedStack.primaryStack.toLowerCase().includes('react')) ||
      (p.id === 'fintech-analytics' && detectedStack.primaryStack.toLowerCase().includes('react')) ||
      (p.id === 'embedded-iot-controller' && (detectedStack.primaryStack.toLowerCase().includes('generic') || detectedStack.primaryStack.toLowerCase().includes('web')));

    // 2. UX Profile & Domain Inference
    const uxProfile = inferProductUXProfile(p.brief);
    const domainPass =
      (p.id === 'ecommerce-storefront' && (uxProfile.domainClassification === 'B2C_CONSUMER' || uxProfile.domainClassification === 'COMMERCE')) ||
      (p.id === 'fintech-analytics' && uxProfile.domainClassification === 'FINTECH') ||
      (p.id === 'embedded-iot-controller' && uxProfile.domainClassification === 'INDUSTRIAL_OPERATIONAL');

    // 3. Source & Pattern Recommendations
    const rankedSources = engine.rankSources({
      framework: detectedStack.primaryStack === 'react' ? 'React' : undefined,
      domain: uxProfile.domainClassification
    });
    const topSourceIds = rankedSources.slice(0, 5).map((r) => r.source.id);

    // Icon recommendation
    const recommendedIcon = specializedIntelligenceEngine.recommendIconSystem({
      useTailwind: detectedStack.styling?.approach === 'TAILWIND',
      density: uxProfile.informationDensity === 'HIGH' || uxProfile.informationDensity === 'EXTREME' ? 'HIGH' : 'LOW'
    });

    // Chart recommendation
    const recommendedChart = specializedIntelligenceEngine.recommendChartLibrary({
      dataPoints: p.id === 'fintech-analytics' ? 25000 : 500,
      framework: detectedStack.primaryStack === 'react' ? 'React' : 'vanilla'
    });

    // Grid recommendation
    const recommendedGrid = specializedIntelligenceEngine.recommendDataGrid({
      estimatedRows: p.id === 'fintech-analytics' ? 100000 : 50
    });

    // 4. Tool Routing (Verify no irrelevant tools like database migration when not asked)
    const uiRouting = routeTool(`Update product catalog cards for ${p.name}`, {
      isOffline: true,
      requireLiveBrowser: false
    });
    const toolRoutingPass = !uiRouting.chosenTool.includes('database');

    // 5. False Alarm Audit on project code
    let falseAlarms = 0;
    for (const f of files) {
      const audit = auditSkillSecurity({
        skillId: f.path,
        name: f.path,
        source: 'benchmark',
        license: 'MIT',
        instructions: f.content
      });
      if (audit.securityRisk === 'CRITICAL' || audit.securityRisk === 'HIGH') {
        falseAlarms++;
      }
    }
    const falseAlarmPass = falseAlarms === 0;

    const allPassed = stackPass && domainPass && toolRoutingPass && falseAlarmPass;
    if (allPassed) {
      results.passedProjects++;
    }

    results.evaluations.push({
      projectId: p.id,
      name: p.name,
      passed: allPassed,
      stackAnalysis: {
        detectedPrimary: detectedStack.primaryStack,
        stylingApproach: detectedStack.styling?.approach,
        confidence: detectedStack.confidence,
        pass: stackPass
      },
      domainAnalysis: {
        inferredDomain: uxProfile.domainClassification,
        density: uxProfile.informationDensity,
        interactionStyle: uxProfile.interactionStyle,
        pass: domainPass
      },
      recommendations: {
        topSources: topSourceIds,
        recommendedIcon: recommendedIcon.recommended.name,
        recommendedChart: recommendedChart.recommended.name,
        recommendedGrid: recommendedGrid.recommended.name
      },
      toolRouting: {
        chosenTool: uiRouting.chosenTool,
        rationale: uiRouting.rationale,
        pass: toolRoutingPass
      },
      securityEvaluation: {
        falseAlarms,
        pass: falseAlarmPass
      }
    });
  }

  results.success = results.passedProjects === results.totalProjects;

  const reportDir = path.resolve(rootDir, 'benchmarks/reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(reportDir, 'external-benchmark-report.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );

  return results;
}

if (process.argv[1] && process.argv[1].endsWith('external-benchmark.js')) {
  runExternalBenchmark().then((res) => {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.success ? 0 : 1);
  }).catch((err) => {
    console.error('External benchmark failed:', err);
    process.exit(1);
  });
}
