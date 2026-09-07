import { desc } from "drizzle-orm";
import { format, parseISO } from "date-fns";
import { getDb } from "@/db";
import { inbodyScans } from "@/db/schema";
import SectionHead from "@/components/SectionHead";
import InbodyForm from "@/components/InbodyForm";
import BodySilhouette from "@/components/BodySilhouette";
import ZoomableImage from "@/components/ZoomableImage";
import InbodyGlossary from "@/components/InbodyGlossary";
import { buildInbodyGlossary } from "@/lib/inbodyGlossary";

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

      <div className="space-y-4">
        {scans.map((s) => (
          <div key={s.id} className="rounded-sm border border-line bg-paper-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="font-display text-sm uppercase text-ink">
                  {format(parseISO(s.date), "dd/MM/yyyy")}
                </span>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <span>{s.weightKg ?? "—"} kg</span>
                  <span>BMI {s.bmi ?? "—"}</span>
                  <span>
                    Mỡ {s.bodyFatKg ?? "—"} kg{" "}
                    {s.bodyFatPercent ? `(${s.bodyFatPercent}%)` : ""}
                  </span>
                  <span>Cơ {s.skeletalMuscleKg ?? "—"} kg</span>
                  <span>BMR {s.bmrKcal ?? "—"} kcal</span>
                </div>
              </div>
              {s.photoUrl && (
                <ZoomableImage
                  src={s.photoUrl}
                  sizes="64px"
                  className="h-20 w-16 flex-shrink-0 rounded-sm border border-line"
                />
              )}
            </div>

            {(s.segmentFat || s.segmentMuscle) && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {s.segmentFat && (
                  <BodySilhouette title="Mỡ" kind="fat" segments={s.segmentFat} />
                )}
                {s.segmentMuscle && (
                  <BodySilhouette title="Cơ" kind="muscle" segments={s.segmentMuscle} />
                )}
              </div>
            )}

            <InbodyGlossary entries={buildInbodyGlossary(s)} />
          </div>
        ))}
      </div>
    </div>
  );
}
