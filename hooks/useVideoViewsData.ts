// TODO: Replace with real API data from backend
// TODO: Insert API function here (fetchVideoViewsData)

export interface VideoViewsData {
  value: number;
  change: number;
  avgScore: number;
  monthly?: number;
  yearly?: number;
}

export function useVideoViewsData(): VideoViewsData {
  return {
    value: 598,
    change: 2.5,
    avgScore: 2299201,
    monthly: 8097,
    yearly: 312134,
  };
}

