"use client";

import { useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { cloudinaryUrl } from "@/lib/cloudinary";
import type { MachineImage } from "@/types";

export default function ImageGallery({ images }: { images: MachineImage[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
        No photos available
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {images.map((img, i) => (
          <div
            key={img.cloudinaryId}
            className="cursor-zoom-in overflow-hidden rounded-xl bg-muted"
            onClick={() => setLightbox(i)}
          >
            <Image
              src={cloudinaryUrl(img.cloudinaryId, { width: 900, crop: "scale" })}
              alt={img.altText || "Machine photo"}
              width={900}
              height={675}
              style={{ height: "auto", width: "100%" }}
              className="block"
              sizes="(max-width: 768px) 100vw, 700px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={cloudinaryUrl(images[lightbox].cloudinaryId, { width: 1600, crop: "scale" })}
              alt={images[lightbox].altText || "Machine photo"}
              width={1600}
              height={1200}
              style={{ height: "auto", width: "100%" }}
              sizes="100vw"
            />
          </div>
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <XIcon className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}
