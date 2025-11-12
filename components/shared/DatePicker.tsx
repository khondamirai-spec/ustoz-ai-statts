import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

type DatePickerAlign = "left" | "right";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  buttonClassName?: string;
  align?: DatePickerAlign;
  weekStartsOn?: 0 | 1;
  disabledDates?: (date: Date) => boolean;
}

const baseButtonClasses =
  "group relative flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white/95 via-white to-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200/70 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60 focus-visible:ring-offset-1";

const calendarContainerClasses =
  "calendar-popover-ambient absolute z-[100] w-[min(20rem,_calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/60 bg-white/90 px-0 backdrop-blur-2xl shadow-[0_30px_70px_-35px_rgba(15,23,42,0.85)] ring-1 ring-slate-900/5 transition-all duration-200 ease-out isolate";

const dayButtonBaseClasses =
  "flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatButtonText = (value?: Date) => {
  if (!value) {
    return "Select date";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
};

const formatHeaderDate = (value?: Date) => {
  if (!value) {
    return "No date selected yet";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
};

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return toStartOfDay(next);
};

const isSameDay = (a: Date | undefined, b: Date | undefined) => {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const toStartOfDay = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

export function DatePicker({
  value,
  onChange,
  label = "Date",
  placeholder = "Select date",
  buttonClassName,
  align = "left",
  weekStartsOn = 1,
  disabledDates,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => toStartOfDay(value ?? new Date()));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const today = useMemo(() => toStartOfDay(new Date()), []);
  const quickSelectOptions = useMemo(
    () => [
      { label: "Today", date: today },
      { label: "In 3 Days", date: addDays(today, 3) },
      { label: "Next Week", date: addDays(today, 7) },
    ],
    [today]
  );
  const selectedDateLabel = useMemo(() => formatHeaderDate(value), [value]);
  const statusChipLabel = value ? "Scheduled" : "Pick date";
  const statusChipClasses = value
    ? "border-emerald-100 bg-emerald-50/90 text-emerald-600"
    : "border-slate-200 bg-slate-100/80 text-slate-500";
  const headerStatusNote = value ? "Active filter" : "No date selected";

  useEffect(() => {
    if (value) {
      const normalized = toStartOfDay(value);
      setViewDate(normalized);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleOpen = useCallback(
    (event?: ReactMouseEvent<HTMLButtonElement>) => {
      if (event) {
        event.preventDefault();
      }
      setIsOpen((prev) => !prev);
    },
    []
  );

  const handleMonthChange = useCallback((offset: number) => {
    setViewDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + offset);
      return next;
    });
  }, []);

  const handleDaySelect = useCallback(
    (date: Date) => {
      if (disabledDates?.(date)) {
        return;
      }

      const normalized = toStartOfDay(date);
      onChange(normalized);
      setViewDate(normalized);
      setIsOpen(false);
    },
    [disabledDates, onChange]
  );

  const handleQuickSelect = useCallback(
    (date: Date) => {
      handleDaySelect(date);
    },
    [handleDaySelect]
  );

  const handleJumpToToday = useCallback(() => {
    setViewDate(today);
  }, [today]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
      }).format(viewDate),
    [viewDate]
  );

  const weekdayLabels = useMemo(() => {
    if (weekStartsOn === 0) {
      return dayLabels;
    }

    return [...dayLabels.slice(1), dayLabels[0]];
  }, [weekStartsOn]);

  const calendarGrid = useMemo(() => {
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
  }, [viewDate, weekStartsOn]);

  const popoverAlignmentClass =
    align === "left"
      ? "bottom-full left-0 mb-2 origin-bottom-left"
      : "bottom-full right-0 mb-2 origin-bottom-right";

  const buttonClasses = [baseButtonClasses, buttonClassName].filter(Boolean).join(" ");

  const monthButtonClasses =
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60 focus-visible:ring-offset-2";

  const iconClasses = [
    "h-4 w-4 text-slate-400 transition-transform duration-300",
    isOpen ? "rotate-180 text-slate-600 drop-shadow-[0_4px_10px_rgba(14,165,233,0.35)]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className="relative select-none">
      <button
        type="button"
        className={buttonClasses}
        onClick={toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <span className="flex min-w-0 flex-col text-left">
            <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
              {label}
            </span>
            <span
              className={`truncate text-sm font-semibold ${value ? "text-slate-900" : "text-slate-400/90"}`}
            >
              {value ? formatButtonText(value) : placeholder}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] ${statusChipClasses}`}
            >
              {statusChipLabel}
            </span>
            <svg
              className={iconClasses}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </button>

      {isOpen ? (
        <div
          className={`${calendarContainerClasses} ${popoverAlignmentClass}`}
          style={{
            animation: "calendarPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            maxWidth: "min(20rem, calc(100vw - 2rem))",
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="space-y-3 border-b border-white/60 bg-gradient-to-br from-slate-50/85 via-white to-white px-5 pb-4 pt-5">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
              <span>{label}</span>
              <span className="text-slate-300">{headerStatusNote}</span>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Selected date</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{selectedDateLabel}</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 transition-all duration-200 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50 focus-visible:ring-offset-2"
                onClick={handleJumpToToday}
              >
                Jump to today
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickSelectOptions.map((option) => {
                const isDisabled = disabledDates?.(option.date) ?? false;
                const isActive = isSameDay(option.date, value);
                let optionClasses =
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-200";
                if (isActive) {
                  optionClasses += " border-sky-500 bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 shadow-lg shadow-sky-200/60";
                } else {
                  optionClasses += " border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900";
                }
                if (isDisabled) {
                  optionClasses += " cursor-not-allowed opacity-40 hover:border-slate-200 hover:text-slate-500";
                }

                return (
                  <button
                    key={option.label}
                    type="button"
                    className={optionClasses}
                    onClick={() => handleQuickSelect(option.date)}
                    disabled={isDisabled}
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <button
              type="button"
              aria-label="Previous month"
              className={monthButtonClasses}
              onClick={() => handleMonthChange(-1)}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 5L7.5 10L12.5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Viewing</p>
              <p className="text-base font-semibold text-slate-900">{monthLabel}</p>
            </div>
            <button
              type="button"
              aria-label="Next month"
              className={monthButtonClasses}
              onClick={() => handleMonthChange(1)}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="px-5 pb-5 pt-1">
            <div className="mb-3 grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400/90">
              {weekdayLabels.map((dayLabel) => (
                <span key={dayLabel} className="py-1">
                  {dayLabel}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              {calendarGrid.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1.5">
                  {week.map((day) => {
                    const isCurrentMonth = day.getMonth() === viewDate.getMonth();
                    const selected = isSameDay(day, value);
                    const isToday = isSameDay(day, today);
                    const isDisabled = disabledDates?.(day) ?? false;

                    let dayClasses = `${dayButtonBaseClasses} bg-white/70 text-slate-600 shadow-[0_4px_10px_rgba(15,23,42,0.08)]`;
                    if (selected) {
                      dayClasses +=
                        " bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/40";
                    } else if (isToday) {
                      dayClasses += " border border-sky-200 bg-sky-50 text-sky-700";
                    } else if (!isCurrentMonth) {
                      dayClasses += " text-slate-300 opacity-60";
                    } else {
                      dayClasses +=
                        " hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 hover:shadow-[0_12px_25px_rgba(15,23,42,0.12)]";
                    }

                    if (isDisabled) {
                      dayClasses += " cursor-not-allowed opacity-30 hover:translate-y-0 hover:shadow-none";
                    }

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        className={dayClasses}
                        onClick={() => handleDaySelect(day)}
                        disabled={isDisabled}
                        aria-pressed={selected}
                        aria-label={new Intl.DateTimeFormat(undefined, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }).format(day)}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


