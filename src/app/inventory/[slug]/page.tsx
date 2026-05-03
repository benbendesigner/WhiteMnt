import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { cloudinaryUrl } from "@/lib/cloudinary";
import ImageGallery from "@/components/inventory/ImageGallery";
import SpecsTable from "@/components/inventory/SpecsTable";
import PriceDisplay from "@/components/inventory/PriceDisplay";
import StatusBadge from "@/components/inventory/StatusBadge";
import ContactCTA from "@/components/inventory/ContactCTA";
import { SITE_NAME, CONTACT_PHONE, CONTACT_EMAIL } from "@/lib/constants";
import { formatCondition } from "@/lib/format";
import type { MachineImage } from "@/types";
import Link from "next/link";

export async function generateStaticParams() {
  try {
    const machines = await prisma.machine.findMany({
      where: { status: { in: ["ACTIVE", "PENDING"] } },
      select: { slug: true },
    });
    return machines.map((m) => ({ slug: m.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const machine = await prisma.machine.findUnique({ where: { slug } });
  if (!machine) return { title: "Machine Not Found" };

  const images = Array.isArray(machine.images) ? (machine.images as MachineImage[]) : [];
  const ogImage = images[0]
    ? cloudinaryUrl(images[0].cloudinaryId, { width: 1200, height: 630, crop: "fill" })
    : undefined;

  return {
    title: machine.title,
    description: machine.metaDescription || machine.description.slice(0, 160),
    openGraph: {
      title: `${machine.title} | ${SITE_NAME}`,
      description: machine.metaDescription || machine.description.slice(0, 160),
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function MachinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const machine = await prisma.machine.findUnique({ where: { slug } });

  if (!machine || machine.status === "DRAFT") notFound();

  const contactEmail = machine.contactEmail ?? CONTACT_EMAIL;
  const contactPhone = machine.contactPhone ?? CONTACT_PHONE;
  const images = Array.isArray(machine.images) ? (machine.images as MachineImage[]) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: machine.title,
    description: machine.description,
    brand: { "@type": "Brand", name: machine.manufacturer },
    offers: machine.callForPrice
      ? undefined
      : {
          "@type": "Offer",
          priceCurrency: "USD",
          price: machine.price?.toString(),
          availability:
            machine.status === "ACTIVE"
              ? "https://schema.org/InStock"
              : "https://schema.org/LimitedAvailability",
        },
    image: images.map((img) => cloudinaryUrl(img.cloudinaryId, { width: 800, height: 600 })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/inventory" className="transition-colors hover:text-primary">
            Inventory
          </Link>{" "}
          &rsaquo; {machine.title}
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] xl:grid-cols-[55%_1fr]">
          {/* ── Left: sticky image gallery ── */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <ImageGallery images={images} />
          </div>

          {/* ── Right: all content + form ── */}
          <div className="flex flex-col gap-8">

            {/* Title, price, meta */}
            <div>
              <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
                <h1 className="flex-1 text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">
                  {machine.title}
                </h1>
                <StatusBadge status={machine.status} />
              </div>
              <PriceDisplay
                price={machine.price}
                callForPrice={machine.callForPrice}
                className="mt-2 text-2xl font-black"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                {machine.manufacturer} · {machine.category}
                {machine.model ? ` · ${machine.model}` : ""}
                {machine.serialNumber ? ` · S/N ${machine.serialNumber}` : ""}
              </p>
            </div>

            {/* Listing details */}
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Listing details</p>
              <div className="space-y-1 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Condition:</span>{" "}
                  {formatCondition(machine.condition)}
                </p>
                {machine.quantity > 1 && (
                  <p>
                    <span className="font-medium text-foreground">Quantity:</span>{" "}
                    {machine.quantity} available
                  </p>
                )}
                <p>
                  <span className="font-medium text-foreground">Listed:</span>{" "}
                  {new Date(machine.dateListed).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="mt-2 flex gap-4 border-t border-border pt-2 text-xs">
                <a href={`tel:${contactPhone}`} className="text-primary hover:underline">
                  {contactPhone}
                </a>
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                  {contactEmail}
                </a>
              </div>
              {machine.contactNote && (
                <p className="mt-1 text-xs italic text-muted-foreground">{machine.contactNote}</p>
              )}
            </div>

            {/* Specs */}
            {machine.specs && (
              <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Specifications</h2>
                <SpecsTable specs={machine.specs} />
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</h2>
              <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                {machine.description}
              </p>
            </div>

            {/* Contact form */}
            <ContactCTA machineId={machine.id} machineName={machine.title} />
          </div>
        </div>
      </div>
    </>
  );
}
