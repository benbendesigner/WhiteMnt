"use client";

import { useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { cloudinaryUrl } from "@/lib/cloudinary";
import type { MachineImage } from "@/types";

export default function ImageGallery({ images }: { images: MachineImage[] }) {
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
        No photos available
      </div>
    );
  }

  const main = images[selected];

  return (
    <>
      <div className="space-y-3">
        <div
          className="relative aspect-video cursor-zoom-in overflow-hidden rounded-xl bg-muted"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={cloudinaryUrl(main.cloudinaryId, { width: 900, height: 506, crop: "fill" })}
            alt={main.altText || "Machine photo"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
            priority
          />
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.cloudinaryId}
                onClick={() => setSelected(i)}
                className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                  i === selected ? "border-primary" : "border-transparent hover:border-border"
                }`}
              >
                <Image
                  src={cloudinaryUrl(img.cloudinaryId, { width: 192, height: 128, crop: "fill" })}
                  alt={img.altText || ""}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <div className="relative aspect-video w-full max-w-5xl">
            <Image
              src={cloudinaryUrl(main.cloudinaryId, { width: 1600, height: 900, crop: "fill" })}
              alt={main.altText || "Machine photo"}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightbox(false)}
          >
            <XIcon className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}
