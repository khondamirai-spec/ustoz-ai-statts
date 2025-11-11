// TODO: Replace with real API data from backend
// TODO: Insert API function here (fetchLineChartData)

export interface LineChartPoint {
  x: number;
  y: number;
}

export function useLineChartData(): LineChartPoint[] {
  // TODO: Connect real API later
  // const data = await fetchLineChartData();
  // return data;

  // Generate dummy line chart points
  return [
    { x: 10, y: 90 },
    { x: 40, y: 80 },
    { x: 60, y: 60 },
    { x: 90, y: 64 },
    { x: 120, y: 68 },
    { x: 140, y: 94 },
    { x: 170, y: 82 },
    { x: 200, y: 70 },
    { x: 220, y: 30 },
    { x: 260, y: 40 },
    { x: 300, y: 50 },
    { x: 320, y: 84 },
    { x: 360, y: 78 },
    { x: 380, y: 74 },
    { x: 390, y: 72 },
    { x: 400, y: 66 },
  ];
}

