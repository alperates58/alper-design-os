import { SourceMetadata } from './types.js';

export class SourceSearchIndex {
  private invertedIndex: Map<string, Set<string>> = new Map();
  private sourceMap: Map<string, SourceMetadata> = new Map();

  constructor(sources: SourceMetadata[] = []) {
    this.buildIndex(sources);
  }

  public buildIndex(sources: SourceMetadata[]): void {
    this.invertedIndex.clear();
    this.sourceMap.clear();

    for (const source of sources) {
      this.sourceMap.set(source.id, source);
      const textToTokenize = [
        source.name,
        source.description,
        source.type,
        ...(source.frameworks || []),
        ...(source.technologies || []),
        ...(source.strengths || []),
        ...(source.domains || []),
        source.maintainer
      ].join(' ');

      const tokens = this.tokenize(textToTokenize);
      for (const token of tokens) {
        if (!this.invertedIndex.has(token)) {
          this.invertedIndex.set(token, new Set());
        }
        this.invertedIndex.get(token)!.add(source.id);
      }
    }
  }

  public search(query: string, limit: number = 20): SourceMetadata[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      return Array.from(this.sourceMap.values()).slice(0, limit);
    }

    const scoreMap = new Map<string, number>();

    for (const token of queryTokens) {
      // Direct token match
      const matchingIds = this.invertedIndex.get(token);
      if (matchingIds) {
        for (const id of matchingIds) {
          scoreMap.set(id, (scoreMap.get(id) || 0) + 10);
        }
      }

      // Partial prefix match
      for (const [indexedToken, idSet] of this.invertedIndex.entries()) {
        if (indexedToken !== token && indexedToken.includes(token)) {
          for (const id of idSet) {
            scoreMap.set(id, (scoreMap.get(id) || 0) + 3);
          }
        }
      }
    }

    const sortedIds = Array.from(scoreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    const results: SourceMetadata[] = [];
    for (const id of sortedIds) {
      const s = this.sourceMap.get(id);
      if (s) results.push(s);
      if (results.length >= limit) break;
    }

    return results;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 1);
  }
}
