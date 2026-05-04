import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";
import StatusBadge from "./StatusBadge";
import type { MachineCardData } from "@/types";

const CONDITION_LABEL: Record<string, string> = {
  NEW: "New",
  USED: "Used",
  REFURBISHED: "Refurbished",
  PARTS_ONLY: "Parts Only",
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function PriceLine({ price, callForPrice }: { price: MachineCardData["price"]; callForPrice: boolean }) {
  if (callForPrice || price === null) {
    return <span className="text-xs text-primary font-medium">Contact For Price</span>;
  }
  return (
    <span className="text-xs font-semibold text-foreground">
      ${Number(price).toLocaleString("en-US")}
    </span>
  );
}

export default function MachineCard({ machine }: { machine: MachineCardData }) {
  const thumb = machine.images[0];
  const imgUrl = thumb
    ? cloudinaryUrl(thumb.cloudinaryId, { width: 480, height: 270, crop: "fill" })
    : null;

  const meta: string[] = [
    machine.manufacturer,
    machine.category,
    CONDITION_LABEL[machine.condition] ?? machine.condition,
  ];
  if (machine.serialNumber) meta.push(`S/N ${machine.serialNumber}`);

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

        <div className="flex flex-col gap-1.5 p-4">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {machine.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {meta.map((item, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1 opacity-40">·</span>}
                {item}
              </span>
            ))}
          </p>
          <p className="text-xs text-muted-foreground/60">
            Listed {formatDate(machine.dateListed)}
          </p>
          <div className="mt-auto pt-1">
            <PriceLine price={machine.price} callForPrice={machine.callForPrice} />
          </div>
        </div>
      </div>
    </Link>
  );
}
