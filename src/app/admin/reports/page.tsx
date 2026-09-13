import Link from "next/link";
import { getSaleRecords, groupByMonth, summarise } from "@/lib/sales";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DownloadIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const money = (n: number) =>
  `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

function parseDate(v: string | undefined): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function SalesReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { from: fromRaw, to: toRaw } = await searchParams;
  const from = parseDate(fromRaw);
  // An end date should include everything that happened on that day.
  const to = parseDate(toRaw);
  if (to) to.setHours(23, 59, 59, 999);

  const records = await getSaleRecords({ from, to });
  const months = groupByMonth(records);
  const stats = summarise(records);

  const csvHref = `/api/admin/sales.csv${fromRaw || toRaw ? `?${new URLSearchParams({ ...(fromRaw && { from: fromRaw }), ...(toRaw && { to: toRaw }) })}` : ""}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Sales report</h1>
        <Button size="sm" variant="outline" render={<a href={csvHref} />}>
          <DownloadIcon className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Date range */}
      <form className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-4">
        <div>
          <label htmlFor="from" className="mb-1 block text-xs font-medium text-muted-foreground">
            From
          </label>
          <input
            type="date"
            id="from"
            name="from"
            defaultValue={fromRaw ?? ""}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="to" className="mb-1 block text-xs font-medium text-muted-foreground">
            To
          </label>
          <input
            type="date"
            id="to"
            name="to"
            defaultValue={toRaw ?? ""}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
          />
        </div>
        <Button type="submit" size="sm">Apply</Button>
        {(fromRaw || toRaw) && (
          <Button size="sm" variant="ghost" render={<Link href="/admin/reports" />}>
            Clear
          </Button>
        )}
      </form>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Sales", value: String(stats.count) },
          { label: "Units", value: String(stats.units) },
          { label: "Revenue", value: money(stats.revenue) },
          { label: "Average sale", value: money(stats.average) },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-2xl font-black text-foreground">{s.value}</p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {stats.unpriced > 0 && (
        <p className="text-xs text-muted-foreground">
          {stats.unpriced} sale{stats.unpriced === 1 ? "" : "s"} recorded without a price; excluded
          from revenue and the average.
        </p>
      )}

      {months.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No sales recorded{fromRaw || toRaw ? " in this period" : " yet"}.
        </p>
      ) : (
        months.map((m) => (
          <section key={m.key}>
            <div className="mb-2 flex items-baseline justify-between gap-3 border-b border-border pb-2">
              <h2 className="text-base font-semibold text-foreground">{m.label}</h2>
              <p className="text-sm text-muted-foreground">
                {m.units} unit{m.units === 1 ? "" : "s"} · {money(m.revenue)}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Item</th>
                    <th className="py-2 pr-4 font-medium">Buyer</th>
                    <th className="py-2 pr-4 text-center font-medium">Qty</th>
                    <th className="py-2 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {m.sales.map((s) => (
                    <tr key={s.id}>
                      <td className="whitespace-nowrap py-2 pr-4 text-muted-foreground">
                        {s.soldAt.toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-4">
                        <span className="font-medium text-foreground">{s.itemTitle}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {s.manufacturer} · {s.category}
                        </span>
                        {s.legacy && (
                          <Badge variant="outline" className="ml-2 text-[10px]">
                            pre-report
                          </Badge>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {s.buyerEmail ? (
                          <a href={`mailto:${s.buyerEmail}`} className="hover:text-primary">
                            {s.buyerName}
                          </a>
                        ) : (
                          s.buyerName
                        )}
                      </td>
                      <td className="py-2 pr-4 text-center text-muted-foreground">{s.quantity}</td>
                      <td className="py-2 text-right font-medium text-foreground">
                        {s.salePrice === null
                          ? "—"
                          : `$${s.salePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </div>
  );
}
