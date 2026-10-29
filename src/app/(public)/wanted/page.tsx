import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, MailIcon, ChevronDownIcon } from "lucide-react";
import { SITE_NAME, CONTACT_PHONE, CONTACT_PHONE_TEL, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wanted",
  description: `Equipment ${SITE_NAME} is actively looking to buy.`,
};

export default async function WantedPage() {
  const items = await prisma.wantedItem.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ manufacturer: "asc" }, { title: "asc" }],
  });

  // Group by manufacturer, normalizing case so "ARTOS" and "Artos" merge
  const byManufacturer: Record<string, typeof items> = {};
  const manufacturerLabel: Record<string, string> = {};
  for (const item of items) {
    const key = item.manufacturer.trim().toLowerCase();
    if (!byManufacturer[key]) {
      byManufacturer[key] = [];
      manufacturerLabel[key] = item.manufacturer.trim();
    }
    byManufacturer[key].push(item);
  }
  const manufacturers = Object.keys(byManufacturer).sort();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
          Selling equipment?
        </p>
        <h1 className="text-4xl font-black leading-none tracking-tight text-foreground sm:text-5xl">
          Equipment Wanted
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          We are actively looking to purchase the following equipment. If you have any of these
          items available, we&apos;d love to hear from you.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No wanted listings at this time.</p>
      ) : (
        <div className="space-y-2">
          {manufacturers.map((manufacturer) => {
            const group = byManufacturer[manufacturer];
            return (
              <details
                key={manufacturer}
                className="group rounded-lg border border-border bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 select-none hover:bg-muted/40">
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-foreground">{manufacturerLabel[manufacturer]}</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {group.length} {group.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="divide-y divide-border border-t border-border">
                  {group.map((item) => (
                    <div key={item.id} className="px-5 py-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <span className="shrink-0 text-xs text-muted-foreground">{item.category}</span>
                      </div>
                      <p className="mt-1 text-sm text-foreground/70">{item.description}</p>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      )}

      <div className="mt-12 rounded-lg border border-border bg-muted/40 px-6 py-8 text-center">
        <h2 className="text-xl font-black tracking-tight text-foreground">
          Have something we&apos;re looking for?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Reach out — we respond quickly and can arrange pickup or shipping anywhere in the US.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/contact" />}>Get in Touch</Button>
          <Button size="lg" variant="outline" render={<a href={`tel:${CONTACT_PHONE_TEL}`} />}>
            <PhoneIcon className="size-4" />
            {CONTACT_PHONE}
          </Button>
          <Button size="lg" variant="outline" render={<a href={`mailto:${CONTACT_EMAIL}`} />}>
            <MailIcon className="size-4" />
            {CONTACT_EMAIL}
          </Button>
        </div>
      </div>
    </div>
  );
}
