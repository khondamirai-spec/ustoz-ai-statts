// TODO: Replace with real API data from backend
// TODO: Insert API function here (fetchHeatmapData)

export interface HeatmapDot {
  intensity: number;
  delay: number;
}

export function useHeatmapData(): HeatmapDot[] {
  // TODO: Connect real API later
  // const data = await fetchHeatmapData();
  // return data;

  // Generate dummy heatmap dots (72 dots for 18x4 grid)
  return Array.from({ length: 72 }, (_, i) => ({
    intensity: Math.random() * 0.4 + 0.3,
    delay: (i % 4 === 0 ? 0.4 : i % 5 === 0 ? 0.9 : i % 7 === 0 ? 1.4 : 0) * 1000,
  }));
}

