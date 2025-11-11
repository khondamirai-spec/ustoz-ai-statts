export interface SalesReportData {
  value: number;
  change: number;
  avgScore: number;
  monthly?: number;
  yearly?: number;
}

export function useSalesReportData(): SalesReportData {
  return {
    value: 598,
    change: 2.5,
    avgScore: 185301,
    monthly: 8097,
    yearly: 312134,
  };
}

