import { desc } from "drizzle-orm";
import { format, parseISO } from "date-fns";
import { getDb } from "@/db";
import { bodyLogs } from "@/db/schema";
import SectionHead from "@/components/SectionHead";
import BodyLogForm from "@/components/BodyLogForm";
import ZoomableImage from "@/components/ZoomableImage";
import PhotoCompare from "@/components/PhotoCompare";

const MEASUREMENT_LABEL: Record<string, string> = {
  waistCm: "eo",
  chestCm: "ngực",
  hipCm: "hông",
  armCm: "tay",
  thighCm: "đùi",
};

export const dynamic = "force-dynamic";

export default async function BodyPage() {
  const logs = await getDb()
    .select()
    .from(bodyLogs)
    .orderBy(desc(bodyLogs.date));

  return (
    <div className="rise-in">
      <p className="font-display text-sm uppercase tracking-[0.08em] text-rust">
        Ảnh body hàng tuần
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold uppercase text-ink">
        Body Log
      </h1>

      <div className="mt-6">
        <BodyLogForm />
      </div>

      {(() => {
        const photoEntries = [...logs]
          .filter((l) => l.photoUrls.length > 0)
          .sort((a, b) => (a.date < b.date ? -1 : 1))
          .map((l) => ({
            id: l.id,
            date: l.date,
            photoUrl: l.photoUrls[0],
            weightKg: l.weightKg,
            bodyFatKg: l.bodyFatKg,
          }));
        if (photoEntries.length < 2) return null;
        return (
          <>
            <SectionHead title="So sánh ảnh" note="Chọn 2 mốc để xem tiến trình" />
            <PhotoCompare entries={photoEntries} />
          </>
        );
      })()}

      <SectionHead title="Lịch sử" note="So sánh ảnh và số đo theo từng tuần" />

      {logs.length === 0 && (
        <p className="text-sm text-faint">Chưa có bản ghi nào.</p>
      )}

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-sm border border-line bg-paper-card p-4"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-display text-sm uppercase text-ink">
                {format(parseISO(log.date), "dd/MM/yyyy")}
              </span>
              <span className="text-xs text-muted">
                {[
                  log.weightKg && `${log.weightKg}kg`,
                  log.bodyFatKg && `mỡ ${log.bodyFatKg}kg`,
                  log.skeletalMuscleKg && `cơ ${log.skeletalMuscleKg}kg`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>

            {log.measurements && Object.keys(log.measurements).length > 0 && (
              <p className="mt-1 text-xs text-faint">
                {Object.entries(log.measurements)
                  .filter(([, v]) => v != null)
                  .map(([k, v]) => `${MEASUREMENT_LABEL[k] ?? k} ${v}cm`)
                  .join(" · ")}
              </p>
            )}

            {log.notes && (
              <p className="mt-2 text-sm text-muted">{log.notes}</p>
            )}

            {log.photoUrls.length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {log.photoUrls.map((url, i) => (
                  <ZoomableImage
                    key={i}
                    src={url}
                    timestamp={log.createdAt}
                    sizes="96px"
                    className="h-28 w-24 flex-shrink-0 rounded-sm border border-line"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
