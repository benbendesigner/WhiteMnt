import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlusIcon, PencilIcon } from "lucide-react";
import { deleteWantedItem } from "@/actions/wanted";

export default async function WantedPage() {
  const items = await prisma.wantedItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Wanted Items</h1>
        <Button size="sm" render={<Link href="/admin/wanted/new" />}>
          <PlusIcon className="mr-1 size-4" />
          Add item
        </Button>
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No wanted items yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>
                      {item.status === "ACTIVE" ? "Active" : "Closed"}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.manufacturer} · {item.category}
                  </p>
                  <p className="mt-1 text-sm text-foreground/70 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button size="sm" variant="outline" render={<Link href={`/admin/wanted/${item.id}`} />}>
                    <PencilIcon className="size-3.5" />
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await deleteWantedItem(item.id);
                    }}
                  >
                    <Button size="sm" variant="outline" type="submit" className="text-destructive hover:bg-destructive/10">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
