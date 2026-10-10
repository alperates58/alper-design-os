import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

export async function runMcpSmokeTest() {
  return new Promise((resolve, reject) => {
    const serverPath = path.resolve(rootDir, 'packages/mcp-server/dist/index.js');
    const child = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: rootDir
    });

    let buffer = '';
    const pendingRequests = new Map();
    let nextId = 1;
    const testResults = {
      success: false,
      handshake: false,
      serverInfo: null,
      totalTools: 0,
      invokedCount: 0,
      passedCount: 0,
      toolInvocations: [],
      error: null
    };

    function sendRequest(method, params = {}) {
      return new Promise((res, rej) => {
        const id = nextId++;
        pendingRequests.set(id, { resolve: res, reject: rej, method });
        child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
      });
    }

    function sendNotification(method, params = {}) {
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
    }

    child.stdout.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id && pendingRequests.has(msg.id)) {
            const req = pendingRequests.get(msg.id);
            pendingRequests.delete(msg.id);
            if (msg.error) {
              req.reject(new Error(`MCP error on ${req.method}: ${JSON.stringify(msg.error)}`));
            } else {
              req.resolve(msg.result);
            }
          }
        } catch {
          // ignore non-json log lines
        }
      }
    });

    child.on('error', (err) => {
      testResults.error = err.message;
      reject(err);
    });

    const timeout = setTimeout(() => {
      child.kill();
      testResults.error = 'MCP smoke test timed out';
      resolve(testResults);
    }, 25000);

    // Execute test sequence
    (async () => {
      try {
        // 1. Initialize
        const initResult = await sendRequest('initialize', {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'benchmark-smoke-client', version: '1.0.0' }
        });
        testResults.handshake = true;
        testResults.serverInfo = initResult.serverInfo;

        sendNotification('notifications/initialized');

        // 2. Tools list
        const toolsResult = await sendRequest('tools/list', {});
        const tools = toolsResult.tools || [];
        testResults.totalTools = tools.length;

        // 3. 10 Core Invocations
        const toolsToTest = [
          {
            name: 'analyze_project',
            args: { projectPath: 'benchmarks/projects/react-typescript' }
          },
          {
            name: 'detect_stack',
            args: { projectPath: 'benchmarks/projects/laravel-blade' }
          },
          {
            name: 'understand_product',
            args: { productName: 'SCADA Benchmark', description: 'Factory floor production monitor' }
          },
          {
            name: 'research_domain',
            args: { domainQuery: 'Industrial Automation' }
          },
          {
            name: 'route_context',
            args: {
              taskId: 't-101',
              taskBrief: 'Fix login button styling',
              detectedStack: 'react-typescript',
              mode: 'REPAIR'
            }
          },
          {
            name: 'route_tool',
            args: { taskDescription: 'Inspect package.json file' }
          },
          {
            name: 'evaluate_scope',
            args: {
              filesToChange: ['src/Login.css'],
              requestedScope: ['Login UI'],
              forbiddenList: ['src/auth/secret.key']
            }
          },
          {
            name: 'evaluate_change_risk',
            args: {
              fileCount: 1,
              architectureImpact: false,
              databaseImpact: false,
              authenticationImpact: false,
              authorizationImpact: false,
              publicApiImpact: false,
              dependencyImpact: false,
              configurationImpact: false,
              deploymentImpact: false,
              dataLossPossibility: false
            }
          },
          {
            name: 'create_verification_plan',
            args: {
              objective: 'Refactor login button UI',
              isUI: true,
              isSecuritySensitive: false,
              riskLevel: 'LOW'
            }
          },
          {
            name: 'evaluate_completion_claim',
            args: {
              claim: 'Verified fix with tests',
              evidences: [{ type: 'UNIT_TEST', status: 'PASS', summary: '100% tests passing' }]
            }
          }
        ];

        for (const item of toolsToTest) {
          testResults.invokedCount++;
          try {
            const res = await sendRequest('tools/call', {
              name: item.name,
              arguments: item.args
            });
            const content = res.content || [];
            const textContent = content.map((c) => c.text).join('\n');
            const hasData = textContent.length > 0;
            testResults.toolInvocations.push({
              tool: item.name,
              status: hasData ? 'PASS' : 'WARN_EMPTY',
              contentSummary: textContent.slice(0, 120)
            });
            if (hasData) testResults.passedCount++;
          } catch (err) {
            testResults.toolInvocations.push({
              tool: item.name,
              status: 'FAIL',
              error: err.message
            });
          }
        }

        testResults.success = testResults.passedCount === toolsToTest.length && testResults.totalTools >= 40;
      } catch (err) {
        testResults.error = err.message;
      } finally {
        clearTimeout(timeout);
        child.kill();
        resolve(testResults);
      }
    })();
  });
}

// CLI Direct Runner
if (process.argv[1] && process.argv[1].endsWith('mcp-smoke-test.js')) {
  runMcpSmokeTest().then((res) => {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.success ? 0 : 1);
  }).catch((err) => {
    console.error('Fatal MCP test error:', err);
    process.exit(1);
  });
}
