import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { cloudinaryUrl } from "@/lib/cloudinary";
import ImageGallery from "@/components/inventory/ImageGallery";
import SpecsTable from "@/components/inventory/SpecsTable";
import PriceDisplay from "@/components/inventory/PriceDisplay";
import StatusBadge from "@/components/inventory/StatusBadge";
import ContactCTA from "@/components/inventory/ContactCTA";
import CopyLinkButton from "@/components/inventory/CopyLinkButton";
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
        <div className="mb-6 flex items-center justify-between gap-4">
          <nav className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/inventory"
              className="shrink-0 underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              Inventory
            </Link>
            <span className="opacity-40">/</span>
            <span className="truncate text-foreground">{machine.title}</span>
          </nav>
          <CopyLinkButton />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] xl:grid-cols-[55%_1fr]">
          {/* ── Left: sticky image gallery ── */}
          <div className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pr-1">
            <ImageGallery images={images} />
          </div>

          {/* ── Right: all content + form ── */}
          <div className="flex flex-col gap-8">

            {/* Title + price */}
            <div>
              <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
                <h1 className="flex-1 text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">
                  {machine.title}
                </h1>
                <StatusBadge status={machine.status} />
              </div>
              {!machine.callForPrice && (
                <PriceDisplay
                  price={machine.price}
                  callForPrice={false}
                  className="mt-2 text-2xl font-black"
                />
              )}
            </div>

            {/* Listing details info card */}
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Listing details
              </p>
              <dl className="divide-y divide-dashed divide-border">
                {[
                  machine.callForPrice
                    ? { label: "Price", value: "Contact for price" }
                    : machine.price
                    ? { label: "Price", value: `$${Number(machine.price).toLocaleString("en-US")}` }
                    : null,
                  { label: "Manufacturer", value: machine.manufacturer },
                  { label: "Category", value: machine.category },
                  machine.model ? { label: "Model", value: machine.model } : null,
                  machine.serialNumber ? { label: "Serial number", value: machine.serialNumber } : null,
                  { label: "Condition", value: formatCondition(machine.condition) },
                  machine.quantity > 1 ? { label: "Quantity", value: `${machine.quantity} available` } : null,
                  {
                    label: "Listed",
                    value: new Date(machine.dateListed).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                  },
                ]
                  .filter(Boolean)
                  .map((row) => (
                    <div key={row!.label} className="flex items-baseline justify-between gap-4 py-2">
                      <dt className="shrink-0 text-xs text-muted-foreground">{row!.label}</dt>
                      <dd className="text-right text-sm font-medium text-foreground">{row!.value}</dd>
                    </div>
                  ))}
              </dl>
              {machine.contactNote && (
                <p className="mt-2 border-t border-border pt-2 text-xs italic text-muted-foreground">
                  {machine.contactNote}
                </p>
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
            {machine.description && (
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</h2>
                <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                  {machine.description}
                </p>
              </div>
            )}

            {/* Contact form */}
            <ContactCTA
              machineId={machine.id}
              machineName={machine.title}
              contactPhone={contactPhone}
              contactEmail={contactEmail}
            />
          </div>
        </div>
      </div>
    </>
  );
}
