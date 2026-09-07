import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import clsx from "clsx";
import { WORKOUT_TEMPLATE, DOW_LABEL } from "@/lib/workoutTemplate";

type Row = { date: string; completed: boolean };

export default function WorkoutMonthView({
  monthParam,
  rows,
}: {
  monthParam: string; // yyyy-MM
  rows: Row[];
}) {
  const month = parseISO(`${monthParam}-01`);
  const rowByDate = new Map(rows.map((r) => [r.date, r]));

  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const today = new Date();
  let done = 0;
  let due = 0;
  for (const d of eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })) {
    if (d > today) continue;
    const t = WORKOUT_TEMPLATE[d.getDay()];
    if (t.dayType === "rest") continue;
    due += 1;
    if (rowByDate.get(format(d, "yyyy-MM-dd"))?.completed) done += 1;
  }

  const prevMonth = format(subMonths(month, 1), "yyyy-MM");
  const nextMonth = format(addMonths(month, 1), "yyyy-MM");
  const isCurrentMonth = isSameMonth(month, today);

  return (
    <div className="rounded-sm border border-line bg-paper-card p-4">
      <div className="flex items-center justify-between">
        <a
          href={`/workout?view=month&month=${prevMonth}`}
          className="font-display text-xs uppercase tracking-wide text-muted hover:text-ink"
        >
          ← Trước
        </a>
        <span className="font-display text-sm uppercase text-ink">
          Tháng {format(month, "MM/yyyy")}
        </span>
        {isCurrentMonth ? (
          <span className="w-16" />
        ) : (
          <a
            href={`/workout?view=month&month=${nextMonth}`}
            className="font-display text-xs uppercase tracking-wide text-muted hover:text-ink"
          >
            Sau →
          </a>
        )}
      </div>

      <p className="mt-3 text-sm text-ink">
        Đã tập <span className="font-display text-steel">{done}</span> / {due} buổi (tính đến hôm nay)
      </p>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
          <div key={d} className="font-display text-[10px] uppercase text-faint">
            {d}
          </div>
        ))}
        {days.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const inMonth = isSameMonth(d, month);
          const t = WORKOUT_TEMPLATE[d.getDay()];
          const row = rowByDate.get(key);
          const isRest = t.dayType === "rest";
          const isFuture = d > today && !isToday(d);
          const missed = !isRest && !isFuture && !row?.completed;

          return (
            <a
              key={key}
              href={`/workout?date=${key}`}
              title={`${DOW_LABEL[d.getDay()]} · ${t.title}`}
              className={clsx(
                "flex aspect-square flex-col items-center justify-center rounded-sm border text-[11px]",
                !inMonth && "opacity-30",
                isToday(d) ? "border-ink" : "border-line",
                isRest && "bg-paper-dim text-faint",
                !isRest && !isFuture && row?.completed && "bg-olive/15 text-olive",
                !isRest && missed && "bg-rust/10 text-rust",
                !isRest && isFuture && "text-muted"
              )}
            >
              <span>{format(d, "d")}</span>
              {!isRest && !isFuture && (row?.completed ? "✓" : "·")}
            </a>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-faint">
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-olive" />
          Đã tập
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-rust" />
          Bỏ lỡ
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-paper-dim" />
          Ngày nghỉ
        </span>
      </div>
    </div>
  );
}
