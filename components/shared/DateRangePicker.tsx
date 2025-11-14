"use client";

import { useEffect, useState } from "react";

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = "",
}: DateRangePickerProps) {
  const [startDateStr, setStartDateStr] = useState<string>("");
  const [endDateStr, setEndDateStr] = useState<string>("");

  // Initialize date strings from Date objects
  useEffect(() => {
    if (startDate) {
      setStartDateStr(startDate.toISOString().split("T")[0]);
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      setEndDateStr(endDate.toISOString().split("T")[0]);
    }
  }, [endDate]);

  const handleStartDateChange = (value: string) => {
    setStartDateStr(value);
    const date = value ? new Date(value) : undefined;
    onStartDateChange(date);
  };

  const handleEndDateChange = (value: string) => {
    setEndDateStr(value);
    const date = value ? new Date(value) : undefined;
    onEndDateChange(date);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <input
          type="date"
          value={startDateStr}
          onChange={(e) => handleStartDateChange(e.target.value)}
          className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all cursor-pointer"
          aria-label="Start date"
        />
      </div>
      <span className="text-slate-400 font-semibold text-lg">—</span>
      <div className="relative">
        <input
          type="date"
          value={endDateStr}
          onChange={(e) => handleEndDateChange(e.target.value)}
          className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all cursor-pointer"
          aria-label="End date"
        />
      </div>
    </div>
  );
}

