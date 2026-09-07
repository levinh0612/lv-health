"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import type { TemplateExercise } from "@/lib/workoutTemplate";
import {
  EXERCISE_IMAGES,
  EXERCISES_NO_PHOTO_NEEDED,
  EXERCISE_MUSCLE_GROUP,
  EXERCISE_VIDEOS,
  EXERCISE_ALTERNATIVE,
} from "@/lib/workoutTemplate";
import ZoomableImage from "@/components/ZoomableImage";
import { uploadToCloudinaryWithId, deleteCloudinaryPhoto } from "@/lib/cloudinary";

type Exercise = TemplateExercise & {
  done: boolean;
  photoUrl?: string | null;
  photoPublicId?: string | null;
  photoAt?: string | null;
};

function toYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else if (u.pathname.startsWith("/shorts/")) {
      id = u.pathname.split("/shorts/")[1];
    } else {
      id = u.searchParams.get("v");
    }
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export default function WorkoutChecklist({
  date,
  session,
  dayType,
  title,
  note,
  initialExercises,
  initialCompleted,
  isCustom = false,
  onMutate,
}: {
  date: string;
  session: number;
  dayType: string;
  title: string;
  duration?: string;
  note?: string;
  initialExercises: Exercise[];
  initialCompleted: boolean;
  isCustom?: boolean;
  onMutate?: (exercises: Exercise[], completed: boolean) => void;
}) {
  const [exercises, setExercises] = useState(initialExercises);
  const [completed, setCompleted] = useState(initialCompleted);
  const [newExercise, setNewExercise] = useState({ name: "", sets: "", rest: "" });
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [confirmUndoIndex, setConfirmUndoIndex] = useState<number | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [photoNotice, setPhotoNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (playingIndex == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPlayingIndex(null);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [playingIndex]);

  useEffect(() => {
    if (!photoNotice) return;
    const t = setTimeout(() => setPhotoNotice(null), 4500);
    return () => clearTimeout(t);
  }, [photoNotice]);

  useEffect(() => {
    const el = fileInputRef.current;
    if (!el) return;
    function onCancel() {
      if (captureIndexRef.current != null) {
        captureIndexRef.current = null;
        setPhotoNotice("Bạn chưa chụp ảnh minh chứng nên bài tập chưa được đánh dấu hoàn thành.");
      }
    }
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, []);

  function persist(next: Exercise[], nextCompleted: boolean) {
    onMutate?.(next, nextCompleted);
    startTransition(async () => {
      await fetch("/api/workouts/day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          session,
          dayType,
          title,
          exercises: next,
          completed: nextCompleted,
        }),
      });
    });
  }

  function needsPhoto(ex: Exercise) {
    return !isCustom && !EXERCISES_NO_PHOTO_NEEDED.has(ex.name);
  }

  function applyToggle(i: number) {
    const next = exercises.map((e, idx) => (idx === i ? { ...e, done: !e.done } : e));
    const allDone = next.length > 0 && next.every((e) => e.done);
    setExercises(next);
    setCompleted(allDone);
    persist(next, allDone);
  }

  function toggleExercise(i: number) {
    const ex = exercises[i];
    if (ex.done) {
      // unmarking a completed exercise needs confirmation to avoid accidental taps
      setConfirmUndoIndex(i);
      return;
    }
    if (needsPhoto(ex)) {
      // marking done requires a proof photo (machine/cable exercises only)
      captureIndexRef.current = i;
      fileInputRef.current?.click();
      return;
    }
    applyToggle(i);
  }

  function confirmUndo() {
    if (confirmUndoIndex != null) applyToggle(confirmUndoIndex);
    setConfirmUndoIndex(null);
  }

  function swapWithAlternative(i: number) {
    const ex = exercises[i];
    if (ex.done) return;
    const alt = EXERCISE_ALTERNATIVE[ex.name];
    if (!alt) return;
    const next = exercises.map((e, idx) =>
      idx === i ? { ...e, name: alt.name, sets: alt.sets, rest: alt.rest } : e
    );
    setExercises(next);
    persist(next, completed);
  }

  async function handlePhotoSelected(file: File) {
    const i = captureIndexRef.current;
    if (i == null) return;
    const target = exercises[i];
    setPhotoNotice(null);
    setUploadingIndex(i);
    try {
      const { url, publicId } = await uploadToCloudinaryWithId(file);
      if (target.photoPublicId) {
        deleteCloudinaryPhoto(target.photoPublicId).catch(() => {});
      }
      const next = exercises.map((e, idx) =>
        idx === i
          ? { ...e, done: true, photoUrl: url, photoPublicId: publicId, photoAt: new Date().toISOString() }
          : e
      );
      const allDone = next.length > 0 && next.every((e) => e.done);
      setExercises(next);
      setCompleted(allDone);
      persist(next, allDone);
    } finally {
      setUploadingIndex(null);
      captureIndexRef.current = null;
    }
  }

  function removeExercise(i: number) {
    const target = exercises[i];
    if (target.photoPublicId) deleteCloudinaryPhoto(target.photoPublicId).catch(() => {});
    const next = exercises.filter((_, idx) => idx !== i);
    setExercises(next);
    persist(next, next.length > 0 && next.every((ex) => ex.done));
  }

  function addExercise() {
    if (!newExercise.name.trim()) return;
    const next = [...exercises, { ...newExercise, done: false }];
    setExercises(next);
    setNewExercise({ name: "", sets: "", rest: "" });
    persist(next, false);
  }

  function toggleRestDay() {
    const next = !completed;
    setCompleted(next);
    persist(exercises, next);
  }

  if (dayType === "rest") {
    return (
      <div className="rounded-sm border border-line bg-paper-card p-4">
        <p className="text-sm text-muted">{note}</p>
        <button
          onClick={toggleRestDay}
          disabled={isPending}
          className={clsx(
            "mt-4 w-full rounded-sm border py-3 font-display text-sm uppercase tracking-wide transition-colors",
            completed
              ? "border-olive bg-olive text-paper"
              : "border-line text-muted"
          )}
        >
          {completed ? "Đã nghỉ / thực hiện ✓" : "Đánh dấu hoàn thành"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-line bg-paper-card p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) handlePhotoSelected(file);
        }}
      />

      {photoNotice && (
        <div className="mb-3 rounded-sm border border-rust/30 bg-rust/10 px-3 py-2 text-xs text-rust">
          {photoNotice}
        </div>
      )}

      {note && <p className="mb-3 text-sm text-muted">{note}</p>}

      {exercises.length === 0 && (
        <p className="mb-3 text-sm text-faint">Chưa có bài tập nào — thêm bài bên dưới.</p>
      )}

      <div className="space-y-3">
        {exercises.map((ex, i) => {
          const thumb = ex.photoUrl ?? EXERCISE_IMAGES[ex.name];
          const uploading = uploadingIndex === i;
          const muscleGroup = EXERCISE_MUSCLE_GROUP[ex.name];
          const embedUrl = EXERCISE_VIDEOS[ex.name] ? toYouTubeEmbedUrl(EXERCISE_VIDEOS[ex.name]) : null;
          const alternative = EXERCISE_ALTERNATIVE[ex.name];
          return (
            <div key={i} className="border-t border-dashed border-line pt-3 first:border-t-0 first:pt-0">
              <div className="flex items-center gap-3">
                {thumb ? (
                  <ZoomableImage
                    src={thumb}
                    alt={ex.name}
                    timestamp={ex.photoAt ?? undefined}
                    sizes="44px"
                    className="h-11 w-11 flex-shrink-0 rounded-sm border border-line"
                  />
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-sm border border-line bg-paper-dim text-base text-faint">
                    🏋️
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleExercise(i)}
                  disabled={uploading}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <span
                    className={clsx(
                      "inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border",
                      ex.done ? "border-rust bg-rust text-paper" : "border-line"
                    )}
                  >
                    {ex.done && "✓"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={clsx(
                        "block truncate text-sm font-medium",
                        ex.done && "text-faint line-through"
                      )}
                    >
                      {ex.name}
                    </span>
                    <span className="block text-xs text-muted">
                      {uploading ? "Đang tải ảnh minh chứng..." : `${ex.sets} · nghỉ ${ex.rest}`}
                    </span>
                  </span>
                </button>
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => removeExercise(i)}
                    className="flex-shrink-0 px-1 text-faint hover:text-rust"
                    aria-label="Xóa bài tập"
                  >
                    ✕
                  </button>
                )}
              </div>

              {(muscleGroup || embedUrl || alternative) && (
                <div className="ml-14 mt-1.5 flex flex-wrap items-center gap-1.5">
                  {muscleGroup && (
                    <span className="inline-flex items-center rounded-full bg-steel/15 px-2.5 py-0.5 font-display text-[10px] uppercase tracking-wide text-steel">
                      {muscleGroup}
                    </span>
                  )}
                  {embedUrl && (
                    <button
                      type="button"
                      onClick={() => setPlayingIndex(i)}
                      className="inline-flex items-center gap-1 rounded-full bg-rust/15 px-2.5 py-0.5 font-display text-[10px] uppercase tracking-wide text-rust"
                    >
                      ▶ Video
                    </button>
                  )}
                  {alternative &&
                    (ex.done ? (
                      <span className="inline-flex items-center rounded-full bg-paper-dim px-2.5 py-0.5 text-[11px] text-muted">
                        Thay thế: {alternative.name}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => swapWithAlternative(i)}
                        className="inline-flex items-center gap-1 rounded-full bg-paper-dim px-2.5 py-0.5 text-[11px] text-muted hover:bg-olive/15 hover:text-olive"
                      >
                        ⇄ Thay thế: {alternative.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isCustom && (
        <div className="mt-4 grid grid-cols-[1fr_auto_auto_auto] gap-1.5 border-t border-dashed border-line pt-3">
          <input
            placeholder="Tên bài tập"
            value={newExercise.name}
            onChange={(e) => setNewExercise((p) => ({ ...p, name: e.target.value }))}
            className="min-w-0 rounded-sm border border-line bg-white px-2 py-1.5 text-xs outline-none focus:border-steel"
          />
          <input
            placeholder="Hiệp×Reps"
            value={newExercise.sets}
            onChange={(e) => setNewExercise((p) => ({ ...p, sets: e.target.value }))}
            className="w-20 rounded-sm border border-line bg-white px-2 py-1.5 text-xs outline-none focus:border-steel"
          />
          <input
            placeholder="Nghỉ"
            value={newExercise.rest}
            onChange={(e) => setNewExercise((p) => ({ ...p, rest: e.target.value }))}
            className="w-14 rounded-sm border border-line bg-white px-2 py-1.5 text-xs outline-none focus:border-steel"
          />
          <button
            type="button"
            onClick={addExercise}
            className="rounded-sm bg-ink px-2.5 text-xs text-paper"
          >
            +
          </button>
        </div>
      )}

      {completed && exercises.length > 0 && (
        <p className="mt-3 font-display text-xs uppercase tracking-wide text-olive">
          Hoàn thành buổi tập ✓
        </p>
      )}

      {confirmUndoIndex != null &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4"
            onClick={() => setConfirmUndoIndex(null)}
          >
            <div
              className="w-full max-w-xs rounded-sm border border-line bg-paper-card p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm text-ink">
                Huỷ đánh dấu hoàn thành cho{" "}
                <span className="font-medium">{exercises[confirmUndoIndex]?.name}</span>?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmUndoIndex(null)}
                  className="rounded-sm border border-line px-3 py-1.5 font-display text-xs uppercase tracking-wide text-muted"
                >
                  Không
                </button>
                <button
                  type="button"
                  onClick={confirmUndo}
                  className="rounded-sm bg-rust px-3 py-1.5 font-display text-xs uppercase tracking-wide text-paper"
                >
                  Huỷ hoàn thành
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {playingIndex != null &&
        (() => {
          const raw = EXERCISE_VIDEOS[exercises[playingIndex]?.name ?? ""];
          const embedUrl = raw ? toYouTubeEmbedUrl(raw) : null;
          if (!embedUrl) return null;
          return createPortal(
            <div
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4"
              onClick={() => setPlayingIndex(null)}
            >
              <button
                type="button"
                aria-label="Đóng"
                className="fixed right-4 top-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setPlayingIndex(null);
                }}
              >
                ✕
              </button>
              <div
                className="aspect-video w-full max-w-2xl overflow-hidden rounded-sm bg-black"
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  src={`${embedUrl}?autoplay=1`}
                  title={`Video hướng dẫn: ${exercises[playingIndex]?.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>,
            document.body
          );
        })()}
    </div>
  );
}
