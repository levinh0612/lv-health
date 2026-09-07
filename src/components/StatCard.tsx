export default function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "rust" | "steel" | "olive";
}) {
  const accentClass =
    accent === "rust"
      ? "text-rust"
      : accent === "steel"
        ? "text-steel"
        : accent === "olive"
          ? "text-olive"
          : "text-ink";

  return (
    <div className="rounded-sm border border-line bg-paper-card p-4">
      <div className="font-display text-[11px] uppercase tracking-wide text-faint">
        {label}
      </div>
      <div className={`mt-1 font-display text-2xl ${accentClass}`}>{value}</div>
    </div>
  );
}
