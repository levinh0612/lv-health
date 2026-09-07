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

// Vertical anchor points (% of the diagram's height) that each callout's
// connector line reaches out to, matching the SVG geometry below.
const ROW_TOP = { arm: 37.5, trunk: 56, leg: 77 };

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

      <div className="relative mx-auto h-64 max-w-full" style={{ width: "min(100%, 360px)" }}>
        <svg
          viewBox="0 0 120 200"
          className="absolute left-1/2 top-0 h-full -translate-x-1/2"
          aria-hidden
        >
          <circle cx="60" cy="18" r="14" fill="var(--line)" />
          {/* rendered on the viewer's left = the person's right side */}
          <rect x="14" y="40" width="16" height="70" rx="8" fill={c("rightArm")} />
          <rect x="90" y="40" width="16" height="70" rx="8" fill={c("leftArm")} />
          <rect x="36" y="36" width="48" height="78" rx="10" fill={c("trunk")} />
          <rect x="38" y="118" width="18" height="72" rx="8" fill={c("rightLeg")} />
          <rect x="64" y="118" width="18" height="72" rx="8" fill={c("leftLeg")} />
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

  return (
    <div
      className={clsx(
        "absolute w-[42%] text-[10.5px] leading-tight",
        side === "left" ? "right-1/2 mr-[70px] text-right" : "left-1/2 ml-[70px] text-left"
      )}
      style={{ top: `${top}%`, transform: "translateY(-50%)" }}
    >
      <div
        className={clsx(
          "absolute top-1/2 h-px w-[62px] border-t border-dashed",
          side === "left" ? "-right-[62px]" : "-left-[62px]"
        )}
        style={{ borderColor: color }}
        aria-hidden
      />
      <span
        className={clsx("inline-block h-1.5 w-1.5 rounded-full align-middle")}
        style={{ background: color }}
      />
      <span className="text-ink"> {label}: </span>
      <span
        className={clsx("font-medium", alarming && "font-semibold")}
        style={{ color }}
      >
        {statusLabelFor(kind, detail.status)}
      </span>
      {detail.percent != null && <span className="text-faint"> ({detail.percent}%)</span>}
      <div className="text-faint">{adviceFor(kind, detail.status)}</div>
    </div>
  );
}
