// TODO: Replace all placeholder functions with real API calls
// TODO: Add proper error handling and loading states
// TODO: Add authentication headers if needed

import type { StatsData } from "@/hooks/useStatsData";
import type { IncomeData } from "@/hooks/useIncomeData";
import type { ScatterPoint } from "@/hooks/useScatterData";
import type { BarDataPoint } from "@/hooks/useBarData";
import type { HeatmapDot } from "@/hooks/useHeatmapData";
import type { LineChartPoint } from "@/hooks/useLineChartData";
import type { CitySalesData } from "@/hooks/useCitySalesData";
import type { SalesReportData } from "@/hooks/useSalesReportData";
import type { MiniBarDataPoint } from "@/hooks/useMiniBarData";

// Dummy data - replace with actual API calls
const dummyStats: StatsData = {
  weekly: { value: 2197, change: 19.6, previousValue: 1340 },
  monthly: { value: 8903, change: 1.9, previousValue: 5441 },
  yearly: { value: 98134, change: 22, previousValue: 76330 },
};

const dummyIncome: IncomeData = {
  value: 32134,
  change: 2.5,
  previousValue: 21340,
  percentages: [6.3, 26.1, 56.2],
};

const dummySalesReport: SalesReportData = {
  value: 9134,
  change: 2.5,
  avgScore: 185301,
  monthly: 8097,
  yearly: 312134,
};

// Placeholder API functions
export async function fetchStats(): Promise<StatsData> {
  // TODO: Replace with fetch('/api/stats')
  // const response = await fetch('/api/stats');
  // if (!response.ok) throw new Error('Failed to fetch stats');
  // return response.json();
  return dummyStats;
}

export async function fetchIncome(): Promise<IncomeData> {
  // TODO: Replace with fetch('/api/income')
  // const response = await fetch('/api/income');
  // if (!response.ok) throw new Error('Failed to fetch income');
  // return response.json();
  return dummyIncome;
}

export async function fetchScatterData(): Promise<ScatterPoint[]> {
  // TODO: Replace with fetch('/api/scatter')
  // const response = await fetch('/api/scatter');
  // if (!response.ok) throw new Error('Failed to fetch scatter data');
  // return response.json();
  return Array.from({ length: 24 }, (_, i) => ({
    x: (i % 8) * 20 + 10,
    y: Math.floor(i / 8) * 30 + 15,
    size: Math.random() * 8 + 4,
  }));
}

export async function fetchBarData(): Promise<BarDataPoint[]> {
  // TODO: Replace with fetch('/api/bar')
  // const response = await fetch('/api/bar');
  // if (!response.ok) throw new Error('Failed to fetch bar data');
  // return response.json();
  return [
    { label: "50", amount: 359, height: 78 },
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

export async function fetchHeatmapData(): Promise<HeatmapDot[]> {
  // TODO: Replace with fetch('/api/heatmap')
  // const response = await fetch('/api/heatmap');
  // if (!response.ok) throw new Error('Failed to fetch heatmap data');
  // return response.json();
  return Array.from({ length: 72 }, (_, i) => ({
    intensity: Math.random() * 0.4 + 0.3,
    delay: (i % 4 === 0 ? 0.4 : i % 5 === 0 ? 0.9 : i % 7 === 0 ? 1.4 : 0) * 1000,
  }));
}

export async function fetchLineChartData(): Promise<LineChartPoint[]> {
  // TODO: Replace with fetch('/api/line')
  // const response = await fetch('/api/line');
  // if (!response.ok) throw new Error('Failed to fetch line chart data');
  // return response.json();
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

export async function fetchCitySalesData(): Promise<CitySalesData[]> {
  // TODO: Replace with fetch('/api/city-sales')
  // const response = await fetch('/api/city-sales');
  // if (!response.ok) throw new Error('Failed to fetch city sales data');
  // return response.json();
  return [
    { city: "Los Angeles", value: "261,192", delta: "+18.6%" },
    { city: "New York", value: "192,954", delta: "+12.4%" },
    { city: "Canada", value: "186,481", delta: "+9.8%" },
  ];
}

export async function fetchSalesReportData(): Promise<SalesReportData> {
  // TODO: Replace with fetch('/api/sales-report')
  // const response = await fetch('/api/sales-report');
  // if (!response.ok) throw new Error('Failed to fetch sales report data');
  // return response.json();
  return dummySalesReport;
}

export async function fetchMiniBarData(): Promise<MiniBarDataPoint[]> {
  // TODO: Replace with fetch('/api/mini-bar')
  // const response = await fetch('/api/mini-bar');
  // if (!response.ok) throw new Error('Failed to fetch mini bar data');
  // return response.json();
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

