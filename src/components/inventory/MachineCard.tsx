import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";
import PriceDisplay from "./PriceDisplay";
import StatusBadge from "./StatusBadge";
import type { MachineCardData } from "@/types";

export default function MachineCard({ machine }: { machine: MachineCardData }) {
  const thumb = machine.images[0];
  const imgUrl = thumb
    ? cloudinaryUrl(thumb.cloudinaryId, { width: 480, height: 270, crop: "fill" })
    : null;

  return (
    <Link href={`/inventory/${machine.slug}`} className="group block">
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow group-hover:shadow-md">
        <div className="relative aspect-video bg-muted">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={thumb?.altText || machine.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No photo
            </div>
          )}
          {machine.status !== "ACTIVE" && (
            <div className="absolute top-2 left-2">
              <StatusBadge status={machine.status} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {machine.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {machine.manufacturer}
            <span className="mx-1.5 opacity-40">·</span>
            {machine.category}
          </p>
          <div className="mt-auto pt-1">
            <PriceDisplay price={machine.price} callForPrice={machine.callForPrice} />
          </div>
        </div>
      </div>
    </Link>
  );
}
