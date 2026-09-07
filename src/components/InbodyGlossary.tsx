import type { GlossaryEntry } from "@/lib/inbodyGlossary";

export default function InbodyGlossary({ entries }: { entries: GlossaryEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="mt-4 border-t border-dashed border-line pt-4">
      <div className="mb-2 font-display text-[11px] uppercase tracking-wide text-faint">
        Giải thích chỉ số
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {entries.map((e) => (
          <div key={e.label} className="text-xs">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium text-ink">{e.label}</span>
              <span className="font-display text-steel">{e.value}</span>
            </div>
            <p className="mt-0.5 text-faint">{e.explain}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
