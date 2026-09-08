"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import ZoomableImage from "@/components/ZoomableImage";

export type PhotoLogEntry = {
  id: number;
  date: string;
  photoUrl: string;
  weightKg: number | null;
  bodyFatKg: number | null;
};

export default function PhotoCompare({ entries }: { entries: PhotoLogEntry[] }) {
  const [leftId, setLeftId] = useState(entries[0]?.id);
  const [rightId, setRightId] = useState(entries[entries.length - 1]?.id);

  if (entries.length < 2) return null;

  const left = entries.find((e) => e.id === leftId) ?? entries[0];
  const right = entries.find((e) => e.id === rightId) ?? entries[entries.length - 1];

  const weightDelta =
    left.weightKg != null && right.weightKg != null ? right.weightKg - left.weightKg : null;
  const fatDelta =
    left.bodyFatKg != null && right.bodyFatKg != null ? right.bodyFatKg - left.bodyFatKg : null;

  return (
    <div className="rounded-sm border border-line bg-paper-card p-4">
      <div className="grid grid-cols-2 gap-3">
        <PhotoSide entry={left} entries={entries} onChange={setLeftId} />
        <PhotoSide entry={right} entries={entries} onChange={setRightId} />
      </div>

      {(weightDelta != null || fatDelta != null) && (
        <p className="mt-3 text-center text-xs text-muted">
          {weightDelta != null && (
            <span>
              Cân nặng: {weightDelta > 0 ? "+" : ""}
              {weightDelta.toFixed(1)} kg
            </span>
          )}
          {weightDelta != null && fatDelta != null && " · "}
          {fatDelta != null && (
            <span>
              Mỡ: {fatDelta > 0 ? "+" : ""}
              {fatDelta.toFixed(1)} kg
            </span>
          )}
        </p>
      )}
    </div>
  );
}

function PhotoSide({
  entry,
  entries,
  onChange,
}: {
  entry: PhotoLogEntry;
  entries: PhotoLogEntry[];
  onChange: (id: number) => void;
}) {
  return (
    <div>
      <select
        value={entry.id}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-sm border border-line bg-white px-2 py-1.5 text-xs outline-none focus:border-steel"
      >
        {entries.map((e) => (
          <option key={e.id} value={e.id}>
            {format(parseISO(e.date), "dd/MM/yyyy")}
          </option>
        ))}
      </select>
      <ZoomableImage
        src={entry.photoUrl}
        timestamp={entry.date}
        sizes="200px"
        className="mt-2 aspect-[3/4] w-full rounded-sm border border-line"
      />
    </div>
  );
}
