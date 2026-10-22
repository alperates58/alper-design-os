/**
 * Project Graph & Code Intelligence Engine V2 (Graphify Inspired)
 * Deterministic AST extraction, provenance tracking (EXTRACTED vs INFERRED),
 * god node identification, change impact propagation, dependency path traversal,
 * and affected test detection.
 */

export type GraphProvenance = 'EXTRACTED' | 'INFERRED';

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
  relationship: 'IMPORTS' | 'CALLS' | 'INHERITS' | 'ROUTES_TO' | 'TESTS' | 'REFERENCES_ADR';
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

export class ProjectGraphV2 {
  private nodes: Map<string, CodeEntityNode> = new Map();
  private edges: CodeDependencyEdge[] = [];
  private adjacencyList: Map<string, Set<string>> = new Map();
  private reverseAdjacencyList: Map<string, Set<string>> = new Map();

  /**
   * Builds code intelligence graph from an array of workspace files via deterministic static extraction.
   */
  public buildGraph(files: Array<{ path: string; content?: string }>): {
    nodeCount: number;
    edgeCount: number;
    extractedCount: number;
    inferredCount: number;
    buildDurationMs: number;
  } {
    const startTime = Date.now();
    this.nodes.clear();
    this.edges = [];
    this.adjacencyList.clear();
    this.reverseAdjacencyList.clear();

    // Pass 1: Extract File, Route, Component and Test entities
    for (const file of files) {
      const p = file.path.replace(/\\/g, '/');
      const content = file.content || '';
      const isTest = p.includes('test') || p.includes('spec');
      const isComponent = p.includes('components') || p.includes('blueprints') || p.endsWith('.tsx') || p.endsWith('.blade.php');

      const fileNode: CodeEntityNode = {
        id: p,
        name: p.split('/').pop() || p,
        kind: isTest ? 'TEST' : isComponent ? 'COMPONENT' : 'FILE',
        filePath: p,
        provenance: 'EXTRACTED',
        provenanceEvidence: `AST File inspection of ${p}`,
        inDegree: 0,
        outDegree: 0
      };
      this.addNode(fileNode);

      // Extract exported functions / classes (AST heuristic)
      const exportMatches = content.matchAll(/export\s+(?:async\s+)?(?:function|class|const)\s+([A-Za-z0-9_]+)/g);
      for (const m of exportMatches) {
        const symbolId = `${p}#${m[1]}`;
        this.addNode({
          id: symbolId,
          name: m[1],
          kind: 'FUNCTION',
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
          evidence: `File exports symbol ${m[1]}`
        });
      }

      // Extract imports
      const importMatches = content.matchAll(/(?:import|from)\s+['"]([^'"]+)['"]/g);
      for (const m of importMatches) {
        const rawTarget = m[1];
        if (rawTarget.startsWith('.')) {
          // Resolved local file path heuristic
          const resolvedPath = this.resolveRelativeImport(p, rawTarget);
          this.addEdge({
            source: p,
            target: resolvedPath,
            relationship: 'IMPORTS',
            provenance: 'EXTRACTED',
            evidence: `Static import statement from ${p} to ${rawTarget}`
          });
        }
      }

      // Extract Express/Router routes
      const routeMatches = content.matchAll(/(?:router|app)\.(get|post|put|delete)\(\s*['"]([^'"]+)['"]/gi);
      for (const m of routeMatches) {
        const routeId = `ROUTE:${m[1].toUpperCase()}:${m[2]}`;
        this.addNode({
          id: routeId,
          name: `${m[1].toUpperCase()} ${m[2]}`,
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
          evidence: `Controller routes to ${m[2]}`
        });
      }

      // Extract ADR references
      const adrMatches = content.matchAll(/ADR-(\d+)/g);
      for (const m of adrMatches) {
        const adrId = `ADR-${m[1]}`;
        if (!this.nodes.has(adrId)) {
          this.addNode({
            id: adrId,
            name: `ADR-${m[1]}`,
            kind: 'ADR',
            filePath: `docs/adr/ADR-${m[1]}.md`,
            provenance: 'INFERRED',
            provenanceEvidence: `Code comment reference in ${p}`,
            inDegree: 0,
            outDegree: 0
          });
        }
        this.addEdge({
          source: p,
          target: adrId,
          relationship: 'REFERENCES_ADR',
          provenance: 'INFERRED',
          evidence: `Symbol references decision ADR-${m[1]}`
        });
      }

      // If test file, link to tested modules
      if (isTest) {
        for (const targetFile of files) {
          const targetNorm = targetFile.path.replace(/\\/g, '/');
          const baseName = targetNorm.split('/').pop()?.replace(/\.(ts|js|tsx)$/, '');
          if (baseName && p.includes(baseName) && p !== targetNorm) {
            this.addEdge({
              source: p,
              target: targetNorm,
              relationship: 'TESTS',
              provenance: 'EXTRACTED',
              evidence: `Test naming convention and import mapping`
            });
          }
        }
      }
    }

    const duration = Date.now() - startTime;
    let extractedCount = 0;
    let inferredCount = 0;

    for (const node of this.nodes.values()) {
      if (node.provenance === 'EXTRACTED') extractedCount++;
      else inferredCount++;
    }

    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.length,
      extractedCount,
      inferredCount,
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
    if (!this.nodes.has(edge.target)) {
      // Create stub node if not already present
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

  private resolveRelativeImport(fromFile: string, relativeTarget: string): string {
    const parts = fromFile.split('/');
    parts.pop(); // remove file name
    const relParts = relativeTarget.split('/');

    for (const r of relParts) {
      if (r === '.') continue;
      if (r === '..') {
        parts.pop();
      } else {
        parts.push(r);
      }
    }

    let resolved = parts.join('/');
    if (resolved.endsWith('.js')) {
      resolved = resolved.replace(/\.js$/, '.ts');
    } else if (!resolved.endsWith('.ts') && !resolved.endsWith('.tsx')) {
      resolved += '.ts';
    }
    return resolved;
  }
}
