export interface IncomeData {
  value: number;
  change: number;
  previousValue: number;
  percentages: number[];
}

export function useIncomeData(): IncomeData {
  return {
    value: 18868,
    change: 2.5,
    previousValue: 21340,
    percentages: [6.3, 26.1, 56.2],
  };
}

