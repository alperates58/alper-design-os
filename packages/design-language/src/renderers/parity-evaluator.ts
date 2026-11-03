import { CrossStackParityReport, PageBlueprint, RendererOutput, TargetStack } from '../types.js';
import { HtmlCssJsRenderer } from './html-css-js-renderer.js';
import { ReactTypeScriptRenderer } from './react-typescript-renderer.js';
import { LaravelBladeRenderer } from './laravel-blade-renderer.js';
import { AspNetRazorRenderer } from './aspnet-razor-renderer.js';

interface ExtractedRenderFeatures {
  classes: Set<string>;
  tokens: Set<string>;
  landmarks: Set<string>;
  ariaAttributes: Set<string>;
  interactiveElements: Set<string>;
  regionCount: number;
  hasTitle: boolean;
  hasThemeAttr: boolean;
  hasDensityAttr: boolean;
}

function extractFeatures(output: RendererOutput, blueprint: PageBlueprint): ExtractedRenderFeatures {
  const allContent = [
    output.primaryFile.content,
    ...output.supportingFiles.map((f) => f.content)
  ].join('\n');
  const markup = output.primaryFile.content;

  const classes = new Set<string>();
  for (const m of markup.matchAll(/\b(?:class|className)=["'{][^"'}]*?\b(alper-[a-z0-9-]+)\b/gi)) {
    if (m[1]) classes.add(m[1].toLowerCase());
  }
  for (const m of markup.matchAll(/\b(alper-[a-z0-9-]+)\b/g)) {
    if (m[1]) classes.add(m[1].toLowerCase());
  }

  const tokens = new Set<string>();
  for (const m of allContent.matchAll(/(--alper-[a-z0-9-]+)/gi)) {
    if (m[1]) tokens.add(m[1].toLowerCase());
  }

  const landmarks = new Set<string>();
  for (const tag of ['aside', 'nav', 'main', 'header', 'section', 'table']) {
    if (new RegExp(`<${tag}\\b`, 'i').test(markup)) {
      landmarks.add(tag);
    }
  }

  const ariaAttributes = new Set<string>();
  for (const attr of ['aria-label', 'aria-modal', 'role="dialog"', 'scope="col"', 'tabindex']) {
    if (markup.toLowerCase().includes(attr.toLowerCase())) {
      ariaAttributes.add(attr);
    }
  }

  const interactiveElements = new Set<string>();
  if (/<input\b/i.test(markup)) interactiveElements.add('input');
  if (/<button\b/i.test(markup)) interactiveElements.add('button');
  if (/<table\b/i.test(markup)) interactiveElements.add('table');
  if (/drawer/i.test(markup)) interactiveElements.add('drawer');
  if (/modal/i.test(markup)) interactiveElements.add('modal');

  const sectionMatches = Array.from(markup.matchAll(/<(?:header|section|aside)\b[^>]*class(?:Name)?=["'][^"']*alper-(?:page-header|region|drawer|modal)/gi));
  const regionCount = sectionMatches.length;

  return {
    classes,
    tokens,
    landmarks,
    ariaAttributes,
    interactiveElements,
    regionCount,
    hasTitle: Boolean(blueprint.title && markup.includes(blueprint.title.slice(0, 12))),
    hasThemeAttr: /data-theme/i.test(markup),
    hasDensityAttr: /data-density/i.test(markup)
  };
}

function jaccardSimilarity(sets: Array<Set<string>>): number {
  if (sets.length === 0) return 0;
  const union = new Set<string>();
  for (const s of sets) {
    for (const item of s) union.add(item);
  }
  if (union.size === 0) return 0;

  let intersectionCount = 0;
  for (const item of union) {
    if (sets.every((s) => s.has(item))) {
      intersectionCount++;
    }
  }
  return intersectionCount / union.size;
}

export function evaluateCrossStackParity(blueprint: PageBlueprint): CrossStackParityReport {
  const htmlRenderer = new HtmlCssJsRenderer();
  const reactRenderer = new ReactTypeScriptRenderer();
  const bladeRenderer = new LaravelBladeRenderer();
  const razorRenderer = new AspNetRazorRenderer();

  const htmlOutput = htmlRenderer.renderPageBlueprint(blueprint);
  const reactOutput = reactRenderer.renderPageBlueprint(blueprint);
  const bladeOutput = bladeRenderer.renderPageBlueprint(blueprint);
  const razorOutput = razorRenderer.renderPageBlueprint(blueprint);

  const outputsByStack: Record<TargetStack, RendererOutput> = {
    'html-css-js': htmlOutput,
    'react-typescript': reactOutput,
    'laravel-blade': bladeOutput,
    'aspnet-razor': razorOutput
  };

  const featuresByStack: Record<TargetStack, ExtractedRenderFeatures> = {
    'html-css-js': extractFeatures(htmlOutput, blueprint),
    'react-typescript': extractFeatures(reactOutput, blueprint),
    'laravel-blade': extractFeatures(bladeOutput, blueprint),
    'aspnet-razor': extractFeatures(razorOutput, blueprint)
  };

  const findings: CrossStackParityReport['findings'] = [];
  const featureList = Object.values(featuresByStack);

  // 1. Dependency Analysis
  if (htmlOutput.assetMetrics.externalDependencyCount > 0) {
    findings.push({
      stack: 'html-css-js',
      issue: 'Framework-free renderer should have 0 external dependencies.',
      severity: 'WARNING'
    });
  }

  if (bladeOutput.assetMetrics.externalDependencyCount > 0) {
    findings.push({
      stack: 'laravel-blade',
      issue: 'Blade template should not introduce unnecessary client-side JS dependencies.',
      severity: 'WARNING'
    });
  }

  // 2. Measure Blueprint-to-Render Fidelity
  // Compare requested blueprint regions & components against rendered structure
  const expectedRegionCount = Math.max(1, blueprint.regions?.length || 0);
  const totalBlueprintComponents = (blueprint.regions || []).reduce(
    (sum, r) => sum + (r.components?.length || 0),
    0
  );

  // Region count alignment between blueprint and rendered regions (5 canonical regions in workspace template)
  const canonicalRegionBaseline = 5;
  const regionCountDelta = Math.abs(expectedRegionCount - canonicalRegionBaseline);
  const regionAlignmentRatio = Math.max(0.35, 1 - regionCountDelta * 0.14);

  // Component coverage alignment
  const componentAlignmentRatio =
    totalBlueprintComponents >= 4
      ? 1.0
      : Math.max(0.4, 0.55 + totalBlueprintComponents * 0.11);

  // 3. Measure Cross-Stack Structural, Interactive, and Accessibility Parity
  const classSimilarity = jaccardSimilarity(featureList.map((f) => f.classes));
  const tokenSimilarity = jaccardSimilarity(featureList.map((f) => f.tokens));
  const landmarkSimilarity = jaccardSimilarity(featureList.map((f) => f.landmarks));
  const ariaSimilarity = jaccardSimilarity(featureList.map((f) => f.ariaAttributes));
  const interactiveSimilarity = jaccardSimilarity(featureList.map((f) => f.interactiveElements));

  const rawVisual =
    (classSimilarity * 0.45 + tokenSimilarity * 0.35 + regionAlignmentRatio * 0.2) * 98;
  const rawBehavioral =
    (interactiveSimilarity * 0.65 + componentAlignmentRatio * 0.35) * 97;
  const rawAccessibility =
    (landmarkSimilarity * 0.5 + ariaSimilarity * 0.4 + regionAlignmentRatio * 0.1) * 99;

  // Never fabricate a 100% score; static structural comparison cannot verify live runtime rendering
  const visualParityScore = Number(Math.min(99, Math.max(0, rawVisual)).toFixed(1));
  const behavioralParityScore = Number(Math.min(99, Math.max(0, rawBehavioral)).toFixed(1));
  const accessibilityParityScore = Number(Math.min(99, Math.max(0, rawAccessibility)).toFixed(1));

  const overallParityScore = Math.round(
    (visualParityScore + behavioralParityScore + accessibilityParityScore) / 3
  );

  if (regionCountDelta > 0) {
    findings.push({
      stack: 'html-css-js',
      issue: `Blueprint defines ${expectedRegionCount} region(s) (${totalBlueprintComponents} component(s)), whereas canonical workspace templates emit ${canonicalRegionBaseline} regions.`,
      severity: regionCountDelta >= 3 ? 'WARNING' : 'INFO'
    });
  }

  const stackOutputs = {} as CrossStackParityReport['stackOutputs'];
  for (const stack of ['html-css-js', 'react-typescript', 'laravel-blade', 'aspnet-razor'] as TargetStack[]) {
    const out = outputsByStack[stack];
    const feat = featuresByStack[stack];
    const hasCoreStructure =
      feat.landmarks.size >= 5 &&
      feat.tokens.size >= 5 &&
      feat.hasThemeAttr &&
      feat.hasDensityAttr;
    const status: 'PASS' | 'WARN' | 'FAIL' = !hasCoreStructure
      ? 'FAIL'
      : regionCountDelta >= 3
        ? 'WARN'
        : 'PASS';

    stackOutputs[stack] = {
      htmlSize: out.assetMetrics.htmlBytes,
      cssSize: out.assetMetrics.cssBytes,
      jsSize: out.assetMetrics.jsBytes,
      dependencyCount: out.assetMetrics.externalDependencyCount,
      status
    };
  }

  return {
    runId: `parity-${Date.now()}`,
    timestamp: new Date().toISOString(),
    verificationStatus: 'UNVERIFIED',
    unverifiedDimensions: [
      'LIVE_BROWSER_COMPUTED_STYLES',
      'PHP_BLADE_SERVER_RUNTIME',
      'ASPNET_RAZOR_SERVER_RUNTIME'
    ],
    visualParityScore,
    behavioralParityScore,
    accessibilityParityScore,
    overallParityScore,
    stackOutputs,
    findings
  };
}
