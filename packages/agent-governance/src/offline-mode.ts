export interface OfflineCapabilityAudit {
  isOffline: boolean;
  localCapabilitiesAvailable: string[];
  networkDependentFeatures: Array<{ feature: string; status: 'AVAILABLE' | 'REQUIRES_NETWORK'; fallbackAvailable: boolean }>;
}

export function auditOfflineCapabilities(isNetworkAvailable: boolean = true): OfflineCapabilityAudit {
  const isOffline = !isNetworkAvailable;

  const localCapabilitiesAvailable = [
    'Local DTCG Token Compilation (CSS, SCSS, TS, Tailwind)',
    'Local Stack Detection & Project Analysis',
    'Local WCAG 2.1 AA/AAA Static Accessibility Auditor',
    'Cached Source Catalog (40+ Design Systems & Guidelines)',
    'Local Behavioral Contract Extraction',
    'Local Regression Baseline & Diff Engine',
    'Deterministic Domain Intelligence Fallback Inference',
    'Action Planner, Scope Guard, & Blast Radius Calculator'
  ];

  const networkDependentFeatures = [
    {
      feature: 'Live Web Search for Upstream Documentation',
      status: (isOffline ? 'REQUIRES_NETWORK' : 'AVAILABLE') as 'AVAILABLE' | 'REQUIRES_NETWORK',
      fallbackAvailable: true
    },
    {
      feature: 'Live Upstream Source Catalog Freshness Hash Check',
      status: (isOffline ? 'REQUIRES_NETWORK' : 'AVAILABLE') as 'AVAILABLE' | 'REQUIRES_NETWORK',
      fallbackAvailable: true
    },
    {
      feature: 'Remote Registry NPM/Packagist Package Resolution',
      status: (isOffline ? 'REQUIRES_NETWORK' : 'AVAILABLE') as 'AVAILABLE' | 'REQUIRES_NETWORK',
      fallbackAvailable: true
    }
  ];

  return {
    isOffline,
    localCapabilitiesAvailable,
    networkDependentFeatures
  };
}
