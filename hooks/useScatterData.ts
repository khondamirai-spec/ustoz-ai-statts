// TODO: Replace with real API data from backend
// TODO: Insert API function here (fetchScatterData)

export interface ScatterPoint {
  x: number;
  y: number;
  size: number;
}

export function useScatterData(): ScatterPoint[] {
  // TODO: Connect real API later
  // const data = await fetchScatterData();
  // return data;

  // Generate dummy scatter points
  return Array.from({ length: 24 }, (_, i) => ({
    x: (i % 8) * 20 + 10,
    y: Math.floor(i / 8) * 30 + 15,
    size: Math.random() * 8 + 4,
  }));
}

