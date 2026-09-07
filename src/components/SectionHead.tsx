export default function SectionHead({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-6">
      <h2 className="font-display text-xl uppercase text-ink">{title}</h2>
      {note && <p className="max-w-[280px] text-[13px] text-muted">{note}</p>}
    </div>
  );
}
