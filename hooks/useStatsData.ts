import { useMemo } from "react";

export interface NewUsersData {
  totalUsers: number;
  change: number;
  chartData: {
    date: string;
    axisLabel: string;
    isoDate: string;
    users: number;
  }[];
}

// Deterministic seeded random function for consistent server/client rendering
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function useNewUsersData(startDate?: Date, endDate?: Date): NewUsersData {
  const normalizedStart = startDate ? new Date(startDate) : undefined;
  const normalizedEnd = endDate ? new Date(endDate) : undefined;

  const chartData = useMemo(() => {
    const data: {
      date: string;
      axisLabel: string;
      isoDate: string;
      users: number;
    }[] = [];
    // Use a fixed default date range to avoid hydration mismatch
    // This ensures server and client render the same initial data
    const defaultEnd = new Date('2024-01-31T00:00:00.000Z');
    const defaultStart = new Date('2024-01-01T00:00:00.000Z');
    const start = normalizedStart ?? defaultStart;
    const end = normalizedEnd ?? defaultEnd;

    const days = Math.max(
      0,
      Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    // Use a seed based on date range for deterministic randomness
    const baseSeed = (start.getTime() + end.getTime()) % 1000000;

    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      // Use seeded random based on date index for consistency
      const seed = baseSeed + i;
      const users = Math.floor(seededRandom(seed) * 150) + 50;

      data.push({
        date: currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        axisLabel: currentDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        }),
        isoDate: currentDate.toISOString(),
        users,
      });
    }

    return data;
  }, [
    normalizedStart?.getTime() ?? null,
    normalizedEnd?.getTime() ?? null,
  ]);

  const totalUsers = useMemo(
    () => chartData.reduce((sum, item) => sum + item.users, 0),
    [chartData]
  );

  const change = useMemo(() => {
    // Use a fixed default date range to avoid hydration mismatch
    const defaultEnd = new Date('2024-01-31T00:00:00.000Z');
    const defaultStart = new Date('2024-01-01T00:00:00.000Z');
    const start = normalizedStart ?? defaultStart;
    const end = normalizedEnd ?? defaultEnd;
    // Use seeded random based on date range for consistent change value
    const seed = (start.getTime() + end.getTime()) % 1000000;
    return Math.round(((seededRandom(seed) * 40) - 10) * 10) / 10;
  }, [normalizedStart?.getTime() ?? null, normalizedEnd?.getTime() ?? null]);

  return {
    totalUsers,
    change,
    chartData,
  };
}

// Keep the old export for backward compatibility
export interface StatsData {
  weekly: {
    value: number;
    change: number;
    previousValue: number;
  };
  monthly: {
    value: number;
    change: number;
    previousValue: number;
  };
  yearly: {
    value: number;
    change: number;
    previousValue: number;
  };
}

export function useStatsData(): StatsData {
  return {
    weekly: { value: 2197, change: 19.6, previousValue: 1340 },
    monthly: { value: 8903, change: 1.9, previousValue: 5441 },
    yearly: { value: 98134, change: 22, previousValue: 76330 },
  };
}

