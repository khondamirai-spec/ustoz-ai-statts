// TODO: Replace with real API data from backend
// TODO: Insert API function here (fetchBarData)

export interface BarDataPoint {
  label: string;
  amount: number;
  height: number;
}

export function useBarData(): BarDataPoint[] {
  // TODO: Connect real API later
  // const data = await fetchBarData();
  // return data;

  return [
    { label: "70", amount: 359, height: 78 },
    { label: "159", amount: 469, height: 105 },
    { label: "189", amount: 698, height: 160 },
    { label: "259", amount: 339, height: 90 },
    { label: "369", amount: 499, height: 130 },
    { label: "459", amount: 489, height: 124 },
    { label: "509", amount: 349, height: 92 },
    { label: "569", amount: 339, height: 88 },
    { label: "659", amount: 299, height: 82 },
    { label: "759", amount: 569, height: 150 },
    { label: "859", amount: 439, height: 120 },
    { label: "959", amount: 556, height: 142 },
  ];
}

