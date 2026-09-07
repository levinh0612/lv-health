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

// Everything below is positioned on one shared 320×200 coordinate system,
// expressed purely as percentages — so the whole diagram (figure + label
// callouts) scales together at any container width instead of the figure
// staying a fixed pixel size while the callouts float off to the side.
const ROW_TOP = { arm: 37.5, trunk: 50, leg: 77 };

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

      <div className="relative w-full" style={{ aspectRatio: "320 / 210" }}>
        <svg viewBox="0 0 320 200" className="absolute inset-x-0 top-0 h-full w-full" aria-hidden>
          <circle cx="160" cy="18" r="14" fill="var(--line)" />
          {/* rendered on the viewer's left = the person's right side */}
          <rect x="112" y="40" width="14" height="70" rx="7" fill={c("rightArm")} />
          <rect x="194" y="40" width="14" height="70" rx="7" fill={c("leftArm")} />
          <rect x="140" y="36" width="40" height="78" rx="9" fill={c("trunk")} />
          <rect x="142" y="118" width="15" height="72" rx="7" fill={c("rightLeg")} />
          <rect x="163" y="118" width="15" height="72" rx="7" fill={c("leftLeg")} />
        </svg>

        <Callout side="left" top={ROW_TOP.arm} label="Tay phải" kind={kind} detail={segments.rightArm} />
        <Callout side="right" top={ROW_TOP.arm} label="Tay trái" kind={kind} detail={segments.leftArm} />
        <Callout side="left" top={ROW_TOP.trunk} label="Thân" kind={kind} detail={segments.trunk} />
        <Callout side="left" top={ROW_TOP.leg} label="Chân phải" kind={kind} detail={segments.rightLeg} />
        <Callout side="right" top={ROW_TOP.leg} label="Chân trái" kind={kind} detail={segments.leftLeg} />
      </div>
    </div>
  );
}

function Callout({
  side,
  top,
  label,
  kind,
  detail,
}: {
  side: "left" | "right";
  top: number;
  label: string;
  kind: "fat" | "muscle";
  detail: SegmentDetail;
}) {
  const color = colorFor(kind, detail.status);
  const alarming = kind === "fat" && detail.status === "over";

  // The callout column is 30% of the diagram's width, with a 5%-wide gap
  // between it and the figure — i.e. a connector 5/30 = 16.7% as wide as
  // this callout box itself.
  return (
    <div
      className={clsx(
        "absolute text-[10.5px] leading-tight",
        side === "left" ? "right-[70%] text-right" : "left-[70%] text-left"
      )}
      style={{ top: `${top}%`, width: "30%", transform: "translateY(-50%)" }}
    >
      <div
        className="absolute top-1/2 h-px border-t border-dashed"
        style={{
          borderColor: color,
          width: "16.7%",
          ...(side === "left" ? { right: "-16.7%" } : { left: "-16.7%" }),
        }}
        aria-hidden
      />
      <span className="inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: color }} />
      <span className="text-ink"> {label}: </span>
      <span className={clsx("font-medium", alarming && "font-semibold")} style={{ color }}>
        {statusLabelFor(kind, detail.status)}
      </span>
      {detail.percent != null && <span className="text-faint"> ({detail.percent}%)</span>}
      <div className="text-faint">{adviceFor(kind, detail.status)}</div>
    </div>
  );
}
