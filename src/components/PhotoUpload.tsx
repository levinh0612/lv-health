"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function PhotoUpload({
  label,
  onUploaded,
  multiple = false,
}: {
  label: string;
  onUploaded: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setProgress(0);

    const localPreviews = Array.from(files).map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...localPreviews]);

    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file, setProgress);
        urls.push(url);
      }
      onUploaded(urls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-line bg-paper-card py-4 font-display text-xs uppercase tracking-wide text-muted transition-colors hover:border-rust hover:text-rust"
      >
        <CameraIcon className="h-4 w-4" />
        {label}
      </button>

      {progress !== null && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-paper-dim">
          <div
            className="h-full bg-rust transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="mt-2 text-xs text-rust">{error}</p>}

      {previews.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div
              key={i}
              className="relative h-16 w-16 overflow-hidden rounded-sm border border-line"
            >
              <Image src={src} alt="" fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path
        d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}
