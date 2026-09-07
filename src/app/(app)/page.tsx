import { asc, desc } from "drizzle-orm";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { getDb } from "@/db";
import { bodyLogs, workoutDays, inbodyScans, goals } from "@/db/schema";
import SectionHead from "@/components/SectionHead";
import StatCard from "@/components/StatCard";
import TrendChart, { TrendPoint } from "@/components/TrendChart";
import BodySilhouette from "@/components/BodySilhouette";
import GoalCard from "@/components/GoalCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const db = getDb();

  const [logs, workouts, scans, allScans, goalRows] = await Promise.all([
    db.select().from(bodyLogs).orderBy(asc(bodyLogs.date)),
    db.select().from(workoutDays).orderBy(desc(workoutDays.date)),
    db.select().from(inbodyScans).orderBy(desc(inbodyScans.date)).limit(1),
    db.select().from(inbodyScans).orderBy(asc(inbodyScans.date)),
    db.select().from(goals).limit(1),
  ]);

  const goal = goalRows[0] ?? null;
  const latestScan = scans[0];
  const latestLog = logs[logs.length - 1];

  // Merge weekly body-log entries with InBody scans into one timeline so the
  // trend chart isn't empty just because only InBody data exists so far.
  const trend: TrendPoint[] = [
    ...logs.map((l) => ({
      dateKey: l.date,
      weight: l.weightKg,
      bodyFat: l.bodyFatKg,
      muscle: l.skeletalMuscleKg,
    })),
    ...allScans.map((s) => ({
      dateKey: s.date,
      weight: s.weightKg,
      bodyFat: s.bodyFatKg,
      muscle: s.skeletalMuscleKg,
    })),
  ]
    .sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1))
    .slice(-12)
    .map((p) => ({
      date: format(parseISO(p.dateKey), "dd/MM"),
      weight: p.weight,
      bodyFat: p.bodyFat,
      muscle: p.muscle,
    }));

  const streak = computeStreak(workouts);

  const currentWeight = latestLog?.weightKg ?? latestScan?.weightKg;
  const currentFat = latestLog?.bodyFatKg ?? latestScan?.bodyFatKg;
  const currentMuscle = latestLog?.skeletalMuscleKg ?? latestScan?.skeletalMuscleKg;

  return (
    <div className="rise-in">
      <p className="font-display text-sm uppercase tracking-[0.08em] text-rust">
        Tổng quan
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold uppercase leading-tight text-ink">
        Chào bạn 👋
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        {latestScan
          ? `Số liệu InBody gần nhất: ${format(parseISO(latestScan.date), "dd/MM/yyyy")}`
          : "Chưa có dữ liệu InBody — thêm bản đo đầu tiên ở tab InBody."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Cân nặng"
          value={currentWeight ? `${currentWeight} kg` : "—"}
          accent="steel"
        />
        <StatCard
          label="Mỡ cơ thể"
          value={currentFat ? `${currentFat} kg` : "—"}
          accent="rust"
        />
        <StatCard
          label="Cơ xương"
          value={currentMuscle ? `${currentMuscle} kg` : "—"}
          accent="olive"
        />
        <StatCard label="Chuỗi ngày tập" value={`${streak} 🔥`} />
      </div>

      <div className="mt-4">
        <GoalCard initialGoal={goal} currentWeight={currentWeight} />
      </div>

      {latestScan?.segmentFat && latestScan?.segmentMuscle && (
        <>
          <SectionHead
            title="Phân tích từng vùng"
            note="Theo bản đo InBody gần nhất"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BodySilhouette title="Mỡ" kind="fat" segments={latestScan.segmentFat} />
            <BodySilhouette title="Cơ" kind="muscle" segments={latestScan.segmentMuscle} />
          </div>
        </>
      )}

      <SectionHead
        title="Xu hướng"
        note="Cân nặng, mỡ và cơ xương theo các lần cập nhật gần đây"
      />
      <TrendChart data={trend} />

      <SectionHead title="Lối tắt" />
      <div className="grid grid-cols-2 gap-3">
        <QuickLink href="/body" title="Ghi body tuần này" accent="steel" />
        <QuickLink href="/meals" title="Chụp bữa ăn" accent="olive" />
        <QuickLink href="/workout" title="Buổi tập hôm nay" accent="rust" />
        <QuickLink href="/inbody" title="Nhập InBody mới" accent="steel" />
      </div>
    </div>
  );
}

function computeStreak(
  workouts: { date: string; completed: boolean; dayType: string }[]
) {
  const sorted = [...workouts].sort((a, b) => (a.date < b.date ? 1 : -1));
  let streak = 0;
  let cursor = new Date();

  for (const day of sorted) {
    const d = parseISO(day.date);
    const diff = differenceInCalendarDays(cursor, d);
    if (diff > 1) break;
    if (day.dayType === "rest") {
      cursor = d;
      continue;
    }
    if (!day.completed) break;
    streak += 1;
    cursor = d;
  }
  return streak;
}

function QuickLink({
  href,
  title,
  accent,
}: {
  href: string;
  title: string;
  accent: "rust" | "steel" | "olive";
}) {
  const accentClass = {
    rust: "border-rust/40 hover:border-rust text-rust",
    steel: "border-steel/40 hover:border-steel text-steel",
    olive: "border-olive/40 hover:border-olive text-olive",
  }[accent];

  return (
    <a
      href={href}
      className={`rounded-sm border bg-paper-card p-4 font-display text-sm uppercase tracking-wide transition-colors ${accentClass}`}
    >
      {title} →
    </a>
  );
}
