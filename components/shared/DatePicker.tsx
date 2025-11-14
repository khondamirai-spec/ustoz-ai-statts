"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";

type DatePickerAlign = "left" | "right";

export interface DatePickerHandle {
  open: () => void;
  close: () => void;
}

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  buttonClassName?: string;
  align?: DatePickerAlign;
  weekStartsOn?: 0 | 1;
  disabledDates?: (date: Date) => boolean;
  buttonRef?: RefObject<HTMLButtonElement>;
  triggerRef?: RefObject<HTMLElement | null>;
}

const baseButtonClasses =
  "group relative flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white/95 via-white to-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200/70 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60 focus-visible:ring-offset-1";

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

export const DatePicker = forwardRef<DatePickerHandle, DatePickerProps>(function DatePicker({
  value,
  onChange,
  label = "Date",
  placeholder = "Select date",
  buttonClassName,
  align = "left",
  weekStartsOn = 1,
  disabledDates,
  buttonRef: externalButtonRef,
  triggerRef,
}, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => toStartOfDay(value ?? new Date()));
  const [popupPosition, setPopupPosition] = useState<{ top: number; left?: number; right?: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const internalButtonRef = useRef<HTMLButtonElement | null>(null);
  const buttonRef = (externalButtonRef ?? internalButtonRef) as RefObject<HTMLButtonElement>;
  const positionRef = (triggerRef ?? buttonRef) as RefObject<HTMLElement>;
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
    if (!isOpen) {
      setPopupPosition(null);
      return;
    }

    // Calculate popup position when opening
    if (positionRef.current) {
      const rect = positionRef.current.getBoundingClientRect();
      const popupWidth = 272; // min(17rem) = 272px
      const spacing = 8; // mt-2 = 8px
      
      if (align === "left") {
        setPopupPosition({
          top: rect.bottom + spacing,
          left: rect.left,
        });
      } else {
        setPopupPosition({
          top: rect.bottom + spacing,
          right: window.innerWidth - rect.right,
        });
      }
    }

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

    const handleResize = () => {
      if (positionRef.current) {
        const rect = positionRef.current.getBoundingClientRect();
        const spacing = 8;
        
        if (align === "left") {
          setPopupPosition({
            top: rect.bottom + spacing,
            left: rect.left,
          });
        } else {
          setPopupPosition({
            top: rect.bottom + spacing,
            right: window.innerWidth - rect.right,
          });
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [isOpen, align, positionRef]);

  const toggleOpen = useCallback(
    (event?: ReactMouseEvent<HTMLButtonElement>) => {
      if (event) {
        event.preventDefault();
      }
      setIsOpen((prev) => !prev);
    },
    []
  );

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }), [open, close]);

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
      ? "top-full left-0 mt-2 origin-top-left"
      : "top-full right-0 mt-2 origin-top-right";

  const buttonClasses = [baseButtonClasses, buttonClassName].filter(Boolean).join(" ");

  const iconClasses = [
    "h-4 w-4 text-slate-400 transition-transform duration-300",
    isOpen ? "rotate-180 text-slate-600 drop-shadow-[0_4px_10px_rgba(14,165,233,0.35)]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className="relative select-none">
      <button
        ref={buttonRef}
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

      {isOpen && popupPosition ? (
        <div
          className="calendar-popover-ambient fixed z-[9999] w-[min(17rem,_calc(100vw-2rem))] rounded-2xl"
          style={{
            top: `${popupPosition.top}px`,
            ...(popupPosition.left !== undefined ? { left: `${popupPosition.left}px` } : {}),
            ...(popupPosition.right !== undefined ? { right: `${popupPosition.right}px` } : {}),
            animation: "calendarPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Header Section */}
          <div className="calendar-header-section">
            <div className="calendar-header-label">{label}</div>
            <div className="calendar-selected-date-display">{selectedDateLabel}</div>
            <div className="calendar-quick-select-container">
              {quickSelectOptions.map((option) => {
                const isDisabled = disabledDates?.(option.date) ?? false;
                const isActive = isSameDay(option.date, value);
                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`calendar-quick-select-btn ${isActive ? "active" : ""}`}
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

          {/* Navigation Section */}
          <div className="calendar-navigation">
            <button
              type="button"
              aria-label="Previous month"
              className="calendar-nav-button"
              onClick={() => handleMonthChange(-1)}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 5L7.5 10L12.5 15"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="calendar-month-year-display">
              <div className="calendar-month-year-label">Viewing</div>
              <div className="calendar-month-year-value">{monthLabel}</div>
            </div>
            <button
              type="button"
              aria-label="Next month"
              className="calendar-nav-button"
              onClick={() => handleMonthChange(1)}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Days Header */}
          <div className="calendar-days-header">
            {weekdayLabels.map((dayLabel) => (
              <div key={dayLabel} className="calendar-day-header">
                {dayLabel}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid-container">
            <div className="calendar-grid">
              {calendarGrid.map((week, weekIndex) => (
                <div key={weekIndex} className="calendar-week-row">
                  {week.map((day) => {
                    const isCurrentMonth = day.getMonth() === viewDate.getMonth();
                    const selected = isSameDay(day, value);
                    const isToday = isSameDay(day, today);
                    const isDisabled = disabledDates?.(day) ?? false;

                    let dayClasses = "calendar-day";
                    if (selected) {
                      dayClasses += " calendar-day-selected";
                    } else if (isToday) {
                      dayClasses += " calendar-day-today";
                    }
                    if (!isCurrentMonth) {
                      dayClasses += " calendar-day-other-month";
                    }
                    if (isDisabled) {
                      dayClasses += " calendar-day-disabled";
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

          {/* Footer */}
          <div className="calendar-footer">
            <button
              type="button"
              className="calendar-footer-button"
              onClick={handleJumpToToday}
            >
              Jump to Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
});


