import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_NAME } from "@/lib/constants";

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Equipment Wanted</h1>
        <p className="mt-2 text-muted-foreground">
          We are actively looking to purchase the following equipment. If you have any of these items available, please{" "}
          <a href="/contact" className="text-primary underline-offset-4 hover:underline">
            get in touch
          </a>
          .
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
    </div>
  );
}
