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
  "flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2";

const calendarContainerClasses =
  "absolute z-[100] w-[16rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl";

const dayButtonBaseClasses =
  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2";

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
    "rounded-full border border-slate-200 p-1.5 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50";

  const iconClasses = [
    "h-5 w-5 text-slate-400 transition-transform duration-200",
    isOpen ? "rotate-180" : "",
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
        <span className="flex min-w-0 flex-col text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </span>
          <span className="truncate text-sm font-semibold text-slate-700">
            {value ? formatButtonText(value) : placeholder}
          </span>
        </span>
        <svg
          className={iconClasses}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6 9L10 13L14 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div
          className={`${calendarContainerClasses} ${popoverAlignmentClass}`}
          style={{ backgroundColor: '#ffffff', backdropFilter: 'blur(0px)' }}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2" style={{ backgroundColor: '#f8fafc' }}>
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
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="text-sm font-semibold text-slate-700">{monthLabel}</span>
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
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="px-3 pb-3 pt-2.5">
            <div className="grid grid-cols-7 gap-1.5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {weekdayLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="mt-2.5 flex flex-col gap-1.5">
              {calendarGrid.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((day) => {
                    const isCurrentMonth = day.getMonth() === viewDate.getMonth();
                    const selected = isSameDay(day, value);
                    const isToday = isSameDay(day, today);
                    const isDisabled = disabledDates?.(day) ?? false;

                    let dayClasses = dayButtonBaseClasses;
                    if (selected) {
                      dayClasses += " bg-slate-900 text-white shadow";
                    } else if (isToday) {
                      dayClasses += " border border-slate-300 bg-white text-slate-900";
                    } else if (!isCurrentMonth) {
                      dayClasses += " text-slate-300";
                    } else {
                      dayClasses += " text-slate-600 hover:bg-slate-100";
                    }

                    if (isDisabled) {
                      dayClasses += " cursor-not-allowed opacity-40 hover:bg-transparent";
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


