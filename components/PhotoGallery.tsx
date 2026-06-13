"use client";

import { useState } from "react";

export function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasPhotos = photos.length > 0;
  const activePhoto = hasPhotos ? photos[activeIndex] : null;

  function goToPrevious() {
    setActiveIndex((currentIndex) => (currentIndex === 0 ? photos.length - 1 : currentIndex - 1));
  }

  function goToNext() {
    setActiveIndex((currentIndex) => (currentIndex === photos.length - 1 ? 0 : currentIndex + 1));
  }

  if (!hasPhotos) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[24px] bg-[var(--color-surface)] text-sm text-[var(--color-muted)]">
        Aucune photo disponible
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[24px] border border-black/5 bg-[var(--color-surface)] shadow-[0_12px_34px_rgba(26,26,26,0.05)]">
        <div className="relative aspect-[4/3]">
          <img
            key={`${activeIndex}-${activePhoto}`}
            src={activePhoto!}
            alt={`${title} - photo ${activeIndex + 1}`}
            className="h-full w-full animate-carousel-in object-cover"
          />

          <div className="absolute bottom-3 right-3 rounded-full border border-white/40 bg-white/88 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-text)] backdrop-blur">
            {activeIndex + 1} / {photos.length}
          </div>

          {photos.length > 1 ? (
            <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-3">
              <button
                type="button"
                onClick={goToPrevious}
                className="pointer-events-auto rounded-full border border-white/40 bg-white/88 px-3 py-1.5 text-xs text-[var(--color-text)] backdrop-blur transition hover:bg-white"
              >
                Précédente
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="pointer-events-auto rounded-full border border-white/40 bg-white/88 px-3 py-1.5 text-xs text-[var(--color-text)] backdrop-blur transition hover:bg-white"
              >
                Suivante
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {photos.length > 1 ? (
        <div className="grid grid-cols-4 gap-2.5 md:grid-cols-6">
          {photos.map((photo, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={photo}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-[16px] border transition ${
                  isActive
                    ? "border-[var(--color-text)] shadow-[0_8px_22px_rgba(26,26,26,0.09)]"
                    : "border-black/5 opacity-75 hover:opacity-100"
                }`}
              >
                <div className="aspect-square">
                  <img src={photo} alt={`${title} miniature ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
