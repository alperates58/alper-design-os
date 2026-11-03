/**
 * Project Graph & Code Intelligence Engine V2 (Phase 3 Reconstruction)
 * Deterministic AST/lexical extraction, strict provenance tracking (EXTRACTED vs INFERRED vs HEURISTIC),
 * comment/string-literal immunity, path-alias & re-export resolution, dynamic route support,
 * duplicate basename disambiguation, and scan coverage reporting.
 */

export type GraphProvenance = 'EXTRACTED' | 'INFERRED' | 'HEURISTIC';

export interface CodeEntityNode {
  id: string;
  name: string;
  kind: 'FILE' | 'FUNCTION' | 'CLASS' | 'INTERFACE' | 'ROUTE' | 'COMPONENT' | 'TEST' | 'ADR';
  filePath: string;
  lineStart?: number;
  lineEnd?: number;
  provenance: GraphProvenance;
  provenanceEvidence: string;
  inDegree: number;
  outDegree: number;
  metadata?: Record<string, any>;
}

export interface CodeDependencyEdge {
  source: string;
  target: string;
  relationship: 'IMPORTS' | 'RE_EXPORTS' | 'CALLS' | 'INHERITS' | 'ROUTES_TO' | 'TESTS' | 'REFERENCES_ADR';
  provenance: GraphProvenance;
  evidence: string;
}

export interface ChangeImpactAnalysis {
  rootChangedEntity: string;
  directlyAffected: string[];
  transitivelyAffected: string[];
  totalAffectedCount: number;
  affectedTestSuites: string[];
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impactExplanation: string;
}

export interface GodNodeMetric {
  nodeId: string;
  name: string;
  kind: string;
  filePath: string;
  totalDegree: number;
  inDegree: number;
  outDegree: number;
  centralityRank: number;
  architecturalWarning?: string;
}

export interface GraphBuildReport {
  nodeCount: number;
  edgeCount: number;
  extractedCount: number;
  inferredCount: number;
  heuristicCount: number;
  totalInputFiles: number;
  supportedFileCount: number;
  unsupportedFiles: string[];
  coveragePercent: number;
  buildDurationMs: number;
}

const SUPPORTED_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.php', '.cs', '.razor', '.cshtml', '.html', '.css', '.scss', '.json'
]);

/**
 * Strips comments and masks string literals EXCEPT module specifier strings in genuine
 * import/export/require statements so imports inside comments or string constants are ignored.
 */
