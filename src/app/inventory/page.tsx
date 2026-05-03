import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import MachineGrid from "@/components/inventory/MachineGrid";
import SearchAndFilter from "@/components/inventory/SearchAndFilter";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import type { FilterParams } from "@/types";
import { Prisma } from "@/generated/prisma/client";
import { SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inventory",
  description: `Browse all available used wire processing equipment at ${SITE_NAME}.`,
};

const PAGE_SIZE = 24;

async function getInventory(params: FilterParams) {
  const { q, category, manufacturer, sort = "newest", page = "1" } = params;
  const skip = (parseInt(page) - 1) * PAGE_SIZE;

  const where: Prisma.MachineWhereInput = {
    status: { in: ["ACTIVE", "PENDING"] },
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { model: { contains: q, mode: "insensitive" } },
        { manufacturer: { contains: q, mode: "insensitive" } },
      ],
    }),
    ...(category && { category: { equals: category, mode: "insensitive" } }),
    ...(manufacturer && { manufacturer: { equals: manufacturer, mode: "insensitive" } }),
  };

  const orderBy: Prisma.MachineOrderByWithRelationInput =
    sort === "oldest" ? { dateListed: "asc" }
    : sort === "price_asc" ? { price: "asc" }
    : sort === "price_desc" ? { price: "desc" }
    : { dateListed: "desc" };

  const [machines, total] = await Promise.all([
    prisma.machine.findMany({ where, orderBy, skip, take: PAGE_SIZE }),
    prisma.machine.count({ where }),
  ]);

  return { machines, total };
}

async function getFilterOptions() {
  const [cats, mfgs] = await Promise.all([
    prisma.machine.findMany({
      where: { status: { in: ["ACTIVE", "PENDING"] } },
      select: { category: true },
      distinct: [Prisma.MachineScalarFieldEnum.category],
    }),
    prisma.machine.findMany({
      where: { status: { in: ["ACTIVE", "PENDING"] } },
      select: { manufacturer: true },
      distinct: [Prisma.MachineScalarFieldEnum.manufacturer],
    }),
  ]);
  return {
    categories: cats.map((c) => c.category).sort(),
    manufacturers: mfgs.map((m) => m.manufacturer).sort(),
  };
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const [{ machines, total }, { categories, manufacturers }] = await Promise.all([
    getInventory(params),
    getFilterOptions(),
  ]);

  const machinesWithImages = machines.map((m) => ({
    ...m,
    images: Array.isArray(m.images) ? (m.images as { cloudinaryId: string; altText?: string; sortOrder?: number }[]) : [],
  }));

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Equipment inventory
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All machines inspected and tested in New England — shipping nationwide.
        </p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-64 lg:flex-shrink-0">
            <Suspense fallback={null}>
              <SearchAndFilter
                categories={categories}
                manufacturers={manufacturers}
                total={total}
              />
            </Suspense>
          </aside>

          <div className="flex-1">
            <MachineGrid machines={machinesWithImages} />
          </div>
        </div>
      </div>

      <NewsletterSignup />
    </>
  );
}
