import {
  DomainResearchResult,
  ResearchEvidence,
  DomainResearchResultSchema
} from './types.js';
import { inferProductUXProfile } from '@alper-design-os/design-core';
import { SourceIntelligenceEngine } from '@alper-design-os/source-intelligence';

export interface DomainResearchInput {
  userBrief: string;
  projectContext?: {
    files?: string[];
    dependencies?: Record<string, string>;
    databaseTables?: string[];
  };
  sourcesToConsult?: string[];
  offlineMode?: boolean;
}

export class DomainIntelligenceV2Engine {
  private sourceEngine: SourceIntelligenceEngine;

  constructor(sourceEngine?: SourceIntelligenceEngine) {
    this.sourceEngine = sourceEngine || SourceIntelligenceEngine.getInstance();
  }

  public researchDomainSync(input: DomainResearchInput): DomainResearchResult {
    const brief = input.userBrief.toLowerCase();
    const evidence: ResearchEvidence[] = [];

    // Stage 1: Fallback baseline from deterministic core
    const baselineProfile = inferProductUXProfile({
      productName: 'Domain Query',
      description: input.userBrief,
      domain: input.userBrief
    });

    let classification = baselineProfile.domainClassification;
    let confidenceScore = 0.65;
    let isFallback = true;

    // Stage 2: Consult Source Intelligence catalog for empirical evidence
    if (!input.offlineMode) {
      try {
        const matchingSources = this.sourceEngine.searchSources(brief);
        if (matchingSources.length > 0) {
          isFallback = false;
          confidenceScore = Math.min(0.95, 0.70 + matchingSources.length * 0.05);

          for (const src of matchingSources.slice(0, 3)) {
            evidence.push({
              claim: `Domain patterns aligned with industry design system: ${src.name}`,
              source: src.homepage,
              confidence: Number((src.trustScore / 100).toFixed(2)),
              date: src.lastUpdated || '2026-09-01',
              relevance: `Provides component archetypes for ${src.domains.join(', ')}`
            });
          }

          // If baseline was generic and source has a specific domain classification, align with highest-trust source
          const topSource = matchingSources[0];
          if (topSource && topSource.domains.length > 0 && ((classification as string) === 'GENERAL_OPERATIONAL' || classification === 'B2B_ENTERPRISE')) {
            const specificDomain = topSource.domains.find(
              (d) =>
                d === 'INDUSTRIAL_OPERATIONAL' ||
                d === 'ENTERPRISE_SAAS' ||
                d === 'FINANCIAL_TRADING' ||
                d === 'HEALTHCARE_CLINICAL' ||
                d === 'DEVELOPER_INFRASTRUCTURE' ||
                d === 'CREATIVE_CONSUMER'
            );
            if (specificDomain) {
              classification = specificDomain as any;
            }
          }
        }
      } catch {
        // Graceful fallback to baseline on error or offline
        isFallback = true;
      }
    }

    // Stage 3: Persona / JTBD synthesis
    const personas = [
      {
        id: 'primary-operator',
        role: `${classification.replace(/_/g, ' ')} Specialist`,
        painPoints: ['High operational latency', 'Information overload in busy shifts'],
        dailyScreenTime: '6-8 hours'
      }
    ];

    const workflows = [
      {
        id: 'primary-workflow',
        name: 'Core Task Processing',
        maxLatencyMs: 250,
        interactionPreference: baselineProfile.interactionStyle
      }
    ];

    // Stage 4: Product Model & UX Profile
    const productModel = {
      domainType: classification,
      dataDensity: baselineProfile.informationDensity,
      primaryLayout: baselineProfile.recommendedDesignDirection.layoutArchetype,
      keyUXPatterns: baselineProfile.requiredVisualPatterns
    };

    const result: DomainResearchResult = {
      classification,
      subdomain: brief.split(/\s+/).slice(0, 3).join(' '),
      evidence,
      confidenceScore,
      isFallback,
      productModel,
      personas,
      workflows,
      uxProfile: baselineProfile
    };

    return DomainResearchResultSchema.parse(result);
  }

  public async researchDomain(input: DomainResearchInput): Promise<DomainResearchResult> {
    return this.researchDomainSync(input);
  }
}
