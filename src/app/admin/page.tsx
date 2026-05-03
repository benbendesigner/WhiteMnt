import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ListingsTable from "@/components/admin/ListingsTable";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";

export default async function AdminDashboard() {
  const machines = await prisma.machine.findMany({ orderBy: { dateListed: "desc" } });

  const stats = {
    total: machines.length,
    active: machines.filter((m) => m.status === "ACTIVE").length,
    pending: machines.filter((m) => m.status === "PENDING").length,
    sold: machines.filter((m) => m.status === "SOLD").length,
    draft: machines.filter((m) => m.status === "DRAFT").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Listings</h1>
        <Button size="sm" render={<Link href="/admin/machines/new" />}>
          <PlusIcon className="mr-1 size-4" />
          New Listing
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, className: "text-foreground" },
          { label: "Active", value: stats.active, className: "text-green-600" },
          { label: "Pending", value: stats.pending, className: "text-amber-600" },
          { label: "Draft", value: stats.draft, className: "text-muted-foreground" },
          { label: "Sold", value: stats.sold, className: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <CardContent className="py-3">
              <p className={`text-2xl font-bold ${s.className}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <ListingsTable machines={machines} />
      </div>
    </div>
  );
}
