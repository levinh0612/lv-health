"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import clsx from "clsx";

export default function ZoomableImage({
  src,
  alt = "",
  className,
  sizes,
}: {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
}) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setZoomed(false);
      }
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    setZoomed(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx("relative block cursor-zoom-in overflow-hidden", className)}
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" unoptimized />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4"
            onClick={close}
          >
            <button
              type="button"
              aria-label="Đóng"
              className="fixed right-4 top-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl text-white"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              ✕
            </button>
            <div
              className={clsx(
                "relative h-full w-full max-w-3xl transition-transform duration-200",
                zoomed ? "scale-[2] cursor-zoom-out" : "cursor-zoom-in scale-100"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setZoomed((z) => !z);
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
