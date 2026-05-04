import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import LoadMoreGrid from "@/components/inventory/LoadMoreGrid";
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

const INITIAL_COUNT = 24;

async function getInventory(params: FilterParams) {
  const { q, category, manufacturer, sort = "newest" } = params;

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

  const machines = await prisma.machine.findMany({ where, orderBy });

  return { machines, total: machines.length };
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

async function getCounts(params: FilterParams) {
  const { q, category, manufacturer } = params;

  const searchWhere = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
          { model: { contains: q, mode: "insensitive" as const } },
          { manufacturer: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [catGroups, mfgGroups] = await Promise.all([
    prisma.machine.groupBy({
      by: ["category"],
      where: {
        status: { in: ["ACTIVE", "PENDING"] },
        ...searchWhere,
        ...(manufacturer && { manufacturer: { equals: manufacturer, mode: "insensitive" } }),
      },
      _count: { _all: true },
    }),
    prisma.machine.groupBy({
      by: ["manufacturer"],
      where: {
        status: { in: ["ACTIVE", "PENDING"] },
        ...searchWhere,
        ...(category && { category: { equals: category, mode: "insensitive" } }),
      },
      _count: { _all: true },
    }),
  ]);

  return {
    categoryCounts: Object.fromEntries(catGroups.map((g) => [g.category, g._count._all])),
    manufacturerCounts: Object.fromEntries(mfgGroups.map((g) => [g.manufacturer, g._count._all])),
  };
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const [{ machines, total }, { categories, manufacturers }, { categoryCounts, manufacturerCounts }] = await Promise.all([
    getInventory(params),
    getFilterOptions(),
    getCounts(params),
  ]);

  const machinesWithImages = machines.map((m) => ({
    ...m,
    price: m.price !== null ? Number(m.price) : null,
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
                categoryCounts={categoryCounts}
                manufacturerCounts={manufacturerCounts}
                total={total}
              />
            </Suspense>
          </aside>

          <div className="flex-1">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Latest
            </p>
            <LoadMoreGrid machines={machinesWithImages} initialCount={INITIAL_COUNT} />
          </div>
        </div>
      </div>

      <NewsletterSignup />
    </>
  );
}
