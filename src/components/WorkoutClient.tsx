"use client";

import { useCallback, useRef, useState } from "react";
import {
  addMonths,
  format,
  isSameMonth,
  parseISO,
  startOfWeek,
  subMonths,
} from "date-fns";
import clsx from "clsx";
import { WORKOUT_TEMPLATE, DOW_LABEL } from "@/lib/workoutTemplate";
import SectionHead from "@/components/SectionHead";
import WorkoutDayPanel, { type SessionRow } from "@/components/WorkoutDayPanel";
import WorkoutMonthView from "@/components/WorkoutMonthView";

type MonthRow = { date: string; completed: boolean };

function monthKeyOf(date: string) {
  return date.slice(0, 7);
}

export default function WorkoutClient({
  initialView,
  weekDates: initialWeekDates,
  weekRowsByDate: initialWeekRowsByDate,
  selectedDate: initialSelectedDate,
  month: initialMonth,
  monthRows: initialMonthRows,
}: {
  initialView: "week" | "month";
  weekDates: string[];
  weekRowsByDate: Record<string, SessionRow[]>;
  selectedDate: string;
  month: string;
  monthRows: MonthRow[];
}) {
  const [view, setView] = useState(initialView);
  const [weekDates, setWeekDates] = useState(initialWeekDates);
  const [weekRowsByDate, setWeekRowsByDate] = useState(initialWeekRowsByDate);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [month, setMonth] = useState(initialMonth);
  const [monthRows, setMonthRows] = useState(initialMonthRows);
  const [monthLoading, setMonthLoading] = useState(false);

  const weekCache = useRef(
    new Map<string, { weekDates: string[]; rowsByDate: Record<string, SessionRow[]> }>()
  );
  const monthCache = useRef(new Map<string, MonthRow[]>([[initialMonth, initialMonthRows]]));

  const updateUrl = useCallback((params: Record<string, string | null>) => {
    const url = new URL(window.location.href);
    for (const [k, v] of Object.entries(params)) {
      if (v == null) url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    }
    window.history.replaceState(null, "", url.toString());
  }, []);

  async function ensureWeekLoaded(date: string) {
    if (weekDates.includes(date)) return;
    const weekKey = format(startOfWeek(new Date(`${date}T00:00:00`), { weekStartsOn: 1 }), "yyyy-MM-dd");
    const cached = weekCache.current.get(weekKey);
    if (cached) {
      setWeekDates(cached.weekDates);
      setWeekRowsByDate(cached.rowsByDate);
      return;
    }
    const res = await fetch(`/api/workouts/week?date=${date}`);
    const data: { weekDates: string[]; rows: (SessionRow & { date: string })[] } = await res.json();
    const rowsByDate: Record<string, SessionRow[]> = {};
    for (const r of data.rows) {
      const list = rowsByDate[r.date] ?? [];
      list.push({
        session: r.session,
        dayType: r.dayType,
        title: r.title,
        completed: r.completed,
        exercises: (r.exercises ?? []).map((ex) => ({ ...ex, done: Boolean(ex.done) })),
      });
      rowsByDate[r.date] = list;
    }
    weekCache.current.set(weekKey, { weekDates: data.weekDates, rowsByDate });
    setWeekDates(data.weekDates);
    setWeekRowsByDate(rowsByDate);
  }

  function selectDate(date: string) {
    setSelectedDate(date);
    setView("week");
    updateUrl({ date, view: null, month: null });
    ensureWeekLoaded(date);
  }

  async function goToMonth(newMonth: string) {
    setMonth(newMonth);
    updateUrl({ view: "month", month: newMonth, date: null });
    const cached = monthCache.current.get(newMonth);
    if (cached) {
      setMonthRows(cached);
      return;
    }
    setMonthLoading(true);
    try {
      const res = await fetch(`/api/workouts/month?month=${newMonth}`);
      const data: MonthRow[] = await res.json();
      monthCache.current.set(newMonth, data);
      setMonthRows(data);
    } finally {
      setMonthLoading(false);
    }
  }

  function switchView(v: "week" | "month") {
    setView(v);
    if (v === "month") updateUrl({ view: "month", month, date: null });
    else updateUrl({ view: null, month: null, date: selectedDate });
  }

  function handleSessionsChange(date: string, sessions: SessionRow[]) {
    setWeekRowsByDate((prev) => ({ ...prev, [date]: sessions }));

    const session1 = sessions.find((s) => s.session === 1);
    if (!session1) return;
    const completed = session1.completed;
    const key = monthKeyOf(date);

    function patch(rows: MonthRow[]): MonthRow[] {
      if (rows.some((r) => r.date === date)) {
        return rows.map((r) => (r.date === date ? { ...r, completed } : r));
      }
      return [...rows, { date, completed }];
    }

    if (key === month) setMonthRows(patch);
    const cached = monthCache.current.get(key);
    if (cached) monthCache.current.set(key, patch(cached));
  }

  const selected = parseISO(`${selectedDate}T00:00:00`.slice(0, 19));
  const template = WORKOUT_TEMPLATE[selected.getDay()];
  const selectedSessions = weekRowsByDate[selectedDate] ?? [];
  const monthDate = parseISO(`${month}-01`);
  const isCurrentMonth = isSameMonth(monthDate, new Date());

  return (
    <div className="rise-in">
      <p className="font-display text-sm uppercase tracking-[0.08em] text-rust">
        Lịch tập
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold uppercase text-ink">
        Workout
      </h1>

      <div className="mt-5 flex gap-1.5">
        <button
          onClick={() => switchView("week")}
          className={clsx(
            "rounded-full px-3 py-1 font-display text-[11px] uppercase tracking-wide transition-colors",
            view === "week" ? "bg-ink text-paper" : "bg-paper-dim text-muted"
          )}
        >
          Tuần này
        </button>
        <button
          onClick={() => switchView("month")}
          className={clsx(
            "rounded-full px-3 py-1 font-display text-[11px] uppercase tracking-wide transition-colors",
            view === "month" ? "bg-ink text-paper" : "bg-paper-dim text-muted"
          )}
        >
          Theo tháng
        </button>
      </div>

      {view === "month" ? (
        <div className="mt-4">
          <WorkoutMonthView
            monthParam={month}
            rows={monthRows}
            loading={monthLoading}
            isCurrentMonth={isCurrentMonth}
            onPrevMonth={() => goToMonth(format(subMonths(monthDate, 1), "yyyy-MM"))}
            onNextMonth={() => goToMonth(format(addMonths(monthDate, 1), "yyyy-MM"))}
            onSelectDate={selectDate}
          />
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {weekDates.map((d) => {
              const dow = new Date(`${d}T00:00:00`).getDay();
              const t = WORKOUT_TEMPLATE[dow];
              const daySessions = weekRowsByDate[d] ?? [];
              const primary = daySessions.find((r) => r.session === 1);
              const done = primary?.completed;
              const extraCount = daySessions.filter((r) => r.session > 1).length;
              const isSelected = d === selectedDate;

              return (
                <button
                  key={d}
                  onClick={() => selectDate(d)}
                  className={clsx(
                    "flex flex-col items-center rounded-sm border p-2 text-center",
                    isSelected
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper-card text-ink"
                  )}
                >
                  <span className="font-display text-[10px] uppercase opacity-70">
                    {DOW_LABEL[dow].replace("Thứ ", "T")}
                  </span>
                  <span
                    className={clsx(
                      "mt-1 text-[10px] font-medium",
                      !isSelected &&
                        (t.dayType === "strength"
                          ? "text-steel"
                          : t.dayType === "cardio"
                            ? "text-rust"
                            : t.dayType === "hiit"
                              ? "text-rust-soft"
                              : "text-faint")
                    )}
                  >
                    {t.title}
                  </span>
                  <span className="mt-1 text-[10px]">
                    {done && "✓"}
                    {extraCount > 0 && ` +${extraCount}`}
                  </span>
                </button>
              );
            })}
          </div>

          <SectionHead
            title={`${DOW_LABEL[selected.getDay()]} · ${template.title}`}
            note={template.duration}
          />

          <WorkoutDayPanel
            date={selectedDate}
            template={template}
            dbSessions={selectedSessions}
            onSessionsChange={(sessions) => handleSessionsChange(selectedDate, sessions)}
          />
        </>
      )}
    </div>
  );
}