function stripCommentsAndMaskNonImportStrings(source: string): {
  codeWithoutComments: string;
  commentsOnly: string;
} {
  let codeOut = '';
  let commentsOut = '';
  let i = 0;
  const len = source.length;

  while (i < len) {
    const ch = source[i];
    const next = source[i + 1];

    // Single-line comment
    if (ch === '/' && next === '/') {
      const start = i;
      i += 2;
      while (i < len && source[i] !== '\n') i++;
      commentsOut += source.slice(start, i) + '\n';
      codeOut += ' ';
      continue;
    }

    // Multi-line comment
    if (ch === '/' && next === '*') {
      const start = i;
      i += 2;
      while (i < len && !(source[i] === '*' && source[i + 1] === '/')) i++;
      i += 2;
      commentsOut += source.slice(start, i) + '\n';
      codeOut += ' ';
      continue;
    }

    // String literal ('...', "...", `...`)
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch;
      const start = i;
      i++;
      while (i < len && source[i] !== quote) {
        if (source[i] === '\\') i += 2;
        else i++;
      }
      if (i < len) i++;
      const literal = source.slice(start, i);

      // Check preceding code token on the current statement to see if this string is a module specifier or route path
      const lookbehind = codeOut.slice(Math.max(0, codeOut.length - 120));
      const isModuleOrRouteSpecifier =
        /(?:^|[;\n{}])\s*(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,$]+\s+from\s+)?$/m.test(lookbehind) ||
        /\b(?:from|import|require)\s*\(?\s*$/m.test(lookbehind) ||
        /(?:router|app|Route)\s*(?:\.|::)\s*(?:get|post|put|delete|patch|use|all)\s*\(\s*$/i.test(lookbehind);

      if (isModuleOrRouteSpecifier && quote !== '`') {
        codeOut += literal;
      } else if (
        quote === '`' &&
        /(?:router|app|Route)\s*(?:\.|::)\s*(?:get|post|put|delete|patch|use|all)\s*\(\s*$/i.test(lookbehind)
      ) {
        codeOut += literal;
      } else {
        // Mask arbitrary string literal content so "import './fake'" inside a string constant is never parsed as an import
        codeOut += `${quote}__STRING_LITERAL__${quote}`;
      }
      continue;
    }

    codeOut += ch;
    i++;
  }

  return { codeWithoutComments: codeOut, commentsOnly: commentsOut };
}

export class ProjectGraphV2 {
  private nodes: Map<string, CodeEntityNode> = new Map();
  private edges: CodeDependencyEdge[] = [];
  private adjacencyList: Map<string, Set<string>> = new Map();
  private reverseAdjacencyList: Map<string, Set<string>> = new Map();

  public getNodes(): CodeEntityNode[] {
    return Array.from(this.nodes.values());
  }

  public getEdges(): CodeDependencyEdge[] {
    return [...this.edges];
  }

  /**
   * Builds code intelligence graph from an array of workspace files via deterministic static extraction.
   */
  public buildGraph(files: Array<{ path: string; content?: string }>): GraphBuildReport {
    const startTime = Date.now();
    this.nodes.clear();
    this.edges = [];
    this.adjacencyList.clear();
    this.reverseAdjacencyList.clear();

    const normalizedFiles = files.map(f => ({
      path: f.path.replace(/\\/g, '/').replace(/^\.\//, ''),
      content: f.content || ''
    }));

    const knownFileSet = new Set(normalizedFiles.map(f => f.path));

    // Count basenames to disambiguate duplicate basenames
    const basenameCounts = new Map<string, number>();
    for (const f of normalizedFiles) {
      const base = f.path.split('/').pop() || f.path;
      basenameCounts.set(base, (basenameCounts.get(base) || 0) + 1);
    }

    // Parse tsconfig.json path aliases if present
    const pathAliases: Array<{ prefix: string; targetPrefix: string }> = [
      { prefix: '@/', targetPrefix: 'src/' },
      { prefix: '~/', targetPrefix: 'src/' }
    ];
    const tsconfigFile = normalizedFiles.find(f => f.path === 'tsconfig.json' || f.path.endsWith('/tsconfig.json'));
    if (tsconfigFile && tsconfigFile.content) {
      try {
        const cleanedJson = tsconfigFile.content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        const parsed = JSON.parse(cleanedJson);
        const pathsObj = parsed?.compilerOptions?.paths;
        if (pathsObj && typeof pathsObj === 'object') {
          for (const [aliasPattern, targets] of Object.entries(pathsObj)) {
            if (Array.isArray(targets) && typeof targets[0] === 'string') {
              const prefix = aliasPattern.replace(/\*$/, '');
              const targetPrefix = String(targets[0]).replace(/^\.\//, '').replace(/\*$/, '');
              pathAliases.unshift({ prefix, targetPrefix });
            }
          }
        }
      } catch {
        // ignore malformed tsconfig
      }
    }

    const unsupportedFiles: string[] = [];
    let supportedFileCount = 0;

    // Pass 1: Extract File, Route, Component, and Test nodes
    for (const file of normalizedFiles) {
      const p = file.path;
      const extMatch = p.match(/(\.[a-z0-9]+)$/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';

      if (!SUPPORTED_EXTENSIONS.has(ext)) {
        unsupportedFiles.push(p);
        continue;
      }
      supportedFileCount++;

      const baseName = p.split('/').pop() || p;
      const isDuplicateBasename = (basenameCounts.get(baseName) || 0) > 1;
      const displayName = isDuplicateBasename ? p : baseName;

      const isTest = /(?:^|\/)(?:tests?|__tests__|specs?)\/|\.(?:test|spec)\.[a-z0-9]+$/i.test(p);
      const isComponent = p.includes('components') || p.includes('blueprints') || p.endsWith('.tsx') || p.endsWith('.blade.php');

      const fileNode: CodeEntityNode = {
        id: p,
        name: displayName,
        kind: isTest ? 'TEST' : isComponent ? 'COMPONENT' : 'FILE',
        filePath: p,
        provenance: 'EXTRACTED',
        provenanceEvidence: `Static file inspection of ${p}`,
        inDegree: 0,
        outDegree: 0,
        metadata: {
          baseName,
          disambiguated: isDuplicateBasename
        }
      };
      this.addNode(fileNode);

      // File-based dynamic routes (Next.js / Remix / Astro style: pages/users/[id].tsx, app/orders/[orderId]/route.ts)
      const fileRouteMatch = p.match(/^(?:src\/)?(?:pages|app)\/(.+)\.(?:tsx|ts|jsx|js)$/i);
      if (fileRouteMatch && !isTest) {
        const rawSeg = fileRouteMatch[1]
          .replace(/\/(?:index|page|route)$/i, '')
          .replace(/\[\.\.\.([^\]]+)\]/g, ':$1*')
          .replace(/\[([^\]]+)\]/g, ':$1');
        const routePath = '/' + (rawSeg === 'index' ? '' : rawSeg);
        const routeId = `ROUTE:ALL:${routePath}`;
        this.addNode({
          id: routeId,
          name: `ALL ${routePath}`,
          kind: 'ROUTE',
          filePath: p,
          provenance: 'EXTRACTED',
          provenanceEvidence: `File-system route convention in ${p}`,
          inDegree: 0,
          outDegree: 0
        });
        this.addEdge({
          source: p,
          target: routeId,
          relationship: 'ROUTES_TO',
          provenance: 'EXTRACTED',
          evidence: `File-system dynamic/static route ${routePath}`
        });
      }
    }

    // Pass 2: Extract symbols, imports, re-exports, routes, ADR references, and test mappings
    for (const file of normalizedFiles) {
      const p = file.path;
      if (!this.nodes.has(p)) continue;

      const rawContent = file.content;
      const { codeWithoutComments, commentsOnly } = stripCommentsAndMaskNonImportStrings(rawContent);
      const isTest = this.nodes.get(p)?.kind === 'TEST';
      const explicitlyImportedFiles = new Set<string>();

      // 1. Extract exported functions / classes / interfaces (only from uncommented code)
      const exportMatches = codeWithoutComments.matchAll(
        /\bexport\s+(?:default\s+)?(?:async\s+)?(function|class|interface|const|let|var)\s+([A-Za-z0-9_]+)/g
      );
      for (const m of exportMatches) {
        const declKind = m[1];
        const symName = m[2];
        const symbolId = `${p}#${symName}`;
        this.addNode({
          id: symbolId,
          name: symName,
          kind: declKind === 'class' ? 'CLASS' : declKind === 'interface' ? 'INTERFACE' : 'FUNCTION',
          filePath: p,
          provenance: 'EXTRACTED',
          provenanceEvidence: `Export declaration in ${p}`,
          inDegree: 0,
          outDegree: 0
        });
        this.addEdge({
          source: p,
          target: symbolId,
          relationship: 'IMPORTS',
          provenance: 'EXTRACTED',
          evidence: `File exports symbol ${symName}`
        });
      }

      // 2. Extract static imports & dynamic import() / require() from uncommented, string-masked code
      const importRegexes = [
        /(?:^|[;\n{}])\s*import\s+(?:type\s+)?(?:[\w*{}\s,$]+\s+from\s+)?['"]([^'"]+)['"]/gm,
        /\b(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g
      ];
      for (const rx of importRegexes) {
        for (const m of codeWithoutComments.matchAll(rx)) {
          const rawTarget = m[1];
          if (!rawTarget || rawTarget === '__STRING_LITERAL__') continue;
          const resolvedPath = this.resolveImportSpecifier(p, rawTarget, knownFileSet, pathAliases);
          if (resolvedPath) {
            explicitlyImportedFiles.add(resolvedPath);
            this.addEdge({
              source: p,
              target: resolvedPath,
              relationship: 'IMPORTS',
              provenance: 'EXTRACTED',
              evidence: `Static import '${rawTarget}' in ${p}`
            });
          }
        }
      }

      // 3. Extract re-exports: export * from '...' and export { a, b } from '...'
      const reExportRegex = /(?:^|[;\n{}])\s*export\s+(?:type\s+)?(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/gm;
      for (const m of codeWithoutComments.matchAll(reExportRegex)) {
        const rawTarget = m[1];
        if (!rawTarget || rawTarget === '__STRING_LITERAL__') continue;
        const resolvedPath = this.resolveImportSpecifier(p, rawTarget, knownFileSet, pathAliases);
        if (resolvedPath) {
          explicitlyImportedFiles.add(resolvedPath);
          this.addEdge({
            source: p,
            target: resolvedPath,
            relationship: 'RE_EXPORTS',
            provenance: 'EXTRACTED',
            evidence: `Re-export statement from '${rawTarget}' in ${p}`
          });
          this.addEdge({
            source: p,
            target: resolvedPath,
            relationship: 'IMPORTS',
            provenance: 'EXTRACTED',
            evidence: `Module re-exports '${rawTarget}' in ${p}`
          });
        }
      }

      // 4. Extract Express / Fastify / Laravel HTTP routes (static and dynamic e.g. /users/:id, /orders/{id}, `/items/${id}`)
      const routeMatches = codeWithoutComments.matchAll(
        /(?:router|app|Route)\s*(?:\.|::)\s*(get|post|put|delete|patch)\s*\(\s*(['"`])([^'"`]+)\2/gi
      );
      for (const m of routeMatches) {
        const method = m[1].toUpperCase();
        const rawRoute = m[3].replace(/\$\{([^}]+)\}/g, ':$1');
        if (rawRoute === '__STRING_LITERAL__') continue;
        const routeId = `ROUTE:${method}:${rawRoute}`;
        this.addNode({
          id: routeId,
          name: `${method} ${rawRoute}`,
          kind: 'ROUTE',
          filePath: p,
          provenance: 'EXTRACTED',
          provenanceEvidence: `HTTP route handler defined in ${p}`,
          inDegree: 0,
          outDegree: 0
        });
        this.addEdge({
          source: p,
          target: routeId,
          relationship: 'ROUTES_TO',
          provenance: 'EXTRACTED',
          evidence: `Controller routes to ${method} ${rawRoute}`
        });
      }

      // 5. Extract ADR references (labeled INFERRED when from code/comments)
      const adrMatches = (codeWithoutComments + '\n' + commentsOnly).matchAll(/\bADR-(\d+)\b/g);
      for (const m of adrMatches) {
        const adrId = `ADR-${m[1]}`;
        if (!this.nodes.has(adrId)) {
          this.addNode({
            id: adrId,
            name: `ADR-${m[1]}`,
            kind: 'ADR',
            filePath: `docs/adr/ADR-${m[1]}.md`,
            provenance: 'INFERRED',
            provenanceEvidence: `Reference in ${p}`,
            inDegree: 0,
            outDegree: 0
          });
        }
        this.addEdge({
          source: p,
          target: adrId,
          relationship: 'REFERENCES_ADR',
          provenance: 'INFERRED',
          evidence: `File references decision ADR-${m[1]}`
        });
      }

      // 6. Link test files to tested modules:
      //    - EXTRACTED when the test file explicitly imports the target module
      //    - HEURISTIC when inferred from disambiguated naming convention (never for generic 'index' or ambiguous duplicate basenames)
      if (isTest) {
        for (const importedTarget of explicitlyImportedFiles) {
          if (importedTarget !== p && this.nodes.get(importedTarget)?.kind !== 'TEST') {
            this.addEdge({
              source: p,
              target: importedTarget,
              relationship: 'TESTS',
              provenance: 'EXTRACTED',
              evidence: `Explicit import of '${importedTarget}' in test file '${p}'`
            });
          }
        }

        const testBase = (p.split('/').pop() || '').replace(/\.(?:test|spec)\.[a-z0-9]+$/i, '');
        if (testBase && testBase.toLowerCase() !== 'index') {
          const matchingTargets = normalizedFiles.filter(tf => {
            if (tf.path === p) return false;
            if (/(?:^|\/)(?:tests?|__tests__|specs?)\/|\.(?:test|spec)\.[a-z0-9]+$/i.test(tf.path)) return false;
            const targetBase = (tf.path.split('/').pop() || '').replace(/\.[a-z0-9]+$/i, '');
            return targetBase === testBase;
          });

          // Only infer heuristic test link if target basename is unique OR shares relative path directory structure
          for (const tf of matchingTargets) {
            if (explicitlyImportedFiles.has(tf.path)) continue;
            const isUniqueTarget = matchingTargets.length === 1;
            const testDirStem = p.split('/').slice(0, -1).filter(seg => !/^tests?$|^__tests__$|^specs?$/i.test(seg)).join('/');
            const targetDirStem = tf.path.split('/').slice(0, -1).filter(seg => !/^src$|^lib$/i.test(seg)).join('/');
            const sharesDirectoryContext = Boolean(testDirStem && targetDirStem && (targetDirStem.endsWith(testDirStem) || testDirStem.endsWith(targetDirStem)));

            if (isUniqueTarget || sharesDirectoryContext) {
              this.addEdge({
                source: p,
                target: tf.path,
                relationship: 'TESTS',
                provenance: 'HEURISTIC',
                evidence: `Heuristic test filename stem match ('${testBase}') between '${p}' and '${tf.path}'`
              });
            }
          }
        }
      }
    }

    const duration = Date.now() - startTime;
    let extractedCount = 0;
    let inferredCount = 0;
    let heuristicCount = 0;

    for (const node of this.nodes.values()) {
      if (node.provenance === 'EXTRACTED') extractedCount++;
      else if (node.provenance === 'HEURISTIC') heuristicCount++;
      else inferredCount++;
    }
    for (const edge of this.edges) {
      if (edge.provenance === 'HEURISTIC') heuristicCount++;
    }

    const totalInputFiles = normalizedFiles.length;
    const coveragePercent =
      totalInputFiles === 0 ? 100 : Math.round((supportedFileCount / totalInputFiles) * 10000) / 100;

    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.length,
      extractedCount,
      inferredCount,
      heuristicCount,
      totalInputFiles,
      supportedFileCount,
      unsupportedFiles,
      coveragePercent,
      buildDurationMs: duration
    };
  }

  public addNode(node: CodeEntityNode): void {
    if (!this.nodes.has(node.id)) {
      this.nodes.set(node.id, node);
      this.adjacencyList.set(node.id, new Set());
      this.reverseAdjacencyList.set(node.id, new Set());
    }
  }

  public addEdge(edge: CodeDependencyEdge): void {
    const duplicate = this.edges.some(
      e => e.source === edge.source && e.target === edge.target && e.relationship === edge.relationship
    );
    if (duplicate) return;

    if (!this.nodes.has(edge.target)) {
      this.addNode({
        id: edge.target,
        name: edge.target.split('/').pop() || edge.target,
        kind: 'FILE',
        filePath: edge.target,
        provenance: edge.provenance,
        provenanceEvidence: edge.evidence,
        inDegree: 0,
        outDegree: 0
      });
    }

    this.edges.push(edge);

    this.adjacencyList.get(edge.source)?.add(edge.target);
    this.reverseAdjacencyList.get(edge.target)?.add(edge.source);

    const srcNode = this.nodes.get(edge.source);
    const tgtNode = this.nodes.get(edge.target);
    if (srcNode) srcNode.outDegree++;
    if (tgtNode) tgtNode.inDegree++;
  }

  public queryEntity(id: string): CodeEntityNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Finds shortest dependency path between two nodes using Breadth-First Search (BFS).
   */
  public queryDependencyPath(startNodeId: string, targetNodeId: string): string[] | null {
    if (!this.nodes.has(startNodeId) || !this.nodes.has(targetNodeId)) return null;
    if (startNodeId === targetNodeId) return [startNodeId];

    const queue: string[][] = [[startNodeId]];
    const visited = new Set<string>([startNodeId]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];

      const neighbors = this.adjacencyList.get(current) || new Set();
      for (const next of neighbors) {
        if (next === targetNodeId) {
          return [...path, next];
        }
        if (!visited.has(next)) {
          visited.add(next);
          queue.push([...path, next]);
        }
      }
    }

    return null;
  }

  /**
   * Computes all downstream entities affected when a given entity changes.
   */
  public showChangeImpact(modifiedNodeId: string): ChangeImpactAnalysis {
    const directlyAffected = Array.from(this.reverseAdjacencyList.get(modifiedNodeId) || []);
    const transitivelyVisited = new Set<string>();

    const queue = [...directlyAffected];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (!transitivelyVisited.has(curr)) {
        transitivelyVisited.add(curr);
        const callers = this.reverseAdjacencyList.get(curr) || new Set();
        for (const caller of callers) {
          if (!transitivelyVisited.has(caller)) {
            queue.push(caller);
          }
        }
      }
    }

    const affectedTests: string[] = [];
    for (const id of [modifiedNodeId, ...transitivelyVisited]) {
      const node = this.nodes.get(id);
      if (node?.kind === 'TEST') {
        affectedTests.push(id);
      }
    }

    const totalCount = transitivelyVisited.size;
    const riskRating: ChangeImpactAnalysis['riskRating'] =
      totalCount > 15 ? 'CRITICAL' : totalCount > 6 ? 'HIGH' : totalCount > 2 ? 'MEDIUM' : 'LOW';

    return {
      rootChangedEntity: modifiedNodeId,
      directlyAffected,
      transitivelyAffected: Array.from(transitivelyVisited),
      totalAffectedCount: totalCount,
      affectedTestSuites: Array.from(new Set(affectedTests)),
      riskRating,
      impactExplanation: `Modifying "${modifiedNodeId}" directly impacts ${directlyAffected.length} callers and transitively reaches ${totalCount} entities across the graph, requiring execution of ${affectedTests.length} test suites.`
    };
  }

  /**
   * Identifies "god nodes" (central modules with unusually high degree centrality).
   */
  public findGodNodes(degreeThreshold = 5): GodNodeMetric[] {
    const list: GodNodeMetric[] = [];

    for (const node of this.nodes.values()) {
      const total = node.inDegree + node.outDegree;
      if (total >= degreeThreshold) {
        list.push({
          nodeId: node.id,
          name: node.name,
          kind: node.kind,
          filePath: node.filePath,
          totalDegree: total,
          inDegree: node.inDegree,
          outDegree: node.outDegree,
          centralityRank: 0,
          architecturalWarning:
            total > 15
              ? 'Extreme god node! Central bottleneck with high blast radius. Consider decomposition.'
              : 'Highly coupled hub module.'
        });
      }
    }

    list.sort((a, b) => b.totalDegree - a.totalDegree);
    list.forEach((item, idx) => {
      item.centralityRank = idx + 1;
    });

    return list;
  }

  /**
   * Maps an array of modified files directly to all affected test files.
   */
  public detectAffectedTests(modifiedFiles: string[]): string[] {
    const affectedTests = new Set<string>();

    for (const file of modifiedFiles) {
      const norm = file.replace(/\\/g, '/');
      const impact = this.showChangeImpact(norm);
      for (const t of impact.affectedTestSuites) {
        affectedTests.add(t);
      }
    }

    return Array.from(affectedTests);
  }

  /**
   * Provides human-readable explanation of how entity A connects to entity B.
   */
  public explainRelationship(nodeAId: string, nodeBId: string): string {
    const path = this.queryDependencyPath(nodeAId, nodeBId);
    if (!path) {
      return `No direct or transitive dependency exists from "${nodeAId}" to "${nodeBId}".`;
    }

    if (path.length === 2) {
      const edge = this.edges.find((e) => e.source === nodeAId && e.target === nodeBId);
      return `"${nodeAId}" directly ${edge?.relationship || 'CONNECTS_TO'} "${nodeBId}" (${edge?.provenance || 'EXTRACTED'}). Evidence: ${edge?.evidence || 'Direct edge'}.`;
    }

    return `"${nodeAId}" transitively depends on "${nodeBId}" through path [${path.join(' -> ')}] with ${path.length - 1} hops.`;
  }

  private resolveImportSpecifier(
    fromFile: string,
    rawTarget: string,
    knownFiles: Set<string>,
    pathAliases: Array<{ prefix: string; targetPrefix: string }>
  ): string | null {
    let candidateBase = '';

    if (rawTarget.startsWith('.')) {
      const parts = fromFile.split('/');
      parts.pop();
      for (const r of rawTarget.split('/')) {
        if (r === '.' || r === '') continue;
        if (r === '..') parts.pop();
        else parts.push(r);
      }
      candidateBase = parts.join('/');
    } else {
      const matchedAlias = pathAliases.find(a => rawTarget.startsWith(a.prefix));
      if (!matchedAlias) {
        // Bare external package import (e.g. 'react', 'zod') -> ignore for local file graph
        return null;
      }
      candidateBase = matchedAlias.targetPrefix + rawTarget.slice(matchedAlias.prefix.length);
    }

    const strippedExt = candidateBase.replace(/\.(js|jsx|mjs|cjs)$/i, '');
    const candidates = [
      candidateBase,
      `${strippedExt}.ts`,
      `${strippedExt}.tsx`,
      `${strippedExt}.js`,
      `${strippedExt}.jsx`,
      `${candidateBase}/index.ts`,
      `${candidateBase}/index.tsx`,
      `${candidateBase}/index.js`
    ];

    for (const c of candidates) {
      if (knownFiles.has(c)) {
        return c;
      }
    }

    // Fallback deterministic normalization when target file is not in input batch
    if (candidateBase.endsWith('.js')) {
      return candidateBase.replace(/\.js$/, '.ts');
    }
    if (!/\.[a-z0-9]+$/i.test(candidateBase)) {
      return `${candidateBase}.ts`;
    }
    return candidateBase;
  }
}
