import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CatalogIndexSchema } from '../sources/schema.js';

describe('API and MCP Sources Catalogs', () => {
  it('validates public-apis catalog matches normalized metadata schema', () => {
    const filePath = path.resolve(__dirname, '../sources/apis/catalog.json');
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const parsed = CatalogIndexSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
    expect(raw.catalogName).toBe('public-apis-discovery-index');
    expect(raw.items.length).toBeGreaterThan(0);

    for (const item of raw.items) {
      expect(item.sourceCatalog).toBe('PUBLIC_APIS');
      expect(item.license.type).toBeDefined();
      expect(typeof item.license.commercialUseAllowed).toBe('boolean');
    }
  });

  it('validates awesome-mcp-servers catalog matches normalized metadata schema', () => {
    const filePath = path.resolve(__dirname, '../sources/mcp/catalog.json');
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const parsed = CatalogIndexSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
    expect(raw.catalogName).toBe('awesome-mcp-servers-discovery-index');
    expect(raw.items.length).toBeGreaterThan(0);

    for (const item of raw.items) {
      expect(item.sourceCatalog).toBe('AWESOME_MCP');
      expect(item.license.type).toBeDefined();
      expect(typeof item.license.commercialUseAllowed).toBe('boolean');
      expect(['STDIO', 'SSE', 'HTTP']).toContain(item.transport);
    }
  });
});
