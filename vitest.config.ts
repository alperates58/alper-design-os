import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@alper-design-os/design-core': path.resolve(__dirname, 'design-core/src/index.ts'),
      '@alper-design-os/adapter-contract': path.resolve(__dirname, 'adapters/contract/src/index.ts'),
      '@alper-design-os/adapter-generic-web': path.resolve(__dirname, 'adapters/generic-web/src/index.ts'),
      '@alper-design-os/adapter-html-css-js': path.resolve(__dirname, 'adapters/html-css-js/src/index.ts'),
      '@alper-design-os/adapter-react': path.resolve(__dirname, 'adapters/react/src/index.ts'),
      '@alper-design-os/adapter-react-typescript': path.resolve(__dirname, 'adapters/react-typescript/src/index.ts'),
      '@alper-design-os/adapter-php': path.resolve(__dirname, 'adapters/php/src/index.ts'),
      '@alper-design-os/adapter-laravel-blade': path.resolve(__dirname, 'adapters/laravel-blade/src/index.ts'),
      '@alper-design-os/adapter-aspnet-razor': path.resolve(__dirname, 'adapters/aspnet-razor/src/index.ts'),
      '@alper-design-os/registry': path.resolve(__dirname, 'registry/src/index.ts'),
      '@alper-design-os/analyzer': path.resolve(__dirname, 'packages/analyzer/src/index.ts'),
      '@alper-design-os/mcp-server': path.resolve(__dirname, 'packages/mcp-server/src/index.ts')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 10000
  }
});
