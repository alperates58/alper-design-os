#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const targetVersion = process.argv[2] || '1.0.0-rc.1';

const files = [
  'package.json',
  'design-core/package.json',
  'registry/package.json',
  'environment-manifest.json',
  'adapters/contract/package.json',
  'adapters/generic-web/package.json',
  'adapters/html-css-js/package.json',
  'adapters/react/package.json',
  'adapters/react-typescript/package.json',
  'adapters/php/package.json',
  'adapters/laravel-blade/package.json',
  'adapters/aspnet-razor/package.json',
  'packages/analyzer/package.json',
  'packages/source-intelligence/package.json',
  'packages/engineering-guardrails/package.json',
  'packages/qa-engine/package.json',
  'packages/software-intelligence/package.json',
  'packages/agent-governance/package.json',
  'packages/design-language/package.json',
  'packages/mcp-server/package.json'
];

console.log(`Setting version to: ${targetVersion}`);
let updated = 0;

for (const f of files) {
  if (fs.existsSync(f)) {
    const json = JSON.parse(fs.readFileSync(f, 'utf-8'));
    json.version = targetVersion;
    fs.writeFileSync(f, JSON.stringify(json, null, 2) + '\n', 'utf-8');
    console.log(` - Updated ${f} -> ${targetVersion}`);
    updated++;
  } else {
    console.warn(` - Not found: ${f}`);
  }
}

// Also update packages/mcp-server/src/server.ts version string
const serverTsPath = 'packages/mcp-server/src/server.ts';
if (fs.existsSync(serverTsPath)) {
  let content = fs.readFileSync(serverTsPath, 'utf-8');
  content = content.replace(/version:\s*['"][^'"]+['"]/, `version: '${targetVersion}'`);
  fs.writeFileSync(serverTsPath, content, 'utf-8');
  console.log(` - Updated ${serverTsPath} -> ${targetVersion}`);
}

console.log(`Updated ${updated} manifests successfully.`);
