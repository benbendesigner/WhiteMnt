import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { SITE_NAME, CONTACT_PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wanted",
  description: `Equipment ${SITE_NAME} is actively looking to buy.`,
};

export default async function WantedPage() {
  const items = await prisma.wantedItem.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

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
        <div className="divide-y divide-border rounded-lg border border-border">
          {items.map((item) => (
            <div key={item.id} className="px-5 py-4">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-semibold text-foreground">{item.title}</h2>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {item.manufacturer} · {item.category}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground/70">{item.description}</p>
            </div>
          ))}
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
          <Button size="lg" variant="outline" render={<a href={`tel:${CONTACT_PHONE}`} />}>
            Call {CONTACT_PHONE}
          </Button>
        </div>
      </div>
    </div>
  );
}
