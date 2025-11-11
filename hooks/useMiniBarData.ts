// TODO: Replace with real API data from backend
// TODO: Insert API function here (fetchMiniBarData)

export interface MiniBarDataPoint {
  label: string;
  height: number;
}

export function useMiniBarData(): MiniBarDataPoint[] {
  // TODO: Connect real API later
  // const data = await fetchMiniBarData();
  // return data;

  return [
    { label: "19", height: 72 },
    { label: "25", height: 120 },
    { label: "35", height: 96 },
    { label: "45", height: 140 },
    { label: "55", height: 115 },
    { label: "65", height: 130 },
    { label: "75", height: 110 },
  ];
}

