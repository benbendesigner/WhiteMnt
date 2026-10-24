import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(d));
}

export default async function SoldDashboard() {
  const sold = await prisma.machine.findMany({
    where: { status: "SOLD" },
    orderBy: { soldAt: "desc" },
    select: {
      id: true,
      title: true,
      manufacturer: true,
      category: true,
      model: true,
      slug: true,
      dateListed: true,
      price: true,
      soldAt: true,
      soldTo: true,
      salePrice: true,
      soldNotes: true,
    },
  });

  const withPrice = sold.filter((m) => m.salePrice !== null);
  const totalRevenue = withPrice.reduce((sum, m) => sum + Number(m.salePrice), 0);
  const avgSalePrice = withPrice.length > 0 ? totalRevenue / withPrice.length : 0;

  const stats = [
    { label: "Total sold", value: sold.length.toString() },
    {
      label: "Total revenue",
      value: withPrice.length > 0 ? fmt(totalRevenue) : "—",
    },
    {
      label: "Average sale price",
      value: withPrice.length > 0 ? fmt(avgSalePrice) : "—",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight text-foreground">Sold</h1>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="text-center">
            <CardContent className="py-3">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl ring-1 ring-foreground/10">
        {sold.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No sold listings yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Sold date</TableHead>
                <TableHead className="text-right">Asking price</TableHead>
                <TableHead className="text-right">Sale price</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sold.map((m) => {
                const askingPrice = m.price !== null ? Number(m.price) : null;
                const salePrice = m.salePrice !== null ? Number(m.salePrice) : null;
                const diff =
                  askingPrice !== null && salePrice !== null
                    ? salePrice - askingPrice
                    : null;

                return (
                  <TableRow key={m.id}>
                    <TableCell className="max-w-56">
                      <Link
                        href={`/admin/machines/${m.id}`}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {m.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {[m.manufacturer, m.model || m.category]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </TableCell>

                    <TableCell>{m.soldTo ?? <span className="text-muted-foreground">—</span>}</TableCell>

                    <TableCell className="text-muted-foreground">
                      {fmtDate(m.soldAt)}
                    </TableCell>

                    <TableCell className="text-right text-muted-foreground">
                      {askingPrice !== null ? fmt(askingPrice) : <span>—</span>}
                    </TableCell>

                    <TableCell className="text-right">
                      {salePrice !== null ? (
                        <span className="font-medium">{fmt(salePrice)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                      {diff !== null && (
                        <span
                          className={`ml-1.5 text-xs ${diff < 0 ? "text-destructive" : "text-green-600"}`}
                        >
                          {diff < 0 ? "" : "+"}
                          {fmt(diff)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="max-w-48 whitespace-normal text-muted-foreground">
                      {m.soldNotes || <span>—</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
