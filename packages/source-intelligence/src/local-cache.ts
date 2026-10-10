import fs from 'fs';
import path from 'path';
import { SourceMetadata, SourceMetadataSchema } from './types.js';

export class SourceLocalCache {
  private cacheDir: string;
  private cacheFilePath: string;

  constructor(customBaseDir: string = process.cwd()) {
    this.cacheDir = path.resolve(customBaseDir, '.alper-design-os/cache/sources');
    this.cacheFilePath = path.join(this.cacheDir, 'sources-metadata.json');
  }

  public hasCache(): boolean {
    return fs.existsSync(this.cacheFilePath);
  }

  public readCachedSources(): SourceMetadata[] {
    if (!this.hasCache()) {
      return [];
    }
    try {
      const raw = fs.readFileSync(this.cacheFilePath, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.sources)) {
        const validated: SourceMetadata[] = [];
        for (const item of data.sources) {
          const parsed = SourceMetadataSchema.safeParse(item);
          if (parsed.success) {
            validated.push(parsed.data);
          }
        }
        return validated;
      }
    } catch {
      // Fallback on corrupt file
    }
    return [];
  }

  public writeCachedSources(sources: SourceMetadata[]): void {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }

      const payload = {
        lastSyncedAt: new Date().toISOString(),
        sourceCount: sources.length,
        version: '1.0.0',
        sources
      };

      fs.writeFileSync(this.cacheFilePath, JSON.stringify(payload, null, 2), 'utf8');
    } catch (err) {
      console.warn('[SourceLocalCache] Could not write cache file:', err);
    }
  }

  public clearCache(): void {
    if (this.hasCache()) {
      try {
        fs.unlinkSync(this.cacheFilePath);
      } catch {
        // ignore
      }
    }
  }
}

export const sourceLocalCache = new SourceLocalCache();
