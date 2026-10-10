import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0'; // Inside container 0.0.0.0 allows host port forward to 127.0.0.1
const APP_MODE = process.env.APP_MODE || 'dual'; // 'broken', 'golden', or 'dual'

const BROKEN_DIR = path.resolve(__dirname, 'apps/broken-web');
const GOLDEN_DIR = path.resolve(__dirname, 'apps/golden-web');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Mock API Endpoints
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ status: 'operational', timestamp: new Date().toISOString(), version: '1.0.0' }));
    return;
  }

  if (pathname === '/api/config') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ cluster: 'benchmark-cluster', telemetry: 'enabled', sampleRate: 0.1 }));
    return;
  }

  if (pathname === '/api/missing-telemetry-endpoint') {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: 'Not Found', message: 'Telemetry endpoint is deprecated' }));
    return;
  }

  // Determine which root directory to serve
  let targetDir = BROKEN_DIR;
  let relativeFilePath = pathname;

  if (APP_MODE === 'broken') {
    targetDir = BROKEN_DIR;
  } else if (APP_MODE === 'golden') {
    targetDir = GOLDEN_DIR;
  } else {
    // Dual mode routing
    if (pathname.startsWith('/broken')) {
      targetDir = BROKEN_DIR;
      relativeFilePath = pathname.replace(/^\/broken/, '') || '/index.html';
    } else if (pathname.startsWith('/golden')) {
      targetDir = GOLDEN_DIR;
      relativeFilePath = pathname.replace(/^\/golden/, '') || '/index.html';
    } else {
      // Default to broken root
      targetDir = BROKEN_DIR;
    }
  }

  if (relativeFilePath === '/' || relativeFilePath === '') {
    relativeFilePath = '/index.html';
  }

  const safePath = path.normalize(relativeFilePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(targetDir, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[Benchmark Server] Listening on http://${HOST}:${PORT} (Mode: ${APP_MODE})`);
});
