import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export type SaleRecord = {
  id: string;
  soldAt: Date;
  itemTitle: string;
  manufacturer: string;
  category: string;
  quantity: number;
  salePrice: number | null;
  buyerName: string;
  buyerEmail: string | null;
  notes: string | null;
  /** Reconstructed from the old Machine columns rather than a real Sale row. */
  legacy: boolean;
};

export type MonthGroup = {
  /** YYYY-MM */
  key: string;
  label: string;
  sales: SaleRecord[];
  units: number;
  revenue: number;
};

/**
 * Sales recorded in the Sale table, plus any listing still carrying the older
 * per-machine sold columns that never got a Sale row. Reading the two together
 * means the report is complete without a migration having to run first.
 */
export async function getSaleRecords(range?: { from?: Date; to?: Date }): Promise<SaleRecord[]> {
  const soldAtFilter: Prisma.DateTimeFilter | undefined =
    range?.from || range?.to
      ? { ...(range.from && { gte: range.from }), ...(range.to && { lte: range.to }) }
      : undefined;

  const [sales, legacy] = await Promise.all([
    prisma.sale.findMany({
      where: soldAtFilter ? { soldAt: soldAtFilter } : undefined,
      orderBy: { soldAt: "desc" },
    }),
    prisma.machine.findMany({
      where: {
        soldAt: soldAtFilter ? { not: null, ...soldAtFilter } : { not: null },
        sales: { none: {} },
      },
      orderBy: { soldAt: "desc" },
    }),
  ]);

  const fromSales: SaleRecord[] = sales.map((s) => ({
    id: `sale-${s.id}`,
    soldAt: s.soldAt,
    itemTitle: s.itemTitle,
    manufacturer: s.manufacturer,
    category: s.category,
    quantity: s.quantity,
    salePrice: s.salePrice !== null ? Number(s.salePrice) : null,
    buyerName: s.buyerName,
    buyerEmail: s.buyerEmail,
    notes: s.notes,
    legacy: false,
  }));

  const fromLegacy: SaleRecord[] = legacy.map((m) => ({
    id: `legacy-${m.id}`,
    soldAt: m.soldAt!,
    itemTitle: m.title,
    manufacturer: m.manufacturer,
    category: m.category,
    quantity: 1,
    salePrice: m.salePrice !== null ? Number(m.salePrice) : null,
    buyerName: m.soldTo ?? "—",
    buyerEmail: null,
    notes: m.soldNotes,
    legacy: true,
  }));

  return [...fromSales, ...fromLegacy].sort((a, b) => b.soldAt.getTime() - a.soldAt.getTime());
}

export function groupByMonth(records: SaleRecord[]): MonthGroup[] {
  const months = new Map<string, MonthGroup>();

  for (const r of records) {
    const key = `${r.soldAt.getFullYear()}-${String(r.soldAt.getMonth() + 1).padStart(2, "0")}`;
    let group = months.get(key);
    if (!group) {
      group = {
        key,
        label: r.soldAt.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
        sales: [],
        units: 0,
        revenue: 0,
      };
      months.set(key, group);
    }
    group.sales.push(r);
    group.units += r.quantity;
    group.revenue += r.salePrice ?? 0;
  }

  return [...months.values()].sort((a, b) => b.key.localeCompare(a.key));
}

export function summarise(records: SaleRecord[]) {
  const units = records.reduce((n, r) => n + r.quantity, 0);
  const revenue = records.reduce((n, r) => n + (r.salePrice ?? 0), 0);
  const priced = records.filter((r) => r.salePrice !== null).length;
  return {
    count: records.length,
    units,
    revenue,
    average: priced > 0 ? revenue / priced : 0,
    unpriced: records.length - priced,
  };
}

/** RFC 4180: wrap in quotes and double any embedded quote. */
function csvCell(value: string | number | null): string {
  if (value === null) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(records: SaleRecord[]): string {
  const header = [
    "Date sold",
    "Item",
    "Manufacturer",
    "Category",
    "Quantity",
    "Sale price",
    "Buyer",
    "Buyer email",
    "Notes",
  ];

  const rows = records.map((r) => [
    r.soldAt.toISOString().slice(0, 10),
    r.itemTitle,
    r.manufacturer,
    r.category,
    r.quantity,
    r.salePrice ?? "",
    r.buyerName,
    r.buyerEmail ?? "",
    r.notes ?? "",
  ]);

  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}
