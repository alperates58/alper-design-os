import net from 'net';
import fs from 'fs';
import path from 'path';

/**
 * Checks if a specific port on 127.0.0.1 is available.
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    // STRICT: Never allow port 3000
    if (port === 3000) {
      resolve(false);
      return;
    }

    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

/**
 * Finds N available ports on 127.0.0.1 starting from startPort.
 */
export async function findAvailablePorts(count = 2, startPort = 41200) {
  const ports = [];
  let currentPort = startPort;

  while (ports.length < count) {
    if (currentPort === 3000) {
      currentPort++;
      continue;
    }
    const available = await isPortAvailable(currentPort);
    if (available) {
      ports.push(currentPort);
    }
    currentPort++;
    if (currentPort > 65000) {
      throw new Error('Failed to find required number of available ports.');
    }
  }

  return ports;
}

/**
 * CLI execution helper
 */
if (process.argv[1] && process.argv[1].endsWith('port-finder.js')) {
  findAvailablePorts(2).then(([brokenPort, goldenPort]) => {
    const portsInfo = {
      brokenWebPort: brokenPort,
      goldenWebPort: goldenPort,
      host: '127.0.0.1',
      generatedAt: new Date().toISOString()
    };
    console.log(JSON.stringify(portsInfo, null, 2));
  }).catch((err) => {
    console.error('Error finding ports:', err);
    process.exit(1);
  });
}
