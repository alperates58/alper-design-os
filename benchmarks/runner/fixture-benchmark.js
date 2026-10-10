import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectStack } from '../../packages/analyzer/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const fixturesDir = path.resolve(rootDir, 'benchmarks/projects');

function getProjectFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'expected-profile.json') continue;
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

export async function runFixtureBenchmark() {
  const fixtureFolders = ['plain-web', 'react-typescript', 'php', 'laravel-blade', 'aspnet-razor'];
  const results = {
    totalFixtures: fixtureFolders.length,
    matchedFixtures: 0,
    fixtures: []
  };

  for (const folder of fixtureFolders) {
    const fixturePath = path.join(fixturesDir, folder);
    const expectedProfilePath = path.join(fixturePath, 'expected-profile.json');
    if (!fs.existsSync(expectedProfilePath)) {
      continue;
    }

    const expected = JSON.parse(fs.readFileSync(expectedProfilePath, 'utf8'));
    const files = getProjectFiles(fixturePath);
    const detected = detectStack(files, folder);

    const matches = {
      primaryStack: detected.primaryStack === expected.expectedPrimaryStack,
      recommendedAdapterId: detected.recommendedAdapterId === expected.expectedRecommendedAdapterId,
      hasTypeScript: detected.hasTypeScript === expected.expectedHasTypeScript,
      templateEngine: detected.templateEngine === expected.expectedTemplateEngine,
      stylingApproach: detected.styling.approach === expected.expectedStylingApproach
    };

    const isMatch = matches.primaryStack && matches.recommendedAdapterId && matches.hasTypeScript;
    if (isMatch) {
      results.matchedFixtures++;
    }

    results.fixtures.push({
      fixtureId: folder,
      passed: isMatch,
      detected: {
        primaryStack: detected.primaryStack,
        recommendedAdapterId: detected.recommendedAdapterId,
        hasTypeScript: detected.hasTypeScript,
        templateEngine: detected.templateEngine,
        stylingApproach: detected.styling.approach,
        confidence: detected.confidence
      },
      expected: expected,
      comparison: matches
    });
  }

  results.success = results.matchedFixtures === results.totalFixtures;
  return results;
}

if (process.argv[1] && process.argv[1].endsWith('fixture-benchmark.js')) {
  runFixtureBenchmark().then((res) => {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.success ? 0 : 1);
  }).catch((err) => {
    console.error('Fixture benchmark failed:', err);
    process.exit(1);
  });
}
