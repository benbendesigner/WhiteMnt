"use client";

import { useState, useRef } from "react";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface UploadedImage {
  cloudinaryId: string;
  altText: string;
  sortOrder: number;
}

interface Props {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  async function uploadFile(file: File): Promise<UploadedImage | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset!);
    fd.append("folder", "equipment");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { cloudinaryId: data.public_id, altText: "", sortOrder: value.length };
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const results = await Promise.all(Array.from(files).map(uploadFile));
    const valid = results.filter(Boolean) as UploadedImage[];
    onChange([...value, ...valid].map((img, i) => ({ ...img, sortOrder: i })));
    setUploading(false);
  }

  function remove(idx: number) {
    const next = value.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sortOrder: i }));
    onChange(next);
  }

  function updateAlt(idx: number, altText: string) {
    const next = [...value];
    next[idx] = { ...next[idx], altText };
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 transition-colors hover:border-primary/50 hover:bg-primary/5"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <UploadCloudIcon className="size-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {uploading ? "Uploading..." : "Drag photos here or click to select"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">JPG, PNG, or WebP · Max 10 MB each</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((img, i) => (
            <div key={img.cloudinaryId} className="group relative space-y-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_150,c_fill,f_auto/${img.cloudinaryId}`}
                alt={img.altText}
                className="h-24 w-full rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 hidden rounded-full bg-destructive p-0.5 text-destructive-foreground group-hover:flex"
              >
                <XIcon className="size-3" />
              </button>
              <input
                type="text"
                placeholder="Alt text"
                value={img.altText}
                onChange={(e) => updateAlt(i, e.target.value)}
                className="w-full rounded border border-input bg-transparent px-1.5 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
              />
              {i === 0 && (
                <Badge className="absolute top-1 left-1" variant="default">
                  Primary
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
