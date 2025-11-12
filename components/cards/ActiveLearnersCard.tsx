"use client";

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SimpleStatCard } from "./SimpleStatCard";

interface ActiveLearnersCardProps {
  title: string;
  value: number;
  change: number;
  delay?: number;
  gridSpan?: number;
  children: ReactNode;
}

export function ActiveLearnersCard({
  title,
  value,
  change,
  delay = 0,
  gridSpan = 6,
  children,
}: ActiveLearnersCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState(() => {
    const now = new Date();
    return toStartOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
  });
  const [toDate, setToDate] = useState(() => toStartOfDay(new Date()));
  const [viewDate, setViewDate] = useState(fromDate);

  const today = useMemo(() => toStartOfDay(new Date()), []);
  const rightViewDate = useMemo(() => addMonths(viewDate, 1), [viewDate]);
  const leftGrid = useMemo(() => buildCalendarGrid(viewDate), [viewDate]);
  const rightGrid = useMemo(() => buildCalendarGrid(rightViewDate), [rightViewDate]);
  const weekdayLabels = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], []);

  const popoverRef = useRef<HTMLDivElement | null>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    setViewDate((prev) => addMonths(prev, -1));
  }, []);

  const handleNext = useCallback(() => {
    setViewDate((prev) => addMonths(prev, 1));
  }, []);

  const handleSelectFrom = useCallback(
    (day: Date) => {
      const normalized = toStartOfDay(day);
      setFromDate(normalized);
      if (toDate && toDate < normalized) {
        setToDate(undefined);
      }
    },
    [toDate]
  );

  const handleSelectTo = useCallback(
    (day: Date) => {
      const normalized = toStartOfDay(day);
      if (fromDate && normalized < fromDate) {
        setFromDate(normalized);
        setToDate(undefined);
        setViewDate(normalized);
        return;
      }
      setToDate(normalized);
    },
    [fromDate]
  );

  const highlightRange = useMemo(
    () =>
      fromDate && toDate
        ? {
            from: fromDate,
            to: toDate,
          }
        : undefined,
    [fromDate, toDate]
  );

  return (
    <div className="relative" style={{ gridColumn: `span ${gridSpan}` }}>
      <SimpleStatCard title={title} value={value} change={change} delay={delay} gridSpan={gridSpan} showMetrics={false}>
        {children}
      </SimpleStatCard>
      <div className="pointer-events-none absolute right-6 top-5 z-20">
        <motion.button
          type="button"
          onClick={toggleOpen}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white/95 via-white to-slate-50/80 text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2"
          whileTap={{ scale: 0.94 }}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Select date range"
        >
          <CalendarBadgeIcon />
        </motion.button>
      </div>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute right-4 top-20 z-30 w-[min(32rem,_calc(100vw-3rem))] rounded-3xl border border-white/70 bg-white/95 p-5 shadow-[0_35px_85px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  viloyatlar
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {fromDate ? formatDisplayDate(fromDate) : "Boshlanish"} — {toDate ? formatDisplayDate(toDate) : "Tugash"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60 focus-visible:ring-offset-2"
                  aria-label="Previous month"
                >
                  <Chevron direction="left" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60 focus-visible:ring-offset-2"
                  aria-label="Next month"
                >
                  <Chevron direction="right" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <CalendarColumn
                heading="From"
                monthLabel={formatMonthLabel(viewDate)}
                weekdayLabels={weekdayLabels}
                calendarGrid={leftGrid}
                viewDate={viewDate}
                selectedDate={fromDate}
                otherBoundaryDate={toDate}
                today={today}
                disabledDates={(day) => !!toDate && day > toDate}
                onDaySelect={handleSelectFrom}
                highlightRange={highlightRange}
              />
              <CalendarColumn
                heading="To"
                monthLabel={formatMonthLabel(rightViewDate)}
                weekdayLabels={weekdayLabels}
                calendarGrid={rightGrid}
                viewDate={rightViewDate}
                selectedDate={toDate}
                otherBoundaryDate={fromDate}
                today={today}
                disabledDates={(day) => !!fromDate && day < fromDate}
                onDaySelect={handleSelectTo}
                highlightRange={highlightRange}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

interface CalendarColumnProps {
  heading: string;
  monthLabel: string;
  weekdayLabels: string[];
  calendarGrid: Date[][];
  viewDate: Date;
  selectedDate?: Date;
  otherBoundaryDate?: Date;
  today: Date;
  disabledDates: (date: Date) => boolean;
  onDaySelect: (date: Date) => void;
  highlightRange?: { from: Date; to: Date };
}

const CalendarColumn = ({
  heading,
  monthLabel,
  weekdayLabels,
  calendarGrid,
  viewDate,
  selectedDate,
  otherBoundaryDate,
  today,
  disabledDates,
  onDaySelect,
  highlightRange,
}: CalendarColumnProps) => (
  <div className="rounded-2xl border border-slate-100/80 bg-white/85 p-4 shadow-[0_18px_36px_rgba(15,23,42,0.08)] backdrop-blur">
    <div className="mb-3 flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">{heading}</span>
      <span className="text-base font-semibold text-slate-900">{monthLabel}</span>
    </div>
    <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400/80">
      {weekdayLabels.map((label) => (
        <span key={label} className="py-1">
          {label}
        </span>
      ))}
    </div>
    <div className="flex flex-col gap-1">
      {calendarGrid.map((week, index) => (
        <div key={`${heading}-week-${index}`} className="grid grid-cols-7 gap-1">
          {week.map((day) => {
            const isCurrentMonth = day.getMonth() === viewDate.getMonth();
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, today);
            const disabled = disabledDates(day);
            const isOtherBoundary = isSameDay(day, otherBoundaryDate);
            const isInRange =
              highlightRange && highlightRange.from && highlightRange.to
                ? day > highlightRange.from && day < highlightRange.to
                : false;

            let classes =
              "relative flex h-10 w-10 items-center justify-center rounded-xl text-[13px] font-semibold transition-all duration-200 focus-visible:outline-none";

            if (disabled) {
              classes += " cursor-not-allowed text-slate-300 opacity-50";
            } else if (isSelected) {
              classes += " bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-400/40 hover:shadow-xl";
            } else if (isInRange) {
              classes += " bg-sky-50 text-sky-600";
            } else if (isToday) {
              classes += " border border-sky-200 bg-sky-50 text-sky-700";
            } else if (!isCurrentMonth) {
              classes += " text-slate-300";
            } else {
              classes +=
                " bg-white/80 text-slate-500 shadow-sm hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]";
            }

            return (
              <button
                key={day.toISOString()}
                type="button"
                className={classes}
                disabled={disabled}
                onClick={() => onDaySelect(day)}
              >
                {isOtherBoundary && !isSelected ? <span className="absolute inset-0 rounded-xl border border-sky-200/70" /> : null}
                {day.getDate()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

const CalendarBadgeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="2.5" y="4" width="21" height="19.5" rx="5.5" fill="#fff" />
    <rect x="2.5" y="4" width="21" height="19.5" rx="5.5" stroke="url(#calendarGradient)" strokeWidth="1.2" />
    <path d="M2.5 9.5h21" stroke="#E2E8F0" strokeWidth="1.2" />
    <rect x="8.8" y="13.2" width="3.2" height="3.2" rx="1" fill="#0EA5E9" />
    <rect x="14.8" y="13.2" width="3.2" height="3.2" rx="1" fill="#0284C7" opacity="0.85" />
    <rect x="8.8" y="17.6" width="3.2" height="3.2" rx="1" fill="#7DD3FC" />
    <rect x="14.8" y="17.6" width="3.2" height="3.2" rx="1" fill="#38BDF8" opacity="0.6" />
    <path d="M9 2.5v3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 2.5v3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="calendarGradient" x1="2.5" y1="4" x2="23.5" y2="23.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E2E8F0" />
        <stop offset="1" stopColor="#CBD5F5" />
      </linearGradient>
    </defs>
  </svg>
);

const Chevron = ({ direction }: { direction: "left" | "right" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d={direction === "left" ? "M9.5 4L5.5 8L9.5 12" : "M6.5 4L10.5 8L6.5 12"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const buildCalendarGrid = (viewDate: Date) => {
  const weekStartsOn = 1;
  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const startDay = startOfMonth.getDay();
  const offset = weekStartsOn === 1 ? (startDay + 6) % 7 : startDay;
  const gridStart = new Date(startOfMonth);
  gridStart.setDate(startOfMonth.getDate() - offset);

  return Array.from({ length: 6 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + weekIndex * 7 + dayIndex);
      return toStartOfDay(day);
    })
  );
};

const addMonths = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return toStartOfDay(next);
};

const formatMonthLabel = (value: Date) =>
  new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(value);

const formatDisplayDate = (value: Date) =>
  new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);

const toStartOfDay = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const isSameDay = (a?: Date, b?: Date) => {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};
