import {
  PageIntent,
  InformationRelevanceItem,
  InformationRelevanceItemSchema,
  InformationRelevanceAuditResult,
  InformationRelevanceAuditResultSchema,
  InformationRelevanceImportance
} from './types.js';

export interface EvaluateElementInput {
  id: string;
  title: string;
  role: string;
  metricType?: string;
  dataBindings?: string[];
  isContradictory?: boolean;
  isDeceptive?: boolean;
  isFiller?: boolean;
  valueDisplay?: string | number;
}

export function auditInformationRelevance(
  intent: PageIntent,
  elements: EvaluateElementInput[]
): InformationRelevanceAuditResult {
  const items: InformationRelevanceItem[] = [];
  const recommendations: string[] = [];

  let noiseCount = 0;
  let deceptiveCount = 0;
  let contradictionCount = 0;

  for (const el of elements) {
    const titleLower = el.title.toLowerCase();
    const roleLower = el.role.toLowerCase();

    let importance: InformationRelevanceImportance = 'SUPPORTING';
    let relevanceScore = 70;
    let signalToNoiseRatio = 0.8;
    let cognitiveLoadImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXCESSIVE' = 'LOW';
    let intentAlignment = true;
    let redundancy: 'UNIQUE' | 'COMPLEMENTARY' | 'DUPLICATE' | 'CONTRADICTORY' = 'UNIQUE';
    let rationale = `Element '${el.title}' aligns with ${intent.intentType}.`;

    // 1. Deceptive detection
    if (el.isDeceptive || titleLower.includes('fake') || titleLower.includes('hallucinated')) {
      importance = 'DECEPTIVE';
      relevanceScore = 0;
      signalToNoiseRatio = 0.0;
      cognitiveLoadImpact = 'EXCESSIVE';
      intentAlignment = false;
      redundancy = 'CONTRADICTORY';
      rationale = `Element '${el.title}' displays fabricated or ungrounded data misleading the user.`;
      deceptiveCount++;
      recommendations.push(`Remove deceptive element '${el.id}' (${el.title}) immediately.`);
    }
    // 2. Contradictory metrics
    else if (el.isContradictory) {
      importance = 'DECEPTIVE';
      relevanceScore = 15;
      signalToNoiseRatio = 0.1;
      cognitiveLoadImpact = 'HIGH';
      intentAlignment = false;
      redundancy = 'CONTRADICTORY';
      rationale = `Element '${el.title}' contradicts primary authoritative metrics on the page.`;
      contradictionCount++;
      recommendations.push(`Resolve metric discrepancy in element '${el.id}'.`);
    }
    // 3. Low-value noise or generic filler
    else if (el.isFiller || roleLower.includes('filler') || roleLower.includes('spacer-card')) {
      importance = 'NOISE';
      relevanceScore = 20;
      signalToNoiseRatio = 0.2;
      cognitiveLoadImpact = 'HIGH';
      intentAlignment = false;
      redundancy = 'DUPLICATE';
      rationale = `Element '${el.title}' acts as visual filler adding cognitive load without informational benefit.`;
      noiseCount++;
      recommendations.push(`Prune filler widget '${el.id}' to reduce cognitive clutter.`);
    }
    // 4. Intent specific primary elements
    else if (
      (intent.intentType === 'OPERATIONAL_MONITORING' && (roleLower.includes('telemetry') || roleLower.includes('sensor') || roleLower.includes('status'))) ||
      (intent.intentType === 'EXECUTIVE_DECISION' && (roleLower.includes('kpi') || roleLower.includes('summary'))) ||
      (intent.intentType === 'DATA_ENTRY_TRANSACTION' && (roleLower.includes('form') || roleLower.includes('input')))
    ) {
      importance = 'PRIMARY';
      relevanceScore = 95;
      signalToNoiseRatio = 0.95;
      cognitiveLoadImpact = 'LOW';
      intentAlignment = true;
      redundancy = 'UNIQUE';
      rationale = `Directly serves core goal '${intent.primaryGoal}'.`;
    }

    const item: InformationRelevanceItem = InformationRelevanceItemSchema.parse({
      elementId: el.id,
      elementTitle: el.title,
      importance,
      relevanceScore,
      signalToNoiseRatio,
      cognitiveLoadImpact,
      intentAlignment,
      redundancy,
      rationale
    });

    items.push(item);
  }

  // Calculate overall score
  const totalRelevance = items.reduce((acc, curr) => acc + curr.relevanceScore, 0);
  const averageRelevance = items.length > 0 ? Math.round(totalRelevance / items.length) : 100;

  const passed = deceptiveCount === 0 && contradictionCount === 0 && averageRelevance >= 60;

  return InformationRelevanceAuditResultSchema.parse({
    overallRelevanceScore: averageRelevance,
    noiseCount,
    deceptiveCount,
    contradictionCount,
    passed,
    items,
    recommendations
  });
}
