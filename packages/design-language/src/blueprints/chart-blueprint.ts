import { ChartBlueprint } from '../types.js';

export function createChartBlueprint(
  id: string,
  title: string,
  overrides?: Partial<ChartBlueprint>
): ChartBlueprint {
  return {
    id,
    title,
    dataShape: 'TIME_SERIES',
    seriesCount: 2,
    timeSeries: true,
    interaction: {
      zoom: true,
      brush: false,
      tooltip: true,
      legend: true
    },
    largeData: false,
    realTime: false,
    accessibility: {
      screenReaderSummary: `Data chart showing ${title} trend over time.`,
      tabularAlternative: true
    },
    renderingPreference: 'AUTO',
    ...overrides
  };
}
