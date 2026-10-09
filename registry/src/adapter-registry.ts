import { AdapterContract, ProjectFile, StackDetectionMatch } from '@alper-design-os/adapter-contract';
import { GenericWebAdapter } from '@alper-design-os/adapter-generic-web';
import { HtmlCssJsAdapter } from '@alper-design-os/adapter-html-css-js';
import { ReactAdapter } from '@alper-design-os/adapter-react';
import { ReactTypeScriptAdapter } from '@alper-design-os/adapter-react-typescript';
import { PhpAdapter } from '@alper-design-os/adapter-php';
import { LaravelBladeAdapter } from '@alper-design-os/adapter-laravel-blade';
import { AspNetRazorAdapter } from '@alper-design-os/adapter-aspnet-razor';

export interface AdapterMatchResult {
  adapter: AdapterContract;
  match: StackDetectionMatch;
}

export class AdapterRegistry {
  private static instance: AdapterRegistry;
  private adapters: Map<string, AdapterContract> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }

  public register(adapter: AdapterContract): void {
    this.adapters.set(adapter.id, adapter);
  }

  public get(id: string): AdapterContract | undefined {
    return this.adapters.get(id);
  }

  public getAll(): AdapterContract[] {
    return Array.from(this.adapters.values());
  }

  public detectBestAdapter(files: ProjectFile[]): AdapterMatchResult | null {
    let bestMatch: AdapterMatchResult | null = null;
    let highestConfidence = -1;

    for (const adapter of this.adapters.values()) {
      const match = adapter.detect(files);
      if (match.matched && match.confidence > highestConfidence) {
        highestConfidence = match.confidence;
        bestMatch = { adapter, match };
      }
    }

    return bestMatch;
  }

  private registerDefaults(): void {
    // Specific framework adapters first, generic fallback last
    this.register(new ReactTypeScriptAdapter());
    this.register(new ReactAdapter());
    this.register(new LaravelBladeAdapter());
    this.register(new AspNetRazorAdapter());
    this.register(new PhpAdapter());
    this.register(new HtmlCssJsAdapter());
    this.register(new GenericWebAdapter());
  }
}

export default AdapterRegistry;
