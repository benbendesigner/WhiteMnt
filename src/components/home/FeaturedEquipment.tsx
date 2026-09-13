import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MachineCard from "@/components/inventory/MachineCard";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "lucide-react";
import type { MachineImage } from "@/types";
import type { Prisma } from "@/generated/prisma/client";

const VISIBLE: Prisma.MachineWhereInput = { status: { in: ["ACTIVE", "PENDING"] } };

/**
 * Listings picked in the admin (Featured column) drive the homepage carousel.
 * When nothing is featured yet we fall back to the newest listings so the
 * section never renders empty.
 */
async function getHomepageMachines() {
  const featured = await prisma.machine.findMany({
    where: { ...VISIBLE, featured: true },
    orderBy: { dateListed: "desc" },
    take: 12,
  });

  const machines =
    featured.length > 0
      ? featured
      : await prisma.machine.findMany({
          where: VISIBLE,
          orderBy: { dateListed: "desc" },
          take: 8,
        });

  return {
    curated: featured.length > 0,
    machines: machines.map((m) => ({
      ...m,
      price: m.price !== null ? Number(m.price) : null,
      images: Array.isArray(m.images) ? (m.images as MachineImage[]) : [],
    })),
  };
}

export default async function FeaturedEquipment() {
  const { curated, machines } = await getHomepageMachines();

  if (machines.length === 0) return null;

  return (
    <section className="bg-background px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {curated ? "Hand picked" : "Just listed"}
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-foreground">
              {curated ? "Featured equipment" : "Latest equipment"}
            </h2>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/inventory" />}>
            View all inventory
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </div>

        {/* Carousel */}
        <div className="mt-8 -mx-4 sm:-mx-6">
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 sm:px-6 snap-x snap-mandatory">
            {machines.map((machine) => (
              <div
                key={machine.id}
                className="w-[280px] flex-shrink-0 snap-start sm:w-[320px]"
              >
                <MachineCard machine={machine} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
