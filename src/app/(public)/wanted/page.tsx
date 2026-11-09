import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wanted",
  description: `Equipment ${SITE_NAME} is actively looking to buy.`,
};

// Case-insensitive so "ARTOS" and "Artos" merge; an empty label sorts first.
function groupBy<T>(list: T[], getLabel: (item: T) => string) {
  const groups = new Map<string, { label: string; items: T[] }>();
  for (const item of list) {
    const label = getLabel(item).trim();
    const key = label.toLowerCase();
    if (!groups.has(key)) groups.set(key, { label, items: [] });
    groups.get(key)!.items.push(item);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, group]) => group);
}

export default async function WantedPage() {
  const items = await prisma.wantedItem.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ manufacturer: "asc" }, { title: "asc" }],
  });

  const manufacturers = groupBy(items, (item) => item.manufacturer);

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
        <div className="space-y-10">
          {manufacturers.map((manufacturer) => (
            <section key={manufacturer.label}>
              <h2 className="border-b border-foreground/15 pb-2 text-lg font-black tracking-tight text-foreground">
                {manufacturer.label}
              </h2>
              {groupBy(manufacturer.items, (item) =>
                /[a-z0-9]/i.test(item.category) ? item.category : ""
              ).map((category) => (
                <div key={category.label} className="mt-4">
                  {category.label && (
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {category.label}
                    </h3>
                  )}
                  <ul className="divide-y divide-border">
                    {category.items.map((item) => (
                      <li key={item.id} className="py-2.5 font-medium text-foreground">
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-lg border border-border bg-muted/40 px-6 py-8 text-center">
        <h2 className="text-xl font-black tracking-tight text-foreground">
          Have something we&apos;re looking for?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Reach out — we respond quickly and can arrange pickup or shipping anywhere in the world.
        </p>
        <div className="mt-5">
          <Button size="lg" render={<Link href="/contact" />}>Get in Touch</Button>
        </div>
      </div>
    </div>
  );
}
