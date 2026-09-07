import clsx from "clsx";
import type { BodySegments, SegmentDetail, SegmentStatus } from "@/db/schema";

const STATUS_LABEL: Record<SegmentStatus, string> = {
  under: "Dưới chuẩn",
  standard: "Chuẩn",
  over: "Vượt chuẩn",
};

function statusLabelFor(kind: "fat" | "muscle", status: SegmentStatus): string {
  if (kind === "fat" && status === "over") return "Báo động";
  return STATUS_LABEL[status];
}

function colorFor(kind: "fat" | "muscle", status: SegmentStatus) {
  if (status === "standard") return "var(--olive)";
  if (kind === "fat") return status === "over" ? "var(--rust)" : "var(--steel)";
  return status === "over" ? "var(--steel)" : "var(--rust)";
}

function adviceFor(kind: "fat" | "muscle", status: SegmentStatus): string {
  if (status === "standard") return "Duy trì mức hiện tại";
  if (kind === "fat") {
    return status === "over" ? "Ưu tiên giảm mỡ vùng này" : "Mỡ thấp, không cần giảm thêm";
  }
  return status === "under" ? "Nên tăng cơ vùng này" : "Cơ phát triển tốt";
}

export default function BodySilhouette({
  title,
  kind,
  segments,
}: {
  title: string;
  kind: "fat" | "muscle";
  segments: BodySegments;
}) {
  const c = (part: keyof BodySegments) => colorFor(kind, segments[part].status);

  return (
    <div className="rounded-sm border border-line bg-paper-card p-4">
      <div className="mb-3 font-display text-xs uppercase tracking-wide text-faint">
        {title}
      </div>

      <div className="flex justify-center">
        <svg viewBox="0 0 120 200" width="120" height="200" aria-hidden>
          {/* head */}
          <circle cx="60" cy="18" r="14" fill="var(--line)" />
          {/* left arm (viewer's left = person's right) */}
          <rect x="14" y="40" width="16" height="70" rx="8" fill={c("rightArm")} />
          {/* right arm */}
          <rect x="90" y="40" width="16" height="70" rx="8" fill={c("leftArm")} />
          {/* trunk */}
          <rect x="36" y="36" width="48" height="78" rx="10" fill={c("trunk")} />
          {/* left leg */}
          <rect x="38" y="118" width="18" height="72" rx="8" fill={c("rightLeg")} />
          {/* right leg */}
          <rect x="64" y="118" width="18" height="72" rx="8" fill={c("leftLeg")} />
        </svg>
      </div>

      <div className="mt-3 space-y-2 text-[11px] text-muted">
        <SegRow label="Tay trái" kind={kind} detail={segments.leftArm} color={c("leftArm")} />
        <SegRow label="Tay phải" kind={kind} detail={segments.rightArm} color={c("rightArm")} />
        <SegRow label="Thân" kind={kind} detail={segments.trunk} color={c("trunk")} />
        <SegRow label="Chân trái" kind={kind} detail={segments.leftLeg} color={c("leftLeg")} />
        <SegRow label="Chân phải" kind={kind} detail={segments.rightLeg} color={c("rightLeg")} />
      </div>
    </div>
  );
}

function SegRow({
  label,
  kind,
  detail,
  color,
}: {
  label: string;
  kind: "fat" | "muscle";
  detail: SegmentDetail;
  color: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span
        className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: color }}
      />
      <div>
        <span className="text-ink">{label}</span>
        {": "}
        <span className={clsx(kind === "fat" && detail.status === "over" && "font-semibold text-rust")}>
          {statusLabelFor(kind, detail.status)}
        </span>
        {detail.percent != null && <span> ({detail.percent}%)</span>}
        <div className="text-faint">{adviceFor(kind, detail.status)}</div>
      </div>
    </div>
  );
}
