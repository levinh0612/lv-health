import { desc } from "drizzle-orm";
import { format, parseISO } from "date-fns";
import { getDb } from "@/db";
import { inbodyScans } from "@/db/schema";
import SectionHead from "@/components/SectionHead";
import InbodyForm from "@/components/InbodyForm";

export const dynamic = "force-dynamic";

export default async function InbodyPage() {
  const scans = await getDb()
    .select()
    .from(inbodyScans)
    .orderBy(desc(inbodyScans.date));

  return (
    <div className="rise-in">
      <p className="font-display text-sm uppercase tracking-[0.08em] text-rust">
        Đo mỗi 2 tuần
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold uppercase text-ink">
        InBody
      </h1>

      <div className="mt-6">
        <InbodyForm />
      </div>

      <SectionHead title="Lịch sử đo" />

      {scans.length === 0 && (
        <p className="text-sm text-faint">Chưa có bản đo nào.</p>
      )}

      <div className="overflow-x-auto rounded-sm border border-line bg-paper-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left font-display text-[11px] uppercase text-faint">
              <th className="p-3">Ngày</th>
              <th className="p-3">Cân nặng</th>
              <th className="p-3">BMI</th>
              <th className="p-3">Mỡ</th>
              <th className="p-3">Cơ xương</th>
              <th className="p-3">BMR</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((s) => (
              <tr key={s.id} className="border-t border-dashed border-line">
                <td className="p-3 font-medium">
                  {format(parseISO(s.date), "dd/MM/yyyy")}
                </td>
                <td className="p-3 text-muted">{s.weightKg ?? "—"} kg</td>
                <td className="p-3 text-muted">{s.bmi ?? "—"}</td>
                <td className="p-3 text-muted">
                  {s.bodyFatKg ?? "—"} kg{" "}
                  {s.bodyFatPercent ? `(${s.bodyFatPercent}%)` : ""}
                </td>
                <td className="p-3 text-muted">{s.skeletalMuscleKg ?? "—"} kg</td>
                <td className="p-3 text-muted">{s.bmrKcal ?? "—"} kcal</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
